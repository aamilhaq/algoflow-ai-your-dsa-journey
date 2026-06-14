import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, Moon, Sun, LogOut, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const initials = (profile?.name ?? profile?.email ?? "?").slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    await signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><SettingsIcon className="h-6 w-6 text-primary" />Settings</h1>

      <Card className="shadow-card p-6">
        <h2 className="font-semibold">Account</h2>
        <div className="mt-4 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="bg-primary/10 font-bold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{profile?.name}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="shadow-card p-6">
        <h2 className="flex items-center gap-2 font-semibold"><Palette className="h-4 w-4 text-primary" />Appearance</h2>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-warning" />}
            <div>
              <Label htmlFor="dark-mode">Dark mode</Label>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
            </div>
          </div>
          <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={(c) => setTheme(c ? "dark" : "light")} />
        </div>
      </Card>

      <Card className="shadow-card p-6">
        <h2 className="font-semibold">Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign out of your AlgoFlow AI account on this device.</p>
        <Button variant="destructive" className="mt-4" onClick={handleSignOut}>
          <LogOut className="mr-1.5 h-4 w-4" />Sign out
        </Button>
      </Card>
    </div>
  );
}
