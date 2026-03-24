Siap. Di bawah ini tiga dokumen turunan yang bisa langsung kamu simpan sebagai:

* `docs/architecture.md`
* `docs/api-contracts.md`
* `docs/milestone-mvp.md`

Saya buat dengan format yang sengaja **tegas, operasional, dan mudah “dimakan” Cursor**.

---

# `architecture.md`

````md
# KasAI Architecture

## 1. Purpose

Dokumen ini menjelaskan arsitektur teknis KasAI untuk MVP full-stack yang:
- realistis untuk hackathon,
- cukup kuat untuk demo juri,
- dan punya jalur evolusi ke sistem production-minded.

KasAI adalah sistem **voice-to-ledger-to-trust** untuk UMKM:
1. menerima input suara/teks,
2. mengubahnya menjadi transaksi terstruktur,
3. memvalidasi dengan guardrail deterministik,
4. menyimpan ke ledger,
5. menghitung underwriting signal,
6. membangun audit trail tamper-evident.

---

## 2. Architecture Principles

1. **Hackathon-first, production-minded**
   - Prioritaskan flow hidup end-to-end.
   - Hindari microservices berlebihan di fase awal.

2. **AI is parser, not source of truth**
   - AI hanya mengekstrak struktur dari input.
   - Semua commit ke ledger harus lolos validasi backend deterministik.

3. **Server is the trust boundary**
   - Hash chain, scoring, commit ledger, dan audit verify dilakukan server-side.
   - Frontend hanya menampilkan status, bukti, dan interaksi.

4. **Database is the source of truth**
   - UI tidak boleh dianggap sumber data final.
   - Semua saldo, jurnal, score snapshot, dan blocks dibaca dari backend/database.

5. **Progressive disclosure in UX**
   - UI harus membimbing juri/pengguna dari input → engine → artifacts → lender outcome.
   - Jangan tampilkan semua bukti sekaligus di awal.

---

## 3. Recommended Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / BFF
- Next.js Route Handlers
- Zod
- Prisma

### Database
- PostgreSQL

### Queue / Jobs
- Redis
- BullMQ (phase 2)

### AI Layer
- OpenAI Speech-to-Text
- OpenAI Structured Outputs

### Vault / Integrity
- Phase 1: Node.js server-side hashing (SHA-256)
- Phase 2: Rust vault microservice

### Deployment
- Coolify
- DuckDNS
- Docker Compose

---

## 4. High-Level System Diagram

