"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  MessageSquare,
  History,
  MapPin,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scan Teeth", href: "/dashboard?tab=scan", icon: ScanLine },
  { label: "Scan History", href: "/dashboard?tab=history", icon: History },
  { label: "Clinic Finder", href: "/dashboard?tab=clinics", icon: MapPin },
  { label: "DentiBot", href: "/chatbot", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card/40 backdrop-blur-xl">
      <div className="p-6">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href.startsWith("/dashboard") && pathname === "/dashboard");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/15 to-sky-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-1">
        <div className="glass rounded-xl p-4 mb-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-cyan-500/20 blur-2xl" />
          <Sparkles className="w-5 h-5 text-cyan-500 mb-2" />
          <div className="text-xs font-semibold mb-1">Upgrade Plan</div>
          <div className="text-xs text-muted-foreground mb-3">
            Get unlimited scans & priority AI
          </div>
          <button className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
            Learn more →
          </button>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
