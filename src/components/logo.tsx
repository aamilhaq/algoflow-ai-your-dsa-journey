import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="grid place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 L9 6 L12 14 L15 9 L20 18" />
        </svg>
      </span>
    </span>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo />
      <span className="text-lg font-extrabold tracking-tight">
        Algo<span className="text-gradient">Flow</span> <span className="text-muted-foreground font-bold">AI</span>
      </span>
    </span>
  );
}
