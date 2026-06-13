import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Map, Bot, BarChart3, Trophy, User, Settings, Code2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LogoWordmark } from "@/components/logo";
import { useProfile } from "@/lib/queries";
import { levelProgress } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Roadmap", url: "/roadmap", icon: Map },
  { title: "AI Tutor", url: "/tutor", icon: Bot },
  { title: "Explain Code", url: "/explain", icon: Code2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Achievements", url: "/achievements", icon: Trophy },
];

const footerItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: profile } = useProfile();
  const lp = profile ? levelProgress(profile.xp) : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/dashboard">
          <LogoWordmark className="group-data-[collapsible=icon]:hidden" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learn</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {lp && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Level {lp.level}</span>
              <span className="text-muted-foreground">{profile?.xp} XP</span>
            </div>
            <Progress value={lp.pct} className="mt-2 h-1.5" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {lp.needed - lp.into} XP to level {lp.level + 1}
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
