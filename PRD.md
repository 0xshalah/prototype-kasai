# PRD — KasAI

**Versi:** 0.9 Draft
**Status:** Draft kerja untuk submission + build prototype
**Produk:** KasAI — Voice-first accounting & trust infrastructure untuk UMKM
**Kategori:** Hackathon x DIGDAYA 2026 — Penguatan Ketahanan dan Inovasi Keuangan / Pemberdayaan UMKM
**Tanggal:** 23 Maret 2026

---

# 1. Ringkasan Eksekutif

KasAI adalah **asisten akuntansi voice-first** untuk UMKM yang mengubah ucapan transaksi harian menjadi **pencatatan terstruktur yang konsisten dengan SAK EMKM**, menghasilkan **underwriting signal / alternative credit score**, dan menyimpan jejak audit **tamper-evident** untuk meningkatkan kepercayaan lembaga keuangan. Konsep ini relevan dengan fokus resmi PIDI Digdaya x Hackathon 2026 pada **penguatan inovasi keuangan, inklusi keuangan, dan pemberdayaan UMKM**, serta orientasi program pada pengembangan **prototipe yang dapat divalidasi dan diimplementasikan**. ([Bank Indonesia][1])

KasAI memecahkan tiga masalah inti UMKM:

1. pencatatan keuangan masih manual atau tidak ada,
2. keuangan pribadi dan usaha sering bercampur,
3. lembaga keuangan kesulitan membaca kelayakan usaha karena data historis tidak konsisten.
   Bank Indonesia sendiri menyoroti bahwa rendahnya kualitas pencatatan menciptakan **asymmetric information** dan menghambat akses pembiayaan UMKM. SAK EMKM juga secara eksplisit mensyaratkan **pemisahan kekayaan pribadi pemilik** dari kekayaan dan hasil usaha entitas. ([web.iaiglobal.or.id][2])

---

# 2. Latar Belakang & Problem Statement

## 2.1 Masalah yang ingin diselesaikan

Pelaku UMKM, khususnya mikro, sering tidak memiliki waktu, kemampuan akuntansi, atau disiplin administratif untuk melakukan pencatatan keuangan harian. Akibatnya:

* transaksi usaha tidak terdokumentasi dengan baik,
* laporan keuangan sulit disusun,
* kelayakan usaha sulit dibuktikan,
* akses pembiayaan formal menjadi lemah.

SAK EMKM dibuat sederhana justru untuk transaksi umum EMKM dan berbasis biaya historis, tetapi syarat dasarnya tetap penting: entitas harus mampu **memisahkan transaksi bisnis dan transaksi pribadi**. Di lapangan, ini titik gagal paling umum—dan di sinilah KasAI masuk sebagai guardrail, bukan sekadar form input yang lebih cantik. ([web.iaiglobal.or.id][2])

## 2.2 Mengapa sekarang

PIDI Digdaya x Hackathon 2026 membuka ruang untuk solusi yang tidak berhenti di ide, tetapi bergerak ke **prototype, video proof of concept, dan implementasi yang scalable**. Jadi KasAI harus dibangun sebagai **produk yang bisa didemokan**, bukan sekadar deck yang kelihatan mahal. ([Bank Indonesia][3])

---

# 3. Visi Produk

## 3.1 Visi

Menjadi **trust infrastructure layer** bagi UMKM Indonesia dengan cara mengubah ucapan transaksi menjadi data keuangan yang:

* mudah dicatat,
* konsisten dengan prinsip SAK EMKM,
* dapat dipakai untuk sinyal underwriting,
* dan dapat diverifikasi integritasnya.

## 3.2 Positioning

KasAI **bukan** “aplikasi pembukuan biasa”.
KasAI adalah **voice-to-ledger-to-trust pipeline** untuk menjembatani UMKM dengan lembaga keuangan formal.

## 3.3 Value Proposition

* **Untuk UMKM:** pencatatan tanpa mengetik, lebih ringan, lebih manusiawi.
* **Untuk lender/bank:** data transaksi lebih rapi, explainable, dan punya audit evidence.
* **Untuk juri/regulator:** ada guardrail, ada jejak audit, ada jalur implementasi.

---

# 4. Tujuan Produk

## 4.1 Tujuan bisnis

Dalam konteks hackathon, KasAI harus membuktikan bahwa:

