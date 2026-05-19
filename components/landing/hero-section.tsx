"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                AI Powered • Computer Vision • Healthcare
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-balance"
            >
              AI Dental Screening
              <br />
              From Your{" "}
              <span className="gradient-text">Smartphone</span>
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
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Scanning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="glass" asChild>
                <Link href="#how-it-works">Learn More</Link>
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
                <span>HIPAA-aware design</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                <span>94% accuracy</span>
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
            <div className="text-xs text-muted-foreground">Scan Result · #2847</div>
            <div className="font-semibold mt-0.5">Dental Analysis Report</div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* Tooth illustration */}
        <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 overflow-hidden mb-5 border border-cyan-500/10">
          <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="hero-tooth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <g transform="translate(100, 75)">
              <path
                d="M0,-40 C-25,-40 -35,-25 -35,-10 C-35,5 -30,20 -25,35 C-22,42 -18,45 -12,40 C-8,35 -5,25 0,25 C5,25 8,35 12,40 C18,45 22,42 25,35 C30,20 35,5 35,-10 C35,-25 25,-40 0,-40 Z"
                fill="url(#hero-tooth)"
                stroke="#22d3ee"
                strokeWidth="1.5"
                opacity="0.9"
              />
              {/* Detection markers */}
              <circle cx="-12" cy="-15" r="3" fill="#f59e0b" className="animate-pulse" />
              <circle cx="14" cy="-8" r="3" fill="#ef4444" className="animate-pulse" />
              <line x1="-12" y1="-15" x2="-45" y2="-25" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="14" y1="-8" x2="50" y2="-15" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
            </g>
            {/* Scan line */}
            <motion.line
              x1="0"
              x2="200"
              y1="0"
              y2="0"
              stroke="#22d3ee"
              strokeWidth="2"
              animate={{ y1: [0, 150, 0], y2: [0, 150, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Cavity", value: "82%", color: "from-amber-500 to-orange-500" },
            { label: "Tartar", value: "67%", color: "from-rose-500 to-red-500" },
            { label: "Healthy", value: "78%", color: "from-emerald-500 to-teal-500" },
          ].map((m) => (
            <div key={m.label} className="glass rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-lg font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="glass rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-medium">DentiBot:</span>{" "}
            Mild caries detected. Recommend professional checkup within 2 weeks.
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
            <div className="text-xs text-muted-foreground">AI Confidence</div>
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
            <div className="text-xs text-muted-foreground">Patients</div>
            <div className="text-sm font-bold">12,847+</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
