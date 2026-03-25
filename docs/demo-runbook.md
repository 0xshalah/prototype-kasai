# demo-runbook.md — Panduan Presentasi KasAI

Dokumen ini adalah skrip operasional untuk meminimalkan risiko saat melakukan demo *live* di hadapan juri.

---

## 🏗️ Persiapan (1 Menit Sebelum Demo)
1. **Reset State:** Klik tombol "Reset Demo" atau akses `/api/audit/reset`.
   - *Tujuan:* Memastikan saldo kembali ke Rp5.000.000 dan Vault bersih.
2. **Check Reliability:** System now has automatic fallback. If VPS Sovereign AI (`43.133.142.68`) is down, it automatically uses OpenAI Whisper within 8 seconds.
3. **Buka Dua Tab:**
   - Tab 1: Terminal Utama (Input Suara).
   - Tab 2: Konsol Auditor / Bank (Visualisasi Shield & Chart).

---

## 🎬 Skenario Demo Utama (3-5 Menit)

### Langkah 1: Perekaman Suara (The "Wow" Moment)
- **Aksi:** Klik "Mulai Rekam" dan katakan: *"Jualan gado-gado seratus lima puluh ribu."*
- **Narasi:** *"KasAI menangkap bahasa alami UMKM. Kami memprioritaskan transkripsi lokal via **Sovereign AI VPS** untuk privasi, namun sistem dilengkapi **Automatic Fallback** ke OpenAI Whisper jika peladen lokal mengalami kendala, menjamin kelancaran operasional 24/7."*
- **Poin Visual:** Teks hasil transkripsi muncul ➔ State pindah ke `CONFIRMING`.

### Langkah 2: Verifikasi & Commit
- **Aksi:** Tampilkan panel review. Klik "Simpan Transaksi".
- **Narasi:** *"Sistem secara otomatis memproses jurnal double-entry sesuai SAK EMKM. Pendapatan diakui, kas bertambah secara atomik."*
- **Poin Visual:** Animasi sukses ➔ Dashboard Refresh ➔ Saldo naik.

### Langkah 3: Guardrail Check (The "Safety" Moment)
- **Aksi:** Ketik atau katakan: *"Ambil uang kas dua ratus ribu."*
- **Narasi:** *"Di sini sistem mendeteksi ambiguitas. Apakah ini untuk pribadi (Prive) atau usaha? AI kami tidak menebak; ia bertanya."*
- **Poin Visual:** Label `NEEDS_HUMAN_REVIEW` muncul. Pilih "Pribadi (Prive)" lalu Commit.

### Langkah 4: Bukti Integritas (The "Trust" Moment)
- **Aksi:** Pindah ke Tab Konsol Auditor.
- **Narasi:** *"Semua data dilindungi Vault Hash Chain. Shield hijau ini membuktikan bahwa dari awal sampai sekarang, rantai integritas belum terputus."*

### Langkah 5: Simulasi Tamper (The "Closer")
- **Aksi:** Klik tombol **"Simulasi Serangan/Tamper"**.
- **Narasi:** *"Bagaimana jika ada peretas atau admin nakal mengubah nilai di database? Sistem kami melakukan polling audit setiap 10 detik."*
- **Poin Visual:** Tunggu 1-10 detik ➔ **SHIELD BERUBAH MERAH BERKEDIP**.
- **Closing:** *"Inilah KasAI. Bukan sekadar pencatatan, tapi Trust Infrastructure untuk UMKM bankable."*

---

## 5. Produksi & Hardening (Final Phase)

✅ **Production Build Clearance:**
- Seluruh *warning* dan *error* ESLint (`no-explicit-any`, `no-sync-scripts`, `no-unused-vars`) telah dibersihkan secara sistemik.
- Build produksi melalui `npm run build` kini menghasilkan status **Success (Exit 0)**, siap untuk *deployment* di Vercel atau infrastruktur berbasis Node.js lainnya.

✅ **Theme & Runtime Reliability:**
- Memperbaiki *race condition* pada konfigurasi Tailwind CDN dengan strategi pemuatan skrip yang presisi (`beforeInteractive` untuk konfigurasi, disinkronkan dengan pemuatan font).
- Mengimplementasikan **Automatic Voice Fallback**: Sistem mencoba menghubungi *Sovereign VPS* terlebih dahulu (batas waktu 8 detik), jika gagal, secara otomatis beralih ke *OpenAI Whisper API*.

---

Aplikasi **KasAI** sekarang berada pada performa puncak, sangat aman secara matematis, memiliki sistem pemulihan kegagalan (*failover*) transkripsi yang cerdas, dan siap untuk dipresentasikan di hadapan juri dengan tingkat kepercayaan diri tinggi.

---

## ⚠️ Kontingensi (Jika Sesuatu Salah)

| Masalah | Solusi Cepat |
|---|---|
| VPS Transcribe Lambat (>8s) | Sistem akan otomatis beralih ke OpenAI Whisper. Jika masih lambat, ketik manual. |
| Saldo tidak update | Klik logo KasAI untuk memaksa refresh halaman total. |
| Shield tidak berubah merah | Klik tombol "Audit Integritas" secara manual di panel samping. |
| Suara tidak terdeteksi | Pastikan izin microphone browser aktif. Jika gagal 2x, beralih ke teks. |
