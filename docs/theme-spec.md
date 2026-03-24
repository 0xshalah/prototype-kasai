# KasAI Theme Spec

## 1. Tujuan

Dokumen ini menetapkan aturan visual resmi untuk KasAI agar:
- konsisten secara brand,
- nyaman dibaca,
- jelas secara hirarki,
- dan tidak lagi mencampur tema terang, gelap, neon, dan teks yang kehilangan kontras.

KasAI menggunakan **satu identitas brand** dengan **tiga konteks visual**:
1. **Homepage / Brosur Interaktif**
2. **UMKM View**
3. **Bank / Auditor View**

---

## 2. Design Principles

### 2.1 Trust first
KasAI adalah produk trust infrastructure. Visual harus terasa:
- rapi,
- stabil,
- akurat,
- dapat dipercaya.

### 2.2 Progressive disclosure
Setiap layar hanya boleh menonjolkan hal yang relevan pada tahap itu.
- Homepage = visi + alasan percaya
- UMKM = aksi + kemudahan
- Bank = bukti + verifikasi

### 2.3 One brand, multiple contexts
UMKM dan Bank boleh berbeda tone, tetapi harus tetap terasa berasal dari produk yang sama.

### 2.4 Clarity over spectacle
Efek visual hanya dipakai bila memperjelas status atau fokus.
Efek visual tidak boleh menjadi isi utama.

### 2.5 Accessibility is not optional
Semua kombinasi teks dan latar wajib menjaga keterbacaan tinggi.
Hindari teks redup di atas latar redup.

---

## 3. Brand Identity

### 3.1 Brand keywords
- Trustworthy
- Structured
- Precise
- Human-centered
- Financially literate
- Technically credible

### 3.2 Brand voice translated into UI
- Tidak playful berlebihan
- Tidak futuristik berlebihan
- Tidak “cyberpunk demo page”
- Tidak korporat dingin tanpa kehangatan

---

## 4. Theme Architecture

## 4.1 Global brand layer
Tetap sama di semua halaman:
- font utama
- radius
- spacing
- border density
- interaction feel
- icon style
- button behavior

## 4.2 Context layer
Berbeda per halaman:

### Homepage
**Theme:** Trust-first dark brochure  
**Goal:** membuat user paham visi dan percaya

### UMKM
**Theme:** Clean light productivity  
**Goal:** membuat user merasa mudah dan aman untuk mencatat transaksi

### Bank / Auditor
**Theme:** Evidence-first dark analytical dashboard  
**Goal:** membuat user percaya sistem dapat diaudit dan diverifikasi

---

## 5. Color Tokens

## 5.1 Brand tokens
Gunakan token ini di seluruh aplikasi.

```css
:root {
  --brand-primary: #4F46E5;   /* Indigo */
  --brand-primary-hover: #4338CA;
  --brand-success: #059669;   /* Emerald */
  --brand-warning: #D97706;   /* Amber */
  --brand-danger: #DC2626;    /* Red */
  --brand-info: #2563EB;      /* Blue */
}
```

---

## 5.2 Homepage tokens

```css
:root,
[data-theme="home"] {
  --bg-page: #0B1220;
  --bg-page-elevated: #111827;
  --bg-card: rgba(15, 23, 42, 0.88);
  --bg-card-muted: #0F172A;
  --border-subtle: #1E293B;
  --border-strong: #334155;

  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --text-on-brand: #FFFFFF;

  --accent-soft: rgba(79, 70, 229, 0.10);
  --accent-glow: rgba(79, 70, 229, 0.22);
}
```

### Karakter homepage

* gelap, tetapi tenang
* premium, tetapi tidak neon-berlebihan
* fokus pada headline dan CTA
* bukan dashboard

---

## 5.3 UMKM tokens

```css
[data-theme="umkm"] {
  --bg-page: #F8FAFC;
  --bg-page-elevated: #F1F5F9;
  --bg-card: #FFFFFF;
  --bg-card-muted: #F8FAFC;
  --border-subtle: #E2E8F0;
  --border-strong: #CBD5E1;

  --text-primary: #0F172A;
  --text-secondary: #334155;
  --text-muted: #64748B;
  --text-on-brand: #FFFFFF;

  --accent-soft: rgba(79, 70, 229, 0.08);
  --accent-glow: rgba(79, 70, 229, 0.14);
}
```

### Karakter UMKM

