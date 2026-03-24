import { NextResponse } from "next/server";
import { VaultRepository } from "@/server/repositories/vault.repository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const blocks = await VaultRepository.findBlocks(limit);

    const items = blocks.map((b: any) => ({
      blockIndex: b.blockIndex,
      transactionId: b.transactionId,
      canonicalPayload: b.canonicalPayload,
      prevHash: b.prevHash,
      hash: b.hash
    }));

    return NextResponse.json({
      success: true,
      data: { items }
    });

  } catch (error: any) {
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch vault chain",
          details: {}
        }
    }, { status: 500 });
  }
}
