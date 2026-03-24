# invariants.md — KasAI System Invariants

Rules yang tidak boleh dilanggar oleh sistem dalam keadaan apapun.

---

## Accounting
**INV-01** — Setiap commit valid harus menghasilkan jurnal double-entry yang seimbang (`Sum(Debit) = Sum(Kredit)`).

**INV-02** — Snapshot saldo harus konsisten dengan total jurnal (`cashBalance = initialBalance + Σjournal`).

**INV-03** — Guardrail insufficient cash harus menolak transaksi sebelum commit.

**INV-04** — Score harus diturunkan dari data ledger/jurnal yang sama dengan yang tampil di dashboard — tidak ada source of truth ganda.

## AI & Parsing
**INV-05** — Transaksi dengan `intent = "ambiguous"` tidak boleh otomatis di-commit ke ledger.

**INV-06** — AI boleh membantu parsing, tapi tidak boleh mengarang kepastian dari input yang tidak cukup.

## Vault & Audit
**INV-07** — Hanya transaksi valid yang boleh memperpanjang vault chain.

**INV-08** — Perubahan manual pada data finansial tanpa pembaruan hash chain harus terdeteksi sebagai `TAMPERED`.

**INV-09** — Setiap commit valid harus menambah satu `VaultBlock` dengan `prevHash` tersambung deterministik.

## Voice Pipeline
**INV-10** — Kegagalan transcribe atau parse tidak boleh menghasilkan commit parsial (ghost transaction).

**INV-11** — UI tidak boleh menampilkan status sukses sebelum commit dan semua side-effects utama selesai.

## UI & State Machine
**INV-12** — State machine hanya boleh berpindah melalui transisi yang sah — tidak boleh loncat akibat race condition atau timeout.

**INV-13** — Polling audit/dashboard tidak boleh mengubah makna data; hanya menyegarkan tampilan.

## Demo
**INV-14** — Demo reset harus mengembalikan sistem ke baseline yang deterministik dan repeatable.

**INV-15** — `businessId` demo harus konsisten di seluruh layer: query, commit, score, dan audit.
