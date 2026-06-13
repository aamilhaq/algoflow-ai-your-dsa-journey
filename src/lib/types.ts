import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Topic = Tables<"topics">;
export type Problem = Tables<"problems">;
export type UserProgress = Tables<"user_progress">;
export type Submission = Tables<"submissions">;
export type Achievement = Tables<"achievements">;
export type UserAchievement = Tables<"user_achievements">;
export type Revision = Tables<"revisions">;

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type TutorMode =
  | "explain-concept"
  | "explain-code"
  | "hints-only"
  | "examples"
  | "complexity"
  | "similar-questions";

// XP required to reach the *next* level from the current one.
export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}
export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}
export function levelProgress(xp: number): { level: number; into: number; needed: number; pct: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const needed = next - base;
  return { level, into, needed, pct: Math.min(100, Math.round((into / needed) * 100)) };
}
