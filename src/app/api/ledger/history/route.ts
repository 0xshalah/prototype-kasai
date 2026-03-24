import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const businessId = process.env.DEMO_BUSINESS_ID || "biz_demo_001";
    
    // Get up to 30 latest balance snapshots, oldest first for chart rendering
    const snapshots = await prisma.balanceSnapshot.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      data: snapshots.reverse() // Reverse so chronological (oldest to newest)
    });

  } catch (error: any) {
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch ledger history",
          details: {}
        }
    }, { status: 500 });
  }
}
