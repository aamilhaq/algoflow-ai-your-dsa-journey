import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bot, Map, BarChart3, Trophy, Code2, Sparkles, ArrowRight, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoWordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const { data } = await supabase.auth.getSession();
      if (data.session) throw redirect({ to: "/dashboard" });
    }
  },
  component: Landing,
});

const features = [
  { icon: Map, title: "Interactive Roadmap", desc: "A guided path from Arrays to Dynamic Programming with unlocks and progress." },
  { icon: Bot, title: "AI Tutor", desc: "Ask for concepts, hints, complexity analysis, and similar problems anytime." },
  { icon: Code2, title: "Explain My Code", desc: "Paste code and get complexity, bugs, edge cases, and optimizations." },
  { icon: Trophy, title: "Gamification", desc: "Earn XP, level up, unlock achievements, and climb the leaderboard." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Heatmaps, weak areas, acceptance rate, and streak history." },
  { icon: Flame, title: "Smart Revision", desc: "Spaced-repetition reminders at 1, 3, 7, and 30 days." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <LogoWordmark />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Duolingo × LeetCode × AI Tutor
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl"
          >
            Master <span className="text-gradient">Data Structures</span> & Algorithms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            An AI-powered learning platform that turns DSA prep into a game. Follow a roadmap, solve problems, and learn faster with your personal AI tutor.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/auth">
                Start learning free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">I have an account</Link>
            </Button>
          </motion.div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-warning" /> 13 topics</span>
            <span className="flex items-center gap-1.5"><Code2 className="h-4 w-4 text-accent" /> Curated problems</span>
            <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-primary" /> Achievements</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold">Everything you need to go from zero to job-ready</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="shadow-card h-full p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Card className="shadow-card overflow-hidden bg-gradient-primary p-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Ready to level up?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">Join AlgoFlow AI and turn consistent practice into mastery.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/auth">Create your free account</Link>
          </Button>
        </Card>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AlgoFlow AI. Built for learners.
        </div>
      </footer>
    </div>
  );
}
