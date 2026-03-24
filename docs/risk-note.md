# risk-note.md — Catatan Risiko & Mitigasi Internal

Wajib dibaca dan diperiksa 5 menit sebelum demo dimulai.

---

## 🚨 Critical Checkpoints

1. **Environment:** Pastikan `.env` memiliki `DEMO_MODE="true"`. Tanpa ini, tombol **Simulasi Tamper** akan ditolak oleh server (403 Forbidden).
2. **Sovereign AI VPS:** Pastikan VPS `43.133.142.68` aktif. Jika *ping* lambat, beralih ke input teks manual di dashboard. Jangan memaksakan demo suara jika suara tidak muncul dalam 10 detik.
3. **Reset Baseline:** Selalu jalankan `/api/audit/reset` sebelum memulai sesi demo baru di depan juri baru. Pastikan saldo kembali ke **Rp5.000.000**.
4. **Shield Polling:** Polling audit adalah 10 detik. Jika Anda menunjukkan manipulasi (Tamper), beri jeda waktu atau klik tombol **"Audit Integritas"** secara manual untuk respons instan.

---

## 🛠️ Fallback Strategies

| Masalah | Aksi Mitigasi |
|---|---|
| Suara tidak ter-transcribe | Klik ikon Keyboard di UI, ketik manual, klik "Proses Teks". |
| Database Error | Jalankan `npx prisma db push` untuk mereset skema (Hanya jika `/api/audit/reset` gagal total). |
| Chart tidak muncul | Refresh halaman (F5). Data ledger tetap aman di database. |
| VPS Down | Ubah `AI_PROVIDER` di `.env` menjadi `openai` (membutuhkan internet ke API OpenAI). |

---

## 📌 Pengingat Narasi
- Jangan terlalu teknis di awal, fokus pada **Value**.
- "Sovereign AI" adalah kata kunci penting (Kedaulatan Data).
- "SAK EMKM" adalah standar industri yang kami ikuti.
- "Vault / Audit Trail" adalah pembeda kami dari aplikasi kasir biasa.