```text
[Browser / Next.js UI]
   ├─ Voice capture
   ├─ Text input
   ├─ Progressive disclosure console
   └─ Bank/Lender evidence view
            │
            ▼
[Next.js App / BFF]
   ├─ /api/transcribe
   ├─ /api/parse
   ├─ /api/commit
   ├─ /api/ledger/summary
   ├─ /api/score
   ├─ /api/audit/verify
   └─ /api/demo/tamper
            │
            ├────────▶ [OpenAI Audio API]
            ├────────▶ [OpenAI Structured Outputs]
            │
            ▼
[Domain Layer]
   ├─ Parser Service
   ├─ Guardrail Service
   ├─ Ledger Service
   ├─ Score Service
   └─ Vault Service
            │
            ├────────▶ [PostgreSQL]
            └────────▶ [Redis / BullMQ]
````

---

## 5. Main User Flows

### 5.1 Happy Path

1. User mengetik atau merekam transaksi.
2. Frontend mengirim input ke backend.
3. Backend mentranskrip audio jika perlu.
4. Backend mem-parse transcript menjadi `TransactionParseResult`.
5. Guardrail backend memvalidasi:

   * intent transaksi,
   * nominal,
   * saldo kas,
   * pemisahan entitas,
   * akun debit/kredit.
6. Jika valid:

   * transaksi disimpan,
   * jurnal dibuat,
   * saldo diperbarui,
   * score snapshot dihitung,
   * block hash ditambahkan.
7. Frontend menampilkan:

   * engine log,
   * ledger artifacts,
   * lender outcome,
   * audit evidence.

### 5.2 Ambiguity Path

1. Input terdeteksi ambigu.
2. Backend mengembalikan `needsHumanReview=true`.
3. UI meminta klarifikasi.
4. Setelah user memilih klasifikasi, commit diulang.

### 5.3 Insufficient Funds Path

1. Nominal transaksi lebih besar dari saldo kas.
2. Guardrail menolak transaksi.
3. Tidak ada commit ledger.
4. Tidak ada block hash baru.
5. Tidak ada update score.

### 5.4 Tamper Path

1. Demo mode mengubah payload block tertentu.
2. Audit verify menghitung ulang chain.
3. Sistem menandai blok rusak pertama.
4. Seluruh blok setelahnya menjadi invalid secara logis.

---

## 6. Domain Services

### 6.1 Parser Service

Tanggung jawab:

* menerima transcript mentah,
* menormalkan teks,
* mengekstrak intent, amount, akun, review flags,
* menghasilkan output sesuai Zod schema.

Tidak bertanggung jawab:

* commit ledger,
* keputusan score final,
* validasi kas.

### 6.2 Guardrail Service

Tanggung jawab:

* memeriksa ambiguitas entitas,
* memeriksa saldo kas cukup,
* memeriksa akun valid,
* memutuskan apakah transaksi boleh di-commit.

Output:

* `allowCommit: boolean`
* `needsHumanReview: boolean`
* `reason: string | null`

### 6.3 Ledger Service

Tanggung jawab:

* membuat transaksi,
* membuat jurnal double-entry,
* memperbarui saldo,
* mengembalikan ringkasan ledger.

Semua operasi ledger harus dilakukan di dalam **database transaction**.

### 6.4 Score Service

Tanggung jawab:

* menghitung underwriting signal / ACS snapshot,
* menyimpan breakdown faktor,
* mengembalikan alasan perubahan score.

### 6.5 Vault Service

Tanggung jawab:

* membentuk canonical payload,
* mengambil `prev_hash`,
* menghitung hash baru,
* menyimpan block,
* memverifikasi seluruh chain.

---

## 7. Data Model Overview

### 7.1 transactions

Menyimpan transaksi level bisnis.

Fields:

* id
* business_id
* raw_text
* parsed_intent
* amount
* debit_account
* credit_account
* status
* created_at

### 7.2 journal_entries

Menyimpan entri jurnal double-entry.

Fields:

* id
* transaction_id
* account_name
* entry_type (`debit` / `credit`)
* amount
* created_at

### 7.3 balance_snapshots

Opsional untuk performance/read model.

Fields:

* id
* business_id
* cash_balance
* expense_total
* prive_total
* created_at

### 7.4 score_snapshots

Menyimpan hasil ACS setelah transaksi valid.

Fields:

* id
* transaction_id
* total_score
* factor_consistency
* factor_separation
* factor_cashflow
* created_at

### 7.5 vault_blocks

Menyimpan hash chain.

Fields:

* id
* block_index
* transaction_id
* canonical_payload
* prev_hash
* hash
* created_at

### 7.6 audit_events

Mencatat kejadian audit/tamper/verify.

Fields:

* id
* event_type
* target_block_index
* message
* created_at

---

## 8. Trust Boundaries

### Browser

Trusted for:

* rendering
* user interaction
* local state sementara

Not trusted for:

* final balances
* final score
* final vault hash validity

### Backend

Trusted for:

* parsing orchestration
* guardrail validation
* commit sequencing
* score calculation
* hash chain creation

### Database

Trusted for:

* persistence
* historical record
* audit evidence storage

---

## 9. Deployment Topology

### Phase 1

Single web app + managed/private services:

```text
Coolify
 ├─ web (Next.js)
 ├─ postgres
 └─ redis (optional)
