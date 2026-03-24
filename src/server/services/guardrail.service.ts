import { JournalRepository } from "@/server/repositories/journal.repository";

export type GuardrailResult = {
  allowCommit: boolean;
  needsHumanReview: boolean;
  reason: string | null;
};

export class GuardrailService {
  static async validateTransaction(data: {
    intent: string;
    amount: number;
    debitAccount: string;
    creditAccount: string;
    businessId: string;
  }): Promise<GuardrailResult> {
    if (data.intent === "ambiguous" || data.intent === "unknown") {
      return {
        allowCommit: false,
        needsHumanReview: true,
        reason: "ENTITY_SEPARATION_AMBIGUOUS",
      };
    }

    if (data.creditAccount === "Kas") {
      const lastBalance = await JournalRepository.getLatestBalance(data.businessId);

      const currentCash = lastBalance?.cashBalance || 0;
      if (data.amount > currentCash) {
        return {
          allowCommit: false,
          needsHumanReview: false,
          reason: `INSUFFICIENT_FUNDS: Available ${currentCash}, required ${data.amount}`,
        };
      }
    }

    return {
      allowCommit: true,
      needsHumanReview: false,
      reason: null,
    };
  }
}
