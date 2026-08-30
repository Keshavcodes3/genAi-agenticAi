import { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, Clock3, MessageSquare, Sparkles } from "lucide-react";
import Sidebar from "../../Chat/Components/Sidebar.jsx";
import MobileHeader from "../../Chat/Components/MobileHeader.jsx";
import { getUsageAnalytics } from "../../Chat/Services/chat.service.js";

const ranges = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const MetricCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

const UsageBars = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.messages), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Message Usage</h2>
          <p className="text-sm text-slate-500">User and AI messages over time.</p>
        </div>
      </div>

      <div className="flex h-64 items-end gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {data.map((item) => {
          const height = Math.max((item.messages / maxValue) * 100, item.messages ? 8 : 0);

          return (
            <div key={item.key} className="flex h-full min-w-[50px] flex-1 flex-col justify-end gap-2">
              <div className="flex flex-1 items-end rounded-lg bg-slate-50 px-2">
                <div
                  className="w-full rounded-t-md bg-orange-500 transition-all"
                  style={{ height: `${height}%` }}
                  title={`${item.messages} messages`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-700">{item.messages}</p>
                <p className="truncate text-[11px] font-medium text-slate-400">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [activeRange, setActiveRange] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getUsageAnalytics();

        if (isMounted) {
          setAnalytics(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load analytics");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeData = useMemo(() => {
    return analytics?.[activeRange] || [];
  }, [activeRange, analytics]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col bg-white overflow-hidden">
        <MobileHeader title="Analytics" />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Analytics
                </h1>
                <p className="mt-2 text-slate-500">
                  Daily, weekly, and monthly usage across conversations.
                </p>
              </div>

              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                {ranges.map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setActiveRange(range.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      activeRange === range.key
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                Loading analytics...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-600">
                {error}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <MetricCard
                    icon={MessageSquare}
                    label="Conversations"
                    value={analytics?.totals?.conversations || 0}
                  />
                  <MetricCard
                    icon={Sparkles}
                    label="Messages"
                    value={analytics?.totals?.messages || 0}
                  />
                  <MetricCard
                    icon={CalendarDays}
                    label="Workspace Chats"
                    value={analytics?.totals?.projectConversations || 0}
                  />
                  <MetricCard
                    icon={Clock3}
                    label="AI Replies"
                    value={analytics?.totals?.aiMessages || 0}
                  />
                </div>

                <UsageBars data={activeData} />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <MetricCard
                    icon={BarChart3}
                    label="Ask Anything"
                    value={analytics?.byMode?.casual || 0}
                  />
                  <MetricCard
                    icon={BarChart3}
                    label="Explanation"
                    value={analytics?.byMode?.explanation || 0}
                  />
                  <MetricCard
                    icon={BarChart3}
                    label="Roadmap"
                    value={analytics?.byMode?.roadmap || 0}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
