"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Activity, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-cyan-deep">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />

        {/* Animated tooth icon */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 opacity-10"
        >
          <svg viewBox="0 0 32 32" fill="white">
            <path d="M16 3C11 3 7 6 7 11c0 2 .5 4 1 6 .5 2 1 4 1.5 6.5.5 2.5 1 5 2.5 5s2-2 2.5-4.5c.5-2 1-3.5 1.5-3.5s1 1.5 1.5 3.5c.5 2.5 1 4.5 2.5 4.5s2-2.5 2.5-5c.5-2.5 1-4.5 1.5-6.5.5-2 1-4 1-6 0-5-4-8-9-8z" />
          </svg>
        </motion.div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Logo className="text-white [&_span]:text-white [&_.gradient-text]:bg-clip-text [&_.gradient-text]:text-transparent [&_.gradient-text]:bg-gradient-to-r [&_.gradient-text]:from-cyan-300 [&_.gradient-text]:to-sky-200" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-6 text-balance">
              Kesehatan gigi bertenaga AI, langsung dari ponsel Anda.
            </h2>
            <p className="text-cyan-100/80 text-lg mb-10 max-w-md">
              Bergabunglah dengan ribuan pengguna DentiScan untuk deteksi dini dan rekomendasi perawatan gigi yang dipersonalisasi.
            </p>

            <div className="space-y-4">
              {[
                { icon: Activity, label: "Akurasi 94.2%", desc: "Pada dataset medis tervalidasi" },
                { icon: Sparkles, label: "Analisis AI Instan", desc: "Hasil dalam waktu kurang dari 2 detik" },
                { icon: ShieldCheck, label: "Privasi Utama", desc: "Data terenkripsi end-to-end" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-cyan-100/60">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-xs text-cyan-100/40">
            © {new Date().getFullYear()} DentiScan · CC26-PSU285
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke beranda
          </Link>
          <div className="lg:hidden">
            <Logo iconOnly />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
