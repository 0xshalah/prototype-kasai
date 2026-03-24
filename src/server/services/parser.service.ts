/**
 * Deterministic text-to-transaction parser.
 * Mimics the logic from the original SPA prototype.
 * In production, this would call OpenAI Structured Outputs.
 */

function normalizeText(text: string): string {
  return String(text || "").replace(/\s+/g, " ").replace(/[.]+$/g, "").trim();
}

function extractAmount(text: string): number | null {
  const lower = text.toLowerCase();

  const phraseMap: { pattern: RegExp; value: number }[] = [
    { pattern: /tiga ratus ribu/, value: 300000 },
    { pattern: /lima ratus ribu/, value: 500000 },
    { pattern: /enam juta/, value: 6000000 },
    { pattern: /setengah juta/, value: 500000 },
  ];

  for (const entry of phraseMap) {
    if (entry.pattern.test(lower)) return entry.value;
  }

  const match = lower.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb)?/);
  if (!match) return null;

  let amount = Number(match[1].replace(/\./g, "").replace(",", "."));
  if (Number.isNaN(amount)) return null;

  const unit = match[2];
  if (unit === "juta" || unit === "jt") amount *= 1000000;
  else if (unit === "ribu" || unit === "rb") amount *= 1000;

  if (!unit && amount < 1000 && /ribu|rb/.test(lower)) amount *= 1000;
  if (!unit && amount < 100 && /juta|jt/.test(lower)) amount *= 1000000;
  return Math.round(amount);
}

function chooseExpenseAccount(text: string): string {
  const lower = text.toLowerCase();
  if (/(listrik|air|internet|wifi|tagihan|sewa)/.test(lower)) return "Beban Utilitas";
  return "Beban Operasional";
}

export type ParseResult =
  | {
      success: true;
      data: {
        rawText: string;
        intent: string;
        amount: number;
        currency: string;
        debitAccount: string | null;
        creditAccount: string;
        confidence: number;
        needsHumanReview: boolean;
        reviewReason: string | null;
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details: Record<string, unknown>;
      };
    };

export class ParserService {
  parse(rawText: string): ParseResult {
    const normalized = normalizeText(rawText);
    if (!normalized) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Teks transaksi wajib diisi.",
          details: {},
        },
      };
    }

    const amount = extractAmount(normalized);
    if (!amount || amount <= 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Nominal transaksi tidak berhasil dikenali.",
          details: { rawText: normalized },
        },
      };
    }

    const lower = normalized.toLowerCase();
    const hasExpenseCue = /(bayar|beli|tagihan|listrik|air|internet|gaji|sewa|servis|bahan)/.test(lower);
    const hasPersonalCue = /(pribadi|anak|rumah|pemilik|keluarga)/.test(lower);
    const hasAmbiguousCashCue = /(ambil|tarik|pakai)/.test(lower) && /kas/.test(lower);

    const base = {
      rawText: normalized,
      amount,
      currency: "IDR" as const,
      debitAccount: null as string | null,
      creditAccount: "Kas",
      confidence: 0.5,
      needsHumanReview: false,
      reviewReason: null as string | null,
    };

    if (hasAmbiguousCashCue && !hasPersonalCue && !hasExpenseCue) {
      return {
        success: false,
        error: {
          code: "NEEDS_HUMAN_REVIEW",
          message: "Transaksi ambigu dan memerlukan klarifikasi pengguna.",
          details: {
            ...base,
            intent: "ambiguous",
            confidence: 0.82,
            needsHumanReview: true,
            reviewReason: "ENTITY_SEPARATION_AMBIGUOUS",
          },
        },
      };
    }

    if (hasPersonalCue) {
      return {
        success: true,
        data: {
          ...base,
          intent: "prive",
          debitAccount: "Prive Pemilik",
          confidence: 0.91,
        },
      };
    }

    if (hasExpenseCue || hasAmbiguousCashCue) {
      return {
        success: true,
        data: {
          ...base,
          intent: "expense",
          debitAccount: chooseExpenseAccount(lower),
          confidence: hasAmbiguousCashCue ? 0.74 : 0.95,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "NEEDS_HUMAN_REVIEW",
        message: "Transaksi belum cukup jelas dan memerlukan klarifikasi pengguna.",
        details: {
          ...base,
          intent: "unknown",
          confidence: 0.56,
          needsHumanReview: true,
          reviewReason: "UNKNOWN_INTENT",
        },
      },
    };
  }
}
