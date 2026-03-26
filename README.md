<p align="center">
  <h1 align="center">🎙️ KasAI</h1>
  <p align="center"><strong>Voice-to-Ledger-to-Trust Pipeline untuk UMKM Indonesia</strong></p>
  <p align="center">
    <em>Asisten Akuntansi Voice-First yang Mengubah Ucapan Menjadi Pencatatan Keuangan Terstruktur</em>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-PROTOTYPE-orange?style=for-the-badge" alt="Status: Prototype" />
  <img src="https://img.shields.io/badge/hackathon-PIDI%20DIGDAYA%202026-blue?style=for-the-badge" alt="PIDI DIGDAYA 2026" />
  <img src="https://img.shields.io/badge/stack-Next.js%2015%20%7C%20Groq%20%7C%20Prisma%20%7C%20PostgreSQL-black?style=for-the-badge" alt="Stack" />
</p>

---

> **⚠️ DISCLAIMER: Proyek ini adalah PROTOTYPE / Proof of Concept yang dibangun untuk submission Hackathon PIDI DIGDAYA x Bank Indonesia 2026. Sistem ini BELUM siap untuk penggunaan produksi dan TIDAK dimaksudkan sebagai pengganti software akuntansi profesional, sistem pemeringkat kredit formal, atau layanan keuangan berlisensi.**

