/**
 * AI Prediction Service
 *
 * This module now uses a local model trained from the DS dataset stored in the repo.
 * The chatbot knowledge base remains below this section.
 */

import type { ScanCondition } from "@/types";
import { predictDentalImage } from "@/lib/ai/dental-model";

export interface AIPredictionResult {
  overallScore: number;
  confidenceScore: number;
  conditions: ScanCondition[];
  summary: string;
  recommendation: string;
  urgency: "low" | "medium" | "high";
}

const PREDICTION_META: Record<
  string,
  {
    summary: string;
    recommendation: string;
    urgency: "low" | "medium" | "high";
    conditionName: string;
    clinicFinder: boolean;
  }
> = {
  caries: {
    summary:
      "Terdeteksi indikasi karies pada gigi. Kondisi ini perlu dipantau karena berpotensi berkembang jika tidak ditangani.",
    recommendation:
      "Segera konsultasi ke dokter gigi untuk evaluasi lanjutan dan tindakan pencegahan agar kerusakan tidak bertambah.",
    urgency: "high",
    conditionName: "Karies",
    clinicFinder: true,
  },
  healthy: {
    summary:
      "Gigi tampak sehat dengan tanda kerusakan yang minimal. Kebersihan mulut terlihat terjaga.",
    recommendation:
      "Pertahankan rutinitas menyikat gigi 2 kali sehari, flossing, dan pemeriksaan rutin setiap 6 bulan.",
    urgency: "low",
    conditionName: "Gigi Sehat",
    clinicFinder: false,
  },
  karang_gigi: {
    summary:
      "Terdeteksi adanya penumpukan karang gigi. Scaling profesional disarankan untuk mencegah peradangan gusi.",
    recommendation:
      "Lakukan scaling ke dokter gigi agar karang gigi dibersihkan dan risiko radang gusi berkurang.",
    urgency: "medium",
    conditionName: "Karang Gigi",
    clinicFinder: true,
  },
  gusi_sehat: {
    summary:
      "Kondisi gusi tampak sehat, tanpa tanda peradangan yang berarti.",
    recommendation:
      "Pertahankan kebiasaan perawatan gigi dan gusi yang sudah baik.",
    urgency: "low",
    conditionName: "Gusi Sehat",
    clinicFinder: false,
  },
};

function buildConditions(label: string, confidence: number): ScanCondition[] {
  const names = ["Karies", "Karang Gigi", "Gigi Sehat", "Gusi Sehat"];
  return names.map((name) => {
    const normalized = name.toLowerCase().replace(/\s+/g, "_");
    const detected =
      (label === "caries" && normalized === "karies") ||
      (label === "karang_gigi" && normalized === "karang_gigi") ||
      (label === "healthy" && normalized === "gigi_sehat") ||
      (label === "gusi_sehat" && normalized === "gusi_sehat");

    const conditionConfidence = detected
      ? confidence
      : Math.max(8, Math.min(28, 100 - confidence));

    return {
      name,
      detected,
      confidence: conditionConfidence,
      severity: detected ? (confidence >= 85 ? "high" : confidence >= 70 ? "medium" : "low") : "low",
    };
  });
}

export async function predictDentalConditions(input: {
  imageBuffer: Buffer;
  fileName?: string;
  mimeType?: string;
}): Promise<AIPredictionResult> {
  const prediction = await predictDentalImage({ imageBuffer: input.imageBuffer });
  const meta = PREDICTION_META[prediction.label];

  return {
    overallScore: prediction.score,
    confidenceScore: prediction.confidence,
    conditions: buildConditions(prediction.label, prediction.confidence),
    summary: meta.summary,
    recommendation: meta.recommendation,
    urgency: meta.urgency,
  };
}

/* ============================================================
 *  CHATBOT — DentiBot
 *  Now: Gemini AI-powered with fallback to knowledge base
 * ============================================================ */

import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `Kamu adalah DentiBot, asisten kesehatan gigi AI yang membantu pengguna dengan:
- Menjelaskan kondisi gigi (karies, karang gigi, gingivitis, plak)
- Memberikan saran perawatan gigi harian
- Menginterpretasi hasil scan dari DentiScan
- Merekomendasikan kapan harus mengunjungi dokter gigi
- Memberikan tips pencegahan penyakit gigi

Selalu respons dalam bahasa Indonesia yang sopan dan ramah. Gunakan format markdown untuk membuat jawaban lebih mudah dibaca.
Jika pengguna bertanya tentang hal yang bukan kesehatan gigi, sampaikan secara ramah bahwa itu di luar keahlian Anda tapi tawarkan info gigi yang relevan.`;

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

function getKnowledgeBaseResponse(userMessage: string): string {
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableServiceUnavailable(err: unknown) {
  if (!err) return false;
  // SDK may throw an Error with message including status, or a custom error with status
  try {
    const e: any = err;
    if (e && (e.status === 503 || e.statusCode === 503)) return true;
    const msg = String(e.message || e);
    if (/503|Service Unavailable/i.test(msg)) return true;
  } catch (e) {
    // ignore
  }
  return false;
}

export async function generateChatResponse(
  userMessage: string,
  history?: Array<{ role: string; content: string }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback ke knowledge base kalau tidak ada API key atau error
  if (!apiKey) {
    return getKnowledgeBaseResponse(userMessage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelCandidates = [
      // Prefer current Gemini model names available for this account
      "models/gemini-2.5-flash",
      "models/gemini-flash-latest",
      "models/gemini-pro-latest",
      "models/gemini-2.0-flash",
      // Legacy fallbacks to non-Gemini models if needed
      "models/chat-bison-001",
      "models/text-bison-001",
    ];

    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    let lastError: unknown = null;

    for (const candidate of modelCandidates) {
      let lastAttemptError: unknown = null;
      const maxAttempts = 3;
      const baseDelay = 500; // ms

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: candidate });
          const chat = model.startChat({
            history: chatHistory,
            systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          });

          const result = await chat.sendMessage(userMessage);
          const response = await result.response;
          const text = response.text().trim();
          return text || getKnowledgeBaseResponse(userMessage);
        } catch (err) {
          lastAttemptError = err;
          const retryable = isRetryableServiceUnavailable(err);
          console.error(`[DentiBot/Gemini][${candidate}] attempt ${attempt} failed`, err);
          if (retryable && attempt < maxAttempts) {
            const wait = baseDelay * Math.pow(2, attempt - 1);
            console.info(`[DentiBot/Gemini][${candidate}] retrying in ${wait}ms`);
            await sleep(wait);
            continue; // retry same candidate
          }
          // not retryable or out of attempts -> break to try next candidate
          break;
        }
      }

      // record last error and try next candidate
      lastError = lastAttemptError;
      continue;
    }

    console.error("[DentiBot/Gemini] All model attempts failed", lastError);
    return getKnowledgeBaseResponse(userMessage);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[DentiBot/Gemini] Initialization error", message, error);
    return getKnowledgeBaseResponse(userMessage);
  }
}
