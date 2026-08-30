import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBubble({ role, message }) {
  const isUser = role === "user";
  const isEmptyAiMessage = !isUser && !message.content;

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-3xl items-start gap-2">
        {!isUser && (
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        )}

        <div
          className={`rounded-3xl px-4 py-3 text-sm shadow-sm transition-all ${
            isUser
              ? "rounded-br-md bg-orange-500 text-white"
              : "rounded-bl-md border border-orange-100 bg-[#fffaf5] text-slate-800"
          }`}
        >
          {isEmptyAiMessage ? (
            <div className="flex h-5 items-center gap-1.5">
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
          ) : isUser ? (
            <p className="whitespace-pre-wrap leading-7">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto rounded-xl border border-orange-100">
                    <table className="w-full border-collapse text-left text-sm">
                      {children}
                    </table>
                  </div>
                ),

                th: ({ children }) => (
                  <th className="border-b border-orange-100 bg-orange-50 px-4 py-2 font-semibold">
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td className="border-b border-orange-100 px-4 py-2">
                    {children}
                  </td>
                ),

                ul: ({ children }) => (
                  <ul className="my-3 list-disc space-y-2 pl-5">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="my-3 list-decimal space-y-2 pl-5">
                    {children}
                  </ol>
                ),

                p: ({ children }) => (
                  <p className="leading-7 mb-3 last:mb-0">{children}</p>
                ),

                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),

                code: ({ children }) => (
                  <code className="rounded bg-orange-100 px-1.5 py-0.5 text-xs">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {isUser && (
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">
            U
          </div>
        )}
      </div>
    </div>
  );
}
