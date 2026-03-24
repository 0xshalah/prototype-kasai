Berikut versi awal yang langsung bisa kamu pakai.

---

# Struktur folder repo

```text
kasai/
├─ apps/
│  └─ web/
│     ├─ app/
│     │  ├─ (dashboard)/
│     │  │  ├─ page.tsx
│     │  │  ├─ umkm/
│     │  │  │  └─ page.tsx
│     │  │  └─ bank/
│     │  │     └─ page.tsx
│     │  ├─ api/
│     │  │  ├─ transcribe/
│     │  │  │  └─ route.ts
│     │  │  ├─ parse/
│     │  │  │  └─ route.ts
│     │  │  ├─ commit/
│     │  │  │  └─ route.ts
│     │  │  ├─ ledger/
│     │  │  │  ├─ summary/
│     │  │  │  │  └─ route.ts
│     │  │  │  └─ journal/
│     │  │  │     └─ route.ts
│     │  │  ├─ score/
│     │  │  │  └─ route.ts
│     │  │  ├─ audit/
│     │  │  │  ├─ chain/
│     │  │  │  │  └─ route.ts
│     │  │  │  └─ verify/
│     │  │  │     └─ route.ts
│     │  │  ├─ demo/
│     │  │  │  ├─ tamper/
│     │  │  │  │  └─ route.ts
│     │  │  │  └─ reset/
│     │  │  │     └─ route.ts
│     │  │  └─ health/
│     │  │     └─ route.ts
│     │  ├─ globals.css
│     │  ├─ layout.tsx
│     │  └─ page.tsx
│     ├─ components/
│     │  ├─ input/
│     │  │  ├─ InputPanel.tsx
│     │  │  ├─ MockScenarioButtons.tsx
│     │  │  └─ VoiceRecorder.tsx
│     │  ├─ engine/
│     │  │  ├─ EngineLog.tsx
│     │  │  └─ GuardrailPanel.tsx
│     │  ├─ ledger/
│     │  │  ├─ JournalList.tsx
│     │  │  ├─ LedgerSummaryCards.tsx
│     │  │  └─ TransactionResultCard.tsx
│     │  ├─ bank/
│     │  │  ├─ ScoreCard.tsx
│     │  │  ├─ ScoreBreakdownTable.tsx
│     │  │  ├─ VaultChainTable.tsx
│     │  │  └─ VerifyBanner.tsx
│     │  └─ shared/
│     │     ├─ Header.tsx
│     │     ├─ TabSwitcher.tsx
│     │     ├─ SectionReveal.tsx
│     │     └─ EmptyState.tsx
│     ├─ lib/
│     │  ├─ db.ts
│     │  ├─ env.ts
│     │  ├─ api-response.ts
│     │  ├─ errors.ts
│     │  └─ logger.ts
│     ├─ server/
│     │  ├─ services/
│     │  │  ├─ parser.service.ts
│     │  │  ├─ guardrail.service.ts
│     │  │  ├─ ledger.service.ts
│     │  │  ├─ score.service.ts
│     │  │  ├─ vault.service.ts
│     │  │  ├─ transcribe.service.ts
│     │  │  └─ audit.service.ts
│     │  ├─ repositories/
│     │  │  ├─ business.repository.ts
│     │  │  ├─ transaction.repository.ts
│     │  │  ├─ journal.repository.ts
│     │  │  ├─ score.repository.ts
│     │  │  ├─ vault.repository.ts
│     │  │  └─ audit.repository.ts
│     │  ├─ domain/
│     │  │  ├─ accounts.ts
│     │  │  ├─ score-rules.ts
│     │  │  ├─ canonical-payload.ts
│     │  │  ├─ guardrail-rules.ts
│     │  │  └─ demo-seeds.ts
│     │  └─ mappers/
│     │     ├─ parse.mapper.ts
│     │     └─ ledger.mapper.ts
│     ├─ hooks/
│     │  ├─ useEngineLog.ts
│     │  ├─ useProgressiveDisclosure.ts
│     │  └─ useVoiceRecorder.ts
│     ├─ types/
│     │  └─ ui.ts
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ next.config.ts
├─ packages/
│  ├─ contracts/
│  │  ├─ src/
│  │  │  ├─ api/
│  │  │  │  ├─ common.ts
│  │  │  │  ├─ parse.ts
│  │  │  │  ├─ commit.ts
│  │  │  │  ├─ ledger.ts
│  │  │  │  ├─ score.ts
│  │  │  │  ├─ audit.ts
│  │  │  │  └─ demo.ts
│  │  │  ├─ domain/
│  │  │  │  ├─ transaction.ts
│  │  │  │  ├─ journal.ts
│  │  │  │  ├─ score.ts
│  │  │  │  └─ vault.ts
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ config/
│     ├─ eslint/
│     ├─ typescript/
│     └─ package.json
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.ts
│  └─ migrations/
├─ docs/
│  ├─ architecture.md
│  ├─ api-contracts.md
│  └─ milestone-mvp.md
├─ docker/
│  └─ web.Dockerfile
├─ .env.example
├─ .gitignore
├─ docker-compose.yml
├─ package.json
├─ pnpm-workspace.yaml
└─ README.md
```

---

# Kenapa struktur ini cocok

## Prinsipnya

* `apps/web`: semua hal yang benar-benar dieksekusi app web
* `packages/contracts`: schema Zod yang dipakai frontend + backend
* `server/services`: logika inti, supaya route handler tetap tipis
* `prisma`: single source of truth untuk data model
* `docs`: dokumen yang jadi sumber perintah untuk Cursor

## Yang penting jangan dicampur

Jangan taruh:

* logic score,
* logic guardrail,
* dan logic vault

langsung di route handler.
Kalau begitu, repo akan cepat berubah menjadi museum callback.

---

# `schema.prisma`

Ini versi MVP yang konsisten dengan PRD, kontrak API, dan alur demo.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TransactionStatus {
  PENDING_REVIEW
  COMMITTED
  REJECTED
}

enum ReviewReason {
  ENTITY_SEPARATION_AMBIGUOUS
  INSUFFICIENT_FUNDS
  INVALID_ACCOUNT_MAPPING
  INVALID_AMOUNT
  UNKNOWN_INTENT
}

enum EntryType {
  DEBIT
  CREDIT
}

enum AuditEventType {
  VERIFY_PASSED
  VERIFY_FAILED
  TAMPER_SIMULATED
  SYSTEM_RESET
}

model Business {
  id            String          @id @default(cuid())
  name          String
  currency      String          @default("IDR")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  users         User[]
  transactions  Transaction[]
  scoreSnapshots ScoreSnapshot[]
  vaultBlocks   VaultBlock[]
  balanceSnapshot BalanceSnapshot?

  @@map("businesses")
}

model User {
  id          String    @id @default(cuid())
  businessId  String
  name        String
  email       String?   @unique
  role        String    @default("owner")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId])
  @@map("users")
}

model Transaction {
  id                String             @id @default(cuid())
  businessId        String
  rawText           String
  parsedIntent      String
  amount            Int
  currency          String             @default("IDR")
  debitAccount      String?
  creditAccount     String?
  confidence        Decimal?           @db.Decimal(4, 3)
  needsHumanReview  Boolean            @default(false)
  reviewReason      ReviewReason?
  reviewResolution  String?
  status            TransactionStatus  @default(PENDING_REVIEW)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  business          Business           @relation(fields: [businessId], references: [id], onDelete: Cascade)
  journalEntries    JournalEntry[]
  scoreSnapshot     ScoreSnapshot?
  vaultBlock        VaultBlock?
  audioUpload       AudioUpload?

  @@index([businessId, createdAt])
  @@index([status])
  @@map("transactions")
}

model JournalEntry {
  id             String      @id @default(cuid())
  transactionId  String
  accountName    String
  entryType      EntryType
  amount         Int
  createdAt      DateTime    @default(now())

  transaction    Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@index([transactionId])
  @@map("journal_entries")
}

model BalanceSnapshot {
  id            String    @id @default(cuid())
  businessId    String    @unique
  cashBalance   Int       @default(0)
  expenseTotal  Int       @default(0)
  priveTotal    Int       @default(0)
  updatedAt     DateTime  @updatedAt
  createdAt     DateTime  @default(now())

  business      Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@map("balance_snapshots")
}

model ScoreSnapshot {
  id                   String      @id @default(cuid())
  businessId           String
  transactionId        String      @unique
  totalScore           Int
  factorConsistency    Int         @default(0)
  factorSeparation     Int         @default(0)
  factorCashflow       Int         @default(0)
  createdAt            DateTime    @default(now())

  business             Business    @relation(fields: [businessId], references: [id], onDelete: Cascade)
  transaction          Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@index([businessId, createdAt])
  @@map("score_snapshots")
}

model VaultBlock {
  id                String      @id @default(cuid())
  businessId        String
  transactionId     String      @unique
  blockIndex        Int
  canonicalPayload  String
  prevHash          String
  hash              String
  createdAt         DateTime    @default(now())

  business          Business    @relation(fields: [businessId], references: [id], onDelete: Cascade)
  transaction       Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@unique([businessId, blockIndex])
  @@index([businessId, createdAt])
  @@map("vault_blocks")
}

model AudioUpload {
  id             String      @id @default(cuid())
  transactionId  String      @unique
  mimeType       String
  fileName       String?
  storagePath    String?
  transcriptText String?
  createdAt      DateTime    @default(now())

  transaction    Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@map("audio_uploads")
}

model AuditEvent {
  id                String         @id @default(cuid())
  businessId        String
  eventType         AuditEventType
  targetBlockIndex  Int?
  message           String
  metadata          Json?
  createdAt         DateTime       @default(now())

  business          Business       @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId, createdAt])
  @@index([eventType])
  @@map("audit_events")
}
```

---

# Catatan desain schema

## 1. Kenapa `BalanceSnapshot` dibuat satu per `Business`

Karena untuk MVP:

* yang kamu butuhkan adalah **read model cepat**
* bukan rekonstruksi saldo dari nol di setiap render

Nanti kalau mau lebih “accounting hardcore”, kamu bisa tambah:

* account balances per akun
* period closing
* trial balance

Tapi untuk hackathon, itu overkill.

## 2. Kenapa `ScoreSnapshot` per transaksi

Karena kamu butuh:

* jejak perubahan score setelah tiap commit
* lender view yang explainable
* demo “naik/turun karena transaksi ini”

## 3. Kenapa `VaultBlock` pakai `blockIndex`

Karena untuk audit chain:

* urutan harus eksplisit
* jangan mengandalkan `createdAt` sebagai satu-satunya ordering

Waktu bisa bohong, `blockIndex` lebih jujur.

## 4. Kenapa `reviewResolution` disimpan

Supaya pada transaksi ambigu kamu punya jejak:

* AI awalnya bingung
* user memilih klasifikasi tertentu
* commit terjadi setelah intervensi

Itu bagus untuk pembuktian guardrail ke juri.

---

# `.env.example`

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kasai
OPENAI_API_KEY=your_openai_api_key_here
REDIS_URL=redis://localhost:6379
APP_BASE_URL=http://localhost:3000
DEMO_MODE=true
```

---

# `prisma/seed.ts` yang saya sarankan

Versi awal cukup seed:

* 1 business
* 1 owner
* 1 balance snapshot dengan kas awal Rp5.000.000

Contoh minimal:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.upsert({
    where: { id: "biz_demo_kasai" },
    update: {},
    create: {
      id: "biz_demo_kasai",
      name: "KasAI Demo UMKM",
      currency: "IDR",
      users: {
        create: {
          name: "Demo Owner",
          email: "owner@kasai.local",
          role: "owner",
        },
      },
      balanceSnapshot: {
        create: {
          cashBalance: 5_000_000,
          expenseTotal: 0,
          priveTotal: 0,
        },
      },
    },
    include: {
      users: true,
      balanceSnapshot: true,
    },
  });

  console.log("Seeded business:", business.name);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

---

# Urutan implementasi terbaik setelah ini

## Step 1

Buat file:

* `prisma/schema.prisma`
* `prisma/seed.ts`

## Step 2

Generate Prisma client dan migrate:

```bash
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

## Step 3

Suruh Cursor bikin repository layer dulu:

* `transaction.repository.ts`
* `journal.repository.ts`
* `score.repository.ts`
* `vault.repository.ts`

## Step 4

Baru lanjut ke service:

* `guardrail.service.ts`
* `ledger.service.ts`
* `vault.service.ts`

---

# Prompt Cursor yang paling pas setelah ini

```text
Read docs/architecture.md and docs/api-contracts.md.
Use prisma/schema.prisma as source of truth.
Generate:
- lib/db.ts
- server/repositories/transaction.repository.ts
- server/repositories/journal.repository.ts
- server/repositories/score.repository.ts
- server/repositories/vault.repository.ts

