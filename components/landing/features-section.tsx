"use client";

import { motion } from "framer-motion";
import {
  ScanLine,
  Bot,
  MapPin,
  History,
  Brain,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Deteksi Gigi AI",
    description:
      "Deteksi karies, karang gigi, dan gingivitis menggunakan model Computer Vision yang dilatih pada ribuan citra medis.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: Bot,
    title: "Chatbot AI Interaktif",
    description:
      "DentiBot menjawab pertanyaan seputar kesehatan gigi dan memberikan saran perawatan personal berdasarkan hasil scan.",
    accent: "from-violet-500 to-purple-500",
  },
  {
    icon: MapPin,
    title: "Pencari Klinik",
    description:
      "Rekomendasi klinik gigi terdekat dengan rating, jarak, dan status buka - otomatis aktif saat terdeteksi kondisi darurat.",
    accent: "from-rose-500 to-pink-500",
  },
  {
    icon: History,
    title: "Riwayat Scan",
    description:
      "Lacak progres kesehatan gigi Anda dari waktu ke waktu. Bandingkan hasil scan dan lihat perkembangan secara visual.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: Brain,
    title: "Penalaran Agen AI",
    description:
      "AI tidak hanya mendeteksi - ia melakukan penalaran dan mengambil aksi otomatis berdasarkan tingkat keparahan.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Privasi Utama",
    description:
      "Data citra dan hasil scan dienkripsi dan disimpan secara aman. Anda memiliki kontrol penuh atas data pribadi.",
    accent: "from-blue-500 to-indigo-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
            Fitur
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Semua yang Anda butuhkan untuk{" "}
            <span className="gradient-text">kesehatan gigi</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            DentiScan menggabungkan Computer Vision, LLM, dan Agentic AI dalam
            satu platform yang rapi dan mudah digunakan.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
