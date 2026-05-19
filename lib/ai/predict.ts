/**
 * AI Prediction Service
 *
 * Current implementation: DUMMY (returns randomized but realistic results)
 * Future: swap `predictDentalConditions` with a fetch to the FastAPI endpoint
 *        exposed by the AI Engineering team.
 *
 * Expected real endpoint contract:
 *   POST {AI_API_URL}/predict
 *   body: multipart/form-data { image: File }
 *   returns: AIPredictionResult (same shape as below)
 */

import type { ScanCondition } from "@/types";

export interface AIPredictionResult {
  overallScore: number;
  confidenceScore: number;
  conditions: ScanCondition[];
  summary: string;
  recommendation: string;
  urgency: "low" | "medium" | "high";
}

const CONDITIONS_POOL = [
  "Karies (Cavity)",
  "Karang Gigi (Tartar)",
  "Gusi Sehat",
  "Radang Gusi (Gingivitis)",
  "Plak Berlebih",
];

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function pickSeverity(confidence: number): "low" | "medium" | "high" {
  if (confidence >= 80) return "high";
  if (confidence >= 60) return "medium";
  return "low";
}

export async function predictDentalConditions(
  _imageData?: string | Buffer
): Promise<AIPredictionResult> {
  // Simulate processing latency
  await new Promise((r) => setTimeout(r, 1500));

  const cariesDetected = Math.random() > 0.4;
  const tartarDetected = Math.random() > 0.5;
  const gingivitisDetected = Math.random() > 0.7;

  const cariesConf = cariesDetected ? randomBetween(65, 92) : randomBetween(8, 30);
  const tartarConf = tartarDetected ? randomBetween(60, 88) : randomBetween(10, 28);
  const gingivitisConf = gingivitisDetected ? randomBetween(55, 80) : randomBetween(5, 25);

  const healthyGumScore = randomBetween(60, 95);

  const conditions: ScanCondition[] = [
    {
      name: "Karies (Cavity)",
      detected: cariesDetected,
      confidence: cariesConf,
      severity: cariesDetected ? pickSeverity(cariesConf) : "low",
    },
    {
      name: "Karang Gigi (Tartar)",
      detected: tartarDetected,
      confidence: tartarConf,
      severity: tartarDetected ? pickSeverity(tartarConf) : "low",
    },
    {
      name: "Radang Gusi (Gingivitis)",
      detected: gingivitisDetected,
      confidence: gingivitisConf,
      severity: gingivitisDetected ? pickSeverity(gingivitisConf) : "low",
    },
    {
      name: "Gusi Sehat",
      detected: healthyGumScore > 70,
      confidence: healthyGumScore,
      severity: "low",
    },
  ];

  const detectedCount = conditions.filter(
    (c) => c.detected && c.name !== "Gusi Sehat"
  ).length;

  let urgency: "low" | "medium" | "high" = "low";
  let summary = "";
  let recommendation = "";

  if (detectedCount === 0) {
    urgency = "low";
    summary =
      "Tidak ada masalah signifikan yang terdeteksi. Kondisi gigi Anda tampak sehat dengan tingkat kebersihan yang baik.";
    recommendation =
      "Lanjutkan rutinitas sikat gigi 2 kali sehari dan flossing. Pemeriksaan rutin ke dokter gigi setiap 6 bulan sangat dianjurkan.";
  } else if (detectedCount === 1) {
    urgency = "medium";
    summary = cariesDetected
      ? "Kemungkinan terdapat karies ringan pada gigi bagian belakang. Belum terlalu mengkhawatirkan namun perlu perhatian."
      : "Terdeteksi adanya akumulasi yang perlu dibersihkan secara profesional.";
    recommendation =
      "Disarankan melakukan pemeriksaan lanjutan ke dokter gigi dalam 2-4 minggu ke depan untuk tindakan preventif.";
  } else {
    urgency = "high";
    summary =
      "Terdeteksi beberapa indikasi masalah kesehatan gigi yang memerlukan perhatian segera. Tingkat keparahan tergolong sedang hingga tinggi.";
    recommendation =
      "Sangat disarankan untuk segera mengunjungi dokter gigi terdekat. Klinik di sekitar Anda telah kami siapkan di tab Clinic Finder.";
  }

  return {
    overallScore: healthyGumScore,
    confidenceScore: randomBetween(82, 96),
    conditions,
    summary,
    recommendation,
    urgency,
  };
}

/* ============================================================
 *  CHATBOT — DentiBot
 *  Current: rule-based dummy responses
 *  Future: swap with Gemini / OpenAI / LangChain agent call
 * ============================================================ */

