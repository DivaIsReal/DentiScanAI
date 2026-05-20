"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layers, Network, Database } from "lucide-react";

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 md:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
              Teknologi AI
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Didukung{" "}
              <span className="gradient-text">Deep Learning</span> & Agentic AI
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Stack teknis DentiScan menggabungkan model CV state-of-the-art dengan
              LLM untuk menciptakan asisten kesehatan gigi yang benar-benar cerdas.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Layers,
                  title: "MobileNetV2 / YOLOv8",
                  desc: "Arsitektur ringan dan cepat, optimal untuk web",
                },
                {
                  icon: Network,
                  title: "Agentic AI dengan LangChain",
                  desc: "Penalaran otomatis dan pemicu Clinic Finder",
                },
                {
                  icon: Database,
                  title: "Dilatih pada Dataset Medis",
                  desc: "Dataset terverifikasi dari Kaggle dan Roboflow",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <TechArchitectureMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TechArchitectureMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 rounded-full blur-3xl" />
      <div className="relative glass-strong rounded-3xl p-8 font-mono text-xs">
        <div className="space-y-3">
          {[
            { label: "INPUT", value: "tooth_image.jpg", color: "text-cyan-500" },
            { label: "PREPROCESS", value: "resize(224, 224) → normalize", color: "text-sky-500" },
            { label: "MODEL", value: "MobileNetV2 + Detection Head", color: "text-blue-500" },
            { label: "OUTPUT", value: '{ karies: 0.82, karang: 0.67 }', color: "text-emerald-500" },
            { label: "AGENT", value: "LangChain.reason() → aksi", color: "text-violet-500" },
            { label: "RESPONSE", value: "Rencana perawatan personal", color: "text-pink-500" },
          ].map((line, i) => (
            <motion.div
              key={line.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="text-muted-foreground w-20 flex-shrink-0">
                {line.label}
              </div>
              <div className={line.color}>
                <span className="text-muted-foreground">→ </span>
                {line.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border/30 grid grid-cols-3 gap-3">
          {[
            { label: "Latensi", value: "~1.2s" },
            { label: "Akurasi", value: "94.2%" },
            { label: "Skor F1", value: "0.91" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-2xl font-bold gradient-text font-display">
                {m.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const BENEFITS = [
  "Deteksi dini sebelum nyeri muncul",
  "Hemat biaya pengobatan jangka panjang",
  "Akses 24/7 dari ponsel Anda",
  "Konsultasi AI tanpa antrean dokter",
  "Lacak progres kesehatan gigi",
  "Rekomendasi klinik berdasarkan kondisi",
];

export function BenefitsSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container">
        <div className="max-w-5xl mx-auto glass-strong rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
                Kenapa DentiScan?
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
                Pergeseran paradigma dari{" "}
                <span className="gradient-text">pengobatan ke pencegahan</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                7 dari 10 orang baru ke dokter saat sudah nyeri hebat. DentiScan
                hadir agar Anda bisa mengambil tindakan preventif lebih awal.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-3">
              {BENEFITS.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
