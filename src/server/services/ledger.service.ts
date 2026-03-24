import { Prisma } from "@prisma/client";
import { TransactionRepository } from "@/server/repositories/transaction.repository";
import { JournalRepository } from "@/server/repositories/journal.repository";

export class LedgerService {
  static async commitToLedger(
    tx: Prisma.TransactionClient,
    data: {
      businessId: string;
      rawText: string;
      intent: string;
      amount: number;
      debitAccount: string;
      creditAccount: string;
    }
  ) {
    // 1. Create Transaction
    const txn = await TransactionRepository.create({
      businessId: data.businessId,
      rawText: data.rawText,
      parsedIntent: data.intent,
      amount: data.amount,
      debitAccount: data.debitAccount,
      creditAccount: data.creditAccount,
      status: "COMMITTED",
    }, tx);

    // 2. Create Journals
    const jDebit = await JournalRepository.createEntry({
      transactionId: txn.id,
      accountName: data.debitAccount,
      entryType: "debit",
      amount: data.amount,
    }, tx);

    const jCredit = await JournalRepository.createEntry({
      transactionId: txn.id,
      accountName: data.creditAccount,
      entryType: "credit",
      amount: data.amount,
    }, tx);

    // 3. Update Balances
    const lastBalance = await JournalRepository.getLatestBalance(data.businessId, tx);

    const oldCash = lastBalance?.cashBalance || 0;
    const oldExpense = lastBalance?.expenseTotal || 0;
    const oldPrive = lastBalance?.priveTotal || 0;

    const newCash =
      data.debitAccount === "Kas"
        ? oldCash + data.amount
        : data.creditAccount === "Kas"
        ? oldCash - data.amount
        : oldCash;

    const newExpense = data.intent === "expense" ? oldExpense + data.amount : oldExpense;
    const newPrive = data.intent === "prive" ? oldPrive + data.amount : oldPrive;

    const snapshot = await JournalRepository.createBalanceSnapshot({
      businessId: data.businessId,
      cashBalance: newCash,
      expenseTotal: newExpense,
      priveTotal: newPrive,
    }, tx);

    return { txn, jDebit, jCredit, snapshot };
  }
}
