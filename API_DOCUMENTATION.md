# API Documentation

Dokumentasi singkat untuk semua endpoint di folder `app/api`.

---

## POST /api/chat

**Description:** Kirim pesan chat ke AI (simpan ke store sementara).

**Authentication:** Required

**Request:**
- Headers: `Content-Type: application/json`, `Cookie` (auth cookie)
- Body (JSON):
  - `message` (string) - pesan user (required)
  - `history` (optional) - array/objek history percakapan

**Response Success:**
```json
{
  "success": true,
  "data": {
    "message": "Balasan bot...",
    "id": "msg-id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

## GET /api/chat

**Description:** Ambil daftar percakapan pengguna dari dummy store.

**Authentication:** Required

**Request:**
- Headers: `Cookie` (auth cookie)
- No body

**Response Success:**
```json
{ "success": true, "data": [ { "role": "user", "content": "..." } ] }
```

**Response Error:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

## DELETE /api/chat

**Description:** Hapus riwayat chat (dummy store) untuk user.

**Authentication:** Required

**Request:**
- Headers: `Cookie` (auth cookie)

**Response Success:**
```json
{ "success": true }
```

**Response Error:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

## POST /api/scan

**Description:** Upload gambar scan gigi, diteruskan ke AI eksternal jika `AI_API_URL` diset, atau gunakan prediksi lokal. Hasil disimpan ke MongoDB (jika terkoneksi) atau dummy store.

**Authentication:** Required

**Request:**
- Headers: `Content-Type: multipart/form-data`, `Cookie` (auth cookie)
- Form Data:
  - `image` (file) - file gambar (required)

**Behavior / Notes:**
- Jika `process.env.AI_API_URL` ada, request diteruskan (forward) ke `${AI_API_URL}/predict` (multipart/form-data). Server AI diharapkan merespon `{ success: true, data: { label, confidence, all_predictions } }`.
- Response dari AI akan dimap ke schema `Scan` sebelum disimpan.

**Response Success (saved scan):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "overallScore": 95,
    "confidenceScore": 95,
    "conditions": [ { "name": "gigi caries", "detected": true, "confidence": 95, "severity": "high" } ],
    "summary": "Terdeteksi: gigi caries dengan kepercayaan 95%",
    "recommendation": "Segera konsultasi ke dokter gigi...",
    "urgency": "high",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "id": "..."
  }
}
```

**Response Error:**
```json
{ "success": false, "error": "File gambar tidak ditemukan" }
```

---

## GET /api/scan

**Description:** Ambil daftar scan (terbaru) untuk user; gunakan MongoDB jika tersedia, atau dummy store.

**Authentication:** Required

**Request:**
- Headers: `Cookie` (auth cookie)
- Query: none

**Response Success:**
```json
{ "success": true, "data": [ /* array scan objects */ ] }
```

**Response Error:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

## GET /api/scan/:scanId

**Description:** Ambil detail satu scan berdasarkan `scanId`.

**Authentication:** Required

**Request:**
- Headers: `Cookie` (auth cookie)
- Path param: `scanId`

**Response Success:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "overallScore": 80,
    "confidenceScore": 80,
    "conditions": [ /* ... */ ],
    "summary": "...",
    "recommendation": "...",
    "urgency": "medium",
    "id": "..."
  }
}
```

**Response Error:**
```json
{ "success": false, "error": "Scan not found or unauthorized" }
```

---

## POST /api/ai/predict

**Description:** Endpoint yang menerima gambar dan menjalankan prediksi AI. Jika `AI_API_URL` dikonfigurasi, request akan diteruskan ke service eksternal (FastAPI). Jika tidak, prediksi berjalan lokal.

**Authentication:** Required

**Request:**
- Headers: `Content-Type: multipart/form-data`, `Cookie` (auth cookie)
- Form Data:
  - `image` (file) - file gambar (required)
  - `debug` (optional) - "1" untuk debug

**Response Success (local):**
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "confidenceScore": 85,
    "conditions": [ { "name": "Karies", "detected": true, "confidence": 85, "severity": "high" } ],
    "summary": "...",
    "recommendation": "...",
    "urgency": "high"
  }
}
```

**Response Success (forwarded FastAPI):**
- FastAPI is expected to return:
```json
{
  "success": true,
  "data": {
    "label": "gigi caries",
    "confidence": 0.99,
    "all_predictions": {
      "gigi caries": 0.99,
      "gigi sehat": 0.001,
      "gusi sehat": 0.001,
      "karang gigi": 0.001
    }
  }
}
```
- The app maps the forwarded response to a compatible structure when saving under `/api/scan`.

**Response Error:**
```json
{ "success": false, "error": "Invalid response from AI service" }
```

---

## POST /api/debug-predict

**Description:** Debug endpoint untuk menghasilkan prediksi + debug info (embedding/distances).

**Authentication:** Not Required

**Request:**
- Headers: `Content-Type: multipart/form-data`
- Form Data:
  - `image` (file)

**Response Success:**
```json
{
  "label": "Karies",
  "confidence": 85,
  "score": 80,
  "debug": { /* embedding + distances */ },
  "allConditions": [ /* conditions array */ ]
}
```

**Response Error:**
```json
{ "error": "No file" }
```

---

## GET /api/clinics

**Description:** Cari klinik terdekat (dummy list). Jika `lat` dan `lng` disediakan sebagai query params, jarak dihitung dan hasil diurutkan.

**Authentication:** Required

**Request:**
- Headers: `Cookie` (auth cookie)
- Query Params (optional): `lat`, `lng`

**Response Success:**
```json
{ "success": true, "data": [ { "id": "clinic_1", "name": "...", "distance": 0.8 } ] }
```

**Response Error:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

## POST /api/auth/register

**Description:** Daftar user baru, set auth cookie.

**Authentication:** Not Required

**Request:**
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `fullName` (string)
  - `email` (string)
  - `password` (string)

**Response Success:**
```json
{ "success": true, "data": { "id": "...", "fullName": "...", "email": "..." } }
```

**Response Error:**
```json
{ "success": false, "error": "Email sudah terdaftar" }
```

---

## POST /api/auth/login

**Description:** Login user, set auth cookie.

**Authentication:** Not Required

**Request:**
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `email` (string)
  - `password` (string)

**Response Success:**
```json
{ "success": true, "data": { "id": "...", "fullName": "...", "email": "..." } }
```

**Response Error:**
```json
{ "success": false, "error": "Email atau password salah" }
```

---

## GET /api/auth/me

**Description:** Ambil profil user dari auth cookie.

**Authentication:** Required

**Request:**
- Headers: `Cookie` (auth cookie)

**Response Success:**
```json
{ "success": true, "data": { "id": "...", "fullName": "...", "email": "..." } }
```

**Response Error:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

## DELETE /api/auth/me

**Description:** Logout - hapus auth cookie.

**Authentication:** Not Required (endpoint hanya clear cookie)

**Request:**
- Headers: cookie (optional)

**Response Success:**
```json
{ "success": true }
```

---


# Notes
- Semua response sukses pada umumnya mengikuti pola `{ success: true, data: ... }` kecuali beberapa debug endpoints yang mengembalikan struktur berbeda.
- Banyak endpoint menggunakan dummy stores saat MongoDB tidak tersedia (lihat implementasi di `lib/db/dummy-store`).
- Untuk endpoint yang meneruskan ke AI eksternal, pastikan `AI_API_URL` di environment di-set (contoh: `https://your-fastapi.railway.app`).

---

Generated from source files in `app/api`.
