import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, StickyNote, ScrollText, ListChecks, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Markdown } from "@/components/markdown";
import { useTopic, useProblemsByTopic, useProgress } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/topics/$slug")({ component: TopicPage });

function TopicPage() {
  const { slug } = useParams({ from: "/_authenticated/topics/$slug" });
  const { data: topic, isLoading } = useTopic(slug);
  const { data: problems } = useProblemsByTopic(topic?.id);
  const { data: progress } = useProgress();
  const prog = progress?.find((p) => p.topic_id === topic?.id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!topic) return <p className="text-muted-foreground">Topic not found.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm"><Link to="/roadmap"><ArrowLeft className="mr-1 h-4 w-4" />Roadmap</Link></Button>

      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon name={topic.icon ?? undefined} className="h-7 w-7" /></div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{topic.name}</h1>
            <DifficultyBadge difficulty={topic.difficulty} />
          </div>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
          <Progress value={prog?.completion_percentage ?? 0} className="mt-3 h-1.5 max-w-md" />
        </div>
      </div>

      <Tabs defaultValue="learn">
        <TabsList className="flex-wrap">
          <TabsTrigger value="learn"><BookOpen className="mr-1.5 h-4 w-4" />Learn</TabsTrigger>
          <TabsTrigger value="notes"><StickyNote className="mr-1.5 h-4 w-4" />Notes</TabsTrigger>
          <TabsTrigger value="cheat"><ScrollText className="mr-1.5 h-4 w-4" />Cheat Sheet</TabsTrigger>
          <TabsTrigger value="problems"><ListChecks className="mr-1.5 h-4 w-4" />Problems</TabsTrigger>
          <TabsTrigger value="tutor"><Bot className="mr-1.5 h-4 w-4" />AI Tutor</TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="mt-4">
          <Card className="p-6">
            <Markdown content={`## Introduction to ${topic.name}\n\n${topic.description}\n\n### Why it matters\nThese fundamentals appear constantly in interviews and real systems. Master the core patterns and you'll recognize them everywhere.\n\n### Key ideas\n- Understand the underlying structure and operations\n- Learn the common patterns and when to apply them\n- Practice until recognition becomes automatic\n\nUse the **AI Tutor** tab for a personalized deep-dive.`} />
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className="p-6 text-sm text-muted-foreground">Your personal notes for {topic.name} will live here. (Coming soon — a rich notes editor.)</Card>
        </TabsContent>

        <TabsContent value="cheat" className="mt-4">
          <Card className="p-6">
            <Markdown content={`### ${topic.name} Cheat Sheet\n\n\`\`\`\nCommon operations & complexities\n----------------------------------\nAccess / lookup   : depends on structure\nInsert / delete   : depends on structure\nTraversal         : O(n)\n\`\`\`\n\n**Patterns:** identify the invariant, choose the right structure, optimize the bottleneck.`} />
          </Card>
        </TabsContent>

        <TabsContent value="problems" className="mt-4 space-y-3">
          {problems && problems.length > 0 ? (
            problems.map((p) => (
              <Link key={p.id} to="/problems/$slug" params={{ slug: p.slug }}>
                <Card className="shadow-card flex items-center justify-between p-4 transition-colors hover:border-primary/50">
                  <span className="font-medium">{p.title}</span>
                  <DifficultyBadge difficulty={p.difficulty} />
                </Card>
              </Link>
            ))
          ) : (
            <Card className="border-dashed p-8 text-center text-sm text-muted-foreground">No problems yet for this topic.</Card>
          )}
        </TabsContent>

        <TabsContent value="tutor" className="mt-4">
          <Card className="p-6 text-center">
            <Bot className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Get a personalized explanation of {topic.name} from your AI tutor.</p>
            <Button asChild className="mt-4"><Link to="/tutor">Open AI Tutor</Link></Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
