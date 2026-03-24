# spec.md — KasAI

## One-liner
Voice-first accounting assistant untuk UMKM Indonesia yang mengubah transaksi harian berbasis suara/teks menjadi pembukuan double-entry terstruktur, dijaga guardrail, dapat diaudit integritasnya, dan menghasilkan sinyal underwriting alternatif.

## Problem
UMKM mikro mencatat keuangan secara informal, tidak konsisten, dan sulit dipercaya oleh lembaga keuangan. Akibatnya, mereka kesulitan membangun histori finansial yang bankable.

## Product Thesis
> KasAI membantu UMKM menjadi lebih bankable dengan mengubah transaksi informal menjadi pembukuan yang lebih rapi, lebih aman, dan lebih dapat dipercaya.

## Core Pillars
1. **Accounting Correctness** — double-entry, SAK EMKM, snapshot konsisten
2. **AI Control & Guardrails** — parsing terstruktur, ambiguitas diblokir
3. **Trust Infrastructure** — vault hash chain, tamper detection
4. **Sovereign AI** — transkripsi via VPS mandiri

## Core Demo Flow
```
IDLE → rekam suara → VPS transcribe → parse → CONFIRMING → commit
     → dashboard update → tamper simulation → audit TAMPERED
```

## Demo Scenarios
### Happy Path
| # | Ucapan | Intent |
|---|--------|--------|
| 1 | "Jualan es teh 50 ribu" | `revenue` |
| 2 | "Bayar tagihan listrik 300 ribu" | `expense` |
| 3 | "Ambil duit buat keperluan pribadi 200 ribu" | `prive` |

### Tamper Scenario
Commit transaksi valid → Klik **Simulasi Tamper** → Nilai berubah di DB tanpa update hash chain → Audit mendeteksi `TAMPERED` → Shield merah + detail block rusak tampil.

## Must-have Features
- Input teks & suara
- Transcription via VPS eksternal
- AI parsing + guardrail ambiguitas
- Guardrail insufficient cash
- Ledger double-entry otomatis
- Dashboard finansial (saldo, expense, prive)
- ACS score + breakdown
- Vault hash chain
- Audit verification + tamper detection
- Demo reset

## Known Risks
- Konsistensi saldo setelah transaksi campuran
- Score gauge bisa kosmetik jika source of truth belum diverifikasi
- Timeout/error dari VPS transcription
- Polling audit dapat menimbulkan flicker

## Non-goals (Hackathon Scope)
- Multi-tenant production
- Auth production-grade
- Integrasi bank/payment rail nyata
- Mobile app native
- Offline penuh
