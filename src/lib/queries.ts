import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { Profile, Topic, Problem, UserProgress, Submission, Achievement } from "@/lib/types";

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: async (): Promise<Topic[]> => {
      const { data, error } = await supabase.from("topics").select("*").order("order");
      if (error) throw error;
      return data;
    },
  });
}

export function useTopic(slug: string) {
  return useQuery({
    queryKey: ["topic", slug],
    queryFn: async (): Promise<Topic | null> => {
      const { data, error } = await supabase.from("topics").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useProblemsByTopic(topicId: string | undefined) {
  return useQuery({
    queryKey: ["problems", "topic", topicId],
    enabled: !!topicId,
    queryFn: async (): Promise<Problem[]> => {
      const { data, error } = await supabase.from("problems").select("*").eq("topic_id", topicId!).order("order");
      if (error) throw error;
      return data;
    },
  });
}

export function useProblem(slug: string) {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: async (): Promise<Problem | null> => {
      const { data, error } = await supabase.from("problems").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<UserProgress[]> => {
      const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
  });
}

export function useSubmissions(problemId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["submissions", user?.id, problemId ?? "all"],
    enabled: !!user,
    queryFn: async (): Promise<Submission[]> => {
      let q = supabase.from("submissions").select("*").eq("user_id", user!.id).order("submitted_at", { ascending: false });
      if (problemId) q = q.eq("problem_id", problemId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async (): Promise<Achievement[]> => {
      const { data, error } = await supabase.from("achievements").select("*").order("xp_reward");
      if (error) throw error;
      return data;
    },
  });
}

export function useUserAchievements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-achievements", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.from("user_achievements").select("achievement_id").eq("user_id", user!.id);
      if (error) throw error;
      return data.map((d) => d.achievement_id);
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, current_level, xp, streak")
        .order("xp", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
}

// Records a solved problem: inserts an Accepted submission, awards XP, updates progress + streak.
export function useSolveProblem() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { problem: Problem; code: string; language: string }) => {
      if (!user) throw new Error("Not signed in");
      const { problem, code, language } = args;
      const xpGain = problem.difficulty === "Hard" ? 100 : problem.difficulty === "Medium" ? 50 : 25;

      await supabase.from("submissions").insert({
        user_id: user.id,
        problem_id: problem.id,
        code,
        language,
        status: "Accepted",
        runtime_ms: Math.floor(40 + Math.random() * 120),
      });

      // profile xp / streak
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (profile) {
        const today = new Date().toISOString().slice(0, 10);
        const last = profile.last_active_date;
        let streak = profile.streak;
        if (last !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          streak = last === yesterday ? streak + 1 : 1;
        }
        const newXp = profile.xp + xpGain;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        await supabase
          .from("profiles")
          .update({ xp: newXp, current_level: newLevel, streak, last_active_date: today })
          .eq("id", user.id);
      }

      // progress for the topic
      if (problem.topic_id) {
        const { data: existing } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("topic_id", problem.topic_id)
          .maybeSingle();
        const { count } = await supabase
          .from("problems")
          .select("id", { count: "exact", head: true })
          .eq("topic_id", problem.topic_id);
        const total = count ?? 1;
        const solved = (existing?.questions_solved ?? 0) + 1;
        const pct = Math.min(100, Math.round((solved / total) * 100));
        await supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            topic_id: problem.topic_id,
            questions_solved: solved,
            completion_percentage: pct,
            last_accessed: new Date().toISOString(),
          },
          { onConflict: "user_id,topic_id" },
        );
      }
      return { xpGain };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["submissions"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
