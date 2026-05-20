"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  MessageSquare,
  History,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard?tab=dashboard", icon: LayoutDashboard },
  { label: "Scan Teeth", href: "/dashboard?tab=scan&step=1", icon: ScanLine },
  { label: "Scan History", href: "/dashboard?tab=history", icon: History },
  { label: "Clinic Finder", href: "/dashboard?tab=clinics", icon: MapPin },
  { label: "DentiBot", href: "/chatbot", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function getTabFromHref(href: string) {
    const m = href.match(/[?&]tab=([^&]+)/);
    return m ? m[1] : null;
  }

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
          let isActive = false;

          if (item.href.startsWith("/dashboard")) {
            const currentTab = searchParams?.get("tab");
            const itemTab = getTabFromHref(item.href);
            isActive = pathname === "/dashboard" && itemTab && itemTab === currentTab;
          } else {
            isActive = pathname === item.href;
          }
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
