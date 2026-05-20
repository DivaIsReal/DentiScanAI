"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Apakah hasil scan DentiScan bisa menggantikan diagnosis dokter?",
    a: "Tidak. DentiScan adalah alat screening preventif, bukan alat diagnostik klinis. Hasil scan kami berfungsi sebagai indikator awal untuk membantu Anda menentukan kapan harus berkonsultasi dengan dokter gigi profesional.",
  },
  {
    q: "Seberapa akurat AI DentiScan?",
    a: "Model kami mencapai akurasi 94.2% pada dataset validasi. Namun akurasi di kondisi nyata bisa bervariasi tergantung kualitas pencahayaan, sudut foto, dan kebersihan kamera. Kami terus mengembangkan model untuk lebih robust.",
  },
  {
    q: "Apakah foto gigi saya aman?",
    a: "Ya. Semua data citra dienkripsi end-to-end. Anda memiliki kontrol penuh untuk menghapus riwayat scan kapan saja. Data tidak dibagikan ke pihak ketiga tanpa izin Anda.",
  },
  {
    q: "Kondisi apa saja yang bisa dideteksi DentiScan?",
    a: "Saat ini DentiScan dapat mendeteksi karies (gigi berlubang), karang gigi (tartar), dan radang gusi (gingivitis). Pengembangan ke depan mencakup deteksi plak dan abrasi enamel.",
  },
  {
    q: "Apakah DentiScan gratis?",
    a: "Versi capstone prototype ini sepenuhnya gratis. Untuk versi production di masa depan, akan ada tier gratis dengan kuota scan harian, dan tier premium untuk akses tanpa batas dan fitur lanjutan.",
  },
  {
    q: "Bagaimana fitur Clinic Finder bekerja?",
    a: "Pencari Klinik menggunakan geolocation perangkat Anda untuk mencari klinik gigi terdekat melalui Google Maps API. Fitur ini diaktifkan otomatis oleh Agentic AI ketika hasil scan menunjukkan tingkat urgensi tinggi.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-4">
            FAQ
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Pertanyaan yang sering diajukan
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-accent/30 transition-colors"
              >
                <span className="font-medium">{faq.q}</span>
                <Plus
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-300 text-cyan-500",
                    open === i && "rotate-45"
                  )}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden p-10 md:p-20 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 text-balance">
              Siap scan dengan lebih cerdas,
              <br />
              bukan lebih rumit?
            </h2>
            <p className="text-cyan-50/90 text-lg mb-8 max-w-2xl mx-auto text-balance">
              Mulai screening gigi Anda hari ini. Gratis, instan, dan didukung
              oleh AI medis terdepan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Mulai Scan Gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="glass"
                className="text-white border-white/30"
                asChild
              >
                <Link href="/login">Masuk</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