1. voice input dapat diubah menjadi ledger entry yang valid,
2. sistem mampu menolak transaksi ambigu atau tidak valid,
3. transaksi yang lolos dapat menghasilkan ringkasan keuangan,
4. riwayat transaksi bisa diverifikasi integritasnya,
5. output memiliki relevansi terhadap underwriting signal.

## 4.2 Tujuan pengguna

Pengguna UMKM dapat:

* mencatat transaksi harian lewat suara atau teks,
* melihat jurnal dan ringkasan kas,
* memahami ketika sistem meminta klarifikasi,
* tidak perlu memahami istilah debit-kredit secara mendalam.

## 4.3 Tujuan teknis

* memindahkan logika inti dari browser ke server,
* menggunakan AI hanya untuk ekstraksi/struktur, bukan sebagai sumber kebenaran final,
* memastikan seluruh commit transaksi melewati validator deterministik,
* menyiapkan deployment yang realistis di Coolify.

---

# 5. Persona

## 5.1 Persona utama — Pemilik UMKM mikro

**Nama contoh:** Bu Rina, pemilik warung kopi kecil
**Karakteristik:** sibuk, non-akuntan, smartphone-first, tidak nyaman mengetik panjang
**Kebutuhan:** catat transaksi cepat, tahu uang masuk/keluar, tidak ribet

## 5.2 Persona sekunder — Kredit analis / bank / fintech lender

**Nama contoh:** Analis KUR cabang
**Karakteristik:** butuh data ringkas, konsisten, dan explainable
**Kebutuhan:** sinyal tambahan untuk menilai kondisi usaha, terutama untuk usaha dengan histori formal terbatas

## 5.3 Persona ketiga — Auditor / mentor / regulator / juri teknis

**Karakteristik:** skeptis terhadap AI
**Kebutuhan:** bukti bahwa sistem tidak asal “halu angka”, punya guardrail, dan jejak audit bisa diverifikasi

---

# 6. Jobs To Be Done

### Untuk UMKM

* “Saat saya selesai transaksi, saya ingin langsung mencatatnya dengan bicara agar saya tidak lupa dan tidak perlu mengetik.”

### Untuk lender

* “Saat saya menilai usaha mikro, saya ingin melihat sinyal operasional yang lebih nyata daripada sekadar asumsi agar keputusan kredit lebih terinformasi.”

### Untuk juri/regulator

* “Saat saya mengevaluasi solusi ini, saya ingin melihat bahwa AI tidak memutuskan seenaknya dan ada pembuktian integritas data.”

---

# 7. Scope Produk

## 7.1 MVP (wajib untuk prototype hidup)

### A. Capture & Parse

* Input teks
* Input suara via browser (`getUserMedia` + `MediaRecorder`)
* Upload audio ke backend
* Transkripsi audio menggunakan OpenAI Audio API
* Parsing transcript ke struktur transaksi dengan Structured Outputs

OpenAI saat ini mendukung endpoint `transcriptions`, termasuk file `wav` dan `webm`, dengan batas unggahan **25 MB** per file. Structured Outputs juga memang dirancang agar respons model patuh pada JSON Schema dan mensyaratkan `additionalProperties: false` untuk object schema. ([OpenAI Platform][4])

### B. Guardrail & Ledger

* Validasi intent transaksi
* Validasi nominal
* Validasi pemisahan entitas (prive vs usaha)
* Validasi saldo kas cukup
* Pembentukan jurnal double-entry sederhana
* Penyimpanan transaksi dan jurnal ke PostgreSQL

### C. Outcome & Explainability

* Saldo kas
* Total beban
* Total prive
* Jurnal terbaru
* ACS total score
* Breakdown faktor skor

### D. Trust Layer

* Pembuatan block hash server-side
* Penyimpanan `prev_hash`, `hash`, `canonical_payload`
* Audit verify seluruh chain
* Demo tamper attack

## 7.2 P1 (setelah MVP stabil)

* worker async untuk proses audio lebih panjang
* lender dashboard lebih kaya
* export laporan PDF
* akun/chart of accounts lebih lengkap
* multi-user / multi-usaha

## 7.3 Di luar scope awal

* integrasi bank/KUR nyata
* status sebagai PKA berizin
* full compliance/regulatory onboarding
* OCR dokumen keuangan
* mobile app native

---

# 8. User Stories

## 8.1 UMKM

