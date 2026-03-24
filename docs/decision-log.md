# decision-log.md — KasAI Architecture Decisions

---

## DL-001 — Single-business demo scope
**Status:** Accepted
Gunakan satu `businessId` demo (`biz_demo_001`) yang konsisten di seluruh aplikasi.
> *Why:* Menyederhanakan scope hackathon, mengurangi kompleksitas auth.
> *Trade-off:* Tidak representatif untuk multi-tenant production.

## DL-002 — Prioritas pada demo-critical path
**Status:** Accepted
Urutan prioritas: voice/text input → parse → guardrail → commit → dashboard → score → audit/tamper.
> *Why:* Ini jalur nilai utama produk; semua komponen lain memperkuat jalur ini.
> *Trade-off:* Fitur sekunder bisa tertunda.

## DL-003 — Sovereign VPS untuk transcription
**Status:** Accepted
Gunakan VPS sendiri (`43.133.142.68:5000`) untuk transcription suara, bukan OpenAI Whisper cloud.
> *Why:* Diferensiasi sovereign AI infrastructure untuk juri.
> *Trade-off:* Risiko timeout, latency, dan observability minim.

## DL-004 — Audit layer adalah fitur inti, bukan gimmick visual
**Status:** Accepted
Vault chain dan tamper detection diperlakukan sebagai pilar inti KasAI.
> *Why:* Ini pembeda trust utama; relevan untuk narasi bankability.
> *Trade-off:* Perlu verifikasi ketat agar klaim tetap kredibel.

## DL-005 — Explicit UI state machine
**Status:** Accepted
Flow dimodelkan sebagai state machine eksplisit: `IDLE | RECORDING | PROCESSING | CONFIRMING | COMMITTED`.
> *Why:* Mengurangi chaos async UI, memudahkan reasoning failure mode.
> *Trade-off:* Perlu disiplin pada semua transisi dan error handling.

## DL-006 — Auth production-grade ditunda
**Status:** Accepted
Auth penuh tidak menjadi bagian scope demo.
> *Why:* Fokus pada accounting intelligence dan trust infrastructure.
> *Trade-off:* Persona bank/admin masih demo-simulated.

## DL-007 — SQLite local, PostgreSQL untuk deployment
**Status:** Accepted
Local dev pakai SQLite; path ke PostgreSQL disiapkan di `schema.prisma` dan `docker-compose.yml`.
> *Why:* Iterasi lokal tetap cepat, jalur deploy tetap realistis.
> *Trade-off:* Ada risiko perbedaan perilaku antar environment.

## DL-008 — Demo reset wajib deterministik
**Status:** Accepted
`/api/audit/reset` harus mengembalikan state ke baseline yang sama setiap eksekusi.
> *Why:* Demo harus repeatable; penting untuk presentasi live.
> *Trade-off:* Perlu disiplin pada seed/reset logic dan data isolation.

## DL-009 — Score adalah derived signal, bukan angka dekoratif
**Status:** Accepted
Score harus diturunkan dari data ledger/jurnal yang sama; tidak boleh ada angka statis/hardcoded.
> *Why:* Menjaga integritas narasi underwriting alternatif.
> *Trade-off:* Kalkulasi dan refresh score harus lebih disiplin.

## DL-010 — VPS transcription adalah operational risk
**Status:** Noted
Ketergantungan pada VPS eksternal menambah satu titik kegagalan yang tidak ada di OpenAI path sebelumnya.
> *Mitigasi:* Siapkan fallback demo via input teks manual jika VPS tidak merespons.
