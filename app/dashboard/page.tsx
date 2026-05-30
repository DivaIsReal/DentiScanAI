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
import { OverviewSection } from "@/components/dashboard/overview-section";
import { StepIndicator } from "@/components/dashboard/step-indicator";
import { TipsAccordion } from "@/components/dashboard/tips-accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { ScanResult } from "@/types";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "dashboard";
  const step = parseInt(searchParams.get("step") || "1", 10) as 1 | 2 | 3;
  const { toast } = useToast();

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

  async function handleScan(file: File | null, debug = false) {
    if (!file) return;
    setLoading(true);
    setResult(null);
    router.push("/dashboard?tab=scan&step=2");

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (debug) formData.append("debug", "1");

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
        router.push("/dashboard?tab=scan&step=3");
        toast(
          "success",
          "Analisis selesai. Hasil scan gigi Anda telah siap dilihat."
        );
      } else {
        router.push("/dashboard?tab=scan&step=1");
        toast(
          "error",
          data.error || "Gagal melakukan analisis. Silakan coba lagi."
        );
      }
    } catch {
      router.push("/dashboard?tab=scan&step=1");
      toast(
        "error",
        "Terjadi kesalahan. Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  const renderOverview = () => (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Overview content */}
        <OverviewSection />
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ClinicFinder />
        </motion.div>
      </div>
    </div>
  );

  const renderScan = () => (
    <div className="space-y-6">
      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StepIndicator currentStep={step} />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <UploadArea onScan={handleScan} loading={loading} />
              <TipsAccordion />
            </motion.div>
          )}

          {/* Step 2: Analyzing */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
                <h3 className="font-semibold text-lg mb-1">AI sedang menganalisis...</h3>
                <p className="text-muted-foreground text-sm">
                  Mohon tunggu beberapa saat untuk hasil yang akurat
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ResultCard result={result} />
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <ClinicFinder />
        </div>
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
              : tab === "scan"
                ? "Lakukan scanning gigi kesehatan Anda dengan AI."
                : "Lihat ringkasan kesehatan gigi dan riwayat scan Anda."}
        </p>
      </motion.div>

      {/* Quick stats - only on scan tab for step 1 */}
      {tab === "scan" && step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 shadow-lg"
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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "dashboard" && renderOverview()}
          {tab === "scan" && renderScan()}
          {tab === "history" && (
            <ScanHistory
              onSelect={(scan) => {
                setResult(scan);
                router.push("/dashboard?tab=scan&step=3");
              }}
            />
          )}
          {tab === "clinics" && (
            <div className="w-full max-w-6xl mx-auto">
              <ClinicFinder />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA to chatbot */}
      {tab === "scan" && step === 3 && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
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
            className="bg-cyan-600 text-white hover:bg-cyan-500"
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
    <div className="glass rounded-2xl p-4 hover:scale-[1.02] transition-transform shadow-lg">
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
