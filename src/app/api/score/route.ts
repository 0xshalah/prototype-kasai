import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BASE_SCORE = 680;

export async function GET() {
  try {
    const businessId = process.env.DEMO_BUSINESS_ID || "biz_demo_001";

    const lastScore = await prisma.scoreSnapshot.findFirst({
      where: {
        transaction: {
          businessId,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Aggregate cumulative factor contributions across the entire ledger history
    const agg = await prisma.scoreSnapshot.aggregate({
      where: {
        transaction: {
          businessId,
        },
      },
      _sum: {
        factorConsistency: true,
        factorSeparation: true,
        factorCashflow: true,
      },
    });

    const cumConsistency = agg._sum.factorConsistency ?? 0;
    const cumSeparation  = agg._sum.factorSeparation  ?? 0;
    const cumCashflow    = agg._sum.factorCashflow    ?? 0;

    // Total score comes from the latest snapshot, fallback to base if no data
    const totalScore = lastScore?.totalScore ?? BASE_SCORE;

    return NextResponse.json({
      success: true,
      data: {
        totalScore,
        baseScore: BASE_SCORE,
        factors: [
          { id: "consistency", name: "Konsistensi Pencatatan", delta: cumConsistency },
          { id: "separation",  name: "Disiplin Pemisahan SAK",  delta: cumSeparation  },
          { id: "cashflow",    name: "Stabilitas Arus Kas",    delta: cumCashflow    },
        ]
      }
    });

  } catch (error: any) {
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch score",
          details: {}
        }
    }, { status: 500 });
  }
}

