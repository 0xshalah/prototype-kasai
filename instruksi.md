## Putusan saya

**Bisa banget dibuat “hidup”, dan saya sarankan kamu menempuh jalur *full-stack pragmatis*, bukan langsung *microservices purist*.**
Untuk KasAI, versi paling masuk akal adalah: **web + API dalam satu codebase**, **database nyata**, **AI server-side**, **hash chain server-side**, lalu **worker + Rust vault** ditambahkan sesudah alur utamanya stabil. Ini paling cocok dengan Coolify, paling cepat dipacu dengan Cursor/AI IDE, dan paling dekat dengan kondisi demo nyata. Next.js saat ini bisa di-*self-host* sebagai **Node.js server** atau **Docker container** dengan dukungan fitur penuh, sementara Coolify memang mendukung deployment berbasis **Nixpacks** untuk app umum dan **Docker Compose** untuk aplikasi multi-service. ([Next.js][1])

---

## Stack yang saya rekomendasikan

### Opsi utama: **Hackathon-first, production-minded**

| Layer            | Tech yang saya sarankan                                  | Kenapa                                          |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Frontend UI      | **Next.js + React + TypeScript + Tailwind**              | Migrasi dari SPA sekarang paling cepat          |
| API / BFF        | **Next.js Route Handlers**                               | Satu domain, minim CORS, minim repo pecah       |
| Shared contracts | **Zod**                                                  | Schema parser, ledger, ACS, vault konsisten     |
| Database         | **PostgreSQL + Prisma**                                  | Cocok untuk ledger, jurnal, audit trail         |
| Queue / async    | **Redis + BullMQ**                                       | Buat transcription, scoring, audit verify async |
| Audio capture    | **getUserMedia + MediaRecorder**                         | Lebih stabil daripada `SpeechRecognition`       |
| AI parsing       | **OpenAI STT + Structured Outputs**                      | Transkrip → JSON valid → guardrail              |
| Vault            | **Node server-side crypto dulu**, **Rust service nanti** | Cepat hidup sekarang, tetap ada jalur ke Rust   |
| Deployment       | **Docker Compose di Coolify**                            | Cocok untuk web + db + redis + worker + vault   |
| Domain           | **DuckDNS**                                              | Murah, simpel, cocok buat MVP self-hosted       |

---

## Kenapa saya memilih stack itu

### 1) Jangan jadikan browser sebagai sumber kepercayaan utama

Saat ini SPA-mu masih banyak “bukti” yang hidup di sisi browser. Untuk demo itu bagus; untuk prototype nyata itu belum cukup. Hash chain, commit ledger, dan audit verify sebaiknya dipindah ke **server**, bukan dibiarkan di JS client. Jadi UI tetap teatrikal, tetapi sumber kebenarannya ada di backend.

### 2) `SpeechRecognition` jangan jadi jalur utama

MDN menandai `SpeechRecognition` sebagai **limited availability**, dan pada beberapa browser—termasuk Chrome—recognition bisa memakai engine berbasis server milik browser vendor, sehingga tidak bekerja offline dan perilakunya tidak sepenuhnya konsisten. Sementara `getUserMedia()` tersedia luas tetapi hanya di **secure context** seperti HTTPS/localhost, dan `MediaRecorder` tersedia luas untuk merekam `MediaStream`. Untuk prototype yang benar-benar hidup, saya akan menjadikan alur utama: **mic → `getUserMedia` → `MediaRecorder` → upload `webm` ke backend**, bukan browser speech recognition langsung. ([MDN Web Docs][2])

### 3) OpenAI cocok untuk alur suara → struktur → guardrail

OpenAI Audio API saat ini mendukung endpoint `transcriptions`, dengan model seperti `gpt-4o-mini-transcribe`, `gpt-4o-transcribe`, dan `gpt-4o-transcribe-diarize`; format audio yang didukung mencakup `wav` dan `webm`, dan ukuran unggahan per file saat ini dibatasi **25 MB**. Untuk parsing, Structured Outputs memang dirancang agar output model mengikuti JSON Schema, dan dokumentasi resminya menekankan bahwa **function calling** cocok saat model dihubungkan dengan fungsi atau sistem aplikasi—persis seperti kasus KasAI yang harus memanggil validator ledger, score engine, dan vault logic. OpenAI juga mensyaratkan `additionalProperties: false` saat memakai Structured Outputs pada object schema, jadi kontrak parser-mu bisa dibuat ketat sejak awal. ([OpenAI Platform][3])

