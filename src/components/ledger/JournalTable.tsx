"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  items: any[];
};

export function JournalTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-muted text-xs italic font-mono">
        Menunggu transaksi...
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 6).map((txn: any, ti: number) => (
        <div
          key={ti}
          className="text-xs font-mono fade-in bg-card p-3 rounded-lg border border-border-subtle"
        >
          <div className="flex justify-between text-secondary mb-2 border-b border-border-subtle pb-2">
            <span className="font-bold text-primary">
              {new Date(txn.createdAt).toLocaleTimeString("id-ID")}
            </span>
            <span className="bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded text-[10px]">
              SAK Validated
            </span>
          </div>
          {txn.entries?.map((e: any, ei: number) => (
            <div key={ei} className={`flex ${e.entryType === "credit" ? "mt-1" : ""}`}>
              <div className={`w-1/2 text-primary ${e.entryType === "credit" ? "pl-4" : ""}`}>
                {e.accountName}
              </div>
              <div className={`w-1/4 text-right ${e.entryType === "debit" ? "text-primary" : "text-muted"}`}>
                {e.entryType === "debit" ? e.amount.toLocaleString("id-ID") : "-"}
              </div>
              <div className={`w-1/4 text-right ${e.entryType === "credit" ? "text-primary" : "text-muted"}`}>
                {e.entryType === "credit" ? e.amount.toLocaleString("id-ID") : "-"}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
