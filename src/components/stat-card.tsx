import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  accent = "primary",
  sub,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: "primary" | "accent" | "success" | "warning";
  sub?: string;
  delay?: number;
}) {
  const accentMap = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
  } as const;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className="shadow-card relative overflow-hidden p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={cn("grid h-11 w-11 place-items-center rounded-xl", accentMap[accent])}>
            <Icon name={icon} className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
