# KasAI API Contracts

## 1. Conventions

### Base URL
- Local: `http://localhost:3000`
- Production: `https://<your-domain>`

### Response Envelope
Semua response API mengikuti pola:

#### Success
```json
{
  "success": true,
  "data": {}
}
```

#### Error

```json
{
  "success": false,
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Common Error Codes

* `BAD_REQUEST`
* `VALIDATION_ERROR`
* `NEEDS_HUMAN_REVIEW`
* `INSUFFICIENT_FUNDS`
* `NOT_FOUND`
* `INTERNAL_ERROR`
* `CHAIN_BROKEN`

---

## 2. Shared Schemas

### 2.1 TransactionParseResult

```json
{
  "rawText": "Ambil uang kas 500 ribu",
  "intent": "ambiguous",
  "amount": 500000,
  "currency": "IDR",
  "debitAccount": null,
  "creditAccount": "Kas",
  "confidence": 0.82,
  "needsHumanReview": true,
  "reviewReason": "ENTITY_SEPARATION_AMBIGUOUS"
}
```

### 2.2 LedgerSummary

```json
{
  "cashBalance": 4700000,
  "expenseTotal": 300000,
  "priveTotal": 0
}
```

### 2.3 ScoreSnapshot

```json
{
  "totalScore": 687,
  "factors": [
    {
      "id": "consistency",
      "name": "Konsistensi Pencatatan",
      "delta": 2
    },
    {
      "id": "separation",
      "name": "Disiplin Pemisahan SAK",
      "delta": 3
    },
    {
      "id": "cashflow",
      "name": "Stabilitas Arus Kas",
      "delta": 2
    }
  ]
}
```

### 2.4 VaultBlock

```json
{
  "blockIndex": 1,
  "transactionId": "txn_123",
  "canonicalPayload": "1|TX-001|0000...|Beban Operasional|Kas|300000",
  "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
  "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
}
```

---

## 3. Endpoints

## 3.1 POST /api/transcribe

### Purpose

Menerima file audio dan mengembalikan transcript mentah.

### Request

`multipart/form-data`

Fields:

* `audio` (required): audio file (`webm`, `wav`, etc.)

### Response

```json
{
  "success": true,
  "data": {
    "transcript": "Bayar tagihan listrik ruko tiga ratus ribu rupiah"
  }
}
```

### Errors

* `BAD_REQUEST` if file missing
* `VALIDATION_ERROR` if unsupported format/too large
* `INTERNAL_ERROR`

---

## 3.2 POST /api/parse

### Purpose

Mengubah teks menjadi struktur transaksi terkontrol.

### Request

```json
{
  "rawText": "Bayar tagihan listrik ruko 300 ribu"
}
```

### Response (valid)

```json
{
  "success": true,
  "data": {
    "rawText": "Bayar tagihan listrik ruko 300 ribu",
    "intent": "expense",
    "amount": 300000,
    "currency": "IDR",
    "debitAccount": "Beban Operasional",
    "creditAccount": "Kas",
    "confidence": 0.96,
    "needsHumanReview": false,
    "reviewReason": null
  }
}
```

### Response (needs review)

```json
{
  "success": false,
  "error": {
    "code": "NEEDS_HUMAN_REVIEW",
    "message": "Transaksi ambigu dan memerlukan klarifikasi pengguna",
    "details": {
      "rawText": "Ambil uang kas 500 ribu",
      "intent": "ambiguous",
      "amount": 500000,
      "currency": "IDR",
      "debitAccount": null,
      "creditAccount": "Kas",
      "confidence": 0.82,
      "needsHumanReview": true,
      "reviewReason": "ENTITY_SEPARATION_AMBIGUOUS"
    }
  }
}
```

---

## 3.3 POST /api/commit

### Purpose

Menerima hasil parse yang sudah jelas, menjalankan guardrail, lalu commit ke ledger + score + vault.

### Request

```json
{
  "rawText": "Bayar tagihan listrik ruko 300 ribu",
  "intent": "expense",
  "amount": 300000,
  "currency": "IDR",
  "debitAccount": "Beban Operasional",
  "creditAccount": "Kas",
  "reviewResolution": null
}
```

### Request (after human clarification)

```json
{
  "rawText": "Ambil uang kas 500 ribu",
  "intent": "prive",
  "amount": 500000,
  "currency": "IDR",
  "debitAccount": "Prive Pemilik",
  "creditAccount": "Kas",
  "reviewResolution": "prive"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123",
    "journalEntries": [
      {
        "accountName": "Beban Operasional",
        "entryType": "debit",
        "amount": 300000
      },
      {
        "accountName": "Kas",
        "entryType": "credit",
        "amount": 300000
      }
    ],
    "ledgerSummary": {
      "cashBalance": 4700000,
      "expenseTotal": 300000,
      "priveTotal": 0
    },
    "scoreSnapshot": {
      "totalScore": 687,
      "factors": [
        {
          "id": "consistency",
          "name": "Konsistensi Pencatatan",
          "delta": 2
        },
        {
          "id": "separation",
          "name": "Disiplin Pemisahan SAK",
          "delta": 3
        },
        {
          "id": "cashflow",
          "name": "Stabilitas Arus Kas",
          "delta": 2
        }
      ]
    },
    "vaultBlock": {
      "blockIndex": 1,
      "transactionId": "txn_123",
      "canonicalPayload": "1|TX-001|0000...|Beban Operasional|Kas|300000",
      "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
    }
  }
}
```

### Errors

#### Insufficient funds

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Saldo kas tidak mencukupi",
    "details": {
      "required": 6000000,
      "available": 5000000
    }
  }
}
```