```

### Phase 2

Compose-based multi-service:

```text
Coolify / Docker Compose
 ├─ web
 ├─ worker
 ├─ postgres
 ├─ redis
 └─ vault-rs
```

---

## 10. Environment Variables

### Required

* `NODE_ENV`
* `DATABASE_URL`
* `OPENAI_API_KEY`

### Optional / Later

* `REDIS_URL`
* `VAULT_SERVICE_URL`
* `APP_BASE_URL`
* `NEXT_PUBLIC_APP_NAME`

---

## 11. Security Notes

1. Jangan commit secret ke repo.
2. Semua AI response harus di-validate lagi dengan Zod.
3. Semua nominal harus di-parse ke integer Rupiah.
4. Semua commit ledger dilakukan di server.
5. Tamper endpoint hanya aktif di mode demo/development.
6. Gunakan HTTPS pada domain publik.

---

## 12. Known MVP Constraints

1. Voice recognition browser tidak dijadikan satu-satunya jalur input.
2. AI parsing masih bergantung pada prompt/schema.
3. ACS pada MVP adalah underwriting-support signal, bukan keputusan kredit final.
4. Vault MVP adalah tamper-evident chain, bukan sistem audit enterprise penuh.
5. Rust vault service boleh ditunda setelah alur hidup stabil.

---

## 13. Future Evolution

### After MVP

* extract vault to Rust
* add BullMQ worker
* richer chart of accounts
* lender dashboard multi-period
* export laporan PDF
* multi-tenant businesses

### Longer-term

* Go ledger service
* Rust verification service
* external integrations
* role-based access
* document ingestion

---

## 14. Non-Goals

Arsitektur ini tidak dimaksudkan untuk:

* menjadi licensed PKA system,
* menjadi CBS/banking core,
* menggantikan audit formal,
* memberikan keputusan kredit otomatis,
* menjadi blockchain network.

````

---

# `api-contracts.md`

```md
# KasAI API Contracts

## 1. Conventions

### Base URL
- Local: `http://localhost:3000`
- Production: `https://<your-domain>`

### Response Envelope
Semua response API mengikuti pola:

