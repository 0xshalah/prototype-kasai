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
```

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