Requirements:
- TypeScript
- Prisma Client
- no auth yet
- repository methods should be small and focused
- do not implement route handlers yet
```

Lalu setelah itu:

```text
Read docs/architecture.md and docs/api-contracts.md.
Implement guardrail.service.ts, ledger.service.ts, score.service.ts, and vault.service.ts.
Use repositories instead of raw Prisma inside services.
Do not touch UI.
```

---

# Satu saran penting

Sebelum kamu minta Cursor bikin semua sekaligus, **commit dulu schema + docs + seed**.
Karena begitu AI IDE mulai “berkreasi”, punya titik balik yang bersih itu jauh lebih berharga daripada motivasi semata.

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan isi awal `transaction.repository.ts`, `guardrail.service.ts`, dan `POST /api/commit/route.ts` agar alur happy-path kamu langsung hidup.**

Berikut isi awal yang langsung bisa kamu pakai untuk **happy-path commit**.

Saya buat dengan asumsi:

* stack: **Next.js App Router + Prisma + Zod**
* path repo sesuai struktur sebelumnya
* belum ada auth
* `businessId` sementara di-hardcode ke seed demo: `biz_demo_kasai`

Saya sertakan 5 file supaya rantainya benar-benar nyambung:

1. `apps/web/lib/db.ts`
2. `apps/web/server/repositories/transaction.repository.ts`
3. `apps/web/server/services/guardrail.service.ts`
4. `apps/web/server/services/score.service.ts`
5. `apps/web/server/services/vault.service.ts`
6. `apps/web/server/services/ledger.service.ts`
7. `apps/web/app/api/commit/route.ts`

---

## 1) `apps/web/lib/db.ts`

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

---

## 2) `apps/web/server/repositories/transaction.repository.ts`

```ts
import type { Prisma, PrismaClient } from "@prisma/client";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  async createTransaction(input: {
    businessId: string;
    rawText: string;
    parsedIntent: string;
    amount: number;
    currency: string;
    debitAccount: string;
    creditAccount: string;
    confidence?: number | null;
    needsHumanReview?: boolean;
    reviewReason?: string | null;
    reviewResolution?: string | null;
    status?: "COMMITTED" | "PENDING_REVIEW" | "REJECTED";
  }) {
    return this.prisma.transaction.create({
      data: {
        businessId: input.businessId,
        rawText: input.rawText,
        parsedIntent: input.parsedIntent,
        amount: input.amount,
        currency: input.currency,
        debitAccount: input.debitAccount,
        creditAccount: input.creditAccount,
        confidence: input.confidence ?? null,
        needsHumanReview: input.needsHumanReview ?? false,
        reviewReason: input.reviewReason as any,
        reviewResolution: input.reviewResolution ?? null,
        status: (input.status ?? "COMMITTED") as any,
      },
    });
  }

  async createJournalEntries(input: {
    transactionId: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
  }) {
    return this.prisma.journalEntry.createMany({
      data: [
        {
          transactionId: input.transactionId,
          accountName: input.debitAccount,
          entryType: "DEBIT",
          amount: input.amount,
        },
        {
          transactionId: input.transactionId,
          accountName: input.creditAccount,
          entryType: "CREDIT",
          amount: input.amount,
        },
      ],
    });
  }

  async getBalanceSnapshot(businessId: string) {
    return this.prisma.balanceSnapshot.findUnique({
      where: { businessId },
    });
  }

  async upsertBalanceSnapshot(input: {
    businessId: string;
    cashBalance: number;
    expenseTotal: number;
    priveTotal: number;
  }) {
    return this.prisma.balanceSnapshot.upsert({
      where: { businessId: input.businessId },
      update: {
        cashBalance: input.cashBalance,
        expenseTotal: input.expenseTotal,
        priveTotal: input.priveTotal,
      },
      create: {
        businessId: input.businessId,
        cashBalance: input.cashBalance,
        expenseTotal: input.expenseTotal,
        priveTotal: input.priveTotal,
      },
    });
  }

  async createScoreSnapshot(input: {
    businessId: string;
    transactionId: string;
    totalScore: number;
    factorConsistency: number;
    factorSeparation: number;
    factorCashflow: number;
  }) {
    return this.prisma.scoreSnapshot.create({
      data: input,
    });
  }

  async getLatestScoreSnapshot(businessId: string) {
    return this.prisma.scoreSnapshot.findFirst({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getLastVaultBlock(businessId: string) {
    return this.prisma.vaultBlock.findFirst({
      where: { businessId },
      orderBy: { blockIndex: "desc" },
    });
  }

  async createVaultBlock(input: {
    businessId: string;
    transactionId: string;
    blockIndex: number;
    canonicalPayload: string;
    prevHash: string;
    hash: string;
  }) {
    return this.prisma.vaultBlock.create({
      data: input,
    });
  }

  async createAuditEvent(input: {
    businessId: string;
    eventType: "VERIFY_PASSED" | "VERIFY_FAILED" | "TAMPER_SIMULATED" | "SYSTEM_RESET";
    targetBlockIndex?: number | null;
    message: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.auditEvent.create({
      data: {
        businessId: input.businessId,
        eventType: input.eventType as any,
        targetBlockIndex: input.targetBlockIndex ?? null,
        message: input.message,
        metadata: input.metadata,
      },
    });
  }
}
```

---

## 3) `apps/web/server/services/guardrail.service.ts`

```ts
export type CommitIntent = "expense" | "prive";

export type GuardrailInput = {
  amount: number;
  intent: CommitIntent;
  debitAccount: string;
  creditAccount: string;
  cashBalance: number;
};

export type GuardrailResult =
  | {
      allowCommit: true;
      reason: null;
    }
  | {
      allowCommit: false;
      reason:
        | "INSUFFICIENT_FUNDS"
        | "INVALID_AMOUNT"
        | "INVALID_ACCOUNT_MAPPING"
        | "UNKNOWN_INTENT";
    };

const ALLOWED_EXPENSE_DEBIT_ACCOUNTS = new Set([
  "Beban Operasional",
  "Beban Listrik",
  "Beban Operasional Lainnya",
]);

const ALLOWED_PRIVE_DEBIT_ACCOUNTS = new Set([
  "Prive Pemilik",
]);

const ALLOWED_CREDIT_ACCOUNTS = new Set(["Kas"]);

export class GuardrailService {
  validate(input: GuardrailInput): GuardrailResult {
    if (!Number.isInteger(input.amount) || input.amount <= 0) {
      return {
        allowCommit: false,
        reason: "INVALID_AMOUNT",
      };
    }

    if (!ALLOWED_CREDIT_ACCOUNTS.has(input.creditAccount)) {
      return {
        allowCommit: false,
        reason: "INVALID_ACCOUNT_MAPPING",
      };
    }

    if (input.intent === "expense") {
      if (!ALLOWED_EXPENSE_DEBIT_ACCOUNTS.has(input.debitAccount)) {
        return {
          allowCommit: false,
          reason: "INVALID_ACCOUNT_MAPPING",
        };
      }
    } else if (input.intent === "prive") {
      if (!ALLOWED_PRIVE_DEBIT_ACCOUNTS.has(input.debitAccount)) {
        return {
          allowCommit: false,
          reason: "INVALID_ACCOUNT_MAPPING",
        };
      }
    } else {
      return {
        allowCommit: false,
        reason: "UNKNOWN_INTENT",
      };
    }

    if (input.cashBalance < input.amount) {
      return {
        allowCommit: false,
        reason: "INSUFFICIENT_FUNDS",
      };
    }

    return {
      allowCommit: true,
      reason: null,
    };
  }
}
```

---

## 4) `apps/web/server/services/score.service.ts`

```ts
export type ScoreFactors = {
  factorConsistency: number;
  factorSeparation: number;
  factorCashflow: number;
};

export type ScoreResult = ScoreFactors & {
  totalScore: number;
};

const BASE_SCORE = 680;

export class ScoreService {
  deriveNextScore(input: {
    previous?: ScoreFactors | null;
    txnClass: "expense" | "prive";
  }): ScoreResult {
    const prev = input.previous ?? {
      factorConsistency: 0,
      factorSeparation: 0,
      factorCashflow: 0,
    };

    let factorConsistency = prev.factorConsistency + 2;
    let factorSeparation = prev.factorSeparation;
    let factorCashflow = prev.factorCashflow;

    if (input.txnClass === "expense") {
      factorSeparation += 3;
      factorCashflow += 2;
    } else if (input.txnClass === "prive") {
      factorSeparation -= 5;
      factorCashflow -= 3;
    }

    const totalScore =
      BASE_SCORE + factorConsistency + factorSeparation + factorCashflow;

    return {
      totalScore,
      factorConsistency,
      factorSeparation,
      factorCashflow,
    };
  }
}
```

---

## 5) `apps/web/server/services/vault.service.ts`

```ts
import { createHash } from "crypto";

const GENESIS_HASH =
  "0000000000000000000000000000000000000000000000000000000000000000";

export class VaultService {
  buildPayload(input: {
    debitAccount: string;
    creditAccount: string;
    amount: number;
  }) {
    return `${input.debitAccount}|${input.creditAccount}|${input.amount}`;
  }

  buildCanonicalPayload(input: {
    blockIndex: number;
    transactionId: string;
    prevHash?: string | null;
    payload: string;
  }) {
    const prevHash = input.prevHash ?? GENESIS_HASH;
    return `${input.blockIndex}|${input.transactionId}|${prevHash}|${input.payload}`;
  }

  sha256Hex(value: string) {
    return createHash("sha256").update(value, "utf8").digest("hex");
  }

  buildBlock(input: {
    blockIndex: number;
    transactionId: string;
    prevHash?: string | null;
    debitAccount: string;
    creditAccount: string;
    amount: number;
  }) {
    const payload = this.buildPayload({
      debitAccount: input.debitAccount,
      creditAccount: input.creditAccount,
      amount: input.amount,
    });

    const prevHash = input.prevHash ?? GENESIS_HASH;

    const canonicalPayload = this.buildCanonicalPayload({
      blockIndex: input.blockIndex,
      transactionId: input.transactionId,
      prevHash,
      payload,
    });

    const hash = this.sha256Hex(canonicalPayload);

    return {
      payload,
      canonicalPayload,
      prevHash,
      hash,
    };
  }
}

export { GENESIS_HASH };
```

---

## 6) `apps/web/server/services/ledger.service.ts`

```ts
import type { PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../repositories/transaction.repository";
import { GuardrailService, type CommitIntent } from "./guardrail.service";
import { ScoreService } from "./score.service";
import { VaultService } from "./vault.service";

export class LedgerService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly guardrailService = new GuardrailService(),
    private readonly scoreService = new ScoreService(),
    private readonly vaultService = new VaultService()
  ) {}

  async commitTransaction(input: {
    businessId: string;
    rawText: string;
    intent: CommitIntent;
    amount: number;
    currency: string;
    debitAccount: string;
    creditAccount: string;
    confidence?: number | null;
    reviewResolution?: string | null;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const repo = new TransactionRepository(tx);

      const balance = await repo.getBalanceSnapshot(input.businessId);
      const currentCashBalance = balance?.cashBalance ?? 0;
      const currentExpenseTotal = balance?.expenseTotal ?? 0;
      const currentPriveTotal = balance?.priveTotal ?? 0;

      const guardrail = this.guardrailService.validate({
        amount: input.amount,
        intent: input.intent,
        debitAccount: input.debitAccount,
        creditAccount: input.creditAccount,
        cashBalance: currentCashBalance,
      });

      if (!guardrail.allowCommit) {
        return {
          ok: false as const,
          reason: guardrail.reason,
          currentCashBalance,
        };
      }

      const transaction = await repo.createTransaction({
        businessId: input.businessId,
        rawText: input.rawText,
        parsedIntent: input.intent,
        amount: input.amount,
        currency: input.currency,
        debitAccount: input.debitAccount,
        creditAccount: input.creditAccount,
        confidence: input.confidence ?? null,
        needsHumanReview: false,
        reviewReason: null,
        reviewResolution: input.reviewResolution ?? null,
        status: "COMMITTED",
      });

      await repo.createJournalEntries({
        transactionId: transaction.id,
        debitAccount: input.debitAccount,
        creditAccount: input.creditAccount,
        amount: input.amount,
      });

      const nextCashBalance = currentCashBalance - input.amount;
      const nextExpenseTotal =
        input.intent === "expense"
          ? currentExpenseTotal + input.amount
          : currentExpenseTotal;
      const nextPriveTotal =
        input.intent === "prive"
          ? currentPriveTotal + input.amount
          : currentPriveTotal;

      const balanceSnapshot = await repo.upsertBalanceSnapshot({
        businessId: input.businessId,
        cashBalance: nextCashBalance,
        expenseTotal: nextExpenseTotal,
        priveTotal: nextPriveTotal,
      });

      const previousScore = await repo.getLatestScoreSnapshot(input.businessId);

      const nextScore = this.scoreService.deriveNextScore({
        previous: previousScore
          ? {
              factorConsistency: previousScore.factorConsistency,
              factorSeparation: previousScore.factorSeparation,
              factorCashflow: previousScore.factorCashflow,
            }
          : null,
        txnClass: input.intent,
      });

      const scoreSnapshot = await repo.createScoreSnapshot({
        businessId: input.businessId,
        transactionId: transaction.id,
        totalScore: nextScore.totalScore,
        factorConsistency: nextScore.factorConsistency,
        factorSeparation: nextScore.factorSeparation,
        factorCashflow: nextScore.factorCashflow,
      });

      const lastBlock = await repo.getLastVaultBlock(input.businessId);
      const blockIndex = (lastBlock?.blockIndex ?? 0) + 1;

      const block = this.vaultService.buildBlock({
        blockIndex,
        transactionId: transaction.id,
        prevHash: lastBlock?.hash ?? null,
        debitAccount: input.debitAccount,
        creditAccount: input.creditAccount,
        amount: input.amount,
      });

      const vaultBlock = await repo.createVaultBlock({
        businessId: input.businessId,
        transactionId: transaction.id,
        blockIndex,
        canonicalPayload: block.canonicalPayload,
        prevHash: block.prevHash,
        hash: block.hash,
      });

      return {
        ok: true as const,
        transaction,
        journalEntries: [
          {
            accountName: input.debitAccount,
            entryType: "debit" as const,
            amount: input.amount,
          },
          {
            accountName: input.creditAccount,
            entryType: "credit" as const,
            amount: input.amount,
          },
        ],
        ledgerSummary: {
          cashBalance: balanceSnapshot.cashBalance,
          expenseTotal: balanceSnapshot.expenseTotal,
          priveTotal: balanceSnapshot.priveTotal,
        },
        scoreSnapshot: {
          totalScore: scoreSnapshot.totalScore,
          factors: [
            {
              id: "consistency",
              name: "Konsistensi Pencatatan",
              delta: scoreSnapshot.factorConsistency,
            },
            {
              id: "separation",
              name: "Disiplin Pemisahan SAK",
              delta: scoreSnapshot.factorSeparation,
            },
            {
              id: "cashflow",
              name: "Stabilitas Arus Kas",
              delta: scoreSnapshot.factorCashflow,
            },
          ],
        },
        vaultBlock: {
          blockIndex: vaultBlock.blockIndex,
          transactionId: transaction.id,
          canonicalPayload: vaultBlock.canonicalPayload,
          prevHash: vaultBlock.prevHash,
          hash: vaultBlock.hash,
        },
      };
    });
  }
}
```

---

## 7) `apps/web/app/api/commit/route.ts`

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { LedgerService } from "@/server/services/ledger.service";

const CommitRequestSchema = z
  .object({
    rawText: z.string().min(1),
    intent: z.enum(["expense", "prive"]),
    amount: z.number().int().positive(),
    currency: z.literal("IDR").default("IDR"),
    debitAccount: z.string().min(1),
    creditAccount: z.string().min(1),
    reviewResolution: z.string().nullable().optional(),
    confidence: z.number().min(0).max(1).nullable().optional(),
  })
  .strict();

const DEMO_BUSINESS_ID = "biz_demo_kasai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CommitRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Payload commit tidak valid",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const ledgerService = new LedgerService(db);

    const result = await ledgerService.commitTransaction({
      businessId: DEMO_BUSINESS_ID,
      rawText: parsed.data.rawText,
      intent: parsed.data.intent,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      debitAccount: parsed.data.debitAccount,
      creditAccount: parsed.data.creditAccount,
      confidence: parsed.data.confidence ?? null,
      reviewResolution: parsed.data.reviewResolution ?? null,
    });

    if (!result.ok) {
      if (result.reason === "INSUFFICIENT_FUNDS") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INSUFFICIENT_FUNDS",
              message: "Saldo kas tidak mencukupi",
              details: {
                available: result.currentCashBalance,
                required: parsed.data.amount,
              },
            },
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.reason,
            message: "Transaksi ditolak oleh guardrail",
            details: {},
          },
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          transactionId: result.transaction.id,
          journalEntries: result.journalEntries,
          ledgerSummary: result.ledgerSummary,
          scoreSnapshot: result.scoreSnapshot,
          vaultBlock: result.vaultBlock,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/commit error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan internal saat commit transaksi",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

# Cara ngetes cepat

## Request happy path

```bash
curl -X POST http://localhost:3000/api/commit \
  -H "Content-Type: application/json" \
  -d '{
    "rawText": "Bayar tagihan listrik ruko 300 ribu",
    "intent": "expense",
    "amount": 300000,
    "currency": "IDR",
    "debitAccount": "Beban Operasional",
    "creditAccount": "Kas"
  }'
