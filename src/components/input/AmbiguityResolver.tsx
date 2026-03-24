"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

const formatRp = (n: number) =>
  "Rp " + Number(n || 0).toLocaleString("id-ID");

type Props = {
  pendingReview: any;
  onResolve: (intent: "prive" | "expense") => void;
};

export function AmbiguityResolver({ pendingReview, onResolve }: Props) {
  if (!pendingReview) return null;

  return (
    <div className="border border-brand-warning bg-card rounded-xl p-6 slide-up shadow-sm my-4">
      <div className="flex items-start gap-4">
        <div className="text-brand-warning text-2xl mt-1">
          <i className="fa-solid fa-hand-paper" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-brand-warning font-bold uppercase tracking-wider mb-1">
            Intervensi Pemisahan Entitas (SAK EMKM)
          </h3>
          <p className="text-sm text-secondary mb-4">
            Niat penggunaan dana ambigu. Mohon klarifikasi:
          </p>
          <div className="text-sm text-secondary leading-7 mb-4 space-y-1 bg-card-muted p-4 rounded border border-border-subtle">
            <div>
              <span className="text-muted w-24 inline-block">Raw text:</span>{" "}
              <span className="text-primary font-medium">{pendingReview.rawText}</span>
            </div>
            <div>
              <span className="text-muted w-24 inline-block">Amount:</span>{" "}
              <span className="font-mono text-primary font-medium">
                {formatRp(pendingReview.amount)}
              </span>
            </div>
            <div>
              <span className="text-muted w-24 inline-block">Reason:</span>{" "}
              <span className="text-primary font-medium">{pendingReview.reviewReason}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onResolve("prive")}
              className="px-6 py-2 bg-card hover:bg-card-muted text-sm font-bold text-primary rounded-lg border border-border-strong transition-colors"
            >
              Tarik Pribadi (Prive)
            </button>
            <button
              onClick={() => onResolve("expense")}
              className="px-6 py-2 bg-brand-primary hover:opacity-90 transition-opacity text-on-brand text-sm font-bold rounded-lg"
            >
              Beban Operasional
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
