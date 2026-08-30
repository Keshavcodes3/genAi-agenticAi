import { useMemo, useState } from "react";
import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useChat } from "../Hooks/useChat";

const ChatInput = () => {
  const [query, setQuery] = useState("");
  const { activeConversationId, conversations, loading } = useSelector(
    (state) => state.chat
  );
  const { takeFollowUpHook, startChatHook } = useChat();

  const activeMode = useMemo(() => {
    return (
      conversations.find((conversation) => conversation.convoId === activeConversationId)
        ?.mode || "casual"
    );
  }, [activeConversationId, conversations]);

  const sendMessage = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) return;

    setQuery("");

    if (!activeConversationId) {
      await startChatHook({
        message: trimmedQuery,
        mode: activeMode,
      });
      return;
    }

    await takeFollowUpHook({
      conversationId: activeConversationId,
      message: trimmedQuery,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSend = query.trim() && !loading;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6">
      <div className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
        <button className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-orange-50 hover:text-orange-500">
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask NexaAI anything..."
          className="max-h-32 min-h-[44px] w-full resize-none bg-transparent py-2.5 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
          rows={1}
          disabled={loading}
        />

        <div className="flex shrink-0 items-center gap-1">
          <button className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-orange-50 hover:text-orange-500">
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!canSend}
            className={`rounded-xl p-2 transition-all ${
              canSend
                ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        NexaAI can make mistakes. Consider verifying important information.
      </p>
    </div>
  );
};

export default ChatInput;