```

## Request prive

```bash
curl -X POST http://localhost:3000/api/commit \
  -H "Content-Type: application/json" \
  -d '{
    "rawText": "Ambil uang kas 500 ribu",
    "intent": "prive",
    "amount": 500000,
    "currency": "IDR",
    "debitAccount": "Prive Pemilik",
    "creditAccount": "Kas",
    "reviewResolution": "prive"
  }'
```

## Request insufficient funds

```bash
curl -X POST http://localhost:3000/api/commit \
  -H "Content-Type: application/json" \
  -d '{
    "rawText": "Beli mesin kopi 6 juta",
    "intent": "expense",
    "amount": 6000000,
    "currency": "IDR",
    "debitAccount": "Beban Operasional",
    "creditAccount": "Kas"
  }'
```

---

# Catatan penting

## Yang sudah hidup dari kode ini

* validasi payload request
* guardrail nominal/saldo/akun dasar
* commit transaction
* create journal entries
* update balance snapshot
* create score snapshot
* create vault block

## Yang belum hidup

* `POST /api/parse`
* `GET /api/score`
* `GET /api/ledger/summary`
* `GET /api/audit/verify`
* text/audio parse end-to-end ke UI

Jadi ini memang fokus untuk **happy-path backend commit** dulu.

---

# Saran urutan setelah ini

1. **buat `GET /api/ledger/summary`**
2. **buat `GET /api/score`**
3. **buat `GET /api/audit/chain`**
4. **baru `POST /api/parse`**
5. **baru UI integrasi**

Kenapa?
Karena backend commit-mu sekarang sudah punya “jantung”.
Tinggal pasang monitor, baru pasang mikrofon.

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan `GET /api/ledger/summary`, `GET /api/score`, dan `GET /api/audit/chain` sekalian agar bank view dan local artifacts langsung bisa baca data nyata.**

Siap. Di bawah ini saya buatkan tiga endpoint read-model supaya UI kamu bisa baca data nyata dari database:

1. `GET /api/ledger/summary`
2. `GET /api/score`
3. `GET /api/audit/chain`

Saya tambahkan juga:

* `score.repository.ts`
* `vault.repository.ts`

supaya struktur repo tetap rapi dan route handler tidak berubah jadi hutan liar.

---

## 1) `apps/web/server/repositories/score.repository.ts`

```ts
import type { Prisma, PrismaClient } from "@prisma/client";

export class ScoreRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  async getLatestScoreSnapshot(businessId: string) {
    return this.prisma.scoreSnapshot.findFirst({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
  }
}
```

---

## 2) `apps/web/server/repositories/vault.repository.ts`

```ts
import type { Prisma, PrismaClient } from "@prisma/client";

export class VaultRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  async getChain(businessId: string, limit = 50) {
    return this.prisma.vaultBlock.findMany({
      where: { businessId },
      orderBy: { blockIndex: "asc" },
      take: limit,
    });
  }

  async getLastBlock(businessId: string) {
    return this.prisma.vaultBlock.findFirst({
      where: { businessId },
      orderBy: { blockIndex: "desc" },
    });
  }
}
```

---

## 3) `apps/web/app/api/ledger/summary/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEMO_BUSINESS_ID = "biz_demo_kasai";

export async function GET() {
  try {
    const balance = await db.balanceSnapshot.findUnique({
      where: { businessId: DEMO_BUSINESS_ID },
    });

    const data = {
      cashBalance: balance?.cashBalance ?? 0,
      expenseTotal: balance?.expenseTotal ?? 0,
      priveTotal: balance?.priveTotal ?? 0,
    };

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/ledger/summary error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan saat mengambil ringkasan ledger",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

## 4) `apps/web/app/api/score/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ScoreRepository } from "@/server/repositories/score.repository";

const DEMO_BUSINESS_ID = "biz_demo_kasai";
const BASE_SCORE = 680;

export async function GET() {
  try {
    const repo = new ScoreRepository(db);
    const latest = await repo.getLatestScoreSnapshot(DEMO_BUSINESS_ID);

    const data = latest
      ? {
          totalScore: latest.totalScore,
          factors: [
            {
              id: "consistency",
              name: "Konsistensi Pencatatan",
              delta: latest.factorConsistency,
            },
            {
              id: "separation",
              name: "Disiplin Pemisahan SAK",
              delta: latest.factorSeparation,
            },
            {
              id: "cashflow",
              name: "Stabilitas Arus Kas",
              delta: latest.factorCashflow,
            },
          ],
        }
      : {
          totalScore: BASE_SCORE,
          factors: [
            {
              id: "consistency",
              name: "Konsistensi Pencatatan",
              delta: 0,
            },
            {
              id: "separation",
              name: "Disiplin Pemisahan SAK",
              delta: 0,
            },
            {
              id: "cashflow",
              name: "Stabilitas Arus Kas",
              delta: 0,
            },
          ],
        };

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/score error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan saat mengambil snapshot score",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

## 5) `apps/web/app/api/audit/chain/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { VaultRepository } from "@/server/repositories/vault.repository";

const DEMO_BUSINESS_ID = "biz_demo_kasai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");

    const limit =
      limitParam && Number.isInteger(Number(limitParam))
        ? Math.max(1, Math.min(Number(limitParam), 200))
        : 50;

    const repo = new VaultRepository(db);
    const blocks = await repo.getChain(DEMO_BUSINESS_ID, limit);

    const data = {
      items: blocks.map((block) => ({
        blockIndex: block.blockIndex,
        transactionId: block.transactionId,
        canonicalPayload: block.canonicalPayload,
        prevHash: block.prevHash,
        hash: block.hash,
        createdAt: block.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/audit/chain error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan saat mengambil rantai audit",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

# Bentuk response yang akan kamu dapat

## `GET /api/ledger/summary`

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

## `GET /api/score`

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

## `GET /api/audit/chain`

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "blockIndex": 1,
        "transactionId": "txn_xxx",
        "canonicalPayload": "1|txn_xxx|0000...|Beban Operasional|Kas|300000",
        "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
        "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
        "createdAt": "2026-03-23T10:00:00.000Z"
      }
    ]
  }
}
```

---

# Cara tes cepat

## Ledger summary

```bash
curl http://localhost:3000/api/ledger/summary
```

## Score

```bash
curl http://localhost:3000/api/score
```

## Audit chain

```bash
curl "http://localhost:3000/api/audit/chain?limit=20"
```

---

# Cara hubungkan ke UI

## Untuk kartu saldo

* fetch `/api/ledger/summary`
* isi:

  * `ui-bal-cash`
  * `ui-bal-exp`
  * `ui-bal-prive`

## Untuk lender score

* fetch `/api/score`
* isi:

  * `ui-score-total`
  * `ui-score-factors`

## Untuk tabel vault

* fetch `/api/audit/chain`
* isi:

  * rows chain table
  * block height header

---

# Saran teknis kecil

Supaya UI tidak ngegas terlalu cepat, buat 3 helper client:

* `fetchLedgerSummary()`
* `fetchScore()`
* `fetchAuditChain()`

Lalu panggil:

* saat halaman load
* setelah `POST /api/commit` sukses
* setelah reset/tamper/verify bila perlu

---

# Prompt Cursor berikutnya yang pas

```text
Read docs/api-contracts.md and the existing route handlers.
Implement client-side fetch helpers for:
- GET /api/ledger/summary
- GET /api/score
- GET /api/audit/chain

Then wire them into the UMKM and Bank views so the UI renders real backend data instead of static placeholders.
Do not change backend contracts.
```

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan `GET /api/audit/verify` dan `POST /api/demo/tamper` supaya tombol “Jalankan Audit” dan “Simulasi Retas” benar-benar hidup end-to-end.**

Siap. Di bawah ini saya buatkan endpoint agar alur **audit verify** dan **tamper demo** benar-benar hidup end-to-end.

Saya tambahkan juga:

* `audit.service.ts`
* update kecil pada `vault.repository.ts`

Supaya logikanya tetap rapi dan route handler tidak berisi semua hal seperti kos anak teknik pas akhir bulan.

---

## 1) Update `apps/web/server/repositories/vault.repository.ts`

Tambahkan method untuk mengambil block target dan mengubah payload/canonical-nya.

```ts
import type { Prisma, PrismaClient } from "@prisma/client";

export class VaultRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  async getChain(businessId: string, limit = 50) {
    return this.prisma.vaultBlock.findMany({
      where: { businessId },
      orderBy: { blockIndex: "asc" },
      take: limit,
    });
  }

  async getLastBlock(businessId: string) {
    return this.prisma.vaultBlock.findFirst({
      where: { businessId },
      orderBy: { blockIndex: "desc" },
    });
  }

  async getBlockByIndex(businessId: string, blockIndex: number) {
    return this.prisma.vaultBlock.findFirst({
      where: { businessId, blockIndex },
    });
  }

  async updateBlockCanonicalPayload(input: {
    id: string;
    canonicalPayload: string;
  }) {
    return this.prisma.vaultBlock.update({
      where: { id: input.id },
      data: {
        canonicalPayload: input.canonicalPayload,
      },
    });
  }
}
```

---

## 2) `apps/web/server/services/audit.service.ts`

```ts
import { createHash } from "crypto";
import type { PrismaClient } from "@prisma/client";
import { VaultRepository } from "../repositories/vault.repository";
import { TransactionRepository } from "../repositories/transaction.repository";

const GENESIS_HASH =
  "0000000000000000000000000000000000000000000000000000000000000000";

export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  private sha256Hex(value: string) {
    return createHash("sha256").update(value, "utf8").digest("hex");
  }

  async verifyChain(businessId: string) {
    const vaultRepo = new VaultRepository(this.prisma);
    const txRepo = new TransactionRepository(this.prisma);

    const blocks = await vaultRepo.getChain(businessId, 1000);

    if (blocks.length === 0) {
      return {
        valid: true,
        firstBrokenBlock: null as number | null,
        invalidBlocks: [] as number[],
      };
    }

    let expectedPrev = GENESIS_HASH;
    let firstBrokenBlock: number | null = null;
    const invalidBlocks: number[] = [];

    for (const block of blocks) {
      const linkageBroken = block.prevHash !== expectedPrev;
      const recalculatedHash = this.sha256Hex(block.canonicalPayload);
      const digestBroken = recalculatedHash !== block.hash;

      if (linkageBroken || digestBroken) {
        if (firstBrokenBlock === null) {
          firstBrokenBlock = block.blockIndex;
        }
        invalidBlocks.push(block.blockIndex);
      } else if (firstBrokenBlock !== null) {
        invalidBlocks.push(block.blockIndex);
      }

      expectedPrev = block.hash;
    }

    const valid = firstBrokenBlock === null;

    await txRepo.createAuditEvent({
      businessId,
      eventType: valid ? "VERIFY_PASSED" : "VERIFY_FAILED",
      targetBlockIndex: firstBrokenBlock,
      message: valid
        ? "Audit verify passed: chain is valid"
        : `Audit verify failed starting from block #${firstBrokenBlock}`,
      metadata: {
        valid,
        firstBrokenBlock,
        invalidBlocks,
      },
    });

    return {
      valid,
      firstBrokenBlock,
      invalidBlocks,
    };
  }

  async tamperBlock(input: {
    businessId: string;
    targetBlockIndex: number;
    mode?: "append_amount_digits";
  }) {
    const mode = input.mode ?? "append_amount_digits";

    const vaultRepo = new VaultRepository(this.prisma);
    const txRepo = new TransactionRepository(this.prisma);

    const block = await vaultRepo.getBlockByIndex(
      input.businessId,
      input.targetBlockIndex
    );

    if (!block) {
      return null;
    }

    let nextCanonicalPayload = block.canonicalPayload;

    if (mode === "append_amount_digits") {
      nextCanonicalPayload = `${block.canonicalPayload}99`;
    }

    const updated = await vaultRepo.updateBlockCanonicalPayload({
      id: block.id,
      canonicalPayload: nextCanonicalPayload,
    });

    await txRepo.createAuditEvent({
      businessId: input.businessId,
      eventType: "TAMPER_SIMULATED",
      targetBlockIndex: input.targetBlockIndex,
      message: `Tamper simulated on block #${input.targetBlockIndex}`,
      metadata: {
        mode,
        originalCanonicalPayload: block.canonicalPayload,
        tamperedCanonicalPayload: nextCanonicalPayload,
      },
    });

    return {
      blockIndex: updated.blockIndex,
      transactionId: updated.transactionId,
      originalCanonicalPayload: block.canonicalPayload,
      tamperedCanonicalPayload: updated.canonicalPayload,
      hash: updated.hash,
    };
  }
}
```

---

## 3) `apps/web/app/api/audit/verify/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuditService } from "@/server/services/audit.service";

const DEMO_BUSINESS_ID = "biz_demo_kasai";

