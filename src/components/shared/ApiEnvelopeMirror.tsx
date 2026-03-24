"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

type Card = {
  label: string;
  sub: string;
  data: any;
  loading?: boolean;
};

const pj = (v: any) => JSON.stringify(v ?? { status: "waiting" }, null, 2);

export function ApiEnvelopeMirror({ cards }: { cards: Card[] }) {
  return (
    <section className="slide-up w-full">
      <div className="flex items-center gap-2 mb-3 px-2">
        <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold border border-brand-primary/40">
          3
        </span>
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          API Envelope Mirror
        </h3>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`bg-card rounded-xl border p-4 shadow-sm ${
              c.data
                ? c.data.success
                  ? "border-brand-success/50"
                  : "border-brand-warning/50"
                : "border-border-subtle"
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                  {c.label}
                </div>
                <div className="text-sm font-bold text-primary mt-1">{c.sub}</div>
              </div>
              <div className="px-3 py-1 rounded-full border border-border-strong bg-card-muted text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {c.loading
                  ? "Processing"
                  : c.data
                  ? c.data.success
                    ? "Success"
                    : c.data.error?.code || "Error"
                  : "Waiting"}
              </div>
            </div>
            <pre className="rounded-lg bg-card-muted border border-border-strong p-4 text-[11px] text-secondary overflow-auto max-h-[200px]">
              {pj(c.data)}
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}
