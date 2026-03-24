import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const recentTransactions = await prisma.transaction.findMany({
      where: { status: "COMMITTED" },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { journalEntries: true }
    });

    const items = recentTransactions.map((t) => ({
      transactionId: t.id,
      createdAt: t.createdAt.toISOString(),
      entries: t.journalEntries.map((je) => ({
        accountName: je.accountName,
        entryType: je.entryType,
        amount: je.amount
      }))
    }));

    return NextResponse.json({ success: true, data: { items } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch journal entries";
    return NextResponse.json({
        success: false,
        error: { code: "INTERNAL_ERROR", message, details: {} }
    }, { status: 500 });
  }
}
