"use client";

import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  userName?: string;
}

export function Topbar({ userName }: TopbarProps) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 11) setGreeting("Good morning");
    else if (h < 16) setGreeting("Good afternoon");
    else if (h < 19) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DS";

  return (
    <header className="h-16 border-b border-border/50 bg-card/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <div className="text-xs text-muted-foreground">{greeting},</div>
        <div className="text-sm font-semibold">{userName || "User"} 👋</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 w-64 bg-background/50"
          />
        </div>

        <button className="relative w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-accent transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 text-white text-sm font-semibold flex items-center justify-center">
          {initials}
        </div>
      </div>
    </header>
  );
}