* Sebagai pemilik usaha, saya ingin merekam suara transaksi agar bisa langsung tercatat.
* Sebagai pemilik usaha, saya ingin sistem memberi tahu jika transaksi saya ambigu.
* Sebagai pemilik usaha, saya ingin melihat kas tersisa setelah transaksi tercatat.

## 8.2 Lender

* Sebagai analis, saya ingin melihat skor underwriting dan alasan pembentukannya.
* Sebagai analis, saya ingin memverifikasi apakah data historis transaksi pernah dimodifikasi.

## 8.3 Admin/Juri

* Sebagai evaluator, saya ingin memicu simulasi tamper dan melihat audit gagal untuk membuktikan integritas sistem.

---

# 9. Requirement Fungsional

## 9.1 Capture & Transcription

1. Sistem harus menerima audio dari browser.
2. Sistem harus menerima input teks sebagai fallback.
3. Sistem harus menolak file audio di atas batas sistem.
4. Sistem harus menyimpan transcript mentah untuk jejak proses.

## 9.2 Parsing

1. Sistem harus mengubah transcript menjadi objek transaksi terstruktur.
2. Sistem harus menandai transaksi ambigu sebagai `needsHumanReview=true`.
3. Sistem tidak boleh langsung commit transaksi yang ambigu.
4. Sistem harus menyimpan confidence dan alasan review.

## 9.3 Guardrail Akuntansi

1. Sistem harus memeriksa apakah transaksi termasuk usaha atau pribadi.
2. Sistem harus memeriksa apakah kas mencukupi.
3. Sistem harus memetakan akun debit/kredit dari kamus akun yang diizinkan.
4. Sistem harus menolak commit jika aturan gagal.

## 9.4 Ledger

1. Sistem harus menyimpan transaksi ke PostgreSQL.
2. Sistem harus membentuk minimal dua baris jurnal untuk setiap transaksi valid.
3. Sistem harus meng-update saldo kas, total beban, dan total prive.

## 9.5 ACS / Underwriting Signal

1. Sistem harus menghitung skor total dari faktor-faktor yang transparan.
2. Sistem harus menampilkan breakdown faktor.
3. Sistem harus membedakan dampak transaksi operasional vs prive.
4. Sistem harus menyimpan snapshot score per commit.

POJK 29/2024 mendefinisikan PKA sebagai penyelenggara ITSK yang mengolah data selain data kredit/pembiayaan untuk menggambarkan kelayakan, kondisi, atau profil konsumen. Regulasi itu juga menekankan kualitas input, kecukupan metode, transparansi, kewajaran, akuntabilitas, dan larangan menyesatkan. Jadi KasAI pada fase MVP harus diposisikan sebagai **underwriting-support signal**, bukan “mesin keputusan kredit final.” ([Peraturan.ID][5])

## 9.6 Vault / Audit Trail

1. Sistem harus menghitung hash dari canonical payload transaksi.
2. Sistem harus mengaitkan setiap block dengan `prev_hash`.
3. Sistem harus menyediakan endpoint verifikasi rantai.
4. Sistem harus mampu menandai blok rusak dan blok sesudahnya sebagai invalid secara logis saat terjadi tamper.

---

# 10. Requirement Non-Fungsional

## 10.1 Keamanan & Integritas

* Hash chain harus dibuat **server-side**
* Input user harus disanitasi
* seluruh secret disimpan sebagai environment variables
* domain demo harus HTTPS

## 10.2 Reliabilitas

* fallback input teks wajib tersedia
* kegagalan transkripsi tidak boleh merusak ledger
* kegagalan audit tidak boleh menghapus data

## 10.3 Kinerja

* parse transaksi teks: target < 2 detik
* transkripsi audio pendek: target < 8 detik
* verifikasi chain mini: target < 3 detik untuk demo dataset kecil

## 10.4 Observability

* audit log proses
* request ID
* error tracking dasar
* health endpoint untuk web/API/vault

---

# 11. Solusi Teknis yang Direkomendasikan

## 11.1 Arsitektur MVP

* **Frontend + BFF:** Next.js + TypeScript + Tailwind
* **Route/API:** Next.js Route Handlers
* **DB:** PostgreSQL
* **ORM:** Prisma
* **Queue (opsional awal, wajib berikutnya):** Redis + BullMQ
* **AI:** OpenAI Transcriptions + Structured Outputs
* **Vault:** Node server-side crypto dulu, Rust service pada fase berikutnya
* **Deploy:** Coolify
* **Domain:** DuckDNS

