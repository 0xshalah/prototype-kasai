# KasAI System Invariants

Dokumen ini mendefinisikan aturan ketat (invariants) yang tidak boleh dilanggar oleh sistem KasAI pada tingkat database maupun service layer, khususnya untuk **Ledger** dan **Vault**.

## 1. Ledger Invariants

### 1.1 Zero-Sum Rule
**Definisi:** Untuk setiap transaksi double-entry yang dicatat, total jumlah debit harus sama persis dengan total jumlah kredit.
**Ekspresi:** `Sum(Debit) - Sum(Credit) == 0` per `Transaction`.
**Dampak:** Mencegah penciptaan atau penghilangan uang secara sepihak di luar pencatatan akuntansi yang valid.

### 1.2 Snapshot Consistency
**Definisi:** Nilai saldo pada `BalanceSnapshot` terbaru harus selalu konsisten dan bisa dihitung ulang dari Saldo Awal ditambah dengan penjumlahan seluruh riwayat `JournalEntry`.
**Ekspresi:** `Current BalanceSnapshot == Initial Balance + Sum(Journal Entries)`.
**Dampak:** Mencegah manipulasi saldo secara langsung (direct update) tanpa melalui pembentukan transaksi jurnal yang tercatat.

## 2. Vault Invariants

### 2.1 Sequence Integrity
**Definisi:** Daftar hash block (VaultBlock) harus membentuk rantai kriptografis yang saling terhubung secara berurutan tak terputus.
**Ekspresi:** Setiap `VaultBlock` (n) baru wajib menyimpan hash dari `VaultBlock` sebelumnya (n-1) di kolom `prevHash`.
**Dampak:** Memastikan tidak ada sisipan atau penghapusan transaksi di masa lalu tanpa merusak seluruh perhitungan block sesudahnya (tamper-evident).

### 2.2 Immutability
**Definisi:** Data yang telah dimasukkan dan dikunci oleh hash di dalam `VaultBlock` (dan juga `Transaction` serta `JournalEntry` terkait) bersifat permanen secara logika.
**Ekspresi:** Data `VaultBlock` dan `Transaction` yang telah commit TIDAK BOLEH diubah (UPDATE) atau dihapus (DELETE) melalui API operasional reguler.
**Dampak:** Menghadirkan *audit trail* yang dapat dipercaya oleh pihak eksternal (lender/auditor) karena kekebalannya dari modifikasi.
