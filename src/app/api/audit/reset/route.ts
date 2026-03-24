import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST() {
  try {
    // Wipe all transactional tables
    await prisma.$transaction([
      prisma.vaultBlock.deleteMany(),
      prisma.transaction.deleteMany(),
      prisma.journalEntry.deleteMany(),
      prisma.balanceSnapshot.deleteMany(),
      prisma.scoreSnapshot.deleteMany(),
      prisma.auditEvent.deleteMany(),
    ]);

    // Force create Genesis Block immediately so the UI is not completely empty
    const genesisPayload = "0|GENESIS|SYSTEM|SYSTEM|0";
    const genesisHash = crypto.createHash("sha256").update(genesisPayload).digest("hex");
    
    // Inject Genesis Transaction to act as the anchor
    const genesisTxn = await prisma.transaction.create({
      data: {
        businessId: "SYSTEM",
        rawText: "INISIALISASI SALDO AWAL",
        parsedIntent: "capital",
        amount: 5000000,
        debitAccount: "Kas",
        creditAccount: "Modal Disetor",
        status: "COMMITTED"
      }
    });

    await prisma.vaultBlock.create({
      data: {
        blockIndex: 0,
        transactionId: genesisTxn.id,
        canonicalPayload: genesisPayload,
        prevHash: "00",
        hash: genesisHash,
      }
    });

    const businessId = process.env.DEMO_BUSINESS_ID || "biz_demo_001";

    // Inject Initial Balance to prevent INSUFFICIENT_FUNDS checks
    await prisma.balanceSnapshot.create({
      data: {
        businessId: businessId,
        cashBalance: 5000000,
        expenseTotal: 0,
        priveTotal: 0
      }
    });

    // Log the reset manually into the clean DB
    await prisma.auditEvent.create({
      data: {
        eventType: "reset",
        message: "SYSTEM_RESET: Auditor triggered manual vault wipe. Chain re-initialized.",
      }
    });

    return NextResponse.json({ success: true, message: "Vault reset successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