export async function GET() {
  try {
    const auditService = new AuditService(db);
    const result = await auditService.verifyChain(DEMO_BUSINESS_ID);

    if (result.valid) {
      return NextResponse.json(
        {
          success: true,
          data: {
            valid: true,
            firstBrokenBlock: null,
            invalidBlocks: [],
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CHAIN_BROKEN",
          message: "Integritas rantai rusak",
          details: {
            valid: false,
            firstBrokenBlock: result.firstBrokenBlock,
            invalidBlocks: result.invalidBlocks,
          },
        },
      },
      { status: 409 }
    );
  } catch (error) {
    console.error("GET /api/audit/verify error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan saat memverifikasi chain",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

## 4) `apps/web/app/api/demo/tamper/route.ts`

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { AuditService } from "@/server/services/audit.service";

const DEMO_BUSINESS_ID = "biz_demo_kasai";

const TamperRequestSchema = z
  .object({
    targetBlockIndex: z.number().int().positive(),
    mode: z.enum(["append_amount_digits"]).default("append_amount_digits"),
  })
  .strict();

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== "true") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Tamper endpoint hanya aktif pada mode demo",
            details: {},
          },
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = TamperRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Payload tamper tidak valid",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const auditService = new AuditService(db);
    const result = await auditService.tamperBlock({
      businessId: DEMO_BUSINESS_ID,
      targetBlockIndex: parsed.data.targetBlockIndex,
      mode: parsed.data.mode,
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Block target tidak ditemukan",
            details: {
              targetBlockIndex: parsed.data.targetBlockIndex,
            },
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          targetBlockIndex: result.blockIndex,
          transactionId: result.transactionId,
          originalCanonicalPayload: result.originalCanonicalPayload,
          tamperedCanonicalPayload: result.tamperedCanonicalPayload,
          message: "Payload block berhasil dimodifikasi untuk keperluan demo",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/demo/tamper error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan saat mensimulasikan tamper",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

# Cara ngetes cepat

## Verify chain sehat

```bash
curl http://localhost:3000/api/audit/verify
```

### Response sukses

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

---

## Simulasi tamper

```bash
curl -X POST http://localhost:3000/api/demo/tamper \
  -H "Content-Type: application/json" \
  -d '{
    "targetBlockIndex": 1,
    "mode": "append_amount_digits"
  }'
```

### Response sukses

```json
{
  "success": true,
  "data": {
    "targetBlockIndex": 1,
    "transactionId": "txn_xxx",
    "originalCanonicalPayload": "1|txn_xxx|0000...|Beban Operasional|Kas|300000",
    "tamperedCanonicalPayload": "1|txn_xxx|0000...|Beban Operasional|Kas|30000099",
    "message": "Payload block berhasil dimodifikasi untuk keperluan demo"
  }
}
```

---

## Verify chain setelah tamper

```bash
curl http://localhost:3000/api/audit/verify
```

### Response gagal

```json
{
  "success": false,
  "error": {
    "code": "CHAIN_BROKEN",
    "message": "Integritas rantai rusak",
    "details": {
      "valid": false,
      "firstBrokenBlock": 1,
      "invalidBlocks": [1]
    }
  }
}
```

Kalau chain punya beberapa block dan kamu tamper block tengah, `invalidBlocks` akan mencakup block itu dan semua block setelahnya.

---

# Catatan penting

## Kenapa saya tamper `canonicalPayload`, bukan `hash`

Karena untuk demo trust yang lebih masuk akal:

* data diubah diam-diam,
* hash tersimpan tetap lama,
* saat verify, recalculated hash tidak cocok.

Itu lebih bagus daripada sekadar “mengacak hash”, yang terasa seperti juri sedang menonton file rusak, bukan serangan.

## Kenapa `verify` return 409 saat chain broken

Karena secara semantik:

* request valid,
* server bekerja,
* tapi state sumber daya sedang konflik/rusak secara integritas.

Kalau kamu mau, ini juga bisa dibuat tetap 200 dengan `success: true` dan `data.valid=false`, tapi kontrakmu sebelumnya lebih dekat ke model `CHAIN_BROKEN` sebagai error state.

---

# Urutan integrasi UI setelah ini

## Tombol “Jalankan Audit”

* call `GET /api/audit/verify`
* jika `success === true` → tampilkan banner hijau
* jika `error.code === "CHAIN_BROKEN"` → tampilkan banner merah + highlight row

## Tombol “Simulasi Retas”

* pilih block index target
* call `POST /api/demo/tamper`
* refresh `/api/audit/chain`
* opsional: langsung panggil `/api/audit/verify`

---

# Prompt Cursor berikutnya yang pas

```text
Read docs/api-contracts.md and existing audit endpoints.
Wire the Bank/Lender UI to:
- GET /api/audit/chain
- GET /api/audit/verify
- POST /api/demo/tamper

Requirements:
- preserve existing progressive disclosure
- show PASS banner on healthy chain
- show FAIL banner on broken chain
- visually highlight first broken block and subsequent invalid blocks
- do not change backend response contracts
```

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan helper frontend `fetchAuditVerify()`, `postTamperDemo()`, plus contoh komponen React untuk `VerifyBanner` dan `VaultChainTable` agar integrasinya ke UI kamu jadi jauh lebih cepat.**

Siap. Saya buatkan **helper frontend** dan **contoh komponen React** yang langsung nyambung ke kontrak backend yang sudah kita susun.

Di bawah ini saya kasih 4 file:

1. `apps/web/lib/api/audit.ts`
2. `apps/web/components/bank/VerifyBanner.tsx`
3. `apps/web/components/bank/VaultChainTable.tsx`
4. contoh integrasi di page/container: `apps/web/components/bank/BankEvidencePanel.tsx`

---

# 1) `apps/web/lib/api/audit.ts`

```ts
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type AuditVerifySuccess = {
  success: true;
  data: {
    valid: true;
    firstBrokenBlock: null;
    invalidBlocks: number[];
  };
};

export type AuditVerifyBroken = {
  success: false;
  error: {
    code: "CHAIN_BROKEN";
    message: string;
    details: {
      valid: false;
      firstBrokenBlock: number;
      invalidBlocks: number[];
    };
  };
};

export type AuditVerifyGenericError = {
  success: false;
  error: ApiError;
};

export type AuditVerifyResponse =
  | AuditVerifySuccess
  | AuditVerifyBroken
  | AuditVerifyGenericError;

export type VaultChainItem = {
  blockIndex: number;
  transactionId: string;
  canonicalPayload: string;
  prevHash: string;
  hash: string;
  createdAt: string;
};

export type AuditChainResponse =
  | {
      success: true;
      data: {
        items: VaultChainItem[];
      };
    }
  | {
      success: false;
      error: ApiError;
    };

export type TamperDemoResponse =
  | {
      success: true;
      data: {
        targetBlockIndex: number;
        transactionId: string;
        originalCanonicalPayload: string;
        tamperedCanonicalPayload: string;
        message: string;
      };
    }
  | {
      success: false;
      error: ApiError;
    };

async function safeJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchAuditVerify(): Promise<AuditVerifyResponse> {
  const res = await fetch("/api/audit/verify", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return safeJson<AuditVerifyResponse>(res);
}

export async function fetchAuditChain(limit = 50): Promise<AuditChainResponse> {
  const res = await fetch(`/api/audit/chain?limit=${limit}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return safeJson<AuditChainResponse>(res);
}

export async function postTamperDemo(
  targetBlockIndex: number,
  mode: "append_amount_digits" = "append_amount_digits"
): Promise<TamperDemoResponse> {
  const res = await fetch("/api/demo/tamper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      targetBlockIndex,
      mode,
    }),
  });

  return safeJson<TamperDemoResponse>(res);
}
```

---

# 2) `apps/web/components/bank/VerifyBanner.tsx`

```tsx
type VerifyState =
  | {
      kind: "idle";
      message?: string;
    }
  | {
      kind: "checking";
      message?: string;
    }
  | {
      kind: "passed";
      message: string;
    }
  | {
      kind: "failed";
      message: string;
      firstBrokenBlock: number;
      invalidBlocks: number[];
    }
  | {
      kind: "error";
      message: string;
    };

type VerifyBannerProps = {
  state: VerifyState;
};

