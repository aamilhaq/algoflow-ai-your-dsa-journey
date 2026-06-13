import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icon";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { useProfile, useProgress, useTopics, useSubmissions } from "@/lib/queries";
import { levelProgress } from "@/lib/types";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip as RTooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { data: profile, isLoading } = useProfile();
  const { data: progress } = useProgress();
  const { data: topics } = useTopics();
  const { data: submissions } = useSubmissions();

  if (isLoading || !profile) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  const lp = levelProgress(profile.xp);
  const solved = submissions?.length ?? 0;

  // weekly chart from submissions
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en", { weekday: "short" });
    const count = submissions?.filter((s) => s.submitted_at.slice(0, 10) === key).length ?? 0;
    return { day: label, solved: count };
  });

  const recent = (progress ?? [])
    .slice()
    .sort((a, b) => +new Date(b.last_accessed) - +new Date(a.last_accessed))
    .slice(0, 3)
    .map((p) => ({ ...p, topic: topics?.find((t) => t.id === p.topic_id) }));

  const nextTopic = topics?.find((t) => !(progress ?? []).some((p) => p.topic_id === t.id && p.completion_percentage >= 100));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {profile.name?.split(" ")[0] ?? "learner"} 👋</h1>
        <p className="text-sm text-muted-foreground">Keep your streak alive and crush some problems today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total XP" value={profile.xp} icon="Zap" accent="primary" sub={`Level ${lp.level}`} delay={0} />
        <StatCard label="Daily Streak" value={`${profile.streak} 🔥`} icon="Flame" accent="warning" sub="days in a row" delay={0.05} />
        <StatCard label="Problems Solved" value={solved} icon="CheckCircle2" accent="success" delay={0.1} />
        <StatCard label="Topics Started" value={progress?.length ?? 0} icon="Map" accent="accent" sub={`of ${topics?.length ?? 0}`} delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card p-5 lg:col-span-2">
          <h2 className="font-semibold">Weekly progress</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <RTooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="solved" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="shadow-card p-5">
          <h2 className="font-semibold">Level progress</h2>
          <div className="mt-6 text-center">
            <div className="text-4xl font-extrabold text-gradient">Lv {lp.level}</div>
            <Progress value={lp.pct} className="mt-4 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">{lp.into} / {lp.needed} XP to next level</p>
          </div>
          {nextTopic && (
            <div className="mt-6 rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground">Recommended next</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold">
                  <Icon name={nextTopic.icon} className="h-4 w-4 text-primary" /> {nextTopic.name}
                </span>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/topics/$slug" params={{ slug: nextTopic.slug }}><ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="shadow-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recently studied</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/roadmap">View roadmap</Link></Button>
        </div>
        {recent.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No topics yet. <Link to="/roadmap" className="text-primary underline">Start the roadmap →</Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {recent.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Link to="/topics/$slug" params={{ slug: r.topic?.slug ?? "" }}>
                  <Card className="p-4 transition-colors hover:border-primary/50">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium"><Icon name={r.topic?.icon} className="h-4 w-4 text-primary" />{r.topic?.name}</span>
                      {r.topic && <DifficultyBadge difficulty={r.topic.difficulty} />}
                    </div>
                    <Progress value={r.completion_percentage} className="mt-3 h-1.5" />
                    <p className="mt-1.5 text-xs text-muted-foreground">{r.completion_percentage}% complete</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
