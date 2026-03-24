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
