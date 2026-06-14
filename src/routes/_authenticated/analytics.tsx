import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";
import { StatCard } from "@/components/stat-card";
import { useProfile, useProgress, useTopics, useSubmissions } from "@/lib/queries";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({ component: AnalyticsPage });

const DIFF_COLORS: Record<string, string> = {
  Easy: "var(--color-success)",
  Medium: "var(--color-warning)",
  Hard: "var(--color-destructive)",
};

function AnalyticsPage() {
  const { data: profile, isLoading } = useProfile();
  const { data: progress } = useProgress();
  const { data: topics } = useTopics();
  const { data: submissions } = useSubmissions();

  if (isLoading || !profile) {
    return <div className="space-y-4"><Skeleton className="h-28 w-full" /><Skeleton className="h-72 w-full" /></div>;
  }

  const solved = submissions?.length ?? 0;
  const accepted = submissions?.filter((s) => s.status === "Accepted").length ?? 0;
  const acceptance = solved ? Math.round((accepted / solved) * 100) : 0;
  const avgRuntime = solved
    ? Math.round((submissions!.reduce((a, s) => a + (s.runtime_ms ?? 0), 0)) / solved)
    : 0;

  // 30-day activity
  const activity = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const count = submissions?.filter((s) => s.submitted_at.slice(0, 10) === key).length ?? 0;
    return { date: d.toLocaleDateString("en", { month: "short", day: "numeric" }), solved: count };
  });

  // difficulty distribution (by solved problems → join via topics? use submission count by problem difficulty unavailable, so derive from progress topics)
  const diffCount: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
  (topics ?? []).forEach((t) => {
    const p = progress?.find((pr) => pr.topic_id === t.id);
    if (p) diffCount[t.difficulty] += p.questions_solved ?? 0;
  });
  const pieData = Object.entries(diffCount).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0);

  const topicProgress = (topics ?? [])
    .map((t) => ({ ...t, prog: progress?.find((p) => p.topic_id === t.id)?.completion_percentage ?? 0 }))
    .sort((a, b) => b.prog - a.prog);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><BarChart3 className="h-6 w-6 text-primary" />Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your progress, consistency, and strengths.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Solved" value={solved} icon="CheckCircle2" accent="success" delay={0} />
        <StatCard label="Acceptance" value={`${acceptance}%`} icon="Target" accent="primary" delay={0.05} />
        <StatCard label="Avg Runtime" value={`${avgRuntime}ms`} icon="Timer" accent="accent" delay={0.1} />
        <StatCard label="Current Streak" value={`${profile.streak} 🔥`} icon="Flame" accent="warning" delay={0.15} />
      </div>

      <Card className="shadow-card p-5">
        <h2 className="font-semibold">Activity (last 30 days)</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} interval={4} stroke="var(--color-muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} stroke="var(--color-muted-foreground)" width={24} />
              <RTooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="solved" stroke="var(--color-primary)" strokeWidth={2} fill="url(#actGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card p-5">
          <h2 className="font-semibold">Solved by difficulty</h2>
          <div className="mt-4 h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {pieData.map((d) => <Cell key={d.name} fill={DIFF_COLORS[d.name]} />)}
                  </Pie>
                  <Legend />
                  <RTooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">Solve problems to see your distribution.</div>
            )}
          </div>
        </Card>

        <Card className="shadow-card p-5">
          <h2 className="font-semibold">Topic mastery</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto scrollbar-thin pr-1">
            {topicProgress.map((t) => (
              <div key={t.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Icon name={t.icon ?? undefined} className="h-4 w-4 text-primary" />{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.prog}%</span>
                </div>
                <Progress value={t.prog} className="mt-1.5 h-1.5" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
