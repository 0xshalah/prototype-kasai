# tasks.md — KasAI Hardening & Demo Checklist

## Phase 0 — Freeze Demo Contract
- [ ] Bekukan 3 transaksi demo resmi (sudah didraft di spec.md)
- [ ] Bekukan urutan demo dari klik pertama sampai akhir
- [ ] Bekukan baseline reset data demo
- [ ] Pastikan VPS `43.133.142.68:5000` sudah stabil dan terdokumentasi

## Phase 1 — Verification of Claims
### Ledger & Accounting
- [x] Verifikasi `revenue` → jurnal balance (Kas Debit, Pendapatan Kredit)
- [x] Verifikasi `expense` → jurnal balance (Beban Debit, Kas Kredit)
- [x] Verifikasi `prive` → jurnal balance (Prive Debit, Kas Kredit)
- [x] Verifikasi urutan campuran (revenue + expense + prive) → saldo kas konsisten
- [x] Verifikasi snapshot saldo = sum jurnal (INV-02)

### Guardrails
- [x] Verifikasi transaksi ambigu → `needsHumanReview`, tidak auto-commit
- [x] Verifikasi insufficient cash → transaksi ditolak dengan pesan yang jelas
- [x] Verifikasi UI menampilkan error/flag dengan bersih

### Audit & Vault
- [ ] Verifikasi setiap commit valid menambah 1 `VaultBlock`
- [ ] Verifikasi `prevHash` tersambung benar antar block
- [ ] Verifikasi simulasi tamper → audit mendeteksi `TAMPERED`
- [ ] Verifikasi detail block/index rusak ditampilkan di UI

### Score
- [ ] Verifikasi score berubah setelah commit valid
- [ ] Verifikasi score breakdown konsisten dengan ledger
- [ ] Pastikan tidak ada nilai hardcoded yang menyamar sebagai real score

### Voice Pipeline
- [ ] Verifikasi transcribe VPS happy path
- [ ] Verifikasi transcribe VPS gagal/timeout → tidak menghasilkan commit parsial
- [ ] Verifikasi UI menampilkan error yang tepat saat VPS tidak merespons

## Phase 2 — UI/Flow Hardening [x]
### State Machine Integrity
- [x] Verifikasi `IDLE → RECORDING → PROCESSING → CONFIRMING → COMMITTED`
- [x] Cegah *double submit* dengan protection state di `FlowController`
- [x] Implementasikan *AbortController* timeout pada transkripsi & parse
- [x] Pastikan *error recovery* kembali ke state yang aman

### Polling & Visual Stability
- [x] Implementasikan *silent polling* pada `BankEvidencePanel` (no flicker)
- [x] Verifikasi transisi visual Chart & Gauge tetap halus saat data berubah
- [x] Pastikan dashboard refresh otomatis setelah commit berhasil (INV-11)

## Phase 3 — Demo Reliability [x]
- [x] Verifikasi `/api/audit/reset` mengembalikan baseline deterministik
- [x] Pastikan demo bisa diulang 3x berturut-turut tanpa state aneh
- [x] Pastikan app tetap usable setelah skenario tamper dijalankan
- [x] Siapkan fallback jika VPS transcribe gagal (input teks manual)

## Phase 4 — Judge Packaging
- [ ] Tulis script demo 3 menit
- [ ] Tulis script demo 5 menit
- [ ] Siapkan narasi _"problem → solution → proof → impact"_
- [ ] Tandai 3 momen visual utama: voice-to-ledger, score update, shield merah

## Phase 5 — Deployment Readiness
- [x] `.env.example` sudah diaudit
- [x] `docker-compose.yml` sudah dibuat
- [x] Local SQLite tetap jalan
- [x] Path migrasi ke PostgreSQL didokumentasikan
- [ ] Catat dependency VPS sebagai operational risk di decision-log
