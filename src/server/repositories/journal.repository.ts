import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CreateJournalEntryDTO = {
  transactionId: string;
  accountName: string;
  entryType: string;
  amount: number;
};

export type CreateBalanceSnapshotDTO = {
  businessId: string;
  cashBalance: number;
  expenseTotal: number;
  priveTotal: number;
};

export class JournalRepository {
  /**
   * Creates a single double-entry journal line.
   */
  static async createEntry(
    data: CreateJournalEntryDTO,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.journalEntry.create({
      data: {
        transactionId: data.transactionId,
        accountName: data.accountName,
        entryType: data.entryType,
        amount: data.amount,
      },
    });
  }

  /**
   * Retrieves recent journal entries.
   */
  static async findRecentEntries(limit: number = 20) {
    return prisma.journalEntry.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Gets the most recent balance snapshot for a business.
   */
  static async getLatestBalance(businessId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.balanceSnapshot.findFirst({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Saves a new balance snapshot.
   */
  static async createBalanceSnapshot(
    data: CreateBalanceSnapshotDTO,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.balanceSnapshot.create({
      data: {
        businessId: data.businessId,
        cashBalance: data.cashBalance,
        expenseTotal: data.expenseTotal,
        priveTotal: data.priveTotal,
      },
    });
  }
}
