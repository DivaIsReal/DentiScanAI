import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
}

export function Logo({ className, iconOnly = false, href = "/" }: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tooth-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path
            d="M16 3C11 3 7 6 7 11c0 2 .5 4 1 6 .5 2 1 4 1.5 6.5.5 2.5 1 5 2.5 5s2-2 2.5-4.5c.5-2 1-3.5 1.5-3.5s1 1.5 1.5 3.5c.5 2.5 1 4.5 2.5 4.5s2-2.5 2.5-5c.5-2.5 1-4.5 1.5-6.5.5-2 1-4 1-6 0-5-4-8-9-8z"
            fill="url(#tooth-gradient)"
          />
          <circle cx="22" cy="9" r="3" fill="#22d3ee" className="animate-pulse" />
          <circle cx="22" cy="9" r="1.5" fill="white" />
        </svg>
      </div>
      {!iconOnly && (
        <span className="font-display text-xl font-bold tracking-tight">
          Denti<span className="gradient-text">Scan</span>
        </span>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