### 4) PostgreSQL + Redis itu kombinasi yang pas

Untuk KasAI, data utamamu relasional: transaksi, jurnal, saldo, blok audit, score snapshot, event log. PostgreSQL memang kuat untuk beban relasional yang rumit dan andal untuk penyimpanan data yang lebih serius. Redis pas dipakai sebagai cache atau message broker/queue untuk pekerjaan async seperti transkripsi, scoring ulang, dan audit verify. Coolify juga punya dukungan database untuk **PostgreSQL** dan **Redis**, jadi jalur deploy-nya tidak liar. ([Coolify][4])

---

## Arsitektur yang saya sarankan

### Tahap 1 — **Near full-stack**

Ini yang saya sarankan untuk segera kamu bangun.

```text
Browser (Next.js UI)
   └─ /api/transcribe        -> OpenAI STT
   └─ /api/parse             -> Structured Outputs
   └─ /api/commit            -> PostgreSQL transaction + hash block
   └─ /api/score             -> ACS breakdown
   └─ /api/audit/verify      -> verify chain

PostgreSQL
Redis (opsional awal, wajib nanti)
```

### Tahap 2 — **Lebih full-stack**

Setelah alur inti stabil:

```text
apps/web          -> Next.js UI + route handlers
apps/worker       -> background jobs (BullMQ)
packages/contracts-> Zod schemas
packages/domain   -> ledger rules + ACS logic
services/vault-rs -> Rust microservice (Axum) untuk hashing/verify
postgres
redis
```

### Tahap 3 — **Purist hybrid**

Kalau nanti benar-benar ingin menepati narasi Go+Rust:

* **web** tetap Next.js
* **ledger service** dipindah ke **Go**
* **vault service** dipindah ke **Rust**
* Next.js tinggal jadi UI + BFF

Itu bagus **nanti**, bukan **hari pertama**. Arsitektur yang terlalu heroik di awal biasanya indah di diagram, lalu galak saat jam 2 pagi.

---

## Repo structure yang saya rekomendasikan

```text
kasai/
  apps/
    web/                 # Next.js app
    worker/              # BullMQ worker (optional at first)
  packages/
    contracts/           # zod schemas: transcript, parse result, journal, score, block
    domain/              # ledger rules, score rules, hash helpers
    ui/                  # reusable components if needed
  services/
    vault-rs/            # phase 2
  prisma/
    schema.prisma
  docker/
    nginx/               # optional if custom reverse layer needed later
  docs/
    architecture.md
    prompts.md
    api-contracts.md
  docker-compose.yml
```

---

## Endpoint minimal yang harus kamu hidupkan dulu

| Endpoint                      | Fungsi                                                |
| ----------------------------- | ----------------------------------------------------- |
| `POST /api/transcribe`        | terima audio `webm/wav`, kirim ke OpenAI              |
| `POST /api/parse`             | transcript → schema JSON terstruktur                  |
| `POST /api/commit`            | validasi guardrail, simpan transaksi + jurnal + block |
| `GET /api/ledger/summary`     | saldo kas, beban, prive                               |
| `GET /api/score`              | ACS total + faktor                                    |
| `GET /api/audit/verify`       | verifikasi seluruh chain                              |
| `POST /api/audit/tamper-demo` | hanya untuk demo juri                                 |

---

## Strategi deploy di Coolify + DuckDNS

### Jalur termudah: **satu domain dulu**

Saya akan mulai dengan:

* `https://kasai-demo.duckdns.org`

Dan **semua** request lewat domain itu:

* UI di `/`
* API di `/api/*`

Ini jauh lebih simpel daripada langsung memecah `app.`, `api.`, `vault.` sejak awal. Kamu menghindari CORS, menghindari wildcard SSL complexity, dan lebih cepat hidup.

### Kapan pakai Nixpacks, kapan pakai Docker Compose

Coolify menulis bahwa:

* **Nixpacks** direkomendasikan untuk kebanyakan aplikasi
* **Docker Compose** cocok untuk **multi-service applications**
* untuk deployment Compose, file `docker-compose.yml` menjadi **single source of truth**
* Coolify bisa memberi domain ke service yang perlu publik, dan service yang tidak diberi domain/port tetap hanya hidup di jaringan privat internal Compose. ([Coolify][5])

Jadi strategi saya:

1. **Kalau masih 1 app + route handlers**: bisa mulai dari **Nixpacks**
2. **Saat tambah Postgres + Redis + worker + vault-rs**: pindah ke **Docker Compose**

