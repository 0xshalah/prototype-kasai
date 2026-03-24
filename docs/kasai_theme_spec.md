# KasAI — Theme Specification & Auditing Checklist

## 1. Konsep Utama
KasAI menggunakan **1 identitas brand** dengan **2 mode konteks (context layers)**:
- **Tema UMKM (`data-theme="umkm"`)**: Ringan, ramah, dan terang. Latar belakang putih/abu-abu muda dengan kontras teks yang nyaman (tidak hitam pekat).
- **Tema Bank/Auditor (`data-theme="bank"`)**: Analitis, tegas, dan *high-signal*. Latar belakang gelap kelam (Midnight/Slate pekat) dengan teks terang.

---

## 2. Kumpulan Token (Token Map)

Pengecatan UI wajib menggunakan *CSS Variables* ini yang dikunci di `globals.css` dan diteruskan ke `tailwind.config.ts`. Jangan pernah gunakan warna absolut seperti `bg-white` atau `text-black`.

### Base Brand Tokens (Tidak Berubah antar Tema)
- `--brand-primary`: `#4f46e5` (Indigo 600)
- `--brand-success`: `#10b981` (Emerald 500)
- `--brand-warning`: `#f59e0b` (Amber 500)
- `--brand-danger`: `#f43f5e` (Rose 500)

### Surface & Text Tokens
| Token Name | Light Mode (UMKM) | Dark Mode (Bank) | Deskripsi Penggunaan |
|---|---|---|---|
| `--bg-page` | `#f8fafc` (Slate 50) | `#020617` (Slate 950) | Background body utama |
| `--bg-card` | `#ffffff` (White) | `#0f172a` (Slate 900) | Background komponen panel/kartu |
| `--bg-card-muted`| `#f1f5f9` (Slate 100) | `#111827` (Gray 900) | Panel sekunder / Header tabel |
| `--border-subtle`| `#e2e8f0` (Slate 200) | `#1e293b` (Slate 800) | Garis pembatas ringan |
| `--border-strong`| `#cbd5e1` (Slate 300) | `#334155` (Slate 700) | Border penekanan khusus |
| `--text-primary` | `#0f172a` (Slate 900) | `#f1f5f9` (Slate 100) | Teks heading & paragraf utama |
| `--text-secondary`| `#334155` (Slate 700) | `#cbd5e1` (Slate 300) | Teks penjelas / sub-heading |
| `--text-muted` | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) | Metadata, timestamp, placeholder |
| `--text-on-brand`| `#ffffff` (White) | `#ffffff` (White) | Teks di atas background tombol primari |

---

## 3. Aturan Tipografi
- **Headings & Body**: Sans-serif bersih.
- **Monospace (Font Mono)**: DILARANG dipakai sembarangan. HANYA eksekutif untuk: *Hash SHA-256, Transaction ID, Log Sistem, dan Canonical Payload*.

---

## 4. Component Audit Checklist

Setiap komponen yang ada saat ini harus dilintasi untuk memastikan tidak ada warna bocor (contoh: `bg-white` di mode Bank).

### A. Global & Layout
- [ ] `src/app/layout.tsx` & `src/app/(dashboard)/layout.tsx` -> Harus membungkus page dengan `data-theme`
- [ ] Header Navigation -> Apakah background-nya `bg-card`?

### B. Komponen Tab UMKM
- [ ] `TransactionInputConsole` -> Apakah textareanya pakai `bg-card-muted` dan `border-subtle`?
- [ ] `VoiceRecorder` -> Tombol mic pakai `brand-primary` atau `brand-danger` (saat merekam).
- [ ] `AmbiguityResolver` -> Alert box harus pakai soft variant dari `brand-warning`.
- [ ] `UmkmFlowPanel` -> Background pembungkus pakai `bg-page`?

### C. Komponen Tab Bank/Auditor
- [ ] `ScoreCard` -> Gauge score pakai warna brand dinamis, tapi teks label HARUS `text-muted`.
- [ ] `ScoreBreakdownTable` -> Tabel row hover tidak boleh silau.
- [ ] `VerifyBanner` -> Alert success harus pakai varian `brand-success`.
- [ ] `VaultChainTable` -> Background tabel harus `bg-card`, border `border-subtle`. Mono text untuk field Hash.
- [ ] `LiveFinancePanel` & `LedgerSummaryCards` -> Angka nominal saldo besar menggunakan `text-primary`.

---

## 5. Refactor Order Execution Plan

1. **Prioritas 1: Fondasi CSS & Tailwind**
   - Daftarkan peubah *root* di `src/app/globals.css`.
   - Modifikasi `tailwind.config.ts` untuk memetakan token CSS ke class *Tailwind* semantik (misal: `bg-page`, `text-muted`).
   - Pasang `data-theme="umkm"` di `src/app/(dashboard)/umkm/page.tsx` dan `data-theme="bank"` di `src/app/(dashboard)/bank/page.tsx`.

2. **Prioritas 2: Global Layout & Primitive Elements**
   - Bersihkan pewarnaan *inline* sembarangan di `layout.tsx` (seperti `bg-slate-900` hardcoded).
   - Pastikan teks dasar menggunakan `text-primary` pada struktur luar.

3. **Prioritas 3: Sweep Audit Per Komponen**
   - Periksa satu-persatu sub-komponen `components/` menggunakan fungsi *Search* untuk menyingkirkan `bg-white`, `bg-slate-*`, `text-gray-*`.
   - Implementasikan *utility classes* rancangan baru secara presisi berdasarkan tabel *Surface Tokens*.
