# 🚀 Panduan Menjalankan Proyek KasAI (Clean Architecture Refactor)

Agar proyek ini berjalan dengan mulus di sistem lokal Anda, ikuti langkah-langkah berikut:

## 1. Konfigurasi Environment (`.env`)
Pastikan file `.env` di direktori root sudah terisi dengan benar. Proyek ini dikonfigurasi menggunakan **PostgreSQL** sebagai Database Utama.

**Isi file `.env` minimal:**
```env
# Koneksi String PostgreSQL (Ganti sesuai DB lokal/hosting Anda)
DATABASE_URL="postgresql://postgres:password@localhost:5432/kasai_db?schema=public"

# Sertakan OPENAI_API_KEY jika ingin mencoba transkripsi suara nyata (Whisper)
OPENAI_API_KEY="sk-..."

# Set ke "true" untuk simulasi demo tanpa kuota OpenAI & Mengaktifkan fitur Tampering
DEMO_MODE="true"

# ID Bisnis Default untuk seeding
DEMO_BUSINESS_ID="biz_demo_001"
```

---

## 2. Inisialisasi Database (Prisma)
Jangan lupa menjalankan perintah sinkronisasi skema dan **Seeding** agar sistem memiliki *Genesis Block* (Blok 0) dan saldo kas awal sebesar Rp 5.000.000.

```bash
# Instalasi library
npm install

# Sinkronisasi Skema Database (Push)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Jalankan Seeding (PENTING!)
npx prisma db seed
```

---

## 3. Menjalankan Server
Setelah database siap, nyalakan server pengembangan:

```bash
npm run dev
```

Akses aplikasi di: **`http://localhost:3000`**

---

## 💡 Strategi Demo yang Meyakinkan (User Story)

### A. Alur Input UMKM (Tab: Input Experience)
1. **Perekaman Suara**: Klik tombol Mikrofon, bicara *"Beli bahan baku ayam 1 juta"* atau *"Bayar listrik ruko 300 ribu"*. Klik Stop.
2. **Klarifikasi Otomatis**: Ketik *"Ambil uang kas 200 ribu"*. Sistem akan melempar status `AMBIGUOUS`. Klik tombol **"Untuk Usaha"** atau **"Untuk Pribadi"** di panel klarifikasi.
3. **Guardrail Saldo**: Coba buat transaksi pengeluaran sebesar Rp 10.000.000. Sistem akan memblokir dengan pesan `"Insufficient Funds"` karena saldo awal hanya Rp 5juta.

### B. Bukti Audit (Tab: Outcome & Trust)
1. **Live Finance**: Lihat saldo Kas, Beban, dan Prive terupdate secara *real-time* setelah Commit.
2. **Vault Verification**: Klik tombol **"Jalankan Audit Vault Chain"**. Semua baris blok akan berwarna hijau dengan status "Valid".
3. **Simulasi Serangan (TAMPER)**: Klik tombol merah **"Mode Hacker: Manipulasi DB"**. Ini akan mengubah nominal satu transaksi secara paksa di database.
4. **Deteksi Instan**: Jalankan audit kembali. Sistem akan menandai baris yang dirusak dengan warna merah menyala dan menjelaskan bahwa data relasional tidak cocok dengan bukti digital SHA-256.

---

### Troubleshooting
- **Mikrofon Tidak Jalan?** Pastikan browser memberikan izin akses mikrofon untuk `localhost`.
- **Error Database?** Pastikan layanan PostgreSQL Anda menyala dan kredensial di `.env` sudah tepat.
- **Data Kosong?** Pastikan Anda sudah menjalankan `npx prisma db seed` agar ada Genesis Block awal.