* terang
* bersih
* action-oriented
* tidak intimidating
* fokus ke input dan feedback

---

## 5.4 Bank / Auditor tokens

```css
[data-theme="bank"] {
  --bg-page: #020617;
  --bg-page-elevated: #0B1220;
  --bg-card: #0F172A;
  --bg-card-muted: #111827;
  --border-subtle: #1E293B;
  --border-strong: #334155;

  --text-primary: #E2E8F0;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --text-on-brand: #FFFFFF;

  --accent-soft: rgba(79, 70, 229, 0.10);
  --accent-glow: rgba(16, 185, 129, 0.16);
}
```

### Karakter bank

* gelap
* analitis
* high signal
* technical but readable
* monospace secukupnya, bukan di semua tempat

---

## 6. Semantic Usage Rules

## 6.1 Text tokens

* `--text-primary` untuk judul, angka utama, body penting
* `--text-secondary` untuk penjelasan sekunder
* `--text-muted` hanya untuk metadata, timestamp, helper text
* `--text-on-brand` untuk teks di tombol primary / elemen berwarna kuat

### Larangan

* Jangan pakai teks muted untuk body paragraph utama
* Jangan pakai teks putih di atas surface terang
* Jangan pakai teks abu-abu tua di atas surface gelap

---

## 6.2 Status colors

* `success` hanya untuk status valid / commit sukses / audit passed
* `warning` hanya untuk ambiguity / review needed / caution
* `danger` hanya untuk insufficient funds / tamper / invalid state
* `info` hanya untuk indikator netral / system info

### Larangan

* Jangan gunakan warna status untuk heading utama
* Jangan gunakan warna danger untuk dekorasi
* Jangan gunakan warna success untuk semua tombol

---

## 6.3 Surfaces

* `bg-page` = background utama halaman
* `bg-card` = kartu utama
* `bg-card-muted` = area nested / panel tambahan
* `border-subtle` = divider biasa
* `border-strong` = fokus / active state / important separator

---

## 7. Typography

## 7.1 Fonts

* Primary UI font: `Inter`
* Technical / evidence font: `JetBrains Mono`

## 7.2 Rules

### Inter dipakai untuk:

* heading
* paragraph
* buttons
* labels
* cards
* CTA

### JetBrains Mono dipakai hanya untuk:

* hash
* canonical payload
* transaction id
* terminal log
* timestamps teknis
* angka teknis khusus

### Larangan

* Jangan gunakan monospace untuk paragraf panjang
* Jangan gunakan monospace untuk hero headline
* Jangan gunakan monospace untuk tombol umum

---

## 8. Type Scale

### Suggested scale

* Hero title: `text-4xl` / `text-5xl`
* Section title: `text-2xl` / `text-3xl`
* Card title: `text-lg` / `text-xl`
* Body: `text-sm` / `text-base`
* Caption/helper: `text-xs`
* Technical metadata: `text-[10px]` / `text-xs` monospace

---

## 9. Component Rules

## 9.1 Buttons

### Primary button

* solid `brand-primary`
* white text
* medium shadow
* hover darkens slightly

### Secondary button

* neutral surface
* visible border
* text-primary or text-secondary depending on theme

### Danger button

* only for tamper/reset/destructive actions

### Larangan

* Jangan lebih dari 1 primary button dominan per section
* Jangan kasih glow besar pada semua tombol

---

## 9.2 Cards

Semua card harus:

* punya surface yang jelas
* punya border halus
* punya padding konsisten
* tidak semua memakai glassmorphism

### Larangan

* Jangan semua card blur
* Jangan campur white card di bank view kecuali very intentional
* Jangan campur slate gelap di UMKM view

---

## 9.3 Alerts / banners

### Success

* latar success soft
* text success
* border success

### Warning

* latar warning soft
* text warning
* border warning

### Error

* latar danger soft
* text danger
* border danger

### Info

* latar neutral/info soft
* text secondary/info

---

## 9.4 Tables

### Bank table

* dark surface
* sticky header
* row hover subtle
* first broken block emphasized
* subsequent invalid blocks faded

### UMKM

* minim tabel bila bisa
* prioritaskan cards dan summary blocks

---

## 9.5 Inputs

### UMKM input

* terang
* border jelas
* fokus ring brand-primary
* placeholder muted tapi tetap terbaca

### Bank filter/search input

