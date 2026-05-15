import { useState } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Sparkles, Send, Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AIAssistant() {
  const { settings } = useAccessibility();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I can help with jobs, applications, and accessibility settings.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const userText = input.trim();
    if (!userText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No reply returned from server.",
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: error?.message || "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 left-5 z-[9999] inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg transition-all hover:opacity-95"
        aria-label="Open AI assistant"
      >
        <Sparkles className="h-4 w-4" />
        AI Help
      </button>

      {open && (
        <div className="fixed bottom-20 left-5 z-[9999] flex h-[460px] w-[350px] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl">
          <div className="flex items-start gap-3 border-b bg-secondary/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-base font-semibold">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Ask about jobs, applying, or accessibility
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background/50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  } ${settings.largeText ? "text-base" : "text-sm"}`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t bg-card p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleSend();
                }}
                placeholder="Ask something..."
                className={`flex-1 rounded-xl border bg-background ${
                  settings.largeTargets ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"
                }`}
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className={`inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all disabled:opacity-50 ${
                  settings.largeTargets ? "px-4 py-3" : "px-3 py-2"
                }`}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {!settings.simpleMode && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInput("help me apply")}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/80"
                >
                  help me apply
                </button>
                <button
                  onClick={() => setInput("simplify this page")}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/80"
                >
                  simplify this page
                </button>
                <button
                  onClick={() => setInput("what accessibility settings do you recommend")}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/80"
                >
                  accessibility tips
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}