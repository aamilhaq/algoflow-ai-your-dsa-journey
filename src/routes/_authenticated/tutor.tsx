import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Markdown } from "@/components/markdown";
import { askTutor } from "@/lib/ai.functions";
import type { ChatMessage, TutorMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tutor")({ component: TutorPage });

const MODES: { value: TutorMode; label: string }[] = [
  { value: "explain-concept", label: "Explain concept" },
  { value: "examples", label: "Worked examples" },
  { value: "complexity", label: "Complexity analysis" },
  { value: "hints-only", label: "Hints only" },
  { value: "similar-questions", label: "Similar questions" },
];

const SUGGESTIONS = [
  "Explain how a hash map works under the hood",
  "What is the two-pointer technique?",
  "When should I use BFS vs DFS?",
  "Explain dynamic programming with an example",
];

function TutorPage() {
  const ask = useServerFn(askTutor);
  const [mode, setMode] = useState<TutorMode>("explain-concept");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({
        data: {
          mode,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        },
      });
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: res.content }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("RATE_LIMIT")) toast.error("Rate limit reached. Please wait a moment.");
      else if (msg.includes("NO_CREDITS")) toast.error("AI credits exhausted. Add credits to continue.");
      else toast.error("The tutor couldn't respond. Try again.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
      <div className="flex items-center justify-between gap-3 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Bot className="h-6 w-6 text-primary" />AI Tutor</h1>
          <p className="text-sm text-muted-foreground">Ask anything about data structures & algorithms.</p>
        </div>
        <Select value={mode} onValueChange={(v) => setMode(v as TutorMode)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MODES.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
          {messages.length === 0 && !loading && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <Bot className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Pick a question to get started</p>
                <div className="mt-4 grid gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary/50">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-primary")}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                {m.role === "user" ? <p className="text-sm">{m.content}</p> : <Markdown content={m.content} />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-primary"><Bot className="h-4 w-4" /></div>
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />Thinking...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-end gap-2 border-t p-3"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask your tutor anything..."
            className="max-h-32 min-h-[44px] resize-none"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}><Send className="h-4 w-4" /></Button>
        </form>
      </Card>
    </div>
  );
}
