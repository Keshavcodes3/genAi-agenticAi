import { useCallback, useEffect, useState } from "react";
import { Crown, FolderGit2, MessageSquare, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../Chat/Components/Sidebar.jsx";
import MobileHeader from "../../Chat/Components/MobileHeader.jsx";
import { getPlatformAnalytics } from "../Services/admin.service.js";

const StatCard = ({ icon: Icon, label, value, tone = "orange" }) => {
    const toneClass = tone === "emerald"
        ? "bg-emerald-50 text-emerald-600"
        : tone === "sky"
            ? "bg-sky-50 text-sky-600"
            : "bg-orange-50 text-orange-600";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">{value}</p>
        </div>
    );
};

const RegistrationBarChart = ({ title, subtitle, data = [] }) => {
    const maxValue = Math.max(...data.map((item) => item.users), 1);

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>

            <div className="flex h-64 items-end gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {data.map((item) => {
                    const height = Math.max(
                        (item.users / maxValue) * 100,
                        item.users ? 8 : 0
                    );

                    return (
                        <div
                            key={item.key}
                            className="flex h-full min-w-[50px] flex-1 flex-col justify-end gap-2"
                        >
                            <div className="flex flex-1 items-end rounded-lg bg-orange-50 px-2">
                                <div
                                    className="w-full rounded-t-md bg-orange-500 transition-all"
                                    style={{ height: `${height}%` }}
                                    title={`${item.users} users`}
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-700">
                                    {item.users}
                                </p>

                                <p className="truncate text-[11px] font-medium text-slate-400">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isAdmin = user?.role === "admin";

    const loadAnalytics = useCallback(async () => {
        if (!isAdmin) return;

        try {
            setLoading(true);
            setError("");
            const response = await getPlatformAnalytics();
            setAnalytics(response.data);
        } catch (err) {
            setError(err.message || "Failed to load platform analytics.");
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadAnalytics();
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [loadAnalytics]);

    if (!isAdmin) {
        return <Navigate to="/chat" replace />;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <main className="flex min-w-0 flex-1 flex-col bg-white overflow-hidden">
                <MobileHeader title="Admin Dashboard" />
                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                                    <ShieldCheck className="h-4 w-4" />
                                    Admin
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Platform Dashboard
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Users, chats, projects, and activity across the whole product.
                                </p>
                            </div>

                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={loadAnalytics}
                                    className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100 self-start sm:self-auto"
                                >
                                    Refresh
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="h-36 animate-pulse rounded-xl bg-orange-50" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                    <StatCard icon={Users} label="Users" value={analytics?.totals?.users || 0} />
                                    <StatCard icon={MessageSquare} label="Conversations" value={analytics?.totals?.conversations || 0} />
                                    <StatCard icon={Sparkles} label="Messages" value={analytics?.totals?.messages || 0} tone="sky" />
                                    <StatCard icon={FolderGit2} label="Projects" value={analytics?.totals?.projects || 0} tone="emerald" />
                                    <StatCard icon={Crown} label="Admins" value={analytics?.totals?.admins || 0} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                                    <RegistrationBarChart
                                        title="Daily Registrations"
                                        subtitle="Last 7 days"
                                        data={analytics?.registrations?.daily || []}
                                    />
                                    <RegistrationBarChart
                                        title="Weekly Registrations"
                                        subtitle="Recent weeks"
                                        data={analytics?.registrations?.weekly || []}
                                    />
                                    <RegistrationBarChart
                                        title="Monthly Registrations"
                                        subtitle="Recent months"
                                        data={analytics?.registrations?.monthly || []}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
                                        <div className="mt-4 space-y-3">
                                            {(analytics?.recentUsers || []).map((item) => (
                                                <div key={item._id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                                                    <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                                                        <p className="truncate text-xs text-slate-500">{item.email}</p>
                                                    </div>
                                                    <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-orange-600">
                                                        {item.role}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h2 className="text-lg font-semibold text-slate-900">Recent Conversations</h2>
                                        <div className="mt-4 space-y-3">
                                            {(analytics?.recentConversations || []).map((item) => (
                                                <div key={item._id} className="rounded-lg bg-slate-50 p-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                                                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                                                            {item.mode}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 truncate text-xs text-slate-500">
                                                        {item.user?.name || "Unknown user"} - {item.user?.email || "No email"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <h2 className="text-lg font-semibold text-slate-900">Conversation Modes</h2>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        {(analytics?.conversationsByMode || []).map((item) => (
                                            <div key={item.mode} className="rounded-lg bg-orange-50 p-4">
                                                <p className="text-sm font-semibold capitalize text-orange-600">{item.mode}</p>
                                                <p className="mt-1 text-2xl font-bold text-slate-900">{item.count}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