---

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Problem Statement](#problem-statement)
- [Cara Kerja](#cara-kerja)
- [Tech Stack](#tech-stack)
- [Fitur Prototype](#fitur-prototype)
- [Batasan Prototype](#batasan-prototype)
- [Instalasi & Setup](#instalasi--setup)
- [Struktur Proyek](#struktur-proyek)
- [Tim](#tim)
- [Lisensi](#lisensi)

---

## Tentang Proyek

**KasAI** adalah prototype solusi *voice-first bookkeeping* untuk UMKM mikro Indonesia. Sistem ini mengubah ucapan transaksi harian (contoh: *"Bayar listrik 300 ribu"*) menjadi:

1. **Pencatatan keuangan terstruktur** — jurnal *double-entry* sesuai prinsip SAK EMKM
2. **Sinyal underwriting alternatif** — *alternative credit signal* berbasis perilaku pencatatan
3. **Jejak audit kriptografis** — *hash chain* SHA-256 yang *tamper-evident*

Prototype ini dibangun untuk menjawab **Problem Statement: Inklusi Ekonomi (UMKM)** pada Hackathon PIDI DIGDAYA x Bank Indonesia 2026, khususnya sub-kategori **Pemanfaatan Data Alternatif / Credit Scoring**.

---

## Problem Statement

Indonesia memiliki lebih dari **65 juta UMKM** yang menyumbang ~60% PDB nasional. Namun:

- **>80% UMKM** tidak memiliki pencatatan keuangan yang memadai
- **93,5% UMKM** membiayai operasional secara mandiri
- Hanya **~6,7%** yang memiliki akses ke pembiayaan perbankan
- Kesenjangan pembiayaan UMKM diperkirakan mencapai **US$234 miliar**

**Akar masalahnya:** lembaga keuangan membutuhkan data terstruktur untuk menilai kelayakan kredit, namun data tersebut tidak tersedia karena UMKM tidak melakukan pencatatan. KasAI dirancang untuk memutus siklus ini.

---

## Cara Kerja

```
🎙️ Suara → 📡 Transkripsi AI → 🧠 Parsing → 🛡️ Guardrail → 📒 Ledger → 📊 Score → 🔒 Vault
```

| Tahap | Proses | Teknologi |
|---|---|---|
| **1. Input** | Pengguna berbicara atau mengetik transaksi | `MediaRecorder` (timeslice 100ms) |
| **2. Transkripsi** | Audio → Teks (3-layer failover) | Groq Whisper → VPS → OpenAI |
| **3. Parsing** | Teks → Objek transaksi terstruktur | Groq Llama 3.3 70B + fallback regex |
| **4. Validasi** | Cek ambiguitas + kecukupan saldo | `GuardrailService` (deterministik) |
| **5. Ledger** | Simpan transaksi + jurnal double-entry | `LedgerService` + Prisma `$transaction` |
| **6. Scoring** | Hitung *alternative credit signal* | `ScoreService` (3 faktor) |
| **7. Audit** | Buat block hash SHA-256 | `VaultService` (hash chain) |

**Prinsip arsitektur:** AI hanya berperan sebagai *parser*. Semua keputusan pencatatan final melewati validator deterministik di server. Database adalah *source of truth*.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | React 19 + Tailwind CSS |
| Validasi | Zod |
| ORM | Prisma 6.19 |
| Database | PostgreSQL (Supabase) |
| AI Transkripsi | Groq Cloud (Whisper-large-v3) |
| AI Parsing | Groq Cloud (Llama 3.3 70B Versatile) |
| Kriptografi | Node.js `crypto` (SHA-256) |
| Deployment | Vercel (function region: `hnd1` / Tokyo) |

---

## Fitur Prototype

### ✅ Yang Sudah Diimplementasikan dan Diverifikasi

- [x] **Voice input** via browser + timesliced recording (100ms)
- [x] **Transkripsi sub-detik** (Groq Whisper-large-v3)
- [x] **3-layer failover** transkripsi (Groq → Sovereign VPS → OpenAI)
- [x] **Filter anti-halusinasi** untuk audio kosong/noise
- [x] **AI parsing** dengan JSON mode + temperature 0.1
- [x] **Fallback rule-based parser** (regex) jika AI gagal
- [x] **Validasi Zod** untuk setiap request
- [x] **Guardrail ambiguitas entitas** (memaksa klarifikasi pribadi/usaha)
- [x] **Guardrail kecukupan saldo** (menolak jika kas tidak cukup)
- [x] **Jurnal double-entry** otomatis (2 entri per transaksi)
- [x] **Balance snapshot** (kas, beban, prive) diperbarui atomik
- [x] **Alternative credit signal** (3 faktor, skala 300–850)
- [x] **Hash chain audit trail** (SHA-256, tamper-evident)
- [x] **Tamper simulation** untuk demo integritas
- [x] **Chain verification** (linkage + digest + data consistency)
- [x] **Deterministic reset** untuk repeatability demo
- [x] **Cloud database** (Supabase PostgreSQL, persisten)
- [x] **Production build** berhasil (Exit 0)

---

## Batasan Prototype

> **Penting:** Bagian ini menjelaskan apa yang BELUM ada dan TIDAK diklaim oleh prototype ini.

- ❌ **Bukan software akuntansi berlisensi** — chart of accounts terbatas (4 akun: Kas, Pendapatan Usaha, Beban Operasional, Prive Pemilik)
- ❌ **Bukan sistem pemeringkat kredit formal** — ACS scoring masih menggunakan delta konstan per transaksi, belum weighted berdasarkan periode/tren
- ❌ **Bukan blockchain** — hash chain adalah *tamper-evident log* lokal, bukan distributed ledger
- ❌ **Single tenant** — belum ada autentikasi atau multi-user (`businessId` di-hardcode)
- ❌ **Belum ada export laporan** — tidak ada PDF/CSV
- ❌ **Belum terintegrasi** dengan lembaga keuangan manapun
- ❌ **Confidence score AI bersifat statis** — bukan probabilitas real-time dari model
- ❌ **Belum divalidasi** terhadap data gagal bayar aktual

---

## Instalasi & Setup

### Prasyarat

- Node.js 18+
- npm atau yarn
- Akun [Groq](https://console.groq.com) (untuk API key)
- Akun [Supabase](https://supabase.com) (untuk PostgreSQL)

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/0xshalah/prototype-kasai.git
cd prototype-kasai

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dan isi:
#   DATABASE_URL    → Connection string Supabase (Transaction Pooler, port 6543)
#   DIRECT_URL      → Connection string Supabase (Session Pooler, port 5432)
#   GROQ_API_KEY    → API key dari console.groq.com
#   AI_PROVIDER     → "groq"

# 4. Push schema ke database
npx prisma db push
npx prisma generate

# 5. (Opsional) Seed data awal
npm run prisma:seed

# 6. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Struktur Proyek

```
├── prisma/
│   └── schema.prisma          # Data model (6 tabel)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transcribe/    # Voice → Text (3-layer failover)
│   │   │   ├── parse/         # Text → Structured Transaction
│   │   │   ├── commit/        # Orchestrator: Guardrail → Ledger → Score → Vault
│   │   │   ├── audit/         # Verify chain + Tamper simulation
│   │   │   └── ledger/        # Read balance & journal data
│   │   └── page.tsx           # Main dashboard UI
│   ├── components/            # React components
│   ├── hooks/
│   │   └── useVoiceCapture.ts # Browser audio recording hook
│   ├── lib/
│   │   └── db.ts              # Prisma client singleton
│   └── server/
│       ├── ai/
│       │   └── providers/     # Groq, OpenAI, Alibaba adapters
│       ├── repositories/      # Database access layer
│       └── services/          # Domain services
│           ├── guardrail.service.ts
│           ├── ledger.service.ts
│           ├── score.service.ts
│           ├── vault.service.ts
│           └── audit.service.ts
├── docs/                      # Dokumentasi arsitektur & demo
├── vercel.json                # Region pinning (hnd1/Tokyo)
└── package.json
```

---

## Tim

**KasAI Labs** — Tim pengembangan mandiri untuk Hackathon PIDI DIGDAYA x Bank Indonesia 2026.

| Nama | Peran | Institusi |
|---|---|---|
| **Shalahuddin Al-Ayyubi** | Product Designer, AI Engineer, Backend Engineer, Full-Stack Developer | Politeknik Negeri Batam |

---

## Konteks Hackathon

| Item | Detail |
|---|---|
| **Kompetisi** | PIDI DIGDAYA x Hackathon 2026 — Bank Indonesia |
| **Problem Statement** | Peningkatan Produktivitas, Ketahanan Pangan, dan Penciptaan Lapangan Kerja |
| **Sub-Problem** | Inklusi Ekonomi (UMKM) — Pemanfaatan Data Alternatif / Credit Scoring |
| **Status Inovasi** | Prototype / Functional Prototype yang sudah berjalan dan dideploy |

---

## Referensi

1. Kementerian Koperasi dan UKM RI. (2023). *Data UMKM Indonesia*
2. World Bank. (2022). *MSME Finance Gap*
3. OJK. (2024). *POJK No. 29 Tahun 2024 tentang Pemeringkat Kredit Alternatif*
4. Bank Indonesia. (2023). *Blueprint Sistem Pembayaran Indonesia 2030*
5. IAI. *SAK EMKM — Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah*

---

## Lisensi

Proyek ini dibuat untuk keperluan Hackathon PIDI DIGDAYA x Bank Indonesia 2026. Hak cipta © 2026 KasAI Labs. All rights reserved.

---

<p align="center">
  <sub>⚠️ <strong>PROTOTYPE</strong> — Dibangun untuk hackathon, bukan untuk penggunaan produksi.</sub>
</p>