Coolify menggunakan container Docker untuk aplikasi dan secara default merekomendasikan **Nixpacks** untuk kebanyakan aplikasi, sementara **Docker Compose** direkomendasikan untuk aplikasi multi-service. Coolify juga menyediakan dukungan resmi untuk **PostgreSQL** dan **Redis**, sehingga jalur deploy untuk arsitektur ini cukup natural. ([Coolify][6])

## 11.2 Strategi deployment

### Tahap awal

* satu domain: `https://kasai-demo.duckdns.org`
* UI dan API di domain yang sama
* DB dan Redis privat di internal network

### Tahap lanjut

* Docker Compose di Coolify untuk `web`, `worker`, `postgres`, `redis`, `vault-rs`

DuckDNS menyediakan API update domain via HTTPS dan contoh cron job yang dijalankan tiap **5 menit** untuk menjaga IP tetap sinkron. ([duckdns.org][7])

---

# 12. Data Model Tingkat Tinggi

## 12.1 Tabel inti

* `businesses`
* `users`
* `transactions`
* `journal_entries`
* `score_snapshots`
* `vault_blocks`
* `audio_uploads`
* `audit_events`

## 12.2 Struktur block

* `id`
* `block_index`
* `transaction_id`
* `canonical_payload`
* `prev_hash`
* `hash`
* `created_at`

## 12.3 Struktur parse result

* `raw_text`
* `intent`
* `amount`
* `debit_account`
* `credit_account`
* `needs_human_review`
* `review_reason`
* `confidence`

---

# 13. KPI & Success Metrics

## 13.1 KPI produk

* % transaksi berhasil di-parse dengan schema valid
* % transaksi yang butuh human review
* median waktu dari input → ledger commit
* % audit chain yang lolos pada data sehat
* jumlah demo skenario yang sukses dijalankan

## 13.2 KPI hackathon

* 1 flow end-to-end hidup
* 1 fail-state ambigu hidup
* 1 fail-state insufficient balance hidup
* 1 tamper simulation hidup
* 1 lender view dengan score breakdown hidup

---

# 14. Acceptance Criteria MVP

## A. Happy path

* User merekam atau mengetik transaksi operasional
* Sistem menghasilkan transcript/teks
* Sistem mem-parse objek transaksi valid
* Sistem commit ke ledger
* Sistem update saldo
* Sistem tambah block hash
* Bank view memperlihatkan score dan block baru

## B. Ambiguity path

* User memasukkan transaksi ambigu
* Sistem menolak auto-commit
* Sistem meminta klarifikasi
* Setelah user memilih `prive` atau `expense`, ledger baru boleh dibuat

## C. Insufficient funds path

* User memasukkan transaksi yang melebihi saldo kas
* Sistem menolak commit
* Tidak ada jurnal baru
* Tidak ada block baru

## D. Tamper path

* User/juri menjalankan simulasi tamper
* Sistem mendeteksi hash mismatch
* Audit banner berubah ke failure
* chain sesudah blok yang rusak ditandai invalid

---

# 15. Risiko Utama

| Risiko                          | Dampak               | Mitigasi                                                                                |
| ------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| Speech API browser tidak stabil | demo gagal           | jadikan `MediaRecorder` + backend transcribe sebagai jalur utama, teks sebagai fallback |
| AI salah ekstrak                | jurnal salah         | Structured Outputs + Zod + guardrail deterministik                                      |
| Scope terlalu besar             | prototype tidak jadi | fokus 1 killer flow + 3 fail-state                                                      |
| Overclaim regulasi              | juri menyerang       | pakai framing “aligned with principles”, bukan “licensed PKA”                           |
| Deploy self-hosted ribet        | demo mepet           | mulai dari single-domain monolith dulu                                                  |

---

# 16. Roadmap Implementasi

## Minggu / Sprint 1

* setup monorepo / Next.js
* Prisma + PostgreSQL
* schema Zod
* endpoint `POST /api/parse`
* endpoint `POST /api/commit`
* UI progressive disclosure

## Sprint 2

* audio upload
* OpenAI transcription
* ACS factor breakdown
* server-side hash chain
* verify endpoint

## Sprint 3

