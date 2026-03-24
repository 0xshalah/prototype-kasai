# judge-proof.md — Bukti Teknis untuk Juri

Dokumen ini meringkas mengapa KasAI bukan sekadar prototipe UI, melainkan sistem infrastruktur keuangan yang valid secara teknis. Gunakan poin-poin ini saat sesi tanya jawab (Q&A).

---

## 💎 Apa yang Kami Buktikan (The Core Proofs)

1. **Accounting Integrity:** Transaksi suara/teks dikonversi menjadi jurnal *double-entry* yang seimbang secara otomatis (INV-01). Saldo kas selalu konsisten dengan total debet/kredit.
2. **Deterministic Security:** Setiap transaksi yang dikomit masuk ke dalam **Vault Hash Chain** (Audit Trail). Jika satu byte data di database diubah secara manual, rantai integritas akan rusak dan terdeteksi dalam hitungan detik.
3. **Operational Guardrails:** Sistem menolak pengeluaran jika saldo tidak cukup (*Insufficient Funds*) dan menghentikan proses jika input ambigu (*Ambiguity Detected*).
4. **Data Sovereignty:** Kami tidak bergantung pada API pihak ketiga untuk privasi suara. Transkripsi dilakukan secara lokal melalui **Sovereign AI VPS** berbasis Whisper.cpp.

---

## 📊 Bukti Verifikasi (Evidence Pack)

| Tes | Hasil | Deskripsi |
|---|---|---|
| **Ledger Consistency** | ✅ PASSED | Verifikasi saldo kas konsisten setelah transaksi campuran (Revenue/Expense/Prive). |
| **Guardrail Logic** | ✅ PASSED | Transaksi ambigu dan saldo negatif berhasil diblokir sebelum masuk ke Ledger/Vault. |
| **Tamper Detection** | ✅ PASSED | Audit service mendeteksi manipulasi database secara real-time (Visual Shield: Pass ➔ Fail). |
| **Demo Reliability** | ✅ PASSED | Sistem kembali ke baseline bersih (Deterministic Reset) di setiap siklus demo. |

---

## 💡 Mengapa Ini Penting?

- **UMKM Bankable:** Mengubah data informal menjadi laporan keuangan yang kredibel bagi lembaga keuangan/investor.
- **Sinyal Underwriting Alternatif:** Kecepatan, akurasi, dan integritas data harian memberikan profil risiko yang lebih akurat dibandingkan laporan manual bulanan.
- **Trust-Integrated:** Menghilangkan "Black Box" AI dengan memberikan verifikasi audit yang transparan bagi pemilik dan pihak ketiga.
