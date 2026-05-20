"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { ScanResult } from "@/types";
import { cn } from "@/lib/utils";

interface ConditionData {
  name: string;
  severity: number;
  color: string;
}

export function OverviewSection() {
  const router = useRouter();
  const [recentScan, setRecentScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch("/api/scan");
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          setRecentScan(data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch scans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Sangat Sehat", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" };
    if (score >= 60) return { label: "Cukup Sehat", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" };
    return { label: "Perlu Perhatian", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-500";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-rose-500 to-red-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!recentScan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Empty state */}
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-xl bg-cyan-500/15 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-cyan-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Belum ada data scan</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Mulai scan pertama kamu untuk melihat analisis kesehatan gigi
          </p>
          <Button
            onClick={() => router.push("/dashboard?tab=scan&step=1")}
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold"
          >
            Scan Sekarang
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  const score = recentScan.overallScore;
  const status = getHealthStatus(score);
  const scoreColor = getScoreColor(score);
  const progressColor = getProgressBarColor(score);

  // Calculate condition values from severity
  const conditions = recentScan.conditions || [];
  const conditionData: ConditionData[] = [
    {
      name: "Karies",
      severity: conditions.find(c => c.name === "Karies")?.severity ? (conditions.find(c => c.name === "Karies")!.severity === "high" ? 80 : conditions.find(c => c.name === "Karies")!.severity === "medium" ? 50 : 20) : 0,
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "Karang",
      severity: conditions.find(c => c.name === "Karang")?.severity ? (conditions.find(c => c.name === "Karang")!.severity === "high" ? 80 : conditions.find(c => c.name === "Karang")!.severity === "medium" ? 50 : 20) : 0,
      color: "from-rose-500 to-red-500",
    },
    {
      name: "Sehat",
      severity: 100 - (conditions.reduce((sum, c) => {
        const sv = c.severity === "high" ? 40 : c.severity === "medium" ? 20 : 10;
        return sum + sv;
      }, 0) || 0),
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Recent Scan Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 shadow-lg"
      >
        <div className="flex gap-6">
          {/* Left: Tooth thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-cyan-500/15 to-sky-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Activity className="w-12 h-12 text-cyan-600 dark:text-cyan-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Right: Scan info */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Scan Terakhir
            </p>
            <h3 className="text-lg font-bold mb-3">Laporan Analisis Gigi</h3>

            {/* Condition badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Karies", value: conditions.find(c => c.name === "Karies")?.severity ? (conditions.find(c => c.name === "Karies")!.severity === "high" ? 80 : conditions.find(c => c.name === "Karies")!.severity === "medium" ? 50 : 20) : 0, color: "from-amber-500 to-orange-500" },
                { label: "Karang", value: conditions.find(c => c.name === "Karang")?.severity ? (conditions.find(c => c.name === "Karang")!.severity === "high" ? 80 : conditions.find(c => c.name === "Karang")!.severity === "medium" ? 50 : 20) : 0, color: "from-rose-500 to-red-500" },
                { label: "Sehat", value: Math.max(0, 100 - (conditions.reduce((sum, c) => sum + (c.severity === "high" ? 40 : c.severity === "medium" ? 20 : 10), 0) || 0)), color: "from-emerald-500 to-teal-500" },
              ].map((m) => (
                <div key={m.label} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium">
                  <span className={`bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                    {m.label} {m.value}%
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom row: Score and button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overall Score</p>
                <p className={cn("text-2xl font-display font-bold", scoreColor)}>
                  {score}/100
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard?tab=scan&step=1")}
                variant="outline"
                size="sm"
              >
                Lihat Detail
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 shadow-lg"
      >
        <div className="mb-6">
          <div className="flex items-end gap-4 mb-6">
            <div>
              <p className={cn("text-4xl font-display font-bold", scoreColor)}>
                {score}
              </p>
              <p className="text-xs text-muted-foreground mt-1">dari 100</p>
            </div>
            <div className={cn("px-4 py-2 rounded-lg text-sm font-medium", status.bg, status.color)}>
              {status.label}
            </div>
          </div>

          {/* Main progress bar */}
          <div className="mb-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", progressColor)}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0</span>
              <span>Perlu perhatian &lt;60</span>
              <span>Sangat sehat 80+</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* 3-column condition grid */}
        <div className="grid grid-cols-3 gap-4">
          {conditionData.map((cond) => (
            <div key={cond.name} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{cond.name}</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cond.severity}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn("h-full rounded-full", `bg-gradient-to-r ${cond.color}`)}
                />
              </div>
              <p className={cn("text-sm font-bold bg-gradient-to-r", cond.color, "bg-clip-text text-transparent")}>
                {cond.severity}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <Button
          onClick={() => router.push("/dashboard?tab=scan&step=1")}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold h-11"
        >
          Scan Sekarang
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          onClick={() => router.push("/dashboard?tab=history")}
          variant="outline"
          className="flex-1 h-11"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Lihat Riwayat
        </Button>
      </motion.div>
    </motion.div>
  );
}
