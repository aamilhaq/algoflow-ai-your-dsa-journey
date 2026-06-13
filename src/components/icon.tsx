import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof Icons;

export function Icon({ name, ...props }: { name: string | null | undefined } & LucideProps) {
  const Cmp = (name && (Icons as Record<string, unknown>)[name]) as React.ComponentType<LucideProps> | undefined;
  const Fallback = Icons.Circle;
  const Render = Cmp ?? Fallback;
  return <Render {...props} />;
}

export type { IconName };
