"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToothAnimation } from "@/components/landing/tooth-animation";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 aurora pointer-events-none" />
      <div className="absolute inset-0 grid-bg mask-radial opacity-50 pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-cyan-500/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-xs font-medium">
                Didukung AI • Computer Vision • Kesehatan
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-balance"
            >
              Screening Gigi AI
              <br />
              <span className="gradient-text">Langsung Dari Ponsel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl text-balance"
            >
              Deteksi dini masalah gigi menggunakan AI hanya melalui foto kamera.
              Dapatkan analisis instan, konsultasi dengan AI assistant, dan
              rekomendasi klinik terdekat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-1 text-white font-semibold px-12 py-6 h-auto text-lg" asChild>
                <Link href="/register">
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="glass" className="border-2 border-cyan-400/50 hover:border-cyan-400 backdrop-blur-md bg-white/10 hover:bg-white/20 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] font-semibold px-12 py-6 h-auto text-lg" asChild>
                <Link href="#how-it-works">Pelajari Lebih Lanjut</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Desain aman untuk privasi</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Hasil instan</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                <span>Akurasi 94%</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Animated dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative">
      {/* Floating glow */}
      <div className="absolute -inset-10 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />

      {/* Main card */}
      <div className="relative glass-strong rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-muted-foreground">Hasil Scan · #2847</div>
            <div className="font-semibold mt-0.5">Laporan Analisis Gigi</div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Aktif
          </div>
        </div>

        {/* Tooth illustration */}
        <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#e8f9f9] via-[#d0f2ff] to-[#e6f0ff] overflow-hidden mb-5 border border-cyan-500/20">
          <ToothAnimation />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Karies", value: "82%", color: "from-amber-500 to-orange-500" },
            { label: "Karang", value: "67%", color: "from-rose-500 to-red-500" },
            { label: "Sehat", value: "78%", color: "from-emerald-500 to-teal-500" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              className="glass rounded-xl p-3"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-lg font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                {m.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="glass rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-medium">DentiBot:</span>{" "}
            Terdeteksi karies ringan. Disarankan periksa profesional dalam 2 minggu.
          </div>
        </div>
      </div>

      {/* Floating accent cards */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -left-6 glass-strong rounded-2xl p-3 shadow-xl hidden md:block"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Kepercayaan AI</div>
            <div className="text-sm font-bold">94.2%</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -right-4 glass-strong rounded-2xl p-3 shadow-xl hidden md:block"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Pasien</div>
            <div className="text-sm font-bold">12,847+</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
