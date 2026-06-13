import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

const styles: Record<Difficulty, string> = {
  Easy: "bg-success/15 text-success border-success/25",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Hard: "bg-destructive/15 text-destructive border-destructive/25",
};

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}
