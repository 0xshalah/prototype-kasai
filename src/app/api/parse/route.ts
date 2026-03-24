import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveAIProvider } from "@/server/ai/provider";

const ParseRequestSchema = z.object({
  rawText: z.string().min(1)
});

// Demo fallback parser
function fallbackParse(text: string) {
  const t = text.toLowerCase();
  
  // Extract amount
  let amount = 0;
  const matchRibu = t.match(/(\d+)\s*ribu/);
  const matchJuta = t.match(/(\d+)\s*juta/);
  const matchExact = t.match(/(?:rp|rupiah)?\s*([\d\.]+)/);

  if (matchRibu) amount = parseInt(matchRibu[1]) * 1000;
  else if (matchJuta) amount = parseInt(matchJuta[1]) * 1000000;
  else if (matchExact) amount = parseInt(matchExact[1].replace(/\./g, ''));

  if (!amount) amount = 100000; // default for demo if parsing fails

  // Intent parsing
  if (t.includes("ambil uang kas") && !t.includes("pribadi") && !t.includes("usaha")) {
    return {
      intent: "ambiguous",
      amount,
      debitAccount: "Beban Operasional", 
      creditAccount: "Kas",
      needsHumanReview: true,
      reviewReason: "ENTITY_SEPARATION_AMBIGUOUS"
    };
  } else if (t.includes("prive") || t.includes("pribadi")) {
    return {
      intent: "prive",
      amount,
      debitAccount: "Prive Pemilik",
      creditAccount: "Kas",
      needsHumanReview: false,
      reviewReason: null
    };
  } else {
    // Default expense
    return {
      intent: "expense",
      amount,
      debitAccount: "Beban Operasional",
      creditAccount: "Kas",
      needsHumanReview: false,
      reviewReason: null
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = ParseRequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request format invalid",
          details: result.error.format()
        }
      }, { status: 400 });
    }

    const { rawText } = result.data;
    
    // 1. Try AI Provider first
    const provider = await getActiveAIProvider();
    let finalParsed = null;
    
    if (provider) {
        finalParsed = await provider.parseTransaction(rawText);
    }
    
    // 2. Fallback to Rule-based
    if (!finalParsed) {
        const p = fallbackParse(rawText);
        finalParsed = {
            rawText,
            intent: p.intent as "revenue" | "expense" | "prive" | "ambiguous" | "capital",
            amount: p.amount,
            currency: "IDR",
            debitAccount: p.debitAccount,
            creditAccount: p.creditAccount,
            confidence: 0.80, // Rule-based baseline
            needsHumanReview: p.needsHumanReview,
            reviewReason: p.reviewReason
        };
    }

    if (finalParsed.needsHumanReview) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NEEDS_HUMAN_REVIEW",
          message: "Transaksi ambigu dan memerlukan klarifikasi pengguna",
          details: finalParsed
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: finalParsed
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message,
          details: {}
        }
    }, { status: 500 });
  }
}
