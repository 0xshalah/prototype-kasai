"use client";

import { TransactionParseResult } from "@/lib/api/transaction";

interface TransactionReviewProps {
  isProcessing: boolean;
  parseResult: TransactionParseResult | null;
  ambiguityError: { message: string, details: TransactionParseResult | null } | null;
  onCommit: (overrideIntent?: "expense" | "prive") => void;
  onCancel: () => void;
}

export function TransactionReview({
  isProcessing,
  parseResult,
  ambiguityError,
  onCommit,
  onCancel
}: TransactionReviewProps) {
  
  // Ambiguity Panel
  if (ambiguityError && !isProcessing) {
    return (
      <div className="bg-brand-warning/10 border border-brand-warning/20 p-5 rounded-xl shadow-sm animate-fade-in text-primary">
        <div className="flex items-start gap-3">
          <div className="bg-brand-warning/20 p-2 rounded-full text-brand-warning mt-1">
             <i className="fa-solid fa-person-circle-question text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-brand-warning">Klarifikasi Entitas Bisnis</h3>
            <p className="text-brand-warning/90 text-sm mt-1">{ambiguityError.message}</p>
            <div className="bg-card p-3 rounded mt-3 text-sm font-mono text-primary border border-border-subtle">
              Ekstraksi: <strong>Rp {ambiguityError.details?.amount?.toLocaleString("id-ID")}</strong>
            </div>
            <p className="text-sm font-medium mt-4 mb-2">Apakah pengeluaran ini untuk usaha atau pribadi?</p>
            <div className="flex gap-3 flex-wrap">
              <button 
                disabled={isProcessing}
                onClick={() => onCommit("expense")}
                className="bg-brand-primary disabled:opacity-50 text-on-brand px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                🏢 Untuk Usaha (Beban)
              </button>
              <button 
                disabled={isProcessing}
                onClick={() => onCommit("prive")}
                className="bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
              >
                🏠 Untuk Pribadi (Prive)
              </button>
              <button onClick={onCancel} className="px-4 py-2 text-muted hover:text-primary transition-colors text-sm">Kembali</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Review Panel
  if (parseResult && !isProcessing) {
    return (
      <div className="bg-card border border-brand-warning/30 rounded-xl shadow-sm animate-fade-in text-primary overflow-hidden">
        <div className="bg-brand-warning/5 border-b border-brand-warning/20 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand-warning/20 text-brand-warning flex items-center justify-center">
              <i className="fa-solid fa-book-open text-[10px]" />
            </div>
            <h3 className="font-bold text-sm text-primary">Preview Jurnal</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded border border-brand-warning/20">
              Belum Tersimpan
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted bg-card px-2 py-1 rounded border border-border-subtle uppercase tracking-wider">
            {parseResult.intent === "revenue" ? "Pemasukan Usaha" : parseResult.intent === "expense" ? "Beban Operasional" : parseResult.intent === "prive" ? "Prive Pemilik" : "Perlu Klarifikasi"}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-xs text-secondary italic bg-card-muted px-3 py-2 rounded border border-border-subtle">
            <i className="fa-solid fa-quote-left text-muted mr-2 text-[10px]" />
            {parseResult.rawText}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Ayat Jurnal Double-Entry</p>
            <table className="w-full text-sm border border-border-subtle rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-card-muted text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="text-left px-4 py-2">Akun</th>
                  <th className="text-right px-4 py-2 text-brand-primary">Debit</th>
                  <th className="text-right px-4 py-2 text-secondary">Kredit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border-subtle">
                  <td className="px-4 py-3 font-medium text-primary">{parseResult.debitAccount}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-brand-primary">
                    Rp {parseResult.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">—</td>
                </tr>
                <tr className="border-t border-border-subtle bg-card-muted/50">
                  <td className="px-4 py-3 pl-8 text-secondary font-medium">{parseResult.creditAccount}</td>
                  <td className="px-4 py-3 text-right text-muted">—</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-secondary">
                    Rp {parseResult.amount.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
            <span className="text-[10px] text-muted italic">Tinjau sebelum menyimpan ke ledger.</span>
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="px-4 py-2 text-muted hover:text-primary font-medium transition-colors text-sm"
              >
                Batalkan
              </button>
              <button 
                onClick={() => onCommit()}
                className="bg-brand-success text-on-brand px-6 py-2.5 rounded-lg font-bold hover:opacity-90 shadow-sm transition flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-lock text-[11px]" />
                Commit ke Ledger
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
