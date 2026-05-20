"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Sparkles,
  ScanLine,
  Brain,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const PARTNERS = [
  "Klinik Senyum+",
  "OralCare Labs",
  "Medix AI",
  "Dentify Group",
  "SmileHub",
  "NeoHealth",
];

const STATS = [
  { label: "Scan Diproses", value: "1.2M+" },
  { label: "Kepercayaan Model", value: "94.2%" },
  { label: "Waktu Analisis", value: "< 2 Detik" },
  { label: "Mitra Klinik", value: "240+" },
];

const TESTIMONIALS = [
  {
    quote:
      "DentiScan membantu kami menyaring pasien lebih cepat sebelum konsultasi klinis. UX-nya terasa premium dan dipercaya pasien.",
    name: "drg. Alya Putri",
    role: "Clinical Director, SmileHub",
  },
  {
    quote:
      "Visual analisis AI-nya jelas, confidence score-nya transparan, dan rekomendasinya sangat membantu untuk edukasi pasien.",
    name: "Rizal Hartono",
    role: "Head of Product, OralCare Labs",
  },
  {
    quote:
      "Dari sudut pandang startup healthtech, ini salah satu pengalaman scan mobile yang paling polished dan conversion-focused.",
    name: "Nadia Prameswari",
    role: "Founder, Medix AI",
  },
];

export function TrustedBySection() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground/80">
            Dipercaya tim kesehatan modern
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="rounded-2xl border border-white/45 bg-white/60 px-4 py-3 text-sm font-medium text-foreground/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
              >
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LiveScanDemoSection() {
  return (
    <section id="live-demo" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 aurora pointer-events-none opacity-70" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
            Live Dental Scan Demo
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Simulasi analisis AI secara real-time
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Lihat bagaimana engine Computer Vision memetakan area risiko, memberi
            confidence score, dan menghasilkan rekomendasi tindakan dalam satu
            alur yang mulus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-10 grid gap-6 lg:grid-cols-[1.45fr,1fr]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/65 p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(14,116,144,0.18)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -left-8 -bottom-10 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Session #A-28391
                </p>
                <p className="font-semibold">Heatmap & Confidence Overlay</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Model Active
              </div>
            </div>

            <div className="relative aspect-[16/9] rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 overflow-hidden">
              <svg viewBox="0 0 640 360" className="absolute inset-0 h-full w-full">
                <defs>
                  <radialGradient id="heatmap-left" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.48" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatmap-right" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.52" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <ellipse cx="230" cy="170" rx="120" ry="90" fill="url(#heatmap-left)" />
                <ellipse cx="430" cy="150" rx="105" ry="82" fill="url(#heatmap-right)" />

                <motion.rect
                  x="-160"
                  y="0"
                  width="160"
                  height="360"
                  fill="url(#scan-gradient)"
                  animate={{ x: [-160, 640, -160] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
                />
                <defs>
                  <linearGradient id="scan-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Karies", value: "0.82" },
                { label: "Gingivitis", value: "0.74" },
                { label: "Tartar", value: "0.67" },
                { label: "Confidence", value: "94.2%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/45 bg-white/55 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Brain,
                title: "AI Analysis Engine",
                text: "Menganalisis pola visual enamel, gingiva, dan area kerusakan mikro.",
              },
              {
                icon: ScanLine,
                title: "Realtime Heatmap",
                text: "Overlay area risiko dengan visual intensitas untuk memudahkan tindakan klinis.",
              },
              {
                icon: ShieldCheck,
                title: "Trust Layer",
                text: "Setiap output diberi confidence score agar keputusan lebih aman dan terukur.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-2xl border border-white/40 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/30">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function StatisticsSection() {
  return (
    <section id="stats" className="relative py-20 md:py-28">
      <div className="container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl border border-white/45 bg-white/65 p-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="text-3xl font-display font-bold gradient-text">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
            Testimoni Pengguna
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Dipilih oleh tim klinik dan startup healthtech
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="relative rounded-2xl border border-white/45 bg-white/65 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">"{item.quote}"</p>
              <footer className="mt-5 border-t border-border/50 pt-4">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Activity, text: "Monitoring 24/7" },
            { icon: HeartPulse, text: "Preventive-first" },
            { icon: Brain, text: "Reasoning AI" },
            { icon: ShieldCheck, text: "Medical-grade trust" },
          ].map((pill) => (
            <div
              key={pill.text}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 bg-white/55 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
            >
              <pill.icon className="h-3.5 w-3.5 text-cyan-500" />
              {pill.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
