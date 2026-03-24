import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // Disabled DEMO_MODE check to allow hackathon judges to test system resilience easily.
    
    // Find the latest transaction that was committed
    const latestTxn = await prisma.transaction.findFirst({
      where: { status: "COMMITTED" },
      orderBy: { createdAt: "desc" },
      include: { vaultBlocks: true }
    });

    if (!latestTxn || latestTxn.vaultBlocks.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NO_DATA",
          message: "No committed transactions available to tamper",
          details: {}
        }
      }, { status: 400 });
    }

    const block = latestTxn.vaultBlocks[0];
    const oldAmount = latestTxn.amount;
    // Tamper: inflate by a fixed delta (not 10x, to avoid INT overflow in SQLite)
    const delta = 99_000_000;
    const newAmount = Math.min(oldAmount + delta, 2_000_000_000);

    // 1. Manipulate the Transaction silently (without touching the vault hash)
    await prisma.transaction.update({
      where: { id: latestTxn.id },
      data: { amount: newAmount }
    });

    // 2. Also inflate the JournalEntry (debit side) so the ledger UI shows a changed number
    const debitEntry = await prisma.journalEntry.findFirst({
      where: { transactionId: latestTxn.id, entryType: "debit" }
    });
    if (debitEntry) {
      await prisma.journalEntry.update({
        where: { id: debitEntry.id },
        data: { amount: newAmount }
      });
    }

    // 3. Inject a new BalanceSnapshot reflecting the tampered expense
    //    (inflate expenses by delta, reduce cash by same delta)
    const businessId = process.env.DEMO_BUSINESS_ID || "biz_demo_001";
    const latestBalance = await prisma.balanceSnapshot.findFirst({
      where: { businessId },
      orderBy: { createdAt: "desc" }
    });
    if (latestBalance) {
      await prisma.balanceSnapshot.create({
        data: {
          businessId,
          cashBalance: Math.max(latestBalance.cashBalance - delta, 0),
          expenseTotal: latestBalance.expenseTotal + delta,
          priveTotal: latestBalance.priveTotal
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        tamperedBlockIndex: block.blockIndex,
        oldAmount,
        newAmount
      }
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to tamper block";
    return NextResponse.json({
        success: false,
        error: { code: "INTERNAL_ERROR", message, details: {} }
    }, { status: 500 });
  }
}
