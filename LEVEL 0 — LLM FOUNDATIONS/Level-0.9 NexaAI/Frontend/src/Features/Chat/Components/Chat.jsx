import { useEffect, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import ChatBubble from "./MessageBubble";
import { useChat } from "../Hooks/useChat";

const modes = [
  { value: "casual", label: "Ask Anything" },
  { value: "explanation", label: "Explanation" },
  { value: "roadmap", label: "Roadmap" },
];

export default function Chat() {
  const { activeConversationId, conversations, loading, messages } = useSelector(
    (state) => state.chat
  );
  const { getAllChats, updateModeHook } = useChat();

  const activeConversation = useMemo(() => {
    return conversations.find((conversation) => conversation.convoId === activeConversationId);
  }, [activeConversationId, conversations]);

  useEffect(() => {
    const hasLoadedConversation =
      activeConversationId &&
      Object.prototype.hasOwnProperty.call(messages, activeConversationId);

    if (activeConversationId && !hasLoadedConversation) {
      getAllChats({ conversationId: activeConversationId });
    }
  }, [activeConversationId, getAllChats, messages]);

  const currentMessages = messages?.[activeConversationId] || [];
  const lastMessage = currentMessages[currentMessages.length - 1];
  const showLoading =
    loading &&
    activeConversationId &&
    !(lastMessage?.role === "ai" && lastMessage?.message?.content === "");

  const handleModeChange = async (e) => {
    if (!activeConversationId) return;
    await updateModeHook({
      conversationId: activeConversationId,
      mode: e.target.value,
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-none tracking-tight text-slate-900">
                {activeConversation?.convo || "NexaAI"}
              </h1>
            </div>
          </div>

          <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-500">
            Change Tone
            <select
              value={activeConversation?.mode || "casual"}
              onChange={handleModeChange}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            >
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="scrollbar-hide flex w-full flex-1 justify-center overflow-y-auto px-4 py-6">
        <div className="flex w-full max-w-4xl flex-col gap-6 pb-20">
          {currentMessages.map((msg, index) => (
            <ChatBubble key={`${msg.role}-${index}`} role={msg.role} message={msg.message} />
          ))}

          {showLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-3xl items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex h-[44px] items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-5 py-4 text-sm shadow-sm transition-all">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />
    </div>
  );
}
