"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileText, MessageSquare } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Unggah Foto",
    description:
      "Ambil foto gigi langsung dari kamera HP atau unggah gambar dari galeri Anda.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Menganalisis",
    description:
      "Model Computer Vision menganalisis citra dalam hitungan detik untuk mendeteksi kondisi.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Dapatkan Hasil",
    description:
      "Dapatkan laporan lengkap dengan confidence score dan visualisasi area terdeteksi.",
  },
  {
    icon: MessageSquare,
    step: "04",
    title: "Konsultasi DentiBot",
    description:
      "Tanya asisten AI untuk penjelasan lebih lanjut atau rekomendasi langkah berikutnya.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg mask-radial opacity-30 pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
            Cara Kerja
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Dari foto ke{" "}
            <span className="gradient-text">analisis</span> dalam hitungan detik
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Empat langkah sederhana untuk memahami kesehatan gigi Anda dengan lebih baik.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 h-full text-center relative">
                  <div className="relative inline-flex">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/10 to-sky-500/5 border border-cyan-500/20 flex items-center justify-center mb-4">
                      <step.icon className="w-10 h-10 text-cyan-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