#### Success
```json
{
  "success": true,
  "data": {}
}
````

#### Error

```json
{
  "success": false,
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Common Error Codes

* `BAD_REQUEST`
* `VALIDATION_ERROR`
* `NEEDS_HUMAN_REVIEW`
* `INSUFFICIENT_FUNDS`
* `NOT_FOUND`
* `INTERNAL_ERROR`
* `CHAIN_BROKEN`

---

## 2. Shared Schemas

### 2.1 TransactionParseResult

```json
{
  "rawText": "Ambil uang kas 500 ribu",
  "intent": "ambiguous",
  "amount": 500000,
  "currency": "IDR",
  "debitAccount": null,
  "creditAccount": "Kas",
  "confidence": 0.82,
  "needsHumanReview": true,
  "reviewReason": "ENTITY_SEPARATION_AMBIGUOUS"
}
```

### 2.2 LedgerSummary

```json
{
  "cashBalance": 4700000,
  "expenseTotal": 300000,
  "priveTotal": 0
}
```

### 2.3 ScoreSnapshot

```json
{
  "totalScore": 687,
  "factors": [
    {
      "id": "consistency",
      "name": "Konsistensi Pencatatan",
      "delta": 2
    },
    {
      "id": "separation",
      "name": "Disiplin Pemisahan SAK",
      "delta": 3
    },
    {
      "id": "cashflow",
      "name": "Stabilitas Arus Kas",
      "delta": 2
    }
  ]
}
```

### 2.4 VaultBlock

```json
{
  "blockIndex": 1,
  "transactionId": "txn_123",
  "canonicalPayload": "1|TX-001|0000...|Beban Operasional|Kas|300000",
  "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
  "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
}
```

---

## 3. Endpoints

## 3.1 POST /api/transcribe

### Purpose

Menerima file audio dan mengembalikan transcript mentah.

### Request

`multipart/form-data`

Fields:

* `audio` (required): audio file (`webm`, `wav`, etc.)

### Response

```json
{
  "success": true,
  "data": {
    "transcript": "Bayar tagihan listrik ruko tiga ratus ribu rupiah"
  }
}
```

### Errors

* `BAD_REQUEST` if file missing
* `VALIDATION_ERROR` if unsupported format/too large
* `INTERNAL_ERROR`

---

## 3.2 POST /api/parse

### Purpose

Mengubah teks menjadi struktur transaksi terkontrol.

### Request

```json
{
  "rawText": "Bayar tagihan listrik ruko 300 ribu"
}
```

### Response (valid)

```json
{
  "success": true,
  "data": {
    "rawText": "Bayar tagihan listrik ruko 300 ribu",
    "intent": "expense",
    "amount": 300000,
    "currency": "IDR",
    "debitAccount": "Beban Operasional",
    "creditAccount": "Kas",
    "confidence": 0.96,
    "needsHumanReview": false,
    "reviewReason": null
  }
}
```

### Response (needs review)

```json
{
  "success": false,
  "error": {
    "code": "NEEDS_HUMAN_REVIEW",
    "message": "Transaksi ambigu dan memerlukan klarifikasi pengguna",
    "details": {
      "rawText": "Ambil uang kas 500 ribu",
      "intent": "ambiguous",
      "amount": 500000,
      "currency": "IDR",
      "debitAccount": null,
      "creditAccount": "Kas",
      "confidence": 0.82,
      "needsHumanReview": true,
      "reviewReason": "ENTITY_SEPARATION_AMBIGUOUS"
    }
  }
}
```

---

## 3.3 POST /api/commit

### Purpose

Menerima hasil parse yang sudah jelas, menjalankan guardrail, lalu commit ke ledger + score + vault.

### Request

```json
{
  "rawText": "Bayar tagihan listrik ruko 300 ribu",
  "intent": "expense",
  "amount": 300000,
  "currency": "IDR",
  "debitAccount": "Beban Operasional",
  "creditAccount": "Kas",
  "reviewResolution": null
}
```

### Request (after human clarification)

```json
{
  "rawText": "Ambil uang kas 500 ribu",
  "intent": "prive",
  "amount": 500000,
  "currency": "IDR",
  "debitAccount": "Prive Pemilik",
  "creditAccount": "Kas",
  "reviewResolution": "prive"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123",
    "journalEntries": [
      {
        "accountName": "Beban Operasional",
        "entryType": "debit",
        "amount": 300000
      },
      {
        "accountName": "Kas",
        "entryType": "credit",
        "amount": 300000
      }
    ],
    "ledgerSummary": {
      "cashBalance": 4700000,
      "expenseTotal": 300000,
      "priveTotal": 0
    },
    "scoreSnapshot": {
      "totalScore": 687,
      "factors": [
        {
          "id": "consistency",
          "name": "Konsistensi Pencatatan",
          "delta": 2
        },
        {
          "id": "separation",
          "name": "Disiplin Pemisahan SAK",
          "delta": 3
        },
        {
          "id": "cashflow",
          "name": "Stabilitas Arus Kas",
          "delta": 2
        }
      ]
    },
    "vaultBlock": {
      "blockIndex": 1,
      "transactionId": "txn_123",
      "canonicalPayload": "1|TX-001|0000...|Beban Operasional|Kas|300000",
      "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
    }
  }
}
```

### Errors

#### Insufficient funds

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Saldo kas tidak mencukupi",
    "details": {
      "required": 6000000,
      "available": 5000000
    }
  }
}
```

#### Validation error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Akun debit/kredit tidak valid",
    "details": {}
  }
}
```

---

## 3.4 GET /api/ledger/summary

### Purpose

Mengambil ringkasan saldo ledger saat ini.

### Response

```json
{
  "success": true,
  "data": {
    "cashBalance": 4700000,
    "expenseTotal": 300000,
    "priveTotal": 0
  }
}
```