export function VerifyBanner({ state }: VerifyBannerProps) {
  if (state.kind === "idle") {
    return (
      <div className="mb-6 p-4 rounded-lg text-sm font-bold flex items-center justify-between bg-slate-900 border border-slate-700 text-slate-400">
        <span>
          {state.message ??
            "Klik 'Jalankan Audit' untuk memverifikasi integritas historis data."}
        </span>
      </div>
    );
  }

  if (state.kind === "checking") {
    return (
      <div className="mb-6 p-4 rounded-lg text-sm font-bold flex items-center justify-between bg-slate-800 border border-slate-700 text-slate-300">
        <span>{state.message ?? "Menghitung ulang rantai kriptografis..."}</span>
        <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
      </div>
    );
  }

  if (state.kind === "passed") {
    return (
      <div className="mb-6 p-4 rounded-lg text-sm font-bold flex items-center justify-between bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
        <span>
          <i className="fa-solid fa-check-double mr-2" aria-hidden="true" />
          {state.message}
        </span>
      </div>
    );
  }

  if (state.kind === "failed") {
    return (
      <div className="mb-6 p-4 rounded-lg text-sm font-bold flex items-center justify-between bg-rose-950/40 text-rose-400 border border-rose-500/30">
        <span>
          <i
            className="fa-solid fa-triangle-exclamation mr-2"
            aria-hidden="true"
          />
          {state.message}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-lg text-sm font-bold flex items-center justify-between bg-amber-950/40 text-amber-400 border border-amber-500/30">
      <span>
        <i className="fa-solid fa-circle-info mr-2" aria-hidden="true" />
        {state.message}
      </span>
    </div>
  );
}

export type { VerifyState };
```

---

# 3) `apps/web/components/bank/VaultChainTable.tsx`

```tsx
import type { VaultChainItem } from "@/lib/api/audit";

type VaultChainTableProps = {
  items: VaultChainItem[];
  firstBrokenBlock: number | null;
  invalidBlocks: number[];
  onTamper?: (blockIndex: number) => void;
  tamperDisabled?: boolean;
};

function truncateMiddle(value: string, head = 10, tail = 8) {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function VaultChainTable({
  items,
  firstBrokenBlock,
  invalidBlocks,
  onTamper,
  tamperDisabled = false,
}: VaultChainTableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-[#0a0f1d] rounded-lg border border-slate-700 overflow-y-auto flex-1 min-h-[250px] relative shadow-inner">
        <div className="px-4 py-10 text-center text-slate-600 italic">
          Genesis block established. Rantai kosong.
        </div>
      </div>
    );
  }

  const invalidSet = new Set(invalidBlocks);

  return (
    <div className="bg-[#0a0f1d] rounded-lg border border-slate-700 overflow-y-auto flex-1 min-h-[250px] relative shadow-inner">
      <table className="w-full text-left text-[11px] font-mono text-slate-300 whitespace-nowrap">
        <thead className="bg-slate-900 border-b border-slate-700 text-slate-500 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3">Blk</th>
            <th className="px-4 py-3">Txn_ID</th>
            <th className="px-4 py-3">Payload</th>
            <th className="px-4 py-3">Prev_Hash</th>
            <th className="px-4 py-3">SHA-256 Hash</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {items.map((block) => {
            const isFirstBroken = firstBrokenBlock === block.blockIndex;
            const isInvalid = invalidSet.has(block.blockIndex);

            const rowClass = [
              "border-b border-slate-800 hover:bg-slate-800/60 transition-colors",
              isFirstBroken ? "bg-rose-950/30 border-l-2 border-l-rose-500" : "",
              !isFirstBroken && isInvalid ? "opacity-50 border-l-2 border-l-rose-400" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={block.blockIndex} className={rowClass}>
                <td className="px-4 py-3 text-slate-400">
                  #{String(block.blockIndex).padStart(3, "0")}
                </td>

                <td className="px-4 py-3 text-indigo-400">{block.transactionId}</td>

                <td
                  className={`px-4 py-3 ${
                    isFirstBroken ? "text-rose-400 font-bold" : "text-slate-300"
                  }`}
                  title={block.canonicalPayload}
                >
                  {truncateMiddle(block.canonicalPayload, 26, 18)}
                </td>

                <td className="px-4 py-3 text-slate-500" title={block.prevHash}>
                  {truncateMiddle(block.prevHash, 8, 8)}
                </td>

                <td
                  className={`px-4 py-3 font-bold ${
                    isFirstBroken ? "text-rose-400" : "text-orange-400"
                  }`}
                  title={block.hash}
                >
                  {truncateMiddle(block.hash, 12, 10)}
                </td>

                <td className="px-4 py-3">
                  {onTamper ? (
                    <button
                      type="button"
                      onClick={() => onTamper(block.blockIndex)}
                      disabled={tamperDisabled}
                      className="text-[10px] font-bold uppercase text-rose-500 hover:text-rose-400 transition-colors bg-rose-950/30 px-2 py-1 rounded border border-rose-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Simulasi Retas
                    </button>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

---

# 4) `apps/web/components/bank/BankEvidencePanel.tsx`

Ini contoh container React yang langsung menggabungkan:

* `fetchAuditChain()`
* `fetchAuditVerify()`
* `postTamperDemo()`
* `VerifyBanner`
* `VaultChainTable`

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchAuditChain,
  fetchAuditVerify,
  postTamperDemo,
  type VaultChainItem,
} from "@/lib/api/audit";
import { VerifyBanner, type VerifyState } from "./VerifyBanner";
import { VaultChainTable } from "./VaultChainTable";

export function BankEvidencePanel() {
  const [items, setItems] = useState<VaultChainItem[]>([]);
  const [loadingChain, setLoadingChain] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [firstBrokenBlock, setFirstBrokenBlock] = useState<number | null>(null);
  const [invalidBlocks, setInvalidBlocks] = useState<number[]>([]);

  const [verifyState, setVerifyState] = useState<VerifyState>({
    kind: "idle",
  });

  const loadChain = useCallback(async () => {
    setLoadingChain(true);
    try {
      const res = await fetchAuditChain(100);

      if (res.success) {
        setItems(res.data.items);
      } else {
        setVerifyState({
          kind: "error",
          message: res.error.message ?? "Gagal memuat chain audit.",
        });
      }
    } catch {
      setVerifyState({
        kind: "error",
        message: "Gagal memuat chain audit.",
      });
    } finally {
      setLoadingChain(false);
    }
  }, []);

  const handleVerify = useCallback(async () => {
    setVerifying(true);
    setVerifyState({
      kind: "checking",
      message: "Menghitung ulang rantai kriptografis...",
    });

    try {
      const res = await fetchAuditVerify();

      if (res.success) {
        setFirstBrokenBlock(null);
        setInvalidBlocks([]);
        setVerifyState({
          kind: "passed",
          message: "AUDIT PASSED: 100% Rantai Data Konsisten.",
        });
        return;
      }

      if (res.error.code === "CHAIN_BROKEN") {
        const details = res.error.details as {
          valid: false;
          firstBrokenBlock: number;
          invalidBlocks: number[];
        };

        setFirstBrokenBlock(details.firstBrokenBlock);
        setInvalidBlocks(details.invalidBlocks);

        setVerifyState({
          kind: "failed",
          message: `CHAIN BROKEN: Integritas hancur mulai Blok #${details.firstBrokenBlock}.`,
          firstBrokenBlock: details.firstBrokenBlock,
          invalidBlocks: details.invalidBlocks,
        });
        return;
      }

      setVerifyState({
        kind: "error",
        message: res.error.message ?? "Gagal memverifikasi chain.",
      });
    } catch {
      setVerifyState({
        kind: "error",
        message: "Gagal memverifikasi chain.",
      });
    } finally {
      setVerifying(false);
    }
  }, []);

  const handleTamper = useCallback(async (blockIndex: number) => {
    setTampering(true);

    try {
      const res = await postTamperDemo(blockIndex);

      if (!res.success) {
        setVerifyState({
          kind: "error",
          message: res.error.message ?? "Gagal menjalankan simulasi retas.",
        });
        return;
      }

      await loadChain();
      await handleVerify();
    } catch {
      setVerifyState({
        kind: "error",
        message: "Gagal menjalankan simulasi retas.",
      });
    } finally {
      setTampering(false);
    }
  }, [handleVerify, loadChain]);

  useEffect(() => {
    void loadChain();
  }, [loadChain]);

  const blockCountText = useMemo(() => `Total Blocks: ${items.length}`, [items.length]);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-shield-check text-orange-500" />
            Vault Audit Trail
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Append-only Cryptographic Ledger (SHA-256).
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={verifying || loadingChain}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-magnifying-glass-chart" />
          {verifying ? "Memverifikasi..." : "Jalankan Audit"}
        </button>
      </div>

      <VerifyBanner state={verifyState} />

      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
          Blockchain Ledger (Mini-Chain)
        </span>
        <span className="text-[10px] text-slate-500 font-mono">{blockCountText}</span>
      </div>

      <VaultChainTable
        items={items}
        firstBrokenBlock={firstBrokenBlock}
        invalidBlocks={invalidBlocks}
        onTamper={(blockIndex) => void handleTamper(blockIndex)}
        tamperDisabled={tampering || verifying || loadingChain || items.length === 0}
      />
    </div>
  );
}
```

---

# Cara pakai di page

Misalnya di:
`apps/web/app/(dashboard)/bank/page.tsx`

```tsx
import { BankEvidencePanel } from "@/components/bank/BankEvidencePanel";

export default function BankPage() {
  return (
    <main className="p-6">
      <BankEvidencePanel />
    </main>
  );
}
```

---

# Kalau kamu mau sinkron dengan score + ledger summary

Struktur terbaik biasanya:

* `BankEvidencePanel` untuk audit chain
* `ScoreCard` + `ScoreBreakdownTable` baca `/api/score`
* `LedgerSummaryCards` baca `/api/ledger/summary`

Lalu satu container parent:

* load data awal
* refresh setelah `POST /api/commit`
* refresh setelah tamper/verify bila perlu

---

# Catatan kecil yang penting

## 1) `fetch()` client-side

Saya set `cache: "no-store"` supaya data audit tidak nyangkut cache. Untuk demo trust, cache stale itu musuh kecil yang efeknya besar.

## 2) Error handling

Saya bedakan:

* `passed`
* `failed`
* `error`

Karena:

* `failed` = sistem bekerja, dan memang menemukan chain rusak
* `error` = request atau server bermasalah

Itu beda makna, jangan dicampur.

## 3) Highlight logic

* `firstBrokenBlock` = merah tebal
* `invalidBlocks` setelahnya = opacity turun + garis kiri merah

Jadi juri bisa melihat “domino effect” tanpa perlu membaca ceramah kriptografi 12 slide.

---

# Prompt Cursor berikutnya yang pas

```text
Read the existing frontend and backend contracts.
Add the following files:
- apps/web/lib/api/audit.ts
- apps/web/components/bank/VerifyBanner.tsx
- apps/web/components/bank/VaultChainTable.tsx
- apps/web/components/bank/BankEvidencePanel.tsx

Requirements:
- preserve backend contracts exactly
- use client-side fetch with no-store
- visually distinguish passed, failed, and generic error states
- highlight first broken block and subsequent invalid blocks
- keep the implementation simple and production-minded
```

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan helper dan komponen React untuk `/api/ledger/summary` dan `/api/score` juga, supaya sisi UMKM dan lender view sama-sama full data nyata.**

Siap. Saya buatkan helper + komponen React untuk dua jalur ini:

* `/api/ledger/summary`
* `/api/score`

Supaya:

* sisi **UMKM** bisa baca saldo nyata,
* sisi **Bank/Lender** bisa baca score nyata,
* dan seluruh demo mulai terasa seperti produk, bukan pajangan yang sangat ambisius.

Saya kasih 5 file:

1. `apps/web/lib/api/ledger.ts`
2. `apps/web/lib/api/score.ts`
3. `apps/web/components/ledger/LedgerSummaryCards.tsx`
4. `apps/web/components/bank/ScoreCard.tsx`
5. `apps/web/components/bank/ScoreBreakdownTable.tsx`
6. bonus container: `apps/web/components/dashboard/LiveFinancePanel.tsx`

---

## 1) `apps/web/lib/api/ledger.ts`

```ts
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type LedgerSummary = {
  cashBalance: number;
  expenseTotal: number;
  priveTotal: number;
};

export type LedgerSummaryResponse =
  | {
      success: true;
      data: LedgerSummary;
    }
  | {
      success: false;
      error: ApiError;
    };

async function safeJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchLedgerSummary(): Promise<LedgerSummaryResponse> {
  const res = await fetch("/api/ledger/summary", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return safeJson<LedgerSummaryResponse>(res);
}
```

---

## 2) `apps/web/lib/api/score.ts`

```ts
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ScoreFactor = {
  id: string;
  name: string;
  delta: number;
};

export type ScoreSnapshot = {
  totalScore: number;
  factors: ScoreFactor[];
};

export type ScoreResponse =
  | {
      success: true;
      data: ScoreSnapshot;
    }
  | {
      success: false;
      error: ApiError;
    };

async function safeJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchScore(): Promise<ScoreResponse> {
  const res = await fetch("/api/score", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return safeJson<ScoreResponse>(res);
}
```

---

## 3) `apps/web/components/ledger/LedgerSummaryCards.tsx`

```tsx
type LedgerSummaryCardsProps = {
  cashBalance: number;
  expenseTotal: number;
  priveTotal: number;
  loading?: boolean;
  errorMessage?: string | null;
};

function formatRp(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

export function LedgerSummaryCards({
  cashBalance,
  expenseTotal,
  priveTotal,
  loading = false,
  errorMessage = null,
}: LedgerSummaryCardsProps) {
  if (errorMessage) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-xl p-4 text-sm font-medium">
        <i className="fa-solid fa-circle-info mr-2" aria-hidden="true" />
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-bold">Saldo Kas</span>
        <span className="font-mono text-sm font-bold text-emerald-400">
          {loading ? "..." : formatRp(cashBalance)}
        </span>
      </div>

      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-bold">Total Beban</span>
        <span className="font-mono text-sm font-bold text-amber-400">
          {loading ? "..." : formatRp(expenseTotal)}
        </span>
      </div>

      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-bold">Prive</span>
        <span className="font-mono text-sm font-bold text-rose-400">
          {loading ? "..." : formatRp(priveTotal)}
        </span>
      </div>
    </div>
  );
}
```

---

## 4) `apps/web/components/bank/ScoreCard.tsx`

```tsx
type ScoreCardProps = {
  totalScore: number;
  loading?: boolean;
  errorMessage?: string | null;
};

function resolveScoreLabel(score: number) {
  if (score >= 700) return "Kelayakan: Strong";
  if (score >= 680) return "Kelayakan: Hold (Moderate)";
  return "Kelayakan: Watch";
}

function resolveScoreColor(score: number) {
  if (score >= 700) return "text-emerald-400";
  if (score >= 680) return "text-amber-400";
  return "text-rose-400";
}

export function ScoreCard({
  totalScore,
  loading = false,
  errorMessage = null,
}: ScoreCardProps) {
  if (errorMessage) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-xl p-4 text-sm font-medium">
        <i className="fa-solid fa-circle-info mr-2" aria-hidden="true" />
        {errorMessage}
      </div>
    );
  }

  const label = resolveScoreLabel(totalScore);
  const scoreClass = resolveScoreColor(totalScore);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center mb-6">
      <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">
        Alternative Credit Score (ACS)
      </div>

      <div
        className={`text-6xl font-bold font-mono mb-4 ${
          loading ? "text-slate-500" : scoreClass
        }`}
      >
        {loading ? "..." : totalScore}
      </div>

      <div className="text-xs font-bold px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full inline-block border border-indigo-500/30">
        {loading ? "Memuat score..." : label}
      </div>
    </div>
  );
}
```

---

## 5) `apps/web/components/bank/ScoreBreakdownTable.tsx`

```tsx
type ScoreFactor = {
  id: string;
  name: string;
  delta: number;
};

type ScoreBreakdownTableProps = {
  factors: ScoreFactor[];
  loading?: boolean;
  errorMessage?: string | null;
};

export function ScoreBreakdownTable({
  factors,
  loading = false,
  errorMessage = null,
}: ScoreBreakdownTableProps) {
  if (errorMessage) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-xl p-4 text-sm font-medium">
        <i className="fa-solid fa-circle-info mr-2" aria-hidden="true" />
        {errorMessage}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <tbody className="divide-y divide-slate-800 font-mono">
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td className="py-3 text-slate-500">Memuat...</td>
                <td className="py-3 text-right text-slate-500">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (factors.length === 0) {
    return (
      <div className="text-slate-600 text-sm italic">
        Belum ada faktor score.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <tbody className="divide-y divide-slate-800 font-mono">
          {factors.map((factor) => {
            const isPos = factor.delta >= 0;

            return (
              <tr key={factor.id}>
                <td className="py-3">
                  <span className="text-white">{factor.name}</span>
                </td>
                <td
                  className={`py-3 text-right font-bold ${
                    isPos ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPos ? "+" : ""}
                  {factor.delta}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 6) `apps/web/components/dashboard/LiveFinancePanel.tsx`

Ini container sederhana supaya sisi UMKM dan lender bisa pakai data nyata sekaligus.

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLedgerSummary } from "@/lib/api/ledger";
import { fetchScore, type ScoreFactor } from "@/lib/api/score";
import { LedgerSummaryCards } from "@/components/ledger/LedgerSummaryCards";
import { ScoreCard } from "@/components/bank/ScoreCard";
import { ScoreBreakdownTable } from "@/components/bank/ScoreBreakdownTable";

type LedgerState = {
  cashBalance: number;
  expenseTotal: number;
  priveTotal: number;
};

type ScoreState = {
  totalScore: number;
  factors: ScoreFactor[];
};

const INITIAL_LEDGER: LedgerState = {
  cashBalance: 0,
  expenseTotal: 0,
  priveTotal: 0,
};

const INITIAL_SCORE: ScoreState = {
  totalScore: 680,
  factors: [],
};

export function LiveFinancePanel() {
  const [ledger, setLedger] = useState<LedgerState>(INITIAL_LEDGER);
  const [score, setScore] = useState<ScoreState>(INITIAL_SCORE);

  const [loadingLedger, setLoadingLedger] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);

  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [scoreError, setScoreError] = useState<string | null>(null);

  const refreshLedger = useCallback(async () => {
    setLoadingLedger(true);
    setLedgerError(null);

    try {
      const res = await fetchLedgerSummary();

      if (res.success) {
        setLedger(res.data);
      } else {
        setLedgerError(res.error.message ?? "Gagal memuat ledger summary.");
      }
    } catch {
      setLedgerError("Gagal memuat ledger summary.");
    } finally {
      setLoadingLedger(false);
    }
  }, []);

  const refreshScore = useCallback(async () => {
    setLoadingScore(true);
    setScoreError(null);

    try {
      const res = await fetchScore();

      if (res.success) {
        setScore(res.data);
      } else {
        setScoreError(res.error.message ?? "Gagal memuat score.");
      }
    } catch {
      setScoreError("Gagal memuat score.");
    } finally {
      setLoadingScore(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshLedger(), refreshScore()]);
  }, [refreshLedger, refreshScore]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Live Financial State</h3>
        <button
          type="button"
          onClick={() => void refreshAll()}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg border border-slate-600"
        >
          Refresh Data
        </button>
      </div>

      <LedgerSummaryCards
        cashBalance={ledger.cashBalance}
        expenseTotal={ledger.expenseTotal}
        priveTotal={ledger.priveTotal}
        loading={loadingLedger}
        errorMessage={ledgerError}
      />

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-emerald-400" />
              Underwriting Signal
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Live data from /api/score
            </p>
          </div>
        </div>

        <ScoreCard
          totalScore={score.totalScore}
          loading={loadingScore}
          errorMessage={scoreError}
        />

        <h4 className="text-[11px] uppercase font-bold text-slate-500 mb-3 border-b border-slate-700 pb-2">
          Factorized Breakdown
        </h4>

        <ScoreBreakdownTable
          factors={score.factors}
          loading={loadingScore}
          errorMessage={scoreError}
        />
      </div>
    </div>
  );
}
```

---

# Cara pakai

## Di halaman UMKM

Kalau kamu mau hanya kartu saldo:

```tsx
import { LiveFinancePanel } from "@/components/dashboard/LiveFinancePanel";

export default function UmkmPage() {
  return (
    <main className="p-6">
      <LiveFinancePanel />
    </main>
  );
}
```

## Di halaman Bank

Kalau kamu ingin gabung dengan `BankEvidencePanel`:

```tsx
import { LiveFinancePanel } from "@/components/dashboard/LiveFinancePanel";
import { BankEvidencePanel } from "@/components/bank/BankEvidencePanel";

export default function BankPage() {
  return (
    <main className="p-6 space-y-8">
      <LiveFinancePanel />
      <BankEvidencePanel />
    </main>
  );
}
```

---

# Pola refresh yang saya sarankan

Setelah `POST /api/commit` sukses:

* refresh `/api/ledger/summary`
* refresh `/api/score`
* refresh `/api/audit/chain`

Jadi satu transaksi akan:

* mengubah saldo,
* mengubah score,
* menambah block.

Itu yang membuat demo terasa “hidup” dan membuat juri bilang:

> “oke, ini bukan sekadar HTML mahal.”

---

# Prompt Cursor berikutnya yang pas

```text
Read the existing frontend and backend contracts.
Add:
- apps/web/lib/api/ledger.ts
- apps/web/lib/api/score.ts
- apps/web/components/ledger/LedgerSummaryCards.tsx
- apps/web/components/bank/ScoreCard.tsx
- apps/web/components/bank/ScoreBreakdownTable.tsx
- apps/web/components/dashboard/LiveFinancePanel.tsx

Requirements:
- use no-store fetch
- keep contracts unchanged
- show loading and error states
- keep UI simple, hackathon-friendly, and production-minded
```

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan `POST /api/parse` dan helper frontend untuk flow teks/suara → parse → human review → commit, supaya alur UMKM kamu benar-benar end-to-end dari input sampai ledger.**

Siap. Saya lanjutkan dengan paket minimum supaya flow **UMKM end-to-end** hidup:

1. `POST /api/parse`
2. helper frontend untuk parse + commit
3. satu komponen/container React untuk:

   * input teks
   * hasil parse
   * human review bila ambigu
   * commit transaksi
   * refresh data setelah sukses

Saya buat dengan asumsi:

* **tanpa** OpenAI dulu untuk parser, supaya flow hidup stabil
* parser awal memakai **rule-based fallback** yang gampang diganti nanti ke Structured Outputs
* source of truth tetap backend

---

# 1) `apps/web/app/api/parse/route.ts`

```ts
import { NextResponse } from "next/server";
import { z } from "zod";

const ParseRequestSchema = z
  .object({
    rawText: z.string().min(1),
  })
  .strict();

type ParseIntent = "expense" | "prive" | "ambiguous" | "unknown";

function normalizeAmount(rawText: string): number {
  const text = rawText.toLowerCase();

  if (text.includes("6 juta") || text.includes("6jt")) return 6_000_000;
  if (text.includes("500 ribu") || text.includes("500rb") || text.includes("lima ratus ribu")) return 500_000;
  if (text.includes("300 ribu") || text.includes("300rb") || text.includes("tiga ratus ribu")) return 300_000;

  const jutaMatch = text.match(/(\d+)\s*juta/);
  if (jutaMatch) return Number(jutaMatch[1]) * 1_000_000;

  const ribuMatch = text.match(/(\d+)\s*ribu/);
  if (ribuMatch) return Number(ribuMatch[1]) * 1_000;

  const plainNumber = text.match(/(\d{3,})/);
  if (plainNumber) return Number(plainNumber[1]);

  return 0;
}

function parseTransaction(rawText: string) {
  const text = rawText.toLowerCase().trim();
  const amount = normalizeAmount(text);

  let intent: ParseIntent = "unknown";
  let debitAccount: string | null = null;
  let creditAccount: string | null = "Kas";
  let confidence = 0.7;
  let needsHumanReview = false;
  let reviewReason: string | null = null;

  const hasTakeCash =
    text.includes("ambil uang kas") ||
    text.includes("ambil kas") ||
    text.includes("tarik kas") ||
    text.includes("ambil uang");

  const hasExpenseSignal =
    text.includes("bayar") ||
    text.includes("beli") ||
    text.includes("tagihan") ||
    text.includes("listrik") ||
    text.includes("beban");

  if (hasTakeCash) {
    intent = "ambiguous";
    debitAccount = null;
    confidence = 0.82;
    needsHumanReview = true;
    reviewReason = "ENTITY_SEPARATION_AMBIGUOUS";
  } else if (hasExpenseSignal) {
    intent = "expense";
    debitAccount = text.includes("listrik")
      ? "Beban Listrik"
      : "Beban Operasional";
    confidence = 0.96;
  } else {
    intent = "ambiguous";
    debitAccount = null;
    confidence = 0.6;
    needsHumanReview = true;
    reviewReason = "UNKNOWN_INTENT";
  }

  return {
    rawText,
    intent,
    amount,
    currency: "IDR" as const,
    debitAccount,
    creditAccount,
    confidence,
    needsHumanReview,
    reviewReason,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ParseRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Payload parse tidak valid",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const result = parseTransaction(parsed.data.rawText);

    if (result.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Nominal transaksi tidak berhasil dikenali",
            details: {
              rawText: parsed.data.rawText,
            },
          },
        },
        { status: 422 }
      );
    }

    if (result.needsHumanReview) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NEEDS_HUMAN_REVIEW",
            message: "Transaksi ambigu dan memerlukan klarifikasi pengguna",
            details: result,
          },
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/parse error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan internal saat parse transaksi",
          details: {},
        },
      },
      { status: 500 }
    );
  }
}
```

---

# 2) `apps/web/lib/api/transaction.ts`

```ts
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ParseSuccessData = {
  rawText: string;
  intent: "expense" | "prive" | "ambiguous" | "unknown";
  amount: number;
  currency: "IDR";
  debitAccount: string | null;
  creditAccount: string | null;
  confidence: number;
  needsHumanReview: boolean;
  reviewReason: string | null;
};

export type ParseResponse =
  | {
      success: true;
      data: ParseSuccessData;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    };

export type CommitResponse =
  | {
      success: true;
      data: {
        transactionId: string;
        journalEntries: Array<{
          accountName: string;
          entryType: "debit" | "credit";
          amount: number;
        }>;
        ledgerSummary: {
          cashBalance: number;
          expenseTotal: number;
          priveTotal: number;
        };
        scoreSnapshot: {
          totalScore: number;
          factors: Array<{
            id: string;
            name: string;
            delta: number;
          }>;
        };
        vaultBlock: {
          blockIndex: number;
          transactionId: string;
          canonicalPayload: string;
          prevHash: string;
          hash: string;
        };
      };
    }
  | {
      success: false;
      error: ApiError;
    };

async function safeJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function postParseTransaction(rawText: string): Promise<ParseResponse> {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ rawText }),
  });

  return safeJson<ParseResponse>(res);
}

export async function postCommitTransaction(input: {
  rawText: string;
  intent: "expense" | "prive";
  amount: number;
  currency: "IDR";
  debitAccount: string;
  creditAccount: string;
  reviewResolution?: string | null;
  confidence?: number | null;
}): Promise<CommitResponse> {
  const res = await fetch("/api/commit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  return safeJson<CommitResponse>(res);
}
```

---

# 3) `apps/web/components/input/TransactionInputConsole.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";
import {
  postCommitTransaction,
  postParseTransaction,
  type ParseSuccessData,
} from "@/lib/api/transaction";

type TransactionInputConsoleProps = {
  onCommitted?: () => Promise<void> | void;
};

function formatRp(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

export function TransactionInputConsole({
  onCommitted,
}: TransactionInputConsoleProps) {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);

  const [parseResult, setParseResult] = useState<ParseSuccessData | null>(null);
  const [reviewPayload, setReviewPayload] = useState<ParseSuccessData | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"info" | "success" | "error">("info");

  const canSubmit = useMemo(() => rawText.trim().length > 0, [rawText]);

  async function handleParse() {
    if (!canSubmit) return;

    setLoading(true);
    setMessage(null);
    setParseResult(null);
    setReviewPayload(null);

    try {
      const res = await postParseTransaction(rawText);

      if (res.success) {
        setParseResult(res.data);
        setMessage("Parse berhasil. Transaksi siap di-commit.");
        setMessageKind("success");
        return;
      }

      if (res.error.code === "NEEDS_HUMAN_REVIEW") {
        setReviewPayload(res.error.details as ParseSuccessData);
        setMessage("Transaksi ambigu. Pilih klasifikasi sebelum commit.");
        setMessageKind("info");
        return;
      }

      setMessage(res.error.message ?? "Gagal mem-parse transaksi.");
      setMessageKind("error");
    } catch {
      setMessage("Gagal mem-parse transaksi.");
      setMessageKind("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit(payload: {
    rawText: string;
    intent: "expense" | "prive";
    amount: number;
    currency: "IDR";
    debitAccount: string;
    creditAccount: string;
    reviewResolution?: string | null;
    confidence?: number | null;
  }) {
    setCommitLoading(true);
    setMessage(null);

    try {
      const res = await postCommitTransaction(payload);

      if (res.success) {
        setMessage(
          `Commit sukses. Txn: ${res.data.transactionId}, Block: #${res.data.vaultBlock.blockIndex}`
        );
        setMessageKind("success");
        setParseResult(null);
        setReviewPayload(null);
        setRawText("");

        if (onCommitted) {
          await onCommitted();
        }
        return;
      }

      setMessage(res.error.message ?? "Commit transaksi gagal.");
      setMessageKind("error");
    } catch {
      setMessage("Commit transaksi gagal.");
      setMessageKind("error");
    } finally {
      setCommitLoading(false);
    }
  }

  async function handleCommitParsed() {
    if (!parseResult) return;

    await handleCommit({
      rawText: parseResult.rawText,
      intent: parseResult.intent === "expense" ? "expense" : "prive",
      amount: parseResult.amount,
      currency: parseResult.currency,
      debitAccount: parseResult.debitAccount ?? "Beban Operasional",
      creditAccount: parseResult.creditAccount ?? "Kas",
      confidence: parseResult.confidence,
      reviewResolution: null,
    });
  }

  async function handleResolveAndCommit(resolution: "prive" | "expense") {
    if (!reviewPayload) return;

    await handleCommit({
      rawText: reviewPayload.rawText,
      intent: resolution,
      amount: reviewPayload.amount,
      currency: reviewPayload.currency,
      debitAccount:
        resolution === "prive" ? "Prive Pemilik" : "Beban Operasional",
      creditAccount: reviewPayload.creditAccount ?? "Kas",
      confidence: reviewPayload.confidence,
      reviewResolution: resolution,
    });
  }

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            Input Transaksi UMKM
          </h2>
          <p className="text-sm text-slate-400">
            Tulis transaksi natural. Sistem akan parse, validasi, lalu commit ke ledger.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder='Contoh: "Bayar tagihan listrik ruko 300 ribu"'
            className="w-full min-h-[120px] rounded-xl bg-slate-900 border border-slate-700 p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRawText("Bayar tagihan listrik ruko 300 ribu")}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Mock Expense
            </button>

            <button
              type="button"
              onClick={() => setRawText("Ambil uang kas 500 ribu")}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Mock Ambiguous
            </button>

            <button
              type="button"
              onClick={() => setRawText("Beli mesin kopi 6 juta")}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Mock Insufficient
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void handleParse()}
            disabled={!canSubmit || loading || commitLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mem-parse..." : "Parse Transaksi"}
          </button>

          <button
            type="button"
            onClick={() => {
              setRawText("");
              setParseResult(null);
              setReviewPayload(null);
              setMessage(null);
            }}
            disabled={loading || commitLoading}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg disabled:opacity-50"
          >
            Reset
          </button>
        </div>

        {message && (
          <div
            className={[
              "rounded-xl border p-4 text-sm font-medium",
              messageKind === "success"
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                : messageKind === "error"
                ? "bg-rose-950/40 border-rose-500/30 text-rose-400"
                : "bg-amber-950/40 border-amber-500/30 text-amber-400",
            ].join(" ")}
          >
            {message}
          </div>
        )}

        {parseResult && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">Hasil Parse</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="text-slate-400">
                Intent: <span className="text-white font-semibold">{parseResult.intent}</span>
              </div>
              <div className="text-slate-400">
                Amount: <span className="text-white font-semibold">{formatRp(parseResult.amount)}</span>
              </div>
              <div className="text-slate-400">
                Debit: <span className="text-white font-semibold">{parseResult.debitAccount}</span>
              </div>
              <div className="text-slate-400">
                Credit: <span className="text-white font-semibold">{parseResult.creditAccount}</span>
              </div>
              <div className="text-slate-400">
                Confidence:{" "}
                <span className="text-white font-semibold">
                  {Math.round(parseResult.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => void handleCommitParsed()}
                disabled={commitLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
              >
                {commitLoading ? "Meng-commit..." : "Commit ke Ledger"}
              </button>
            </div>
          </div>
        )}

        {reviewPayload && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-amber-400 mb-1">
                Human Review Dibutuhkan
              </h3>
              <p className="text-sm text-slate-300">
                Sistem mendeteksi ambiguitas pemisahan entitas. Pilih klasifikasi transaksi:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="text-slate-400">
                Raw Text: <span className="text-white">{reviewPayload.rawText}</span>
              </div>
              <div className="text-slate-400">
                Amount: <span className="text-white">{formatRp(reviewPayload.amount)}</span>
              </div>
              <div className="text-slate-400">
                Reason: <span className="text-white">{reviewPayload.reviewReason}</span>
              </div>
              <div className="text-slate-400">
                Confidence:{" "}
                <span className="text-white">
                  {Math.round(reviewPayload.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleResolveAndCommit("prive")}
                disabled={commitLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
              >
                {commitLoading ? "Meng-commit..." : "Klasifikasikan sebagai Prive"}
              </button>

              <button
                type="button"
                onClick={() => void handleResolveAndCommit("expense")}
                disabled={commitLoading}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
              >
                {commitLoading ? "Meng-commit..." : "Klasifikasikan sebagai Beban"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

# 4) Contoh integrasi: `apps/web/components/dashboard/UmkmFlowPanel.tsx`

Komponen ini menggabungkan:

* input + parse + human review + commit
* ledger summary + score
* callback refresh ke panel lain

```tsx
"use client";

import { useCallback } from "react";
import { TransactionInputConsole } from "@/components/input/TransactionInputConsole";
import { LiveFinancePanel } from "@/components/dashboard/LiveFinancePanel";

export function UmkmFlowPanel() {
  const handleCommitted = useCallback(async () => {
    // Placeholder:
    // di versi berikutnya bisa trigger event bus / query invalidation
    // untuk sekarang biarkan komponen lain refresh manual atau via remount.
  }, []);

  return (
    <div className="space-y-8">
      <TransactionInputConsole onCommitted={handleCommitted} />
      <LiveFinancePanel />
    </div>
  );
}
```

---

# 5) Cara pakai di page

Misalnya di:
`apps/web/app/(dashboard)/umkm/page.tsx`

```tsx
import { UmkmFlowPanel } from "@/components/dashboard/UmkmFlowPanel";

export default function UmkmPage() {
  return (
    <main className="p-6">
      <UmkmFlowPanel />
    </main>
  );
}
```

---

# Flow yang sekarang sudah hidup

Dengan file-file di atas, kamu sudah punya flow ini:

## Happy path

1. user tulis: `Bayar tagihan listrik ruko 300 ribu`
2. `POST /api/parse`
3. parse sukses
4. user klik commit
5. `POST /api/commit`
6. ledger + score + vault block tercipta

## Ambiguous path

1. user tulis: `Ambil uang kas 500 ribu`
2. `POST /api/parse`
3. backend balas `NEEDS_HUMAN_REVIEW`
4. UI tampilkan pilihan:

   * klasifikasikan sebagai prive
   * klasifikasikan sebagai beban
5. user pilih
6. commit lanjut

## Insufficient funds path

1. user tulis: `Beli mesin kopi 6 juta`
2. parse sukses
3. commit ditolak guardrail
4. tidak ada jurnal / saldo / block baru

---

# Catatan penting

## Kenapa parser awal dibuat rule-based dulu

Karena kamu butuh flow hidup yang:

* stabil,
* gampang dites,
* dan tidak bergantung penuh pada prompt/LLM saat pondasi backend belum rapat.

Nanti tinggal ganti isi `parseTransaction()` dengan:

* OpenAI Structured Outputs
* plus fallback local parser bila model gagal

Jadi ini bukan kompromi jelek; ini fondasi yang waras.

## Kenapa parse ambigu saya return sebagai `422`

Karena parse-nya memang berhasil membaca teks, tetapi hasilnya **belum layak untuk commit otomatis**. Itu lebih jujur daripada berpura-pura semua adalah success lurus.

---

# Prompt Cursor berikutnya yang pas

```text
Read docs/api-contracts.md and existing frontend/backend code.
Add:
- apps/web/app/api/parse/route.ts
- apps/web/lib/api/transaction.ts
- apps/web/components/input/TransactionInputConsole.tsx
- apps/web/components/dashboard/UmkmFlowPanel.tsx

Requirements:
- keep parser rule-based for now
- support happy path, ambiguous human review, and insufficient funds flow
- preserve existing commit contract
- do not add auth
- keep the UI hackathon-friendly and simple
```

Saran langkah berikutnya: **kalau kamu mau, saya bisa lanjut buatkan integrasi voice nyata (`MediaRecorder` → `/api/transcribe` → `/api/parse`) agar positioning “voice-first” KasAI tidak hanya jadi janji manis di hero section.**

Siap. Kita buat jalur **voice nyata** yang stabil untuk hackathon:

**Browser**
`MediaRecorder` → kirim `audio/webm` ke `/api/transcribe`

**Backend**
`/api/transcribe` → transkrip teks

**Frontend**
hasil transkrip → otomatis isi input / langsung kirim ke `/api/parse`

Saya sarankan jalur ini dulu:

* **rekam audio 3–10 detik**
* kirim ke backend
* backend transkrip
* frontend tampilkan transcript
* user bisa:

  * review dulu, atau
  * langsung parse

Itu lebih aman untuk demo daripada mode “langsung commit dari mic” yang terlalu optimistis.

Di bawah ini saya kasih 5 file:

1. `apps/web/app/api/transcribe/route.ts`
2. `apps/web/lib/api/transcribe.ts`
3. `apps/web/hooks/useVoiceRecorder.ts`
4. `apps/web/components/input/VoiceRecorder.tsx`
5. update `TransactionInputConsole.tsx` agar bisa menerima transcript dari voice

---

# 1) `apps/web/app/api/transcribe/route.ts`

Versi ini **siap hidup** dengan 2 mode:

* **mode demo lokal**: fallback mock transcript bila `OPENAI_API_KEY` belum diisi
* **mode nyata**: panggil OpenAI STT

```ts
import { NextResponse } from "next/server";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

function jsonError(status: number, code: string, message: string, details: unknown = {}) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

async function mockTranscriptFromFilename(file: File) {
  const name = file.name.toLowerCase();

  if (name.includes("listrik")) {
    return "Bayar tagihan listrik ruko 300 ribu";
  }

  if (name.includes("kas")) {
    return "Ambil uang kas 500 ribu";
  }

  return "Bayar tagihan listrik ruko 300 ribu";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return jsonError(400, "BAD_REQUEST", "File audio wajib dikirim pada field 'audio'");
    }

    if (audio.size <= 0) {
      return jsonError(400, "BAD_REQUEST", "File audio kosong");
    }

    if (audio.size > MAX_FILE_SIZE_BYTES) {
      return jsonError(413, "VALIDATION_ERROR", "Ukuran file audio melebihi batas 25MB", {
        maxBytes: MAX_FILE_SIZE_BYTES,
        actualBytes: audio.size,
      });
    }

    const mimeType = audio.type || "application/octet-stream";
    const supportedTypes = new Set([
      "audio/webm",
      "audio/wav",
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
      "audio/x-wav",
    ]);

    if (!supportedTypes.has(mimeType)) {
      return jsonError(415, "VALIDATION_ERROR", "Format audio belum didukung", {
        mimeType,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Fallback demo mode: tetap hidup walau API key belum ada
    if (!apiKey) {
      const transcript = await mockTranscriptFromFilename(audio);

      return NextResponse.json(
        {
          success: true,
          data: {
            transcript,
            provider: "mock",
          },
        },
        { status: 200 }
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("file", audio, audio.name || "recording.webm");
    upstreamForm.append("model", "gpt-4o-mini-transcribe");

    const upstream = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstreamForm,
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      return jsonError(502, "UPSTREAM_ERROR", "Gagal mentranskrip audio melalui provider AI", {
        upstreamStatus: upstream.status,
        upstreamBody: errorText,
      });
    }

    const result = (await upstream.json()) as { text?: string };
    const transcript = result.text?.trim();

    if (!transcript) {
      return jsonError(502, "UPSTREAM_ERROR", "Provider AI tidak mengembalikan transcript");
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          transcript,
          provider: "openai",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/transcribe error:", error);

    return jsonError(500, "INTERNAL_ERROR", "Terjadi kesalahan internal saat mentranskrip audio");
  }
}
```

---

# 2) `apps/web/lib/api/transcribe.ts`

```ts
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type TranscribeResponse =
  | {
      success: true;
      data: {
        transcript: string;
        provider: "mock" | "openai";
      };
    }
  | {
      success: false;
      error: ApiError;
    };

async function safeJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function postTranscribeAudio(blob: Blob, fileName = "recording.webm"): Promise<TranscribeResponse> {
  const form = new FormData();
  form.append("audio", blob, fileName);

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: form,
  });

  return safeJson<TranscribeResponse>(res);
}
```

---

# 3) `apps/web/hooks/useVoiceRecorder.ts`

Hook ini:

* minta akses mic
* rekam audio
* stop
* hasilkan `Blob`
* expose status sederhana

```ts
"use client";

import { useCallback, useRef, useState } from "react";

type RecorderState = "idle" | "requesting" | "recording" | "stopped" | "error";

type UseVoiceRecorderResult = {
  state: RecorderState;
  errorMessage: string | null;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
};

export function useVoiceRecorder(): UseVoiceRecorderResult {
  const [state, setState] = useState<RecorderState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const cleanupStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const resetRecording = useCallback(() => {
    cleanupStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setAudioBlob(null);
    setErrorMessage(null);
    setState("idle");
  }, [cleanupStream]);

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage(null);
      setAudioBlob(null);
      setState("requesting");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser tidak mendukung getUserMedia");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setErrorMessage("Terjadi kesalahan saat merekam audio.");
        setState("error");
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setState("stopped");
        cleanupStream();
      };

      recorder.start();
      setState("recording");
    } catch (error) {
      console.error("startRecording error:", error);
      setErrorMessage("Gagal mengakses mikrofon. Pastikan HTTPS/localhost dan izin mic aktif.");
      setState("error");
      cleanupStream();
    }
  }, [cleanupStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    state,
    errorMessage,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
```

---

# 4) `apps/web/components/input/VoiceRecorder.tsx`

Komponen ini:

* rekam audio
* kirim ke `/api/transcribe`
* tampilkan transcript
* kirim transcript ke parent

```tsx
"use client";

import { useState } from "react";
import { postTranscribeAudio } from "@/lib/api/transcribe";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

type VoiceRecorderProps = {
  onTranscriptReady?: (transcript: string) => void;
};

export function VoiceRecorder({ onTranscriptReady }: VoiceRecorderProps) {
  const {
    state,
    errorMessage,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [infoKind, setInfoKind] = useState<"info" | "success" | "error">("info");

  async function handleTranscribe() {
    if (!audioBlob) return;

    setTranscribing(true);
    setInfoMessage(null);

    try {
      const res = await postTranscribeAudio(audioBlob);

      if (!res.success) {
        setInfoKind("error");
        setInfoMessage(res.error.message ?? "Gagal mentranskrip audio.");
        return;
      }

      setTranscript(res.data.transcript);
      setInfoKind("success");
      setInfoMessage(
        `Transkripsi berhasil (${res.data.provider === "openai" ? "OpenAI" : "Mock Demo"}).`
      );

      onTranscriptReady?.(res.data.transcript);
    } catch {
      setInfoKind("error");
      setInfoMessage("Gagal mentranskrip audio.");
    } finally {
      setTranscribing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Voice Recorder</h3>
        <p className="text-xs text-slate-400">
          Rekam transaksi suara, transkripkan, lalu teruskan ke parser.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {state !== "recording" ? (
          <button
            type="button"
            onClick={() => void startRecording()}
            disabled={transcribing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
          >
            <i className="fa-solid fa-microphone mr-2" />
            Mulai Rekam
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg"
          >
            <i className="fa-solid fa-stop mr-2" />
            Stop Rekam
          </button>
        )}

        <button
          type="button"
          onClick={() => void handleTranscribe()}
          disabled={!audioBlob || transcribing || state === "recording"}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
        >
          <i className="fa-solid fa-waveform-lines mr-2" />
          {transcribing ? "Mentranskrip..." : "Transkrip Audio"}
        </button>

        <button
          type="button"
          onClick={resetRecording}
          disabled={state === "recording" || transcribing}
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      <div className="text-xs text-slate-400">
        Status recorder: <span className="font-semibold text-white">{state}</span>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm text-rose-400">
          {errorMessage}
        </div>
      )}

      {infoMessage && (
        <div
          className={[
            "rounded-xl border p-4 text-sm",
            infoKind === "success"
              ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
              : infoKind === "error"
              ? "border-rose-500/30 bg-rose-950/40 text-rose-400"
              : "border-amber-500/30 bg-amber-950/40 text-amber-400",
          ].join(" ")}
        >
          {infoMessage}
        </div>
      )}

      {transcript && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Transcript</div>
          <div className="text-sm text-white">{transcript}</div>
        </div>
      )}
    </div>
  );
}
```

---

# 5) Update `TransactionInputConsole.tsx`

Tambahkan `VoiceRecorder` dan biarkan transcript otomatis mengisi textarea.

Di bawah ini versi yang sudah disuntikkan voice. Kalau kamu sudah punya file sebelumnya, fokus ke:

* import `VoiceRecorder`
* tambahkan handler `handleTranscriptReady`
* render `<VoiceRecorder />`

```tsx
"use client";

import { useMemo, useState } from "react";
import {
  postCommitTransaction,
  postParseTransaction,
  type ParseSuccessData,
} from "@/lib/api/transaction";
import { VoiceRecorder } from "@/components/input/VoiceRecorder";

type TransactionInputConsoleProps = {
  onCommitted?: () => Promise<void> | void;
};

function formatRp(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

export function TransactionInputConsole({
  onCommitted,
}: TransactionInputConsoleProps) {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);

  const [parseResult, setParseResult] = useState<ParseSuccessData | null>(null);
  const [reviewPayload, setReviewPayload] = useState<ParseSuccessData | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"info" | "success" | "error">("info");

  const canSubmit = useMemo(() => rawText.trim().length > 0, [rawText]);

  function handleTranscriptReady(transcript: string) {
    setRawText(transcript);
    setMessage("Transcript siap. Lanjutkan dengan parse transaksi.");
    setMessageKind("info");
    setParseResult(null);
    setReviewPayload(null);
  }

  async function handleParse() {
    if (!canSubmit) return;

    setLoading(true);
    setMessage(null);
    setParseResult(null);
    setReviewPayload(null);

    try {
      const res = await postParseTransaction(rawText);

      if (res.success) {
        setParseResult(res.data);
        setMessage("Parse berhasil. Transaksi siap di-commit.");
        setMessageKind("success");
        return;
      }

      if (res.error.code === "NEEDS_HUMAN_REVIEW") {
        setReviewPayload(res.error.details as ParseSuccessData);
        setMessage("Transaksi ambigu. Pilih klasifikasi sebelum commit.");
        setMessageKind("info");
        return;
      }

      setMessage(res.error.message ?? "Gagal mem-parse transaksi.");
      setMessageKind("error");
    } catch {
      setMessage("Gagal mem-parse transaksi.");
      setMessageKind("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit(payload: {
    rawText: string;
    intent: "expense" | "prive";
    amount: number;
    currency: "IDR";
    debitAccount: string;
    creditAccount: string;
    reviewResolution?: string | null;
    confidence?: number | null;
  }) {
    setCommitLoading(true);
    setMessage(null);

    try {
      const res = await postCommitTransaction(payload);

      if (res.success) {
        setMessage(
          `Commit sukses. Txn: ${res.data.transactionId}, Block: #${res.data.vaultBlock.blockIndex}`
        );
        setMessageKind("success");
        setParseResult(null);
        setReviewPayload(null);
        setRawText("");

        if (onCommitted) {
          await onCommitted();
        }
        return;
      }

      setMessage(res.error.message ?? "Commit transaksi gagal.");
      setMessageKind("error");
    } catch {
      setMessage("Commit transaksi gagal.");
      setMessageKind("error");
    } finally {
      setCommitLoading(false);
    }
  }

  async function handleCommitParsed() {
    if (!parseResult) return;

    await handleCommit({
      rawText: parseResult.rawText,
      intent: parseResult.intent === "expense" ? "expense" : "prive",
      amount: parseResult.amount,
      currency: parseResult.currency,
      debitAccount: parseResult.debitAccount ?? "Beban Operasional",
      creditAccount: parseResult.creditAccount ?? "Kas",
      confidence: parseResult.confidence,
      reviewResolution: null,
    });
  }

  async function handleResolveAndCommit(resolution: "prive" | "expense") {
    if (!reviewPayload) return;

    await handleCommit({
      rawText: reviewPayload.rawText,
      intent: resolution,
      amount: reviewPayload.amount,
      currency: reviewPayload.currency,
      debitAccount:
        resolution === "prive" ? "Prive Pemilik" : "Beban Operasional",
      creditAccount: reviewPayload.creditAccount ?? "Kas",
      confidence: reviewPayload.confidence,
      reviewResolution: resolution,
    });
  }

  return (
    <div className="space-y-6">
      <VoiceRecorder onTranscriptReady={handleTranscriptReady} />

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Input Transaksi UMKM
            </h2>
            <p className="text-sm text-slate-400">
              Tulis atau transkripkan transaksi natural. Sistem akan parse, validasi, lalu commit ke ledger.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder='Contoh: "Bayar tagihan listrik ruko 300 ribu"'
              className="w-full min-h-[120px] rounded-xl bg-slate-900 border border-slate-700 p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRawText("Bayar tagihan listrik ruko 300 ribu")}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Mock Expense
              </button>

              <button
                type="button"
                onClick={() => setRawText("Ambil uang kas 500 ribu")}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Mock Ambiguous
              </button>

              <button
                type="button"
                onClick={() => setRawText("Beli mesin kopi 6 juta")}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Mock Insufficient
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void handleParse()}
              disabled={!canSubmit || loading || commitLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mem-parse..." : "Parse Transaksi"}
            </button>

            <button
              type="button"
              onClick={() => {
                setRawText("");
                setParseResult(null);
                setReviewPayload(null);
                setMessage(null);
              }}
              disabled={loading || commitLoading}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          {message && (
            <div
              className={[
                "rounded-xl border p-4 text-sm font-medium",
                messageKind === "success"
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  : messageKind === "error"
                  ? "bg-rose-950/40 border-rose-500/30 text-rose-400"
                  : "bg-amber-950/40 border-amber-500/30 text-amber-400",
              ].join(" ")}
            >
              {message}
            </div>
          )}

          {parseResult && (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Hasil Parse</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="text-slate-400">
                  Intent: <span className="text-white font-semibold">{parseResult.intent}</span>
                </div>
                <div className="text-slate-400">
                  Amount: <span className="text-white font-semibold">{formatRp(parseResult.amount)}</span>
                </div>
                <div className="text-slate-400">
                  Debit: <span className="text-white font-semibold">{parseResult.debitAccount}</span>
                </div>
                <div className="text-slate-400">
                  Credit: <span className="text-white font-semibold">{parseResult.creditAccount}</span>
                </div>
                <div className="text-slate-400">
                  Confidence:{" "}
                  <span className="text-white font-semibold">
                    {Math.round(parseResult.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => void handleCommitParsed()}
                  disabled={commitLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                >
                  {commitLoading ? "Meng-commit..." : "Commit ke Ledger"}
                </button>
              </div>
            </div>
          )}

          {reviewPayload && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-amber-400 mb-1">
                  Human Review Dibutuhkan
                </h3>
                <p className="text-sm text-slate-300">
                  Sistem mendeteksi ambiguitas pemisahan entitas. Pilih klasifikasi transaksi:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="text-slate-400">
                  Raw Text: <span className="text-white">{reviewPayload.rawText}</span>
                </div>
                <div className="text-slate-400">
                  Amount: <span className="text-white">{formatRp(reviewPayload.amount)}</span>
                </div>
                <div className="text-slate-400">
                  Reason: <span className="text-white">{reviewPayload.reviewReason}</span>
                </div>
                <div className="text-slate-400">
                  Confidence:{" "}
                  <span className="text-white">
                    {Math.round(reviewPayload.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleResolveAndCommit("prive")}
                  disabled={commitLoading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                >
                  {commitLoading ? "Meng-commit..." : "Klasifikasikan sebagai Prive"}
                </button>

                <button
                  type="button"
                  onClick={() => void handleResolveAndCommit("expense")}
                  disabled={commitLoading}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                >
                  {commitLoading ? "Meng-commit..." : "Klasifikasikan sebagai Beban"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

# Kenapa jalur ini tepat

## Yang sekarang benar-benar hidup

* mic browser
* rekam audio nyata
* kirim blob ke backend
* backend transkrip
* transcript masuk ke input box
* transcript diparse
* kalau ambigu → human review
* kalau jelas → commit ke ledger

Jadi positioning **voice-first** sekarang sudah punya tulang, bukan cuma poster kampanye teknologi.

## Kenapa transcript tidak langsung auto-commit

Karena itu lebih aman untuk demo dan lebih selaras dengan narasi guardrail:

* AI boleh dengar
* AI boleh bantu baca
* tapi keputusan commit tetap melewati validasi dan, jika perlu, intervensi manusia

Itu justru selling point KasAI.

---

# Prompt Cursor berikutnya yang pas

```text
Read docs/architecture.md and existing transaction flow.
Add real voice input support with:
- apps/web/app/api/transcribe/route.ts
- apps/web/lib/api/transcribe.ts
- apps/web/hooks/useVoiceRecorder.ts
- apps/web/components/input/VoiceRecorder.tsx

Then update TransactionInputConsole.tsx so transcript from voice recording automatically fills the text input and can be parsed/committed through the existing flow.

Requirements:
- support MediaRecorder
- send FormData to /api/transcribe
- keep text fallback
- do not auto-commit after transcription
- keep the UI demo-friendly and stable
```

Saran langkah berikutnya: **kalau kamu mau, saya bisa bantu bungkus semua yang sudah kita buat menjadi satu checklist implementasi final + urutan prompt Cursor paling efisien, supaya kamu tinggal eksekusi tanpa lompat-lompat file.**

Siap. Di bawah ini saya bungkus jadi **paket eksekusi final** yang bisa kamu pakai langsung di Cursor tanpa zig-zag.

---

# Checklist implementasi final KasAI

## Fase 0 — Fondasi repo

* [ ] Buat struktur folder repo
* [ ] Tambahkan `docs/architecture.md`
* [ ] Tambahkan `docs/api-contracts.md`
* [ ] Tambahkan `docs/milestone-mvp.md`
* [ ] Tambahkan `.env.example`
* [ ] Tambahkan `prisma/schema.prisma`
* [ ] Tambahkan `prisma/seed.ts`
* [ ] Jalankan migration + seed

## Fase 1 — Backend inti

* [ ] `lib/db.ts`
* [ ] repository:

  * [ ] `transaction.repository.ts`
  * [ ] `score.repository.ts`
  * [ ] `vault.repository.ts`
* [ ] services:

  * [ ] `guardrail.service.ts`
  * [ ] `score.service.ts`
  * [ ] `vault.service.ts`
  * [ ] `ledger.service.ts`
  * [ ] `audit.service.ts`

## Fase 2 — API inti

* [ ] `POST /api/parse`
* [ ] `POST /api/commit`
* [ ] `GET /api/ledger/summary`
* [ ] `GET /api/score`
* [ ] `GET /api/audit/chain`
* [ ] `GET /api/audit/verify`
* [ ] `POST /api/demo/tamper`
* [ ] `POST /api/transcribe`

## Fase 3 — Frontend data layer

* [ ] `lib/api/transaction.ts`
* [ ] `lib/api/ledger.ts`
* [ ] `lib/api/score.ts`
* [ ] `lib/api/audit.ts`
* [ ] `hooks/useVoiceRecorder.ts`

## Fase 4 — Frontend UI

* [ ] `VoiceRecorder.tsx`
* [ ] `TransactionInputConsole.tsx`
* [ ] `LedgerSummaryCards.tsx`
* [ ] `ScoreCard.tsx`
* [ ] `ScoreBreakdownTable.tsx`
* [ ] `VerifyBanner.tsx`
* [ ] `VaultChainTable.tsx`
* [ ] `LiveFinancePanel.tsx`
* [ ] `BankEvidencePanel.tsx`
* [ ] `UmkmFlowPanel.tsx`

## Fase 5 — Integrasi halaman

* [ ] `app/(dashboard)/umkm/page.tsx`
* [ ] `app/(dashboard)/bank/page.tsx`
* [ ] wire refresh setelah commit
* [ ] wire tamper → reload chain → verify

## Fase 6 — Stabilitas demo

* [ ] seed demo business
* [ ] seed saldo awal Rp5.000.000
* [ ] test 3 skenario:

  * [ ] happy
  * [ ] ambiguous
  * [ ] insufficient funds
* [ ] test tamper demo
* [ ] test verify pass/fail
* [ ] test voice recording di localhost/HTTPS

## Fase 7 — Deploy

* [ ] siapkan Dockerfile / Nixpacks
* [ ] deploy ke Coolify
* [ ] setup PostgreSQL
* [ ] setup Redis jika dipakai
* [ ] setup DuckDNS
* [ ] set env vars
* [ ] smoke test public URL

---

# Urutan prompt Cursor paling efisien

## Prompt 1 — repo foundation

```text
Read docs/architecture.md, docs/api-contracts.md, and docs/milestone-mvp.md.
Set up the repository foundation for a Next.js + TypeScript + Prisma monorepo.
Create only the folder structure, .env.example, prisma/schema.prisma, prisma/seed.ts, lib/db.ts, and package configuration.
Do not implement route handlers or UI yet.
```

## Prompt 2 — Prisma + seed

```text
Use prisma/schema.prisma as source of truth.
Generate the Prisma models, migration-ready schema, and seed.ts for:
- Business
- User
- Transaction
- JournalEntry
- BalanceSnapshot
- ScoreSnapshot
- VaultBlock
- AudioUpload
- AuditEvent

Seed one demo business with initial cash balance Rp5.000.000.
Do not add auth.
```

## Prompt 3 — repositories

```text
Read docs/architecture.md and prisma/schema.prisma.
Implement:
- server/repositories/transaction.repository.ts
- server/repositories/score.repository.ts
- server/repositories/vault.repository.ts

Requirements:
- use Prisma Client
- repository methods must be small and focused
- no route handlers yet
```

## Prompt 4 — services

```text
Read docs/architecture.md and docs/api-contracts.md.
Implement:
- server/services/guardrail.service.ts
- server/services/score.service.ts
- server/services/vault.service.ts
- server/services/ledger.service.ts
- server/services/audit.service.ts

Requirements:
- use repositories instead of raw Prisma where possible
- keep services deterministic
- do not touch UI yet
```

## Prompt 5 — commit + parse endpoints

```text
Read docs/api-contracts.md.
Implement:
- app/api/parse/route.ts
- app/api/commit/route.ts

Requirements:
- use Zod validation
- preserve response envelopes exactly
- parser is rule-based for now
- support happy path, ambiguity, and insufficient funds flow
```

## Prompt 6 — read-model endpoints

```text
Read docs/api-contracts.md.
Implement:
- app/api/ledger/summary/route.ts
- app/api/score/route.ts
- app/api/audit/chain/route.ts
- app/api/audit/verify/route.ts
- app/api/demo/tamper/route.ts

Requirements:
- preserve contracts exactly
- use existing repositories/services
- demo tamper endpoint must be guarded by DEMO_MODE
```

## Prompt 7 — transcribe endpoint

```text
Implement app/api/transcribe/route.ts.

Requirements:
- accept FormData field 'audio'
- validate file size <= 25MB
- support audio/webm and common audio mime types
- if OPENAI_API_KEY is missing, use a demo fallback transcript
- if OPENAI_API_KEY exists, call OpenAI audio transcription API
- preserve response envelope
```

## Prompt 8 — frontend API helpers

```text
Create:
- lib/api/transaction.ts
- lib/api/ledger.ts
- lib/api/score.ts
- lib/api/audit.ts
- lib/api/transcribe.ts

Requirements:
- use fetch
- use no-store for GETs
- preserve backend contracts exactly
- export typed responses
```

## Prompt 9 — voice hook

```text
Create hooks/useVoiceRecorder.ts.

Requirements:
- use getUserMedia
- use MediaRecorder
- expose state, errorMessage, audioBlob, startRecording, stopRecording, resetRecording
- keep implementation browser-safe and simple
```

## Prompt 10 — UI input flow

```text
Create:
- components/input/VoiceRecorder.tsx
- components/input/TransactionInputConsole.tsx
- components/dashboard/UmkmFlowPanel.tsx

Requirements:
- voice transcript should fill the text input
- parse must not auto-commit
- support human review for ambiguous flow
- support commit after parse
- keep UI simple and hackathon-friendly
```

## Prompt 11 — UI finance panels

```text
Create:
- components/ledger/LedgerSummaryCards.tsx
- components/bank/ScoreCard.tsx
- components/bank/ScoreBreakdownTable.tsx
- components/dashboard/LiveFinancePanel.tsx

Requirements:
- fetch from real backend endpoints
- include loading and error states
- keep layout simple
```

## Prompt 12 — UI audit panels

```text
Create:
- components/bank/VerifyBanner.tsx
- components/bank/VaultChainTable.tsx
- components/bank/BankEvidencePanel.tsx

Requirements:
- wire GET /api/audit/chain
- wire GET /api/audit/verify
- wire POST /api/demo/tamper
- highlight first broken block and subsequent invalid blocks
- visually distinguish pass, fail, and generic error
```

## Prompt 13 — page wiring

```text
Wire the dashboard pages:
- app/(dashboard)/umkm/page.tsx
- app/(dashboard)/bank/page.tsx

Requirements:
- UMKM page should show UmkmFlowPanel
- Bank page should show LiveFinancePanel + BankEvidencePanel
- do not change backend contracts
```

## Prompt 14 — refresh orchestration

```text
Improve the frontend so that after a successful commit:
- ledger summary refreshes
- score refreshes
- audit chain refreshes

Requirements:
- keep the implementation simple
- use callback props or local refresh handlers
- do not introduce heavy state libraries
```

## Prompt 15 — polish for demo

```text
Perform a focused polish pass.

Requirements:
- improve empty states
- improve button disabled states
- improve error messages for demo clarity
- preserve functionality
- do not refactor architecture
```

---

# Urutan kerja yang saya sarankan di terminal

```bash
pnpm install
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```

Lalu tes berurutan:

```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"rawText":"Bayar tagihan listrik ruko 300 ribu"}'
```

```bash
curl -X POST http://localhost:3000/api/commit \
  -H "Content-Type: application/json" \
  -d '{"rawText":"Bayar tagihan listrik ruko 300 ribu","intent":"expense","amount":300000,"currency":"IDR","debitAccount":"Beban Operasional","creditAccount":"Kas"}'
```

```bash
curl http://localhost:3000/api/ledger/summary
curl http://localhost:3000/api/score
curl http://localhost:3000/api/audit/chain
curl http://localhost:3000/api/audit/verify
```

```bash
curl -X POST http://localhost:3000/api/demo/tamper \
  -H "Content-Type: application/json" \
  -d '{"targetBlockIndex":1,"mode":"append_amount_digits"}'
```

```bash
curl http://localhost:3000/api/audit/verify
```

---

# Checklist validasi sebelum deploy

## Backend

* [ ] parse happy path berhasil
* [ ] parse ambiguous mengembalikan `NEEDS_HUMAN_REVIEW`
* [ ] commit expense berhasil
* [ ] commit prive berhasil
* [ ] insufficient funds ditolak
* [ ] score berubah sesuai transaksi
* [ ] vault block bertambah saat commit valid
* [ ] verify pass untuk chain sehat
* [ ] verify fail setelah tamper

## Frontend

* [ ] transcript voice masuk ke textarea
* [ ] parse result tampil
* [ ] review ambigu tampil
* [ ] commit sukses memunculkan feedback
* [ ] summary cards update
* [ ] score panel update
* [ ] chain table update
* [ ] verify banner update

## Demo

* [ ] 1 happy path
* [ ] 1 ambiguity path
* [ ] 1 insufficient funds path
* [ ] 1 tamper simulation
* [ ] 1 verify fail setelah tamper

---

# Aturan main saat pakai Cursor

## Lakukan

* suruh AI kerjakan **satu milestone per prompt**
* refer ke `docs/*.md`
* lock kontrak API sebelum UI di-wire
* commit setiap milestone kecil

## Jangan lakukan

* jangan bilang “build everything”
* jangan biarkan Cursor refactor besar saat flow belum hidup
* jangan ganti kontrak backend sambil UI belum stabil
* jangan masuk Rust dulu sebelum Node vault jalan

---

# Strategi commit Git yang sehat

Saya sarankan commit per fase:

1. `chore: setup repo, prisma schema, seed`
2. `feat: add repositories and core services`
3. `feat: add parse and commit endpoints`
4. `feat: add summary, score, and audit read endpoints`
5. `feat: add tamper and verify audit flow`
6. `feat: add voice transcription flow`
7. `feat: wire frontend transaction console`
8. `feat: wire bank evidence and score panels`
9. `chore: deploy config for coolify`

Itu akan menyelamatkanmu saat Cursor mendadak merasa dirinya Steve Jobs + Linus Torvalds dalam satu sore.

---

# Prioritas mutlak kalau waktunya mepet

Kalau kamu kejar deadline, urutan yang **tidak boleh gagal** adalah:

1. `POST /api/parse`
2. `POST /api/commit`
3. `GET /api/ledger/summary`
4. `GET /api/score`
5. `GET /api/audit/chain`
6. `GET /api/audit/verify`
7. `POST /api/demo/tamper`
8. UI input + bank evidence
9. Voice recorder

Karena tanpa voice pun kamu masih bisa demo.
Tanpa parse/commit/audit, kamu cuma punya website yang pandai berjanji.

---

# Final execution order

Kalau saya ringkas menjadi 10 langkah:

1. **setup repo + prisma**
2. **seed business demo**
3. **buat repositories**
4. **buat services**
5. **buat parse + commit**
6. **buat summary + score + audit endpoints**
7. **buat transcribe**
8. **buat frontend helpers**
9. **buat UI panels**
10. **wire, test, deploy**

---

# Penutup paling praktis

Kalau kamu mulai hari ini, saya sarankan buka Cursor dan kerjakan **hanya sampai Prompt 6 dulu**.
Begitu backend inti hidup, baru sentuh frontend dan voice. Itu jauh lebih aman daripada mengejar mikrofon sementara ledger belum punya denyut nadi.

Saran langkah berikutnya: **jalankan Prompt 1–6 dulu dan berhenti setelah backend inti hidup; setelah itu baru kirim struktur file hasil Cursor kalau kamu ingin saya audit sebelum kamu lanjut ke UI.**
