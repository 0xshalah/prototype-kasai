import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CreateScoreSnapshotDTO = {
  transactionId: string;
  totalScore: number;
  factorConsistency: number;
  factorSeparation: number;
  factorCashflow: number;
};

export class ScoreRepository {
  /**
   * Retrieves the most recent score snapshot globally.
   * Assumes global scoring for MVP (or can be scoped to businessId later if added to model).
   */
  static async getLatestScore(tx: Prisma.TransactionClient = prisma) {
    return tx.scoreSnapshot.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Creates a new score snapshot linked to a transaction.
   */
  static async createScore(
    data: CreateScoreSnapshotDTO,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.scoreSnapshot.create({
      data: {
        transactionId: data.transactionId,
        totalScore: data.totalScore,
        factorConsistency: data.factorConsistency,
        factorSeparation: data.factorSeparation,
        factorCashflow: data.factorCashflow,
      },
    });
  }
}