---

## 3.5 GET /api/ledger/journal

### Purpose

Mengambil daftar jurnal terbaru.

### Query Params

* `limit` (optional, default 10)

### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "transactionId": "txn_123",
        "createdAt": "2026-03-23T10:00:00.000Z",
        "entries": [
          {
            "accountName": "Beban Operasional",
            "entryType": "debit",
            "amount": 300000
          },
          {
            "accountName": "Kas",
            "entryType": "credit",
            "amount": 300000
          }
        ]
      }
    ]
  }
}
```

---

## 3.6 GET /api/score

### Purpose

Mengambil snapshot score terbaru.

### Response

```json
{
  "success": true,
  "data": {
    "totalScore": 687,
    "factors": [
      {
        "id": "consistency",
        "name": "Konsistensi Pencatatan",
        "delta": 2
      },
      {
        "id": "separation",
        "name": "Disiplin Pemisahan SAK",
        "delta": 3
      },
      {
        "id": "cashflow",
        "name": "Stabilitas Arus Kas",
        "delta": 2
      }
    ]
  }
}
```

---

## 3.7 GET /api/audit/chain

### Purpose

Mengambil daftar block dalam mini-chain.

### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "blockIndex": 1,
        "transactionId": "txn_123",
        "canonicalPayload": "1|TX-001|0000...|Beban Operasional|Kas|300000",
        "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
        "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
      }
    ]
  }
}
```

---

## 3.8 GET /api/audit/verify

### Purpose

Memverifikasi seluruh rantai hash.

### Response (passed)

```json
{
  "success": true,
  "data": {
    "valid": true,
    "firstBrokenBlock": null,
    "invalidBlocks": []
  }
}
```

### Response (broken)

```json
{
  "success": false,
  "error": {
    "code": "CHAIN_BROKEN",
    "message": "Integritas rantai rusak",
    "details": {
      "valid": false,
      "firstBrokenBlock": 2,
      "invalidBlocks": [2, 3, 4]
    }
  }
}
```

---

## 3.9 POST /api/demo/tamper

### Purpose

Endpoint khusus demo untuk mensimulasikan modifikasi ilegal payload block.

### Request

```json
{
  "targetBlockIndex": 2,
  "mode": "append_amount_digits"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "targetBlockIndex": 2,
    "message": "Payload block berhasil dimodifikasi untuk keperluan demo"
  }
}
```

### Notes

* Endpoint ini hanya aktif di mode demo/development.
* Tidak boleh aktif di production normal.

---

## 3.10 POST /api/system/reset

### Purpose

Reset state sistem untuk demo.

### Request

```json
{}
```

### Response

```json
{
  "success": true,
  "data": {
    "message": "System state reset berhasil"
  }
}
```

### Notes

* Hanya untuk demo/development.

---

## 4. Suggested Zod Contracts

### Parse Request

```ts
const ParseRequestSchema = z.object({
  rawText: z.string().min(1)
})
```

### Parse Response

```ts
const TransactionParseResultSchema = z.object({
  rawText: z.string(),
  intent: z.enum(["expense", "prive", "ambiguous", "unknown"]),
  amount: z.number().int().positive(),
  currency: z.literal("IDR"),
  debitAccount: z.string().nullable(),
  creditAccount: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  needsHumanReview: z.boolean(),
  reviewReason: z.string().nullable()
}).strict()
```

### Commit Request

```ts
const CommitRequestSchema = z.object({
  rawText: z.string(),
  intent: z.enum(["expense", "prive"]),
  amount: z.number().int().positive(),
  currency: z.literal("IDR"),
  debitAccount: z.string(),
  creditAccount: z.string(),
  reviewResolution: z.string().nullable().optional()
}).strict()
```

---

## 5. Contract Rules