* tamper simulation
* lender view
* Docker Compose
* deploy ke Coolify + DuckDNS
* smoke test end-to-end

---

# 17. Prompting & AI Policy

## 17.1 AI digunakan untuk

* transkripsi audio
* ekstraksi intent transaksi
* normalisasi struktur input

## 17.2 AI tidak digunakan untuk

* langsung menulis ledger tanpa validasi
* menentukan keputusan kredit final
* mengabaikan guardrail saldo/entitas

## 17.3 Prinsip

* AI = parser
* backend = validator
* database = source of truth
* hash chain = evidence layer

---

# 18. Open Questions

1. Apakah akun-akun awal cukup dibatasi ke 10–15 akun inti SAK EMKM?
2. Apakah prototype akan single business dulu atau multi-business?
3. Apakah score ditampilkan sebagai angka 0–100 / 300–850 / readiness tier?
4. Apakah vault akan tetap di Node untuk demo atau dipisah ke Rust sebelum final?
5. Apakah submission hackathon butuh dokumen PRD ringkas 2 halaman turunan dari dokumen ini?

---

# 19. Rekomendasi Keputusan Produk

## Keputusan yang saya sarankan

* **Bangun monolith full-stack dulu**
  Bukan karena saya anti-arsitektur cantik, tapi karena saya pro-prototype yang benar-benar hidup.
* **Jadikan teks fallback sebagai jalur aman**
  Mic itu impresif; fallback itu penyelamat reputasi.
* **Hash chain pindah ke server sekarang**
  Ini garis pemisah antara “simulasi pintar” dan “produk mulai nyata”.
* **Tahan ego microservices dulu**
  Go dan Rust boleh masuk bertahap, jangan masuk bareng sambil bawa koper dan drama.

---

# 20. Referensi inti

* PIDI Digdaya x Hackathon 2026 — problem statement, pendaftaran, prototype path: ([Bank Indonesia][1])
* SAK EMKM — konsep entitas bisnis, kesederhanaan standar, efektif sejak 1 Januari 2018: ([web.iaiglobal.or.id][2])
* POJK 29/2024 — definisi PKA dan prinsip pengolahan data alternatif untuk kredit: ([Peraturan.ID][5])
* OpenAI Speech-to-Text — endpoint transcriptions, model, format audio, batas 25 MB: ([OpenAI Platform][4])
* OpenAI Structured Outputs — kepatuhan JSON schema, `additionalProperties: false`: ([OpenAI Platform][8])
* Coolify — Nixpacks untuk kebanyakan aplikasi, Docker Compose untuk multi-service, dukungan PostgreSQL/Redis, environment variables: ([Coolify][6])
* DuckDNS — API update dan cron pembaruan IP: ([duckdns.org][7])

Saran langkah berikutnya: **ubah PRD ini menjadi 3 turunan kerja sekaligus: `architecture.md`, `api-contracts.md`, dan `milestone-mvp.md`, karena itu format yang paling enak “dimakan” Cursor tanpa membuat repo berubah jadi fanfiction arsitektur.**

[1]: https://www.bi.go.id/id/PIDI/default.aspx?utm_source=chatgpt.com "PIDI: Pusat Inovasi Digital Indonesia untuk Akselerasi Talenta Digital dan Inovasi Nasional"
[2]: https://web.iaiglobal.or.id/SAK-IAI/Tentang%2520SAK%2520EMKM?utm_source=chatgpt.com "Tentang SAK EMKM"
[3]: https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_284926.aspx?utm_source=chatgpt.com "Pusat Inovasi Digital Indonesia (PIDI): Untuk Talenta Muda Penggerak Ekonomi Digital Nasional"
[4]: https://platform.openai.com/docs/guides/speech-to-text?lang=javascript&utm_source=chatgpt.com "Speech to text | OpenAI API"
[5]: https://www.peraturan.go.id/files/peraturan-ojk-no-29-tahun-2024.pdf?utm_source=chatgpt.com "PERATURAN OTORITAS JASA KEUANGAN"
[6]: https://coolify.io/docs/applications/?utm_source=chatgpt.com "Applications | Coolify Docs"
[7]: https://www.duckdns.org/spec.jsp?utm_source=chatgpt.com "Duck DNS - spec"
[8]: https://platform.openai.com/docs/guides/structured-outputs?lang=javascript&utm_source=chatgpt.com "Structured model outputs | OpenAI API"
