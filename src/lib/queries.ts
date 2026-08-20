import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, DEMO_USER_ID } from "@/lib/auth";
import type { Profile, Topic, Problem, UserProgress, Submission, Achievement } from "@/lib/types";

const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  name: "Alex Chen (Demo)",
  email: "demo@algoflow.ai",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  current_level: 8,
  xp: 2850,
  streak: 14,
  last_active_date: new Date().toISOString().slice(0, 10),
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

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
      if (user?.id === DEMO_USER_ID) return DEMO_PROFILE;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) return DEMO_PROFILE;
      return data ?? DEMO_PROFILE;
    },
  });
}

export function useProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<UserProgress[]> => {
      if (user?.id === DEMO_USER_ID) {
        const { data: topics } = await supabase.from("topics").select("*");
        if (!topics || topics.length === 0) return [];
        return topics.map((t, idx) => ({
          id: `prog-${t.id}`,
          user_id: DEMO_USER_ID,
          topic_id: t.id,
          questions_solved: Math.max(1, 8 - idx * 2),
          completion_percentage: Math.max(25, 100 - idx * 15),
          last_accessed: new Date(Date.now() - idx * 3600000).toISOString(),
        }));
      }
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
      if (user?.id === DEMO_USER_ID) {
        const now = Date.now();
        const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
        const demoSubs: Submission[] = [
          { id: "sub-1", user_id: DEMO_USER_ID, problem_id: "p1", code: "// Two Sum\nfunction twoSum(nums, target) { return [0, 1]; }", language: "javascript", status: "Accepted", runtime_ms: 54, submitted_at: daysAgo(0) },
          { id: "sub-2", user_id: DEMO_USER_ID, problem_id: "p2", code: "// Valid Anagram", language: "typescript", status: "Accepted", runtime_ms: 62, submitted_at: daysAgo(0) },
          { id: "sub-3", user_id: DEMO_USER_ID, problem_id: "p3", code: "// Reverse LinkedList", language: "javascript", status: "Accepted", runtime_ms: 48, submitted_at: daysAgo(1) },
          { id: "sub-4", user_id: DEMO_USER_ID, problem_id: "p4", code: "// Binary Search", language: "python", status: "Accepted", runtime_ms: 71, submitted_at: daysAgo(1) },
          { id: "sub-5", user_id: DEMO_USER_ID, problem_id: "p5", code: "// Max Subarray", language: "typescript", status: "Accepted", runtime_ms: 59, submitted_at: daysAgo(2) },
          { id: "sub-6", user_id: DEMO_USER_ID, problem_id: "p6", code: "// Container With Water", language: "javascript", status: "Accepted", runtime_ms: 84, submitted_at: daysAgo(2) },
          { id: "sub-7", user_id: DEMO_USER_ID, problem_id: "p7", code: "// Invert Tree", language: "typescript", status: "Accepted", runtime_ms: 42, submitted_at: daysAgo(3) },
          { id: "sub-8", user_id: DEMO_USER_ID, problem_id: "p8", code: "// Climb Stairs", language: "javascript", status: "Accepted", runtime_ms: 38, submitted_at: daysAgo(4) },
          { id: "sub-9", user_id: DEMO_USER_ID, problem_id: "p9", code: "// Coin Change", language: "python", status: "Accepted", runtime_ms: 95, submitted_at: daysAgo(5) },
          { id: "sub-10", user_id: DEMO_USER_ID, problem_id: "p10", code: "// LRU Cache", language: "typescript", status: "Accepted", runtime_ms: 110, submitted_at: daysAgo(6) },
        ];
        return problemId ? demoSubs.filter((s) => s.problem_id === problemId) : demoSubs;
      }
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
      if (user?.id === DEMO_USER_ID) {
        const { data: ach } = await supabase.from("achievements").select("id");
        return ach?.map((a) => a.id) ?? [];
      }
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
      const list = data ?? [];
      if (!list.some((p) => p.id === DEMO_USER_ID)) {
        list.push({
          id: DEMO_USER_ID,
          name: DEMO_PROFILE.name,
          avatar_url: DEMO_PROFILE.avatar_url,
          current_level: DEMO_PROFILE.current_level,
          xp: DEMO_PROFILE.xp,
          streak: DEMO_PROFILE.streak,
        });
      }
      return list.sort((a, b) => b.xp - a.xp);
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: { name?: string; avatar_url?: string | null }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
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
