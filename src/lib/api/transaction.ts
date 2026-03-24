export type TransactionParseResult = {
  rawText: string;
  intent: "revenue" | "expense" | "prive" | "ambiguous";
  amount: number;
  currency: "IDR";
  debitAccount: string | null;
  creditAccount: string | null;
  confidence: number;
  needsHumanReview: boolean;
  reviewReason: string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details: unknown;
  };
};

export type CommitRequest = {
  rawText: string;
  intent: "revenue" | "expense" | "prive";
  amount: number;
  currency: "IDR";
  debitAccount: string;
  creditAccount: string;
  reviewResolution?: string | null;
};

export type CommitResponseData = {
  transactionId: string;
  journalEntries: { accountName: string; entryType: string; amount: number }[];
  ledgerSummary: { cashBalance: number; expenseTotal: number; priveTotal: number };
  scoreSnapshot: { totalScore: number; factors: Record<string, unknown>[] };
  vaultBlock: { blockIndex: number; transactionId: string; canonicalPayload: string; prevHash: string; hash: string };
};

export async function parseTransaction(text: string): Promise<ApiResponse<TransactionParseResult>> {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText: text }),
  });
  return res.json();
}

export async function commitTransaction(data: CommitRequest): Promise<ApiResponse<CommitResponseData>> {
  const res = await fetch("/api/commit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