* boleh dark
* tetapi text-primary tetap jelas

---

## 10. Allowed Visual Effects

## Allowed

* subtle gradient pada headline atau badge utama
* soft shadow pada CTA utama
* light blur hanya pada hero ornament atau top nav
* fade-in sederhana
* hover elevation ringan
* success/danger glow kecil pada state kritis

## Forbidden

* glow besar di semua card
* badge berkedip terus-menerus
* animasi pulse pada banyak elemen
* gradient text untuk body paragraph
* blur berat di panel utama
* kombinasi neon cyan + neon pink + emerald sekaligus
* glassmorphism sebagai default semua panel

---

## 11. Page-by-Page Rules

## 11.1 Homepage (`/`)

### Tujuan

Membangun trust dan mengantar user ke demo.

### Harus ada

* hero yang jelas
* subheadline yang mudah dipahami
* 2 CTA maksimum
* 3 proof pillars maksimum
* visual tenang

### Tidak boleh

* tampil seperti bank console penuh
* terasa seperti dashboard teknis
* terlalu ramai badge, glow, dan status

### Intensity level

**Medium-Low**

---

## 11.2 UMKM (`/umkm`)

### Tujuan

Membuat tindakan terasa mudah.

### Harus ada

* panel input dominan
* summary cards jelas
* feedback parse/commit jelas
* ambiguity review sangat terbaca

### Tidak boleh

* dark dashboard feel
* terlalu banyak log teknis di layar pertama
* teks kecil berlebihan

### Intensity level

**Low**

---

## 11.3 Bank (`/bank`)

### Tujuan

Membuktikan integritas dan underwriting signal.

### Harus ada

* score jelas
* chain table jelas
* verify banner jelas
* tamper flow jelas

### Tidak boleh

* putih terang bocor ke permukaan utama
* feature card gaya marketing
* glow berlebihan di semua panel

### Intensity level

**Medium**

---

## 12. Accessibility Rules

1. Teks utama harus selalu kontras tinggi terhadap background
2. Teks kecil tidak boleh memakai warna terlalu pudar
3. Badge/status harus tetap terbaca tanpa mengandalkan warna saja
4. Hover/focus states harus jelas
5. Jangan gunakan efek blur yang mengurangi keterbacaan teks
6. Jangan gunakan animasi terus-menerus pada elemen penting

---

## 13. Tailwind Mapping Recommendation

### Utility classes via CSS variables

Gunakan class custom atau config theme yang memetakan ke variable berikut:

* `bg-page`
* `bg-card`
* `bg-card-muted`
* `border-subtle`
* `border-strong`
* `text-primary`
* `text-secondary`
* `text-muted`
* `text-on-brand`

### Contoh CSS utility

```css
.bg-page { background-color: var(--bg-page); }
.bg-card { background-color: var(--bg-card); }
.bg-card-muted { background-color: var(--bg-card-muted); }

.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-on-brand { color: var(--text-on-brand); }

.border-subtle { border-color: var(--border-subtle); }
.border-strong { border-color: var(--border-strong); }
```

---

## 14. Component Audit Checklist

Setiap komponen wajib dicek dengan pertanyaan ini:

* Apakah background memakai token semantik?
* Apakah text utama cukup kontras?
* Apakah text muted masih terbaca?
* Apakah warna status punya makna yang jelas?
* Apakah komponen ini cocok dengan konteks halaman?
* Apakah komponen ini terlalu banyak efek?
* Apakah komponen ini terlihat berasal dari brand yang sama?

---

## 15. Refactor Order

### Phase 1 — global tokens

* layout
* page bg
* text defaults
* card defaults
* button defaults
* input defaults

### Phase 2 — homepage

* hero
* proof cards
* CTA
* remove excessive glow

### Phase 3 — UMKM

* input panel
* banners
* summary cards
* parse/review states

### Phase 4 — Bank

* score card
* breakdown table
* chain table
* verify banner

### Phase 5 — polish

* spacing
* typography
* empty states
* hover/focus states

---

## 16. Final North Star

### Homepage harus terasa:

> “Saya paham mengapa KasAI penting.”

### UMKM page harus terasa:

> “Saya bisa pakai ini tanpa takut.”

### Bank page harus terasa:

> “Saya bisa percaya dan memverifikasi ini.”

Jika salah satu halaman gagal memberikan perasaan itu, theme system harus dianggap belum selesai.
