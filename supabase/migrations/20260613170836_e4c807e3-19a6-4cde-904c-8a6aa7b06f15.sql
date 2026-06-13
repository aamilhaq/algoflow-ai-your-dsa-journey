
-- ENUMS
CREATE TYPE public.difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE public.submission_status AS ENUM ('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Pending');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  current_level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TOPICS
CREATE TABLE public.topics (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  difficulty public.difficulty_level NOT NULL DEFAULT 'Easy',
  estimated_hours INTEGER NOT NULL DEFAULT 4,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.topics TO anon, authenticated;
GRANT ALL ON public.topics TO service_role;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics are publicly viewable" ON public.topics FOR SELECT USING (true);

-- PROBLEMS
CREATE TABLE public.problems (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  topic_id UUID REFERENCES public.topics ON DELETE CASCADE,
  difficulty public.difficulty_level NOT NULL DEFAULT 'Easy',
  company_tags TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  constraints TEXT,
  examples JSONB NOT NULL DEFAULT '[]',
  starter_code JSONB NOT NULL DEFAULT '{}',
  solution TEXT,
  hints TEXT[] NOT NULL DEFAULT '{}',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.problems TO anon, authenticated;
GRANT ALL ON public.problems TO service_role;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Problems are publicly viewable" ON public.problems FOR SELECT USING (true);

-- USER PROGRESS
CREATE TABLE public.user_progress (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics ON DELETE CASCADE,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own progress" ON public.user_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SUBMISSIONS
CREATE TABLE public.submissions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  status public.submission_status NOT NULL DEFAULT 'Pending',
  runtime_ms INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own submissions" ON public.submissions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are publicly viewable" ON public.achievements FOR SELECT USING (true);

-- USER ACHIEVEMENTS
CREATE TABLE public.user_achievements (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own achievements" ON public.user_achievements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- REVISIONS
CREATE TABLE public.revisions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics ON DELETE CASCADE,
  due_date DATE NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.revisions TO authenticated;
GRANT ALL ON public.revisions TO service_role;
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own revisions" ON public.revisions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PUBLIC LEADERBOARD VIEW (safe columns only)
CREATE VIEW public.leaderboard
WITH (security_invoker = false) AS
SELECT id, name, avatar_url, current_level, xp, streak
FROM public.profiles
ORDER BY xp DESC;
GRANT SELECT ON public.leaderboard TO anon, authenticated;
