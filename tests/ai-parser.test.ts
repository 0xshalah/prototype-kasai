import { PrismaClient } from "@prisma/client";
import { LedgerService } from "../src/server/services/ledger.service";
import { GuardrailService } from "../src/server/services/guardrail.service";
import { VaultService } from "../src/server/services/vault.service";

const prisma = new PrismaClient();
const businessId = "biz_demo_ai_parser";

async function runTests() {
  console.log("=========================================");
  console.log("🧠 STARTING AI PARSER (MOCK) TESTS");
  console.log("=========================================");

  await prisma.vaultBlock.deleteMany({});
  await prisma.journalEntry.deleteMany({});
  await prisma.transaction.deleteMany({ where: { businessId } });
  await prisma.balanceSnapshot.deleteMany({ where: { businessId } });

  // Initial balance for testing
  await prisma.balanceSnapshot.create({
    data: {
      businessId,
      cashBalance: 1000000,
      expenseTotal: 0,
      priveTotal: 0,
    }
  });

  const scenarios = [
    {
      name: "Skenario Pemasukan (Sales)",
      text: "Hari ini jual 10 porsi nasi goreng dapat 150 ribu",
      mockOpenJsonResponse: {
        intent: "revenue",
        amount: 150000,
        debitAccount: "Kas",
        creditAccount: "Pendapatan Usaha",
        needsHumanReview: false,
        reviewReason: null
      }
    },
    {
      name: "Skenario Beban (Expense)",
      text: "Bayar token listrik warung 50 ribu",
      mockOpenJsonResponse: {
        intent: "expense",
        amount: 50000,
        debitAccount: "Beban Listrik",
        creditAccount: "Kas",
        needsHumanReview: false,
        reviewReason: null
      }
    },
    {
      name: "Skenario Prive (Personal Use)",
      text: "Ambil uang laci 100 ribu buat jajan anak",
      mockOpenJsonResponse: {
        intent: "prive",
        amount: 100000,
        debitAccount: "Prive Pemilik",
        creditAccount: "Kas",
        needsHumanReview: false,
        reviewReason: null
      }
    },
    {
      name: "Skenario Ambigu",
      text: "Uang 50 rbu dipake", // Tidak jelas pake apa (usaha atau pribadi)
      mockOpenJsonResponse: {
        intent: "ambiguous",
        amount: 50000,
        debitAccount: "Unknown",
        creditAccount: "Kas",
        needsHumanReview: true,
        reviewReason: "ENTITY_SEPARATION_AMBIGUOUS"
      }
    }
  ];

  for (const s of scenarios) {
    console.log(`\n▶️ [${s.name}]`);
    console.log(`Input Text: "${s.text}"`);

    // 1. Simulate API Route parsing the response
    const parsed = s.mockOpenJsonResponse;
    console.log(`Mock AI Output: OK (Intent: ${parsed.intent}, Amount: ${parsed.amount}, NeedsReview: ${parsed.needsHumanReview})`);

    // 2. Pass to Guardrail
    const validation = await GuardrailService.validateTransaction({
      intent: parsed.intent,
      amount: parsed.amount,
      debitAccount: parsed.debitAccount,
      creditAccount: parsed.creditAccount,
      businessId
    });

    if (!validation.allowCommit) {
      if (validation.needsHumanReview) {
        console.log(`🛡️ Guardrail: TRANSAKSI DITOLAK (needsHumanReview = true, Reason: ${validation.reason})`);
        console.log(`✅ Test passed! Guardrail correctly caught the ambiguous transaction.`);
        continue;
      } else {
        console.log(`🛡️ Guardrail: TRANSAKSI DITOLAK (Reason: ${validation.reason})`);
        continue;
      }
    }

    console.log(`🛡️ Guardrail: PASSED`);

    // 3. Pass to Ledger & Vault
    await prisma.$transaction(async (tx) => {
      const ledgerRes = await LedgerService.commitToLedger(tx as any, {
        businessId,
        rawText: s.text,
        intent: parsed.intent,
        amount: parsed.amount,
        debitAccount: parsed.debitAccount,
        creditAccount: parsed.creditAccount,
      });

      await VaultService.appendBlock(tx as any, {
        transactionId: ledgerRes.txn.id,
        debitAccount: parsed.debitAccount,
        creditAccount: parsed.creditAccount,
        amount: parsed.amount,
      });

      console.log(`📓 Ledger Commit SUCCESS: ${ledgerRes.txn.id}`);
      console.log(`📊 Snapshot Updated - New Cash Balance: ${ledgerRes.snapshot.cashBalance}`);
    });
  }

  console.log("\n=========================================");
  console.log("🏁 AI PARSER TESTS COMPLETED");
  console.log("=========================================");
}

runTests().catch(console.error).finally(() => prisma.$disconnect());
