import { NextResponse } from "next/server";
import { JournalRepository } from "@/server/repositories/journal.repository";

export async function GET() {
  try {
    const businessId = process.env.DEMO_BUSINESS_ID || "biz_demo_001";
    
    // Get latest balance snapshot using repository
    const lastBalance = await JournalRepository.getLatestBalance(businessId);

    return NextResponse.json({
      success: true,
      data: {
        cashBalance: lastBalance?.cashBalance || 0,
        expenseTotal: lastBalance?.expenseTotal || 0,
        priveTotal: lastBalance?.priveTotal || 0
      }
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch ledger summary";
    return NextResponse.json({
        success: false,
        error: { code: "INTERNAL_ERROR", message, details: {} }
    }, { status: 500 });
  }
}
