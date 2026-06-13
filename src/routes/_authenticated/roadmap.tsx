import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, Lock, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icon";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { useTopics, useProgress } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/roadmap")({ component: Roadmap });

function Roadmap() {
  const { data: topics, isLoading } = useTopics();
  const { data: progress } = useProgress();

  if (isLoading) {
    return <div className="mx-auto max-w-2xl space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>;
  }

  const getProg = (id: string) => progress?.find((p) => p.topic_id === id);
  let prevComplete = true;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">DSA Roadmap</h1>
        <p className="text-sm text-muted-foreground">Follow the path. Each topic unlocks as you progress.</p>
      </div>

      <div className="space-y-1">
        {topics?.map((topic, i) => {
          const p = getProg(topic.id);
          const pct = p?.completion_percentage ?? 0;
          const unlocked = i === 0 || prevComplete || pct > 0;
          const done = pct >= 100;
          const wasComplete = prevComplete;
          prevComplete = done;
          const locked = !unlocked && !wasComplete;

          return (
            <div key={topic.id}>
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                {locked ? (
                  <Card className="flex items-center gap-4 p-5 opacity-60">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground"><Lock className="h-5 w-5" /></div>
                    <div className="flex-1">
                      <p className="font-semibold">{topic.name}</p>
                      <p className="text-xs text-muted-foreground">Complete the previous topic to unlock</p>
                    </div>
                    <DifficultyBadge difficulty={topic.difficulty} />
                  </Card>
                ) : (
                  <Link to="/topics/$slug" params={{ slug: topic.slug }}>
                    <Card className="shadow-card flex items-center gap-4 p-5 transition-all hover:border-primary/50 hover:shadow-glow">
                      <div className={`grid h-12 w-12 place-items-center rounded-xl ${done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"}`}>
                        {done ? <CheckCircle2 className="h-6 w-6" /> : <Icon name={topic.icon ?? undefined} className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{topic.name}</p>
                          <DifficultyBadge difficulty={topic.difficulty} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{topic.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{topic.estimated_hours}h</span>
                          <span className="flex items-center gap-1"><ListChecks className="h-3 w-3" />{p?.questions_solved ?? 0} solved</span>
                        </div>
                        <Progress value={pct} className="mt-2 h-1.5" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">{pct}%</span>
                    </Card>
                  </Link>
                )}
              </motion.div>
              {i < (topics?.length ?? 0) - 1 && (
                <div className="flex justify-center py-1 text-muted-foreground/40"><ArrowDown className="h-5 w-5" /></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