1. Semua nominal harus integer Rupiah.
2. Semua object schema harus `strict`.
3. `ambiguous` dan `unknown` tidak boleh di-commit.
4. `prive` harus diarahkan ke akun `Prive Pemilik`.
5. `creditAccount` untuk MVP default adalah `Kas`.
6. Semua response error harus menyertakan `code`.
7. Demo endpoints harus diproteksi environment flag.

````

---

# `milestone-mvp.md`

```md
# KasAI MVP Milestone Plan

## 1. Objective

Membangun prototype full-stack KasAI yang benar-benar hidup dan bisa didemokan end-to-end:
- text/voice input,
- AI parsing,
- guardrail,
- ledger,
- score breakdown,
- tamper-evident hash chain,
- audit verify,
- deploy di Coolify dengan domain DuckDNS.

Target utama bukan “arsitektur tercantik”, tetapi:
- satu flow hidup,
- fail-state jelas,
- dan demo yang stabil.

---

## 2. Definition of Done (MVP)

MVP dinyatakan selesai jika semua ini hidup:

### Happy Path
- user input teks/voice
- parse valid
- commit ledger sukses
- saldo update
- ACS update
- vault block bertambah
- lender view menampilkan outcome

### Ambiguity Path
- transaksi ambigu ditolak otomatis
- user diminta klarifikasi
- commit baru lanjut setelah resolusi

### Insufficient Funds Path
- transaksi ditolak
- tidak ada jurnal
- tidak ada block baru

### Tamper Path
- satu block dirusak
- verify chain gagal
- sistem menunjukkan blok awal rusak dan domino invalid

### Deployment
- app bisa diakses melalui domain publik
- HTTPS aktif
- data persisten di PostgreSQL

---

## 3. Milestones

## Milestone 0 — Repo & Foundations
### Goal
Menyiapkan fondasi repo, stack, dan kontrak teknis.

### Tasks
- setup monorepo / single repo Next.js
- install TypeScript, Tailwind, Prisma, Zod
- setup PostgreSQL connection
- setup initial folder structure
- buat `.env.example`
- buat `architecture.md`, `api-contracts.md`, `milestone-mvp.md`

### Deliverables
- app jalan lokal
- DB connect berhasil
- contracts file tersedia

### Exit Criteria
- `npm run dev` berjalan
- Prisma migrate berhasil
- homepage sederhana tampil

---

## Milestone 1 — Static UI to Real Frontend Shell
### Goal
Mengubah SPA demo menjadi frontend shell yang siap bicara ke backend.

### Tasks
- migrasi HTML demo ke Next.js pages/app router
- buat komponen:
  - InputPanel
  - EngineLog
  - LedgerArtifacts
  - BankView
  - VerifyBanner
- implement progressive disclosure
- implement accessible tabs
- buat global UI state minimal

### Deliverables
- UI berjalan di Next.js
- tab UMKM / Bank jalan
- progressive reveal berjalan

### Exit Criteria
- user bisa berpindah mode
- panel engine/artifacts/bank muncul sesuai flow
- reset UI bekerja

---

## Milestone 2 — Text Parse Flow
### Goal
Menghidupkan alur teks → parse → review/commit.

### Tasks
- implement `POST /api/parse`
- buat Zod schema parse request/response
- integrasi OpenAI Structured Outputs
- simpan transcript mentah
- bangun fallback parser minimal untuk local testing
- tampilkan hasil parse ke UI log

### Deliverables
- input teks bisa diparse
- transaksi ambigu menghasilkan `NEEDS_HUMAN_REVIEW`
- hasil parse tervalidasi schema

### Exit Criteria
- 3 skenario lolos:
  - happy
  - ambiguous
  - insufficient candidate
- no invalid object shape dari parser masuk ke flow commit

---

## Milestone 3 — Guardrail + Ledger Commit
### Goal
Membuat ledger backend deterministik yang benar-benar menjadi source of truth.

### Tasks
- implement `POST /api/commit`
- buat service:
  - guardrail service
  - ledger service
- cek saldo kas
- cek intent commit valid
- cek entity separation
- simpan transactions
- simpan journal entries
- hitung/update summary balances

### Deliverables
- commit transaction hidup
- ledger summary hidup
- journal list hidup

### Exit Criteria
- happy path menghasilkan jurnal valid
- ambiguous tidak bisa langsung commit
- insufficient funds ditolak
- UI membaca data dari API, bukan state palsu

---

## Milestone 4 — ACS Score Engine
### Goal
Membuat underwriting-support signal yang explainable.

### Tasks
- implement score service
- hitung faktor:
  - consistency
  - separation discipline
  - cashflow stability
- simpan score snapshots
- implement `GET /api/score`
- render factor breakdown di bank view

### Deliverables
- score berubah saat transaksi valid
- score turun untuk prive
- factor breakdown terlihat

### Exit Criteria
- score total dapat dijelaskan dari jumlah delta faktor
- no hidden magic number di UI
- lender view tampil konsisten dengan DB state

---

## Milestone 5 — Vault Chain
### Goal
Memindahkan trust evidence dari browser ke backend.

### Tasks
- implement vault block schema/table
- implement canonical payload builder
- ambil `prev_hash`
- hitung SHA-256 server-side
- simpan block
- implement `GET /api/audit/chain`
- render chain table di bank view

### Deliverables
- setiap commit valid menambah 1 block
- chain table hidup dari API
- block height akurat

### Exit Criteria
- no block created on failed transactions
- first block pakai `GENESIS_HASH`
- subsequent block pakai `prev_hash` block sebelumnya

---

## Milestone 6 — Audit Verify + Tamper Demo
### Goal
Menciptakan “jaw-dropper moment” untuk juri.

### Tasks
- implement `GET /api/audit/verify`
- implement `POST /api/demo/tamper`
- verifikasi ulang chain
- tandai first broken block
- tandai subsequent invalid blocks
- tampilkan result banner di UI

### Deliverables
- tombol verify bekerja
- tamper simulation bekerja
- banner PASS / FAIL bekerja

### Exit Criteria
- healthy chain => PASS
- tampered chain => FAIL
- blok setelah titik rusak ikut invalid secara logis

---

## Milestone 7 — Voice Input
### Goal
Membuat jalur voice-first benar-benar hidup, tanpa menjadikan browser speech sebagai satu-satunya sandaran.

### Tasks
- implement `getUserMedia`
- implement `MediaRecorder`
- upload audio ke backend
- implement `POST /api/transcribe`
- integrasikan transcript ke `/api/parse`
- pertahankan text fallback

### Deliverables
- user bisa rekam suara
- transcript muncul di UI log
- transcript masuk ke parse flow

### Exit Criteria
- audio pendek berhasil diproses
- jika audio gagal, text fallback tetap bekerja
- voice path tidak merusak ledger path

---

## Milestone 8 — Deployment
### Goal
Menjalankan KasAI di server nyata.

### Tasks
- siapkan Dockerfile atau Nixpacks-compatible config
- siapkan Postgres di Coolify
- siapkan Redis jika dipakai
- set environment variables
- deploy web app
- setup DuckDNS
- setup HTTPS
- smoke test public URL

### Deliverables
- app online
- database persisten
- domain publik aktif

### Exit Criteria
- domain publik bisa dibuka
- parse + commit + verify bekerja di environment deploy
- minimal satu demo flow bisa dijalankan end-to-end

---

## 4. Task Prioritization

## P0 — Wajib
- repo setup
- frontend shell
- parse endpoint
- commit endpoint
- guardrail
- ledger summary
- score breakdown
- vault chain
- verify audit
- deploy public

## P1 — Sangat disarankan
- audio upload
- transcription
- tamper demo endpoint
- reset endpoint demo
- Redis + worker

## P2 — Jika masih ada waktu
- Rust vault microservice
- export PDF
- auth
- multi-business
- analytics

---

## 5. Suggested Sprint / Day Plan

## Day 1
- repo setup
- Prisma schema
- UI shell
- contracts

## Day 2
- `/api/parse`
- mock parser fallback
- ambiguity flow

## Day 3
- `/api/commit`
- journal + balances
- insufficient funds guardrail

## Day 4
- score engine
- bank view
- render breakdown

## Day 5
- vault chain
- audit verify
- tamper demo

## Day 6
- voice input
- transcription
- polish UI

## Day 7
- deploy Coolify
- DuckDNS
- demo rehearsal
- bug fixing

---

## 6. Acceptance Checklist

### Parse
- [ ] text parse berhasil
- [ ] ambiguous parse ditandai review
- [ ] invalid payload ditolak schema

### Guardrail
- [ ] ambiguous tidak auto-commit
- [ ] insufficient funds ditolak
- [ ] only allowed accounts bisa dipakai

### Ledger
- [ ] transaction tersimpan
- [ ] journal entries tersimpan
- [ ] balances berubah konsisten

### Score
- [ ] score naik untuk expense valid
- [ ] score turun untuk prive
- [ ] breakdown cocok dengan total

### Vault
- [ ] block baru dibuat saat commit valid
- [ ] no block on failed transaction
- [ ] verify PASS untuk chain sehat
- [ ] verify FAIL untuk chain rusak

### Deploy
- [ ] app online
- [ ] env vars aman
- [ ] database persisten
- [ ] HTTPS aktif

---

## 7. Risks and Mitigation

### Risk: AI parser salah
Mitigation:
- Structured Outputs
- Zod validation
- human review for ambiguous cases

### Risk: voice path gagal di browser
Mitigation:
- text fallback
- `MediaRecorder` path
- jangan bergantung penuh ke browser speech recognition

### Risk: demo server bermasalah
Mitigation:
- seeded demo data
- reset endpoint
- rehearsal on deployed URL

### Risk: scope kebanyakan
Mitigation:
- lock P0
- P1 hanya jika P0 stabil
- Rust service ditunda bila perlu

---

## 8. Demo Script Alignment

Prototype harus mendukung script demo berikut:

1. User klik mock/text/voice input
2. Engine log muncul
3. Ambiguity guardrail muncul jika perlu
4. Ledger artifact terbentuk
5. User pindah ke bank view
6. Score breakdown terlihat
7. User klik audit verify
8. PASS
9. User klik tamper
10. Verify lagi
11. FAIL

Jika flow ini mulus, demo sudah punya struktur “hook → proof → trust → outcome”.

---

## 9. Nice-to-Have Demo Enhancements

- seed multiple transactions
- score trend badge
- export evidence snapshot
- lender summary card
- event timeline panel

---

## 10. Final Rule

Jika ada konflik antara:
- membangun fitur baru, atau
- menstabilkan happy path + ambiguity + tamper demo,

maka pilih **menstabilkan flow utama**.

Karena juri tidak memberi hadiah untuk backlog yang puitis.
````

---

## Cara pakai di Cursor

Urutan paling efektif:

1. Simpan tiga file ini dulu ke `docs/`
2. Lalu kasih prompt ke Cursor seperti ini:

```text
Read docs/architecture.md and docs/api-contracts.md.
Implement the Prisma schema for transactions, journal_entries, score_snapshots, and vault_blocks.
Use PostgreSQL.
Do not add auth yet.
Generate migrations and seed data for one demo business.
```

Lalu lanjut:

```text
Read docs/api-contracts.md.
Implement POST /api/parse and POST /api/commit using Next.js Route Handlers and Zod validation.
Return the exact response envelope from the contract.
```

Lalu lanjut:

```text
Read docs/milestone-mvp.md.
Implement only Milestone 3 and Milestone 5.
Do not touch voice input yet.
```

Itu jauh lebih aman daripada menyuruh AI “bangun KasAI full stack” lalu berharap dia mendapat wahyu arsitektur.

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan `schema.prisma` dan struktur folder repo yang cocok dengan tiga dokumen ini.**