### Domain DuckDNS

DuckDNS menyediakan dynamic DNS gratis. Dokumentasi resminya menunjukkan URL update berbentuk `https://www.duckdns.org/update?...`, menyarankan `ip=` dikosongkan agar IP publik dideteksi otomatis, dan contoh cron job dijalankan tiap **5 menit**. Jadi jalur praktisnya:

* buat subdomain DuckDNS
* pasang updater di VPS/host
* arahkan domain itu ke server Coolify. ([Duck DNS][6])

### HTTPS dan wildcard

Coolify mengelola HTTPS otomatis saat kamu memasukkan domain `https://...`, dan juga punya konsep **wildcard domain**. Tapi Coolify juga menjelaskan bahwa **catch-all domains** tidak bisa otomatis mendapat SSL certificate; untuk subdomain di bawah satu domain, kamu perlu **wildcard SSL certificate**. Pada sisi Traefik, dokumentasi resmi menyebut **DNS-01 challenge wajib** untuk wildcard certificate generation, dan provider `duckdns` memang didukung lewat `DUCKDNS_TOKEN`. Saya tetap menyarankan mulai dari **satu domain tanpa wildcard**, lalu pindah ke wildcard hanya bila kamu benar-benar butuh `app.`, `api.`, preview deploy, atau multitenancy. Saat eksperimen ACME/wildcard, Traefik juga menyarankan memakai **Let’s Encrypt staging** dulu agar tidak cepat kena rate limit. ([Coolify][7])

### Environment variables di Coolify

Coolify mendukung **shared variables** di level team/project/environment, dan juga punya variabel bawaan seperti `COOLIFY_FQDN` dan `COOLIFY_URL`. Untuk KasAI, saya akan set minimal:

* `OPENAI_API_KEY`
* `DATABASE_URL`
* `REDIS_URL`
* `NODE_ENV`
* `DUCKDNS_TOKEN` *(kalau wildcard/DNS challenge dikerjakan di level proxy atau service terkait)*
  Gunakan shared variables agar staging dan production tidak saling menggigit. ([Coolify][8])

---

## Strategi implementasi supaya prototype ini benar-benar hidup

## Fase 1 — Bekukan kontrak dulu

Sebelum Cursor menulis 500 file yang kamu sendiri tak sempat baca, definisikan kontrak inti:

### `TransactionParseResult`

```ts
{
  rawText: string
  intent: "expense" | "prive" | "unknown"
  amount: number
  currency: "IDR"
  debitAccount: string | null
  creditAccount: string | null
  confidence: number
  needsHumanReview: boolean
  reviewReason: string | null
}
```

### `LedgerCommitResult`

```ts
{
  transactionId: string
  journalLines: [...]
  balances: {...}
  scoreSnapshot: {...}
  block: {...}
}
```

Buat ini dulu di **Zod**, lalu baru suruh IDE AI menghasilkan route handler, service, dan test dari schema tersebut. Dengan Structured Outputs, schema yang tegas adalah rem tanganmu. ([OpenAI Platform][9])

## Fase 2 — Hidupkan backend yang jujur

Urutan server-side yang saya sarankan:

1. **record audio** di browser via `getUserMedia + MediaRecorder`
2. upload ke `POST /api/transcribe`
3. backend panggil OpenAI STT
4. backend panggil parser dengan Structured Outputs
5. validator deterministik cek:

   * saldo kas
   * entity separation
   * akun valid
   * nominal valid
6. commit ke Postgres dalam **satu DB transaction**
7. hitung block hash di server
8. simpan score snapshot
9. return hasil ke UI

Dengan ini, halamanmu bukan cuma simulasi; ia menjadi **client** dari sistem nyata.

## Fase 3 — Tambahkan async worker

Begitu flow dasar jalan, pindahkan proses yang tidak harus sinkron ke worker:

* transkripsi panjang
* re-score historis
* audit re-check
* generate summary lender

Redis cocok dipakai untuk ini, dan Coolify punya dukungan Redis. ([Coolify][10])

## Fase 4 — Extract Rust tanpa drama

Jangan pindahkan semuanya sekaligus. Ekstrak **hanya vault** ke Rust lebih dulu:

* `POST /hash`
* `POST /verify`
* `GET /health`

UI dan backend utama tetap jalan walau vault-rs sempat belum selesai. Itu penting untuk menjaga demo tetap hidup saat integrasi lagi rewel.

---

## Taktik memakai Cursor / IDE AI supaya tidak chaos