const KNOWLEDGE_BASE: Record<string, string> = {
  karies: `**Karies (Gigi Berlubang)** adalah kerusakan jaringan keras gigi yang disebabkan oleh asam yang dihasilkan bakteri di dalam plak.

**Penyebab utama:**
- Konsumsi gula berlebih
- Kebersihan mulut yang kurang
- Plak yang menumpuk
- Air liur yang sedikit

**Gejala awal:** bintik putih atau coklat pada permukaan gigi, sensitivitas terhadap makanan manis/dingin.

**Pencegahan:** sikat gigi 2x sehari dengan pasta berfluoride, kurangi gula, gunakan dental floss, dan periksa ke dokter gigi setiap 6 bulan.`,

  "kesehatan gigi": `**5 Cara Menjaga Kesehatan Gigi Sehari-hari:**

1. **Sikat gigi 2x sehari** — pagi setelah sarapan dan malam sebelum tidur, masing-masing 2 menit.
2. **Gunakan pasta gigi berfluoride** — fluoride memperkuat enamel.
3. **Flossing setiap hari** — membersihkan sela gigi yang tidak terjangkau sikat.
4. **Batasi makanan manis dan asam** — terutama soda, permen, dan jus kemasan.
5. **Periksa rutin ke dokter gigi** — minimal setiap 6 bulan untuk scaling dan pengecekan.`,

  dokter: `Berdasarkan hasil screening, jika DentiScan mendeteksi:

- **Karies tingkat sedang/tinggi** → segera ke dokter gigi dalam 1-2 minggu
- **Karang gigi** → scaling profesional dalam 1 bulan
- **Gusi berdarah/bengkak** → konsultasi dalam beberapa hari

Jika hasil scan Anda menunjukkan urgency **HIGH**, fitur Clinic Finder kami sudah otomatis aktif untuk membantu menemukan klinik terdekat.`,

  makanan: `**Makanan yang merusak gigi:**

⚠️ **Hindari/batasi:**
- Permen lengket, karamel, gummy
- Minuman bersoda dan jus kemasan
- Keripik dan makanan bertepung
- Es batu (memicu retakan)
- Minuman asam (cuka, lemon berlebih)

✅ **Baik untuk gigi:**
- Susu dan keju (kaya kalsium)
- Sayuran berserat (apel, wortel, seledri)
- Teh hijau (mengandung polifenol)
- Air putih banyak`,

  scaling: `**Scaling** adalah prosedur pembersihan karang gigi (tartar) yang menempel di permukaan gigi dan di bawah garis gusi, yang tidak bisa dihilangkan dengan sikat gigi biasa.

**Mengapa penting:**
- Mencegah penyakit gusi (gingivitis & periodontitis)
- Menghilangkan bau mulut
- Mengembalikan warna gigi alami

**Frekuensi yang disarankan:** setiap 6 bulan sekali.`,

  flossing: `**Flossing** adalah membersihkan sela-sela gigi menggunakan benang gigi (dental floss).

**Cara benar:**
1. Ambil 40-45 cm dental floss
2. Lilitkan ke jari tengah kedua tangan
3. Pegang dengan ibu jari & telunjuk, sisakan 2-3 cm
4. Gerakkan naik-turun di setiap sela gigi membentuk huruf C
5. Gunakan bagian benang yang bersih untuk setiap gigi

**Frekuensi:** minimal 1x sehari, idealnya sebelum tidur.`,
};

export async function generateChatResponse(
  userMessage: string,
  _history?: Array<{ role: string; content: string }>
): Promise<string> {
  // Simulate thinking latency
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  const lower = userMessage.toLowerCase();

  for (const [key, response] of Object.entries(KNOWLEDGE_BASE)) {
    if (lower.includes(key)) return response;
  }

  if (lower.includes("halo") || lower.includes("hai") || lower.includes("hi")) {
    return `Halo! 👋 Saya **DentiBot**, asisten kesehatan gigi AI Anda.

Saya bisa membantu Anda dengan:
- Menjelaskan kondisi gigi (karies, karang gigi, gingivitis)
- Saran perawatan harian
- Interpretasi hasil scan
- Rekomendasi kunjungan dokter

Ada yang ingin Anda tanyakan?`;
  }

  if (lower.includes("terima kasih") || lower.includes("makasih")) {
    return "Sama-sama! Tetap jaga kesehatan gigi Anda ya. Jangan lupa untuk melakukan scan rutin dengan DentiScan. 🦷✨";
  }

  // Default fallback
  return `Pertanyaan menarik! Berdasarkan basis pengetahuan medis kami:

Kesehatan gigi yang baik membutuhkan kombinasi dari **kebersihan harian**, **pola makan seimbang**, dan **pemeriksaan rutin**.

Beberapa topik yang bisa saya bantu jelaskan:
- Apa itu karies?
- Cara menjaga kesehatan gigi
- Kapan harus ke dokter gigi?
- Makanan yang merusak gigi
- Tentang scaling & flossing

Coba tanyakan salah satunya, atau ceritakan lebih spesifik keluhan Anda. 🦷`;
}
