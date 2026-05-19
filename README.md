# 🦷 DentiScan

> **AI Dental Screening From Your Smartphone**
> Deteksi dini masalah gigi (karies, karang gigi, radang gusi) menggunakan Computer Vision dan Agentic AI Chatbot.

**Capstone Project — Coding Camp 2026 powered by DBS Foundation**
**Tim ID:** `CC26-PSU285` · **Tema:** Healthy Lives & Well-being

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Anggota Tim](#-anggota-tim)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Struktur Folder](#-struktur-folder)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Alur Data](#-arsitektur--alur-data)
- [Database Schema](#-database-schema)
- [Integrasi AI (Swap Dummy → Real)](#-integrasi-ai-swap-dummy--real)
- [Authentication Flow](#-authentication-flow)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

---

## 🎯 Tentang Project

**Problem.** Kesehatan gigi sering diabaikan karena infeksinya asimtomatik di tahap awal. 7 dari 10 orang baru ke dokter saat sudah nyeri hebat — biaya jadi mahal, perawatan jadi kompleks.

**Solusi.** DentiScan adalah **"painkiller"** untuk preventive care: cukup foto gigi pakai HP, AI langsung menganalisis kondisi karies/karang gigi/gusi, dan **DentiBot** (Agentic AI Chatbot) memberi saran personal serta memicu **Clinic Finder** otomatis jika kondisi darurat.

**Bukan diagnosis klinis final** — ini alat *preventive screening*, melengkapi (bukan menggantikan) dokter gigi.

---

## 👥 Anggota Tim

| ID | Nama | Peran |
|---|---|---|
| CDCC796D6X0087 | **Friska Ayu Dwicahyani** | Data Scientist |
| CDCC796D6X0298 | **Yasmin Zahra Tushafa** | Data Scientist |
| CACC589D6Y0470 | **Sayyid Hasan Harahap** | AI Engineer |
| CACC223D6Y2317 | **Faris Jihadi Hanif Lubis** | AI Engineer |
| CFCC223D6Y1564 | **Diva Ahmad Pradana** | Full-Stack Web Developer |
| CFCC283D6X2825 | **Nina Kusuma Wardhani** | Full-Stack Web Developer |

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + custom design tokens (cyan/sky/navy medical-tech palette)
- **Framer Motion** — animasi & micro-interactions
- **Shadcn/ui pattern** — komponen primitif buatan sendiri (Button, Input, Card, etc)
- **Lucide React** — ikon
- **react-dropzone** — drag & drop upload
- **react-markdown** — rendering response chatbot
- **recharts** — siap untuk dashboard analytics

### Backend (Next.js API Routes)
- JWT Authentication (httpOnly cookies) + bcrypt
- **MongoDB** (Mongoose) — dengan fallback **in-memory dummy store** untuk demo cepat
- Zod validation

### AI Integration (siap di-swap)
- **Dummy mode** (default): randomized realistic predictions + rule-based Indonesian knowledge base
- **Production mode**: tinggal set `AI_API_URL` (FastAPI dari tim AI Engineer) dan `GEMINI_API_KEY`

### Maps
- Placeholder SVG map + 5 klinik Yogyakarta hardcoded
- Siap diganti Google Maps Embed dengan `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## 🚀 Quick Start

### Prasyarat
- **Node.js** ≥ 18.17
- **npm** atau **pnpm**
- (Opsional) **MongoDB** lokal atau Atlas — kalau tidak ada, app tetap jalan pakai in-memory store

### Langkah

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local — minimal ubah JWT_SECRET

# 3. (Opsional) Jalankan MongoDB lokal kalau mau persistensi
# brew services start mongodb-community     # macOS
# sudo systemctl start mongod               # Linux

# 4. Run dev server
npm run dev

# Buka http://localhost:3000
```

### Demo flow

1. Buka `/register` → buat akun
2. Login → masuk ke `/dashboard`
3. Drag & drop foto gigi apapun → klik "Analyze with AI"
4. Lihat hasil scan + recommendation
5. Klik "Tanya DentiBot" → ngobrol dengan AI assistant
6. Cek tab "Scan History" → lihat semua scan sebelumnya
7. Cek tab "Clinic Finder" → klinik gigi terdekat

---

## 📁 Struktur Folder

```
dentiscan/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (backend)
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts       # GET = current user, DELETE = logout
│   │   ├── scan/route.ts         # POST = analyze, GET = history
│   │   ├── chat/route.ts         # DentiBot endpoint
│   │   └── clinics/route.ts      # Clinic Finder data
│   ├── dashboard/                # Main feature page (protected)
│   │   ├── layout.tsx
│   │   └── page.tsx              # Tab-aware: scan | history | clinics
│   ├── chatbot/                  # DentiBot page (protected)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx                # Root layout + fonts
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Design tokens & glass utilities
├── components/
│   ├── ui/                       # Primitives (Button, Card, Toast...)
│   ├── layout/                   # Navbar, Footer, Logo, AuthLayout
│   ├── landing/                  # Hero, Features, HowItWorks, Tech, FAQ, CTA
│   ├── auth-form.tsx             # Unified Login/Register form
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── upload-area.tsx       # Drag & drop + camera
│   │   ├── result-card.tsx       # Animated scan result
│   │   ├── clinic-finder.tsx
│   │   └── scan-history.tsx
│   └── chatbot/
│       └── chat-bubble.tsx
├── lib/
│   ├── ai/predict.ts             # 🔑 Dummy AI — swap here for real model
│   ├── auth/jwt.ts               # JWT sign/verify, cookie helpers
│   ├── db/
│   │   ├── connect.ts            # Mongoose connection
│   │   └── dummy-store.ts        # In-memory fallback
│   └── utils.ts
├── models/                       # Mongoose schemas
│   ├── User.ts
│   ├── Scan.ts
│   └── Chat.ts
├── types/index.ts                # Shared TypeScript types
├── middleware.ts                 # Protects /dashboard/* and /chatbot/*
├── tailwind.config.ts
├── .env.example
└── README.md
```

---

## ✨ Fitur Utama

### 1. Landing Page (`/`)
Hero + Features + How It Works + AI Technology + Benefits + FAQ + CTA + Footer. Animated dashboard mockup di hero menampilkan preview produk.

### 2. Auth (`/login`, `/register`)
Split layout (kiri branding glassmorphism, kanan form). Validasi Indonesian, show/hide password, remember me, social login UI (Google/GitHub) — currently stubbed.

### 3. Dashboard (`/dashboard`)
- **Scan Teeth**: drag & drop foto → `POST /api/scan` → AI returns conditions + score + recommendation + urgency
- **Result Card**: animated SVG circular score, per-condition progress bars dengan severity color coding, AI summary box
- **Scan History**: tabel responsif dengan empty state
- **Clinic Finder**: 5 klinik Yogyakarta dengan rating/jarak/jam buka

### 4. DentiBot (`/chatbot`)
ChatGPT-style UI. Auto-scroll, typing animation (3 bouncing dots), markdown rendering, suggestion chips saat kosong, clear chat. Knowledge base lokal mencakup: karies, perawatan gigi, kapan ke dokter, makanan yang merusak, scaling, flossing.

### 5. Agentic Trigger
Logika di `lib/ai/predict.ts`: kalau `≥ 2` kondisi terdeteksi atau salah satunya `severity: high`, `urgency` diset `"high"` dan rekomendasi otomatis mengarahkan ke Clinic Finder.

---

## 🏗 Arsitektur & Alur Data

```
┌─────────────┐     POST /api/scan      ┌─────────────────┐
│   Browser   │ ───── (image) ────────▶ │  Next.js API    │
│  (Dashboard)│                          │  (App Router)   │
└─────────────┘                          └────────┬────────┘
       ▲                                          │
       │                                          ▼
       │                                  ┌───────────────┐
       │                                  │ predictDental │
       │                                  │ Conditions()  │
       │   ScanResult JSON                │  (dummy now)  │
       │ ◀────────────────────────────────│  ↓ swap to    │
       │                                  │   FastAPI     │
       │                                  └───────┬───────┘
       │                                          │
       │                                          ▼
       │                                  ┌───────────────┐
       │                                  │   MongoDB     │
       │                                  │  or dummy in- │
       │                                  │  memory store │
       │                                  └───────────────┘
       │
       │   Agentic chat (urgency=high → suggest clinic)
       ▼
┌─────────────┐
│  DentiBot   │
└─────────────┘
```

---

## 🗄 Database Schema

### `User`
```ts
{
  _id: ObjectId,
  fullName: string,
  email: string,           // unique, lowercase
  password: string,        // bcrypt hashed
  createdAt: Date,
  updatedAt: Date
}
```

### `Scan`
```ts
{
  _id: ObjectId,
  userId: ObjectId,        // ref: User
  imageUrl?: string,
  overallScore: number,    // 0-100 (gum health %)
  confidenceScore: number, // 0-100
  conditions: [{
    name: string,          // "Karies", "Karang Gigi", "Radang Gusi"
    detected: boolean,
    confidence: number,
    severity?: "low" | "medium" | "high"
  }],
  summary: string,         // Indonesian
  recommendation: string,
  urgency: "low" | "medium" | "high",
  createdAt: Date
}
```

### `Chat`
```ts
{
  _id: ObjectId,
  userId: ObjectId,        // ref: User, unique
  messages: [{
    id: string,
    role: "user" | "assistant",
    content: string,
    createdAt: Date
  }]
}
```

---

## 🤖 Integrasi AI (Swap Dummy → Real)

Semua AI logic tersentralisasi di **`lib/ai/predict.ts`**. Cukup ganti 2 fungsi:

### 1. Computer Vision — `predictDentalConditions(imageFile)`

**Saat ini (dummy):**
```ts
export async function predictDentalConditions(image: Buffer | File) {
  // ... returns randomized realistic ScanResult
}
```

**Ganti dengan FastAPI dari tim AI Engineer:**
```ts
export async function predictDentalConditions(image: Buffer | File) {
  const form = new FormData();
  form.append("image", image);
  const res = await fetch(`${process.env.AI_API_URL}/predict`, {
    method: "POST",
    body: form,
  });
  return await res.json();
}
```

Kontrak output (sudah disepakati di `types/index.ts`):
```ts
{ overallScore, confidenceScore, conditions[], summary, recommendation, urgency }
```

### 2. Chatbot — `generateChatResponse(message, history?)`

**Saat ini (dummy):** rule-based Indonesian knowledge base.

**Ganti dengan Gemini / OpenAI:**
```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateChatResponse(message: string, history = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    systemInstruction: "Kamu adalah DentiBot, asisten kesehatan gigi...",
  });
  const result = await chat.sendMessage(message);
  return result.response.text();
}
```

Untuk **Agentic AI dengan LangChain** (sesuai project plan), tambahkan tools `clinicFinderTool` dan `scanHistoryTool` agar chatbot bisa proaktif memanggil fitur lain.

---

## 🔐 Authentication Flow

```
[Register] → POST /api/auth/register
              ↓ bcrypt.hash(password)
              ↓ save User
              ↓ signToken({userId, email, fullName})
              ↓ setAuthCookie(token)  ← httpOnly, 7 days
              ↓
        ▶ Redirect to /dashboard

[Login]    → POST /api/auth/login
              ↓ bcrypt.compare
              ↓ signToken
              ↓ setAuthCookie
              ↓
        ▶ Redirect to /dashboard

[Logout]   → DELETE /api/auth/me
              ↓ clearAuthCookie
              ↓
        ▶ Redirect to /login

[Middleware] (every request to /dashboard/* and /chatbot/*)
              ↓ check cookie 'dentiscan_token'
              ↓ if missing → redirect /login
```

---

## 🚢 Deployment

### Vercel (Recommended untuk Next.js)

```bash
# 1. Push ke GitHub
# 2. Import project di vercel.com
# 3. Set Environment Variables (sama seperti .env.local)
# 4. Deploy
```

### Railway / Render

Set start command: `npm run start` (jalanin `npm run build` dulu).
Pastikan environment variables di-set di dashboard.

### MongoDB

Untuk production, pakai **MongoDB Atlas** (free tier 512 MB cukup). Whitelist Vercel/Railway IP atau allow `0.0.0.0/0` untuk demo.

---

## 🗺 Roadmap

- [x] Landing page + auth + dashboard scaffold (Minggu 4)
- [x] Dummy AI predictions + chatbot knowledge base
- [x] MongoDB schema + dummy store fallback
- [ ] Integrasi FastAPI real model (Minggu 4) — *AI Engineer team*
- [ ] Integrasi Gemini API untuk DentiBot (Minggu 4) — *AI Engineer team*
- [ ] Real Google Maps embed di Clinic Finder (Minggu 4) — *Full-Stack team*
- [ ] Webcam capture (live photo, bukan upload) (Minggu 4)
- [ ] Testing E2E + bug fixing (Minggu 5)
- [ ] Deployment ke Vercel + custom domain (Minggu 5)
- [ ] Final report & demo day prep (Minggu 5)

---

## 📚 Referensi

- Kühnisch, J., et al. (2022). *Deep learning for caries detection and classification: a systematic review.* Journal of Dentistry.
- Hassan, M. G., et al. (2023). *Smartphone-based application for dental caries detection using Deep Learning.* Scientific Reports (Nature).

---

## 🙏 Acknowledgements

Coding Camp 2026 powered by **DBS Foundation** · Tema **Healthy Lives & Well-being**

Built with ❤️ by **Tim CC26-PSU285**
