import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Play, Send, Lightbulb, History as HistoryIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Markdown } from "@/components/markdown";
import { useProblem, useSubmissions, useSolveProblem } from "@/lib/queries";
import type { ProblemExample } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/problems/$slug")({ component: ProblemPage });

function ProblemPage() {
  const { slug } = useParams({ from: "/_authenticated/problems/$slug" });
  const { data: problem, isLoading } = useProblem(slug);
  const { data: submissions } = useSubmissions(problem?.id);
  const solve = useSolveProblem();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const starter = useMemo(() => {
    const sc = (problem?.starter_code ?? {}) as Record<string, string>;
    return sc[language] ?? "";
  }, [problem, language]);

  const effectiveCode = code || starter;

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!problem) return <p className="text-muted-foreground">Problem not found.</p>;

  const examples = (problem.examples ?? []) as unknown as ProblemExample[];

  const run = () => {
    setOutput("▶ Running test cases...\n✓ Example 1 passed\n✓ Example 2 passed\n\nAll sample tests passed (mock runner).");
    toast.success("Ran sample tests");
  };

  const submit = async () => {
    setOutput("Submitting...");
    await solve.mutateAsync({ problem, code: effectiveCode, language });
    setOutput("✓ Accepted — all tests passed! XP awarded.");
    toast.success("Accepted! 🎉 XP awarded");
  };

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm"><Link to="/roadmap"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link></Button>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: statement */}
        <Card className="shadow-card max-h-[80vh] overflow-y-auto scrollbar-thin p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {problem.company_tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>

          <div className="mt-4"><Markdown content={problem.description ?? ""} /></div>

          {examples.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold">Examples</h3>
              {examples.map((ex, i) => (
                <div key={i} className="rounded-lg border bg-muted/40 p-3 font-mono text-xs">
                  <p><span className="text-muted-foreground">Input:</span> {ex.input}</p>
                  <p><span className="text-muted-foreground">Output:</span> {ex.output}</p>
                  {ex.explanation && <p className="text-muted-foreground">{ex.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          {problem.constraints && (
            <div className="mt-4">
              <h3 className="font-semibold">Constraints</h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{problem.constraints}</p>
            </div>
          )}

          {problem.hints.length > 0 && (
            <Accordion type="single" collapsible className="mt-4">
              {problem.hints.map((h, i) => (
                <AccordionItem key={i} value={`h${i}`}>
                  <AccordionTrigger className="text-sm"><span className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-warning" />Hint {i + 1}</span></AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{h}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Card>

        {/* Right: editor */}
        <div className="space-y-4">
          <Card className="shadow-card overflow-hidden">
            <div className="flex items-center justify-between border-b p-3">
              <Select value={language} onValueChange={(v) => { setLanguage(v); setCode(""); }}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={run}><Play className="mr-1 h-4 w-4" />Run</Button>
                <Button size="sm" onClick={submit} disabled={solve.isPending}><Send className="mr-1 h-4 w-4" />Submit</Button>
              </div>
            </div>
            <textarea
              value={effectiveCode}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="h-72 w-full resize-none bg-card p-4 font-mono text-sm outline-none scrollbar-thin"
            />
          </Card>

          {output && (
            <Card className="p-4"><pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">{output}</pre></Card>
          )}

          <Tabs defaultValue="subs">
            <TabsList><TabsTrigger value="subs"><HistoryIcon className="mr-1.5 h-4 w-4" />Submissions</TabsTrigger></TabsList>
            <TabsContent value="subs" className="mt-3 space-y-2">
              {submissions && submissions.length > 0 ? submissions.map((s) => (
                <Card key={s.id} className="flex items-center justify-between p-3 text-sm">
                  <span className={s.status === "Accepted" ? "font-medium text-success" : "text-muted-foreground"}>{s.status}</span>
                  <span className="text-xs text-muted-foreground">{s.language} · {new Date(s.submitted_at).toLocaleString()}</span>
                </Card>
              )) : <p className="text-sm text-muted-foreground">No submissions yet.</p>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
