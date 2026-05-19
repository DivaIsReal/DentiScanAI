"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Activity,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ResultCard } from "@/components/dashboard/result-card";
import { ClinicFinder } from "@/components/dashboard/clinic-finder";
import { ScanHistory } from "@/components/dashboard/scan-history";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { ScanResult } from "@/types";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "scan";
  const { push } = useToast();

  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, lastScore: 0 });

  // Fetch stats
  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) {
          setStats({
            total: d.data.length,
            lastScore: d.data[0].overallScore,
          });
        }
      })
      .catch(() => {});
  }, [result]);

  async function handleScan(file: File | null) {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
        push({
          type: "success",
          title: "Analisis selesai",
          description: "Hasil scan gigi Anda telah siap dilihat.",
        });
      } else {
        push({
          type: "error",
          title: "Gagal melakukan analisis",
          description: data.error || "Silakan coba lagi.",
        });
      }
    } catch {
      push({
        type: "error",
        title: "Terjadi kesalahan",
        description: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setLoading(false);
    }
  }

  const renderScan = () => (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 space-y-6">
        <UploadArea onScan={handleScan} loading={loading} />

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Tips untuk hasil terbaik</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Gunakan pencahayaan yang cukup dan merata</li>
                  <li>Buka mulut lebar dan arahkan kamera ke gigi</li>
                  <li>Pastikan foto tidak buram atau gelap</li>
                  <li>Format yang didukung: JPG, PNG, WebP (maks 10MB)</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        <ClinicFinder />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight">
          {tab === "history"
            ? "Riwayat Scan"
            : tab === "clinics"
              ? "Klinik Terdekat"
              : "Dashboard"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {tab === "history"
            ? "Lihat semua hasil scan kesehatan gigi Anda."
            : tab === "clinics"
              ? "Temukan klinik gigi terbaik di sekitar Anda."
              : "Mulai screening kesehatan gigi Anda dengan AI."}
        </p>
      </motion.div>

      {/* Quick stats - only on scan tab */}
      {tab === "scan" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            icon={ScanLine}
            label="Total Scan"
            value={stats.total.toString()}
            accent="from-cyan-500 to-sky-600"
          />
          <StatCard
            icon={Activity}
            label="Skor Terakhir"
            value={stats.lastScore ? `${stats.lastScore}` : "—"}
            suffix={stats.lastScore ? "/100" : ""}
            accent="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Status"
            value={
              stats.lastScore >= 80
                ? "Sehat"
                : stats.lastScore >= 60
                  ? "Cukup"
                  : stats.lastScore > 0
                    ? "Perlu Perhatian"
                    : "—"
            }
            accent="from-amber-500 to-orange-600"
          />
          <StatCard
            icon={Sparkles}
            label="AI Confidence"
            value="94.2%"
            accent="from-violet-500 to-fuchsia-600"
          />
        </motion.div>
      )}

      {/* Loading overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="glass-strong rounded-2xl px-8 py-6 flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            <div>
              <p className="font-semibold">AI sedang menganalisis...</p>
              <p className="text-xs text-muted-foreground">
                Mohon tunggu beberapa saat
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "scan" && renderScan()}
          {tab === "history" && (
            <ScanHistory
              onSelect={(scan) => {
                setResult(scan);
                router.push("/dashboard?tab=scan");
              }}
            />
          )}
          {tab === "clinics" && (
            <div className="max-w-3xl">
              <ClinicFinder />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA to chatbot */}
      {tab === "scan" && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-0.5">
                Konsultasi lebih lanjut dengan DentiBot
              </h3>
              <p className="text-sm text-muted-foreground">
                Tanyakan apa pun tentang hasil scan Anda kepada AI asisten gigi
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/chatbot")}
            className="bg-gradient-to-r from-cyan-500 to-sky-600 text-white"
          >
            Tanya DentiBot
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  suffix?: string;
  accent: string;
}

function StatCard({ icon: Icon, label, value, suffix, accent }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-4 hover:scale-[1.02] transition-transform">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="font-display font-bold text-lg leading-tight">
            {value}
            {suffix && (
              <span className="text-xs text-muted-foreground font-normal ml-0.5">
                {suffix}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
