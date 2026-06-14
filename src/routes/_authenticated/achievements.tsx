import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";
import { useAchievements, useUserAchievements } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/achievements")({ component: AchievementsPage });

function AchievementsPage() {
  const { data: achievements, isLoading } = useAchievements();
  const { data: unlocked } = useUserAchievements();

  if (isLoading) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>;
  }

  const unlockedSet = new Set(unlocked ?? []);
  const total = achievements?.length ?? 0;
  const earned = achievements?.filter((a) => unlockedSet.has(a.id)).length ?? 0;
  const pct = total ? Math.round((earned / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Trophy className="h-6 w-6 text-warning" />Achievements</h1>
        <p className="text-sm text-muted-foreground">Unlock badges by hitting milestones on your DSA journey.</p>
      </div>

      <Card className="shadow-card p-5">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Progress</span>
          <span className="text-muted-foreground">{earned} / {total} unlocked</span>
        </div>
        <Progress value={pct} className="mt-3 h-2" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements?.map((a, i) => {
          const has = unlockedSet.has(a.id);
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={cn("shadow-card relative h-full p-5", !has && "opacity-70")}>
                <div className="flex items-start gap-4">
                  <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", has ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
                    {has ? <Icon name={a.icon ?? "Award"} className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-2 text-xs font-semibold text-primary">+{a.xp_reward} XP</p>
                  </div>
                </div>
                {has && <span className="absolute right-3 top-3 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">UNLOCKED</span>}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