#### Validation error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Akun debit/kredit tidak valid",
    "details": {}
  }
}
```

---

## 3.4 GET /api/ledger/summary

### Purpose

Mengambil ringkasan saldo ledger saat ini.

### Response

```json
{
  "success": true,
  "data": {
    "cashBalance": 4700000,
    "expenseTotal": 300000,
    "priveTotal": 0
  }
}
```

---

## 3.5 GET /api/ledger/journal

### Purpose

Mengambil daftar jurnal terbaru.

### Query Params

* `limit` (optional, default 10)

### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "transactionId": "txn_123",
        "createdAt": "2026-03-23T10:00:00.000Z",
        "entries": [
          {
            "accountName": "Beban Operasional",
            "entryType": "debit",
            "amount": 300000
          },
          {
            "accountName": "Kas",
            "entryType": "credit",
            "amount": 300000
          }
        ]
      }
    ]
  }
}
```

---

## 3.6 GET /api/score

### Purpose

Mengambil snapshot score terbaru.

### Response

```json
{
  "success": true,
  "data": {
    "totalScore": 687,
    "factors": [
      {
        "id": "consistency",
        "name": "Konsistensi Pencatatan",
        "delta": 2
      },
      {
        "id": "separation",
        "name": "Disiplin Pemisahan SAK",
        "delta": 3
      },
      {
        "id": "cashflow",
        "name": "Stabilitas Arus Kas",
        "delta": 2
      }
    ]
  }
}
```

---

## 3.7 GET /api/audit/chain

### Purpose

Mengambil daftar block dalam mini-chain.

### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "blockIndex": 1,
        "transactionId": "txn_123",
        "canonicalPayload": "1|TX-001|0000...|Beban Operasional|Kas|300000",
        "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
        "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
      }
    ]
  }
}
```

---

## 3.8 GET /api/audit/verify

### Purpose

Memverifikasi seluruh rantai hash.

### Response (passed)

```json
{
  "success": true,
  "data": {
    "valid": true,
    "firstBrokenBlock": null,
    "invalidBlocks": []
  }
}
```

### Response (broken)

```json
{
  "success": false,
  "error": {
    "code": "CHAIN_BROKEN",
    "message": "Integritas rantai rusak",
    "details": {
      "valid": false,
      "firstBrokenBlock": 2,
      "invalidBlocks": [2, 3, 4]
    }
  }
}
```

---

## 3.9 POST /api/demo/tamper

### Purpose

Endpoint khusus demo untuk mensimulasikan modifikasi ilegal payload block.

### Request

```json
{
  "targetBlockIndex": 2,
  "mode": "append_amount_digits"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "targetBlockIndex": 2,
    "message": "Payload block berhasil dimodifikasi untuk keperluan demo"
  }
}
```

### Notes

* Endpoint ini hanya aktif di mode demo/development.
* Tidak boleh aktif di production normal.

---

## 3.10 POST /api/system/reset

### Purpose

Reset state sistem untuk demo.

### Request

```json
{}
```

### Response

```json
{
  "success": true,
  "data": {
    "message": "System state reset berhasil"
  }
}
```

### Notes

* Hanya untuk demo/development.

---

## 4. Suggested Zod Contracts

### Parse Request

```ts
const ParseRequestSchema = z.object({
  rawText: z.string().min(1)
})
```

### Parse Response

```ts
const TransactionParseResultSchema = z.object({
  rawText: z.string(),
  intent: z.enum(["expense", "prive", "ambiguous", "unknown"]),
  amount: z.number().int().positive(),
  currency: z.literal("IDR"),
  debitAccount: z.string().nullable(),
  creditAccount: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  needsHumanReview: z.boolean(),
  reviewReason: z.string().nullable()
}).strict()
```

### Commit Request

```ts
const CommitRequestSchema = z.object({
  rawText: z.string(),
  intent: z.enum(["expense", "prive"]),
  amount: z.number().int().positive(),
  currency: z.literal("IDR"),
  debitAccount: z.string(),
  creditAccount: z.string(),
  reviewResolution: z.string().nullable().optional()
}).strict()
```

---

## 5. Contract Rules

1. Semua nominal harus integer Rupiah.
2. Semua object schema harus `strict`.
3. `ambiguous` dan `unknown` tidak boleh di-commit.
4. `prive` harus diarahkan ke akun `Prive Pemilik`.
5. `creditAccount` untuk MVP default adalah `Kas`.
6. Semua response error harus menyertakan `code`.
7. Demo endpoints harus diproteksi environment flag.
