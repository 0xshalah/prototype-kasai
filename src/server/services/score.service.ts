import { Prisma } from "@prisma/client";
import { ScoreRepository } from "@/server/repositories/score.repository";

export class ScoreService {
  static async updateScore(
    tx: Prisma.TransactionClient,
    data: { transactionId: string; intent: string }
  ) {
    const lastScore = await ScoreRepository.getLatestScore(tx);

    const baseScore = lastScore ? lastScore.totalScore : 680;
    const isPrive = data.intent === "prive";

    const factorConsistency = isPrive ? -1 : 2;
    const factorSeparation = isPrive ? -2 : 3;
    const factorCashflow = isPrive ? 0 : 2;

    const totalDelta = factorConsistency + factorSeparation + factorCashflow;
    const newTotalScore = baseScore + totalDelta;

    const score = await ScoreRepository.createScore({
        transactionId: data.transactionId,
        totalScore: newTotalScore,
        factorConsistency,
        factorSeparation,
        factorCashflow,
      }, tx);

    return score;
  }
}
