"use client";

import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface HealthGaugeProps {
  score: number;
  label?: string;
}

export function HealthGauge({ score, label = "Skor Kesehatan Gigi" }: HealthGaugeProps) {
  const data = [{ value: score }];
  const getStatusColor = () => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getStatusText = () => {
    if (score >= 80) return "Sangat Sehat";
    if (score >= 60) return "Cukup Sehat";
    return "Perlu Perhatian";
  };

  const data100 = [{ value: 100 }];

  return (
    <div className="glass rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        {label}
      </h3>

      <div className="space-y-3">
        {/* Gauge visualization */}
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <Bar dataKey="value" fill="#0ea5e9" radius={8}>
                <Cell
                  fill={`url(#gradient-${score})`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score and status */}
        <div className="flex items-end justify-between">
          <div>
            <div className={cn(
              "font-display text-3xl font-bold bg-gradient-to-r",
              getStatusColor(),
              "bg-clip-text text-transparent"
            )}>
              {score}
            </div>
            <p className="text-xs text-muted-foreground">dari 100</p>
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium",
            score >= 80 && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            score >= 60 && score < 80 && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            score < 60 && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          )}>
            {getStatusText()}
          </div>
        </div>
      </div>

      {/* SVG Defs for gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id={`gradient-${score}`} x1="0" y1="0" x2="1" y2="0">
            {score >= 80 && (
              <>
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
              </>
            )}
            {score >= 60 && score < 80 && (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f97316" />
              </>
            )}
            {score < 60 && (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#e11d48" />
              </>
            )}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
