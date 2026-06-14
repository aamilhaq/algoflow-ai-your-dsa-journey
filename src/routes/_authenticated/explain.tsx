import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Code2, Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/markdown";
import { explainMyCode } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/explain")({ component: ExplainPage });

function ExplainPage() {
  const explain = useServerFn(explainMyCode);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await explain({ data: { code, language } });
      setResult(res.content);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("RATE_LIMIT")) toast.error("Rate limit reached. Please wait a moment.");
      else if (msg.includes("NO_CREDITS")) toast.error("AI credits exhausted. Add credits to continue.");
      else toast.error("Couldn't analyze your code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Code2 className="h-6 w-6 text-primary" />Explain My Code</h1>
        <p className="text-sm text-muted-foreground">Paste your solution and get an AI breakdown: complexity, bugs, edge cases, and optimizations.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b p-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={run} disabled={loading || !code.trim()}>
              {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
              Analyze
            </Button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="// Paste your code here..."
            className="h-[60vh] w-full resize-none bg-card p-4 font-mono text-sm outline-none scrollbar-thin"
          />
        </Card>

        <Card className="shadow-card max-h-[70vh] overflow-y-auto scrollbar-thin p-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          ) : result ? (
            <Markdown content={result} />
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div><Sparkles className="mx-auto h-8 w-8 text-primary/50" /><p className="mt-2">Your analysis will appear here.</p></div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
