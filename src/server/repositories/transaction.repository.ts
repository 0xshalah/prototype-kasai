import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CreateTransactionDTO = {
  businessId: string;
  rawText: string;
  parsedIntent: string;
  amount: number;
  debitAccount?: string | null;
  creditAccount?: string | null;
  status: string;
};

export class TransactionRepository {
  /**
   * Creates a transaction. Can participate in an existing Prisma transaction if `tx` is provided.
   */
  static async create(
    data: CreateTransactionDTO,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.transaction.create({
      data: {
        businessId: data.businessId,
        rawText: data.rawText,
        parsedIntent: data.parsedIntent,
        amount: data.amount,
        debitAccount: data.debitAccount,
        creditAccount: data.creditAccount,
        status: data.status,
      },
    });
  }

  /**
   * Retrieves a single transaction by its ID.
   */
  static async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
    });
  }

  /**
   * Finds recent transactions for a given business, optionally including related journal entries.
   */
  static async findRecent(businessId: string, limit: number = 10, includeJournals: boolean = false) {
    return prisma.transaction.findMany({
      where: { businessId },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        journalEntries: includeJournals,
      },
    });
  }
}