### Pakai AI untuk **eksekusi**, bukan untuk **mengganti arsitek**

Cara yang saya sarankan:

1. **Tulis `docs/architecture.md`**

   * boundary tiap service
   * alur request
   * domain model
   * rules guardrail

2. **Tulis `docs/api-contracts.md`**

   * request/response per endpoint
   * contoh success/fail

3. **Tulis `docs/prompts.md`**

   * prompt STT context
   * prompt parser
   * refusal/clarification policy

4. Baru suruh Cursor/agent:

   * generate Prisma schema
   * generate Zod contracts
   * generate route handlers
   * generate test cases
   * generate Docker Compose
   * generate health endpoints

### Aturan emas

Jangan kasih prompt:

> “Build full stack KasAI.”

Kasih prompt:

> “Buat `POST /api/parse` pakai Zod schema ini, kembalikan 422 jika `needsHumanReview=true`, tulis unit test untuk 3 skenario.”

AI IDE bagus untuk **potongan kerja yang batasnya jelas**. Kalau kamu suruh jadi nabi arsitektur, dia bisa khusyuk tetapi tetap menyesatkan.

---

## Stack alternatif kalau kamu ingin lebih “sesuai narasi awal”

Kalau kamu **bersikeras** ingin nuansa Go + Rust terasa sejak awal, ini versi yang masih waras:

| Layer         | Opsi alternatif                  |
| ------------- | -------------------------------- |
| Web           | Next.js + TypeScript             |
| API Gateway   | Next.js Route Handlers atau Hono |
| Ledger Engine | Go (Fiber / Echo)                |
| Vault         | Rust (Axum)                      |
| DB            | PostgreSQL                       |
| Queue         | Redis                            |
| Deploy        | Docker Compose di Coolify        |

Saya hanya menyarankan ini kalau:

* timmu tidak solo,
* ada orang yang nyaman di Go/Rust,
* dan kamu siap bayar “pajak integrasi”.

Kalau tidak, lebih baik **TypeScript dulu, Rust kemudian**.

---

## Rekomendasi final saya

### Stack final yang paling saya sarankan

* **Frontend + BFF:** Next.js + TypeScript + Tailwind
* **ORM:** Prisma
* **DB:** PostgreSQL
* **Queue:** Redis + BullMQ
* **Audio:** `getUserMedia` + `MediaRecorder`
* **AI:** OpenAI Transcriptions + Structured Outputs
* **Vault:** server-side Node crypto sekarang, Rust service nanti
* **Deploy:** Coolify
* **Domain:** DuckDNS, **single domain dulu**

### Kenapa ini yang paling tepat

Karena ini:

* paling cepat menghidupkan prototype
* paling sedikit mengubah SPA yang sudah kamu punya
* paling gampang dibantu Cursor
* paling cocok dengan Coolify
* dan tetap memberi jalur evolusi ke **Go + Rust** tanpa bikin kamu tenggelam di minggu pertama

Saran langkah berikutnya: **mulai dari monorepo Next.js + PostgreSQL + satu endpoint nyata `POST /api/commit-transaction`, lalu pindahkan hash chain dari browser ke server sebelum kamu menyentuh Rust sama sekali.**

[1]: https://nextjs.org/docs/app/getting-started/deploying "https://nextjs.org/docs/app/getting-started/deploying"
[2]: https://developer.mozilla.org/id/docs/Web/API/SpeechRecognition "https://developer.mozilla.org/id/docs/Web/API/SpeechRecognition"
[3]: https://platform.openai.com/docs/guides/speech-to-text?lang=javascript "https://platform.openai.com/docs/guides/speech-to-text?lang=javascript"
[4]: https://coolify.io/docs/databases/postgresql "https://coolify.io/docs/databases/postgresql"
[5]: https://coolify.io/docs/builds/introduction "https://coolify.io/docs/builds/introduction"
[6]: https://www.duckdns.org/ "https://www.duckdns.org/"
[7]: https://coolify.io/docs/knowledge-base/domains "https://coolify.io/docs/knowledge-base/domains"
[8]: https://coolify.io/docs/knowledge-base/environment-variables "https://coolify.io/docs/knowledge-base/environment-variables"
[9]: https://platform.openai.com/docs/guides/structured-outputs?lang=javascript "https://platform.openai.com/docs/guides/structured-outputs?lang=javascript"
[10]: https://coolify.io/docs/databases/redis "https://coolify.io/docs/databases/redis"
