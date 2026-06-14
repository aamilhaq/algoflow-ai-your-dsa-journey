import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { User, Save, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { useProfile, useProgress, useSubmissions, useUpdateProfile } from "@/lib/queries";
import { levelProgress } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/profile")({ component: ProfilePage });

function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const { data: progress } = useProgress();
  const { data: submissions } = useSubmissions();
  const update = useUpdateProfile();
  const [name, setName] = useState<string | null>(null);

  if (isLoading || !profile) return <Skeleton className="h-96 w-full" />;

  const lp = levelProgress(profile.xp);
  const nameValue = name ?? profile.name ?? "";
  const initials = (profile.name ?? profile.email ?? "?").slice(0, 2).toUpperCase();
  const joined = new Date(profile.created_at).toLocaleDateString("en", { month: "long", year: "numeric" });

  const save = async () => {
    if (!nameValue.trim()) return toast.error("Name can't be empty");
    try {
      await update.mutateAsync({ name: nameValue.trim() });
      toast.success("Profile updated");
      setName(null);
    } catch {
      toast.error("Couldn't update profile");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><User className="h-6 w-6 text-primary" />Profile</h1>

      <Card className="shadow-card p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.name ?? "avatar"} />
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
              <Calendar className="h-3.5 w-3.5" />Joined {joined}
            </p>
            <div className="mt-3 max-w-xs">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Level {lp.level}</span><span className="text-muted-foreground">{profile.xp} XP</span>
              </div>
              <Progress value={lp.pct} className="mt-1.5 h-1.5" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total XP" value={profile.xp} icon="Zap" accent="primary" delay={0} />
        <StatCard label="Problems Solved" value={submissions?.length ?? 0} icon="CheckCircle2" accent="success" delay={0.05} />
        <StatCard label="Topics Started" value={progress?.length ?? 0} icon="Map" accent="accent" delay={0.1} />
      </div>

      <Card className="shadow-card p-6">
        <h2 className="font-semibold">Edit profile</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={nameValue} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email ?? ""} disabled />
          </div>
          <Button onClick={save} disabled={update.isPending || name === null}>
            <Save className="mr-1.5 h-4 w-4" />Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
