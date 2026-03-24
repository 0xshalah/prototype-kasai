import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEMO_BUSINESS_ID } from "@/lib/api-response";

export async function POST() {
  try {
    // Delete all data for the demo business in order
    await db.auditEvent.deleteMany({ where: { businessId: DEMO_BUSINESS_ID } });
    await db.vaultBlock.deleteMany({ where: { businessId: DEMO_BUSINESS_ID } });
    await db.scoreSnapshot.deleteMany({ where: { businessId: DEMO_BUSINESS_ID } });
    await db.journalEntry.deleteMany({
      where: { transaction: { businessId: DEMO_BUSINESS_ID } },
    });
    await db.transaction.deleteMany({ where: { businessId: DEMO_BUSINESS_ID } });
    await db.audioUpload.deleteMany({ where: { businessId: DEMO_BUSINESS_ID } });

    // Reset balance to initial state
    await db.balanceSnapshot.upsert({
      where: { businessId: DEMO_BUSINESS_ID },
      update: { cashBalance: 5_000_000, expenseTotal: 0, priveTotal: 0 },
      create: { businessId: DEMO_BUSINESS_ID, cashBalance: 5_000_000, expenseTotal: 0, priveTotal: 0 },
    });

    return NextResponse.json({
      success: true,
      data: { message: "System state reset berhasil" },
    });
  } catch (error) {
    console.error("POST /api/demo/reset error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Error resetting demo state", details: {} } },
      { status: 500 }
    );
  }
}
