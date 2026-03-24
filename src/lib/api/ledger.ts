import { ApiResponse } from "./transaction";

export type LedgerSummaryData = {
  cashBalance: number;
  expenseTotal: number;
  priveTotal: number;
};

export type JournalEntryData = {
  accountName: string;
  entryType: "debit" | "credit";
  amount: number;
};

export type JournalItem = {
  transactionId: string;
  createdAt: string;
  entries: JournalEntryData[];
};

export type JournalResponseData = {
  items: JournalItem[];
};

export async function getLedgerSummary(): Promise<ApiResponse<LedgerSummaryData>> {
  const res = await fetch("/api/ledger/summary", {
    method: "GET",
    cache: "no-store", // Ensure real-time balances
  });
  return res.json();
}

export async function getJournalEntries(limit: number = 20): Promise<ApiResponse<JournalResponseData>> {
  const res = await fetch(`/api/ledger/journal?limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });
  return res.json();
}
