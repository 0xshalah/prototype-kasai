import { PrismaClient } from "@prisma/client";
import { LedgerService } from "../src/server/services/ledger.service";
import { VaultService } from "../src/server/services/vault.service";
import { AuditService } from "../src/server/services/audit.service";

const prisma = new PrismaClient();

async function main() {
  console.log("-----------------------------------------");
  console.log("🚀 STARTING TAMPER SIMULATION");
  console.log("-----------------------------------------");

  const businessId = "biz_demo_tamper";
  const auditService = new AuditService(prisma);

  // Clean up previous runs for this business
  await prisma.vaultBlock.deleteMany({});
  await prisma.scoreSnapshot.deleteMany({});
  await prisma.journalEntry.deleteMany({});
  await prisma.transaction.deleteMany({ where: { businessId } });
  await prisma.balanceSnapshot.deleteMany({ where: { businessId } });
  await prisma.auditEvent.deleteMany({});
  
  // A. Commit satu transaksi valid
  console.log("\n[A] Committing valid transaction...");
  
  const commitResult = await prisma.$transaction(async (tx) => {
    const ledgerResult = await LedgerService.commitToLedger(tx as any, {
      businessId,
      rawText: "Beli token listrik 50000",
      intent: "expense",
      amount: 50000,
      debitAccount: "Beban Operasional",
      creditAccount: "Kas",
    });

    const block = await VaultService.appendBlock(tx as any, {
      transactionId: ledgerResult.txn.id,
      debitAccount: "Beban Operasional",
      creditAccount: "Kas",
      amount: 50000,
    });

    return { transactionId: ledgerResult.txn.id, block };
  });

  console.log(`Transaction created: ID ${commitResult.transactionId}, Amount: 50000`);

  // B. Verifikasi integrity via audit.service.ts
  console.log("\n[B] Verifying chain logic...");
  const verify1 = await auditService.verifyChain(businessId);
  console.log(`Initial Verify Result: ${verify1.valid ? "✅ VALID" : "❌ INVALID"}`);

  if (!verify1.valid) {
    console.error("Chain invalid before tamper! Exiting...");
    return;
  }

  // C. Secara manual (via Prisma client) ubah field amount di tabel Transaction
  console.log("\n[C] 🥷 Hacker sneaks in: Modifying Transaction Amount table directly to 999999...");
  await prisma.transaction.update({
    where: { id: commitResult.transactionId },
    data: { amount: 999999 },
  });

  const modifiedTx = await prisma.transaction.findUnique({ where: { id: commitResult.transactionId } });
  console.log(`Transaction ID ${modifiedTx?.id} new amount is: ${modifiedTx?.amount}`);

  // D. Jalankan lagi verifikasi via audit.service.ts
  console.log("\n[D] Verifying chain logic AFTER tamper...");
  const verify2 = await auditService.verifyChain(businessId);
  console.log(`After Tamper Verify Result: ${verify2.valid ? "✅ VALID (FAILED TO DETECT)" : "❌ INVALID (HACK DETECTED)"}`);
  
  if (verify2.valid) {
    console.log("\n⚠️ CRITICAL FLAW DETECTED:");
    console.log("The AuditService verified the VaultBlocks, but the actual Transaction table diverges!");
    console.log("Vault logic is isolated from the live ledger data logic.");
  } else {
    console.log("\n🛡️ System successfully detected the manipulation!");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
