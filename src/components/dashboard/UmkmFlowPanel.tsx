"use client";

import { useState } from "react";
import { TransactionInputConsole } from "../input/TransactionInputConsole";
import { parseTransaction, commitTransaction, TransactionParseResult, CommitRequest } from "@/lib/api/transaction";

interface UmkmFlowPanelProps {
  onCommitSuccess?: () => void;
  onSwitchToBank?: () => void;
}

export function UmkmFlowPanel({ onCommitSuccess, onSwitchToBank }: UmkmFlowPanelProps) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<TransactionParseResult | null>(null);
  const [ambiguityError, setAmbiguityError] = useState<{message: string, details: any} | null>(null);
  const [commitSuccessData, setCommitSuccessData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFlow = () => {
    setInputText("");
    setParseResult(null);
    setAmbiguityError(null);
    setCommitSuccessData(null);
    setErrorMessage(null);
  };

  const handleParse = async () => {
    setIsProcessing(true);
    setParseResult(null);
    setAmbiguityError(null);
    setCommitSuccessData(null);
    setErrorMessage(null);

    try {
      const res = await parseTransaction(inputText);
      
      if (res.success && res.data) {
        setParseResult(res.data);
      } else if (res.error?.code === "NEEDS_HUMAN_REVIEW") {
        setAmbiguityError({
          message: res.error.message,
          details: res.error.details
        });
      } else {
        setErrorMessage(res.error?.message || "Gagal memparsing teks");
      }
    } catch (e) {
      setErrorMessage("Terjadi kesalahan jaringan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommit = async (overrideIntent?: "expense" | "prive") => {
    setIsProcessing(true);
    setErrorMessage(null);
    
    // Construct commit request from parsed data or ambiguity details
    const targetData = parseResult || (ambiguityError?.details as TransactionParseResult);
    if (!targetData) return;

    const requestBody: CommitRequest = {
      rawText: targetData.rawText,
      intent: overrideIntent || (targetData.intent === "ambiguous" ? "expense" : targetData.intent),
      amount: targetData.amount,
      currency: "IDR",
      debitAccount: overrideIntent === "prive" ? "Prive Pemilik" : (targetData.debitAccount || "Beban Operasional"),
      creditAccount: targetData.creditAccount || "Kas",
      reviewResolution: overrideIntent || null
    };

    try {
      const res = await commitTransaction(requestBody);
      if (res.success && res.data) {
        setCommitSuccessData(res.data);
        setParseResult(null);
        setAmbiguityError(null);
        setInputText("");
        onCommitSuccess?.(); // 🔑 trigger parent refresh
      } else {
        const msg = res.error?.message || "Transaksi ditolak oleh sistem";
        const hint = res.error?.code === "INSUFFICIENT_FUNDS"
          ? " — Saldo Kas tidak mencukupi untuk transaksi ini."
          : "";
        setErrorMessage(msg + hint);
      }
    } catch (e) {
      setErrorMessage("Gagal terhubung ke server. Periksa koneksi jaringan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-primary">Terminal KasAI UMKM</h2>
        <p className="text-secondary text-sm">Rekam transaksi bisnismu menggunakan suara atau ketikan natural.</p>
      </div>

      <TransactionInputConsole 
        value={inputText}
        onChange={setInputText}
        onParse={handleParse}
        isProcessing={isProcessing}
      />

      {/* Error / Notification Banner */}
      {errorMessage && (
        <div className="bg-brand-danger/10 border-l-4 border-brand-danger p-4 rounded-md flex items-start gap-3">
          <svg className="w-5 h-5 text-brand-danger mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-brand-danger font-bold">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-xs text-brand-danger/80 mt-1 underline">Tutup</button>
          </div>
        </div>
      )}

      {/* Ambiguity Resolution Panel */}
      {ambiguityError && !isProcessing && (
        <div className="bg-brand-warning/10 border border-brand-warning/20 p-5 rounded-xl shadow-sm animate-fade-in text-primary">
          <div className="flex items-start gap-3">
            <div className="bg-brand-warning/20 p-2 rounded-full text-brand-warning mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
                  onClick={() => handleCommit("expense")}
                  className="bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed text-on-brand px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                >
                  {isProcessing ? "Menyimpan..." : "🏢 Untuk Usaha (Beban)"}
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={() => handleCommit("prive")}
                  className="bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  {isProcessing ? "Menyimpan..." : "🏠 Untuk Pribadi (Prive)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journal Preview Panel */}
      {parseResult && !isProcessing && (
        <div className="bg-card border border-brand-warning/30 rounded-xl shadow-sm animate-fade-in text-primary overflow-hidden">
          {/* Panel Header */}
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
              {parseResult.intent === "expense" ? "Beban Operasional" : parseResult.intent === "prive" ? "Prive Pemilik" : "Perlu Klarifikasi"}
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Raw input */}
            <div className="text-xs text-secondary italic bg-card-muted px-3 py-2 rounded border border-border-subtle">
              <i className="fa-solid fa-quote-left text-muted mr-2 text-[10px]" />
              {parseResult.rawText}
            </div>

            {/* Double-entry Journal Table */}
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
                <tfoot>
                  <tr className="border-t-2 border-border-strong bg-card-muted text-[10px] font-bold text-muted">
                    <td className="px-4 py-2">TOTAL</td>
                    <td className="px-4 py-2 text-right font-mono text-brand-primary">Rp {parseResult.amount.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2 text-right font-mono">Rp {parseResult.amount.toLocaleString("id-ID")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Stateful Guardrail Badges */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Guardrail Validation</p>
              <div className="flex flex-wrap gap-2">
                {/* Double-entry is always balanced at this point */}
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-success/10 border border-brand-success/20 text-brand-success text-[11px] rounded-full font-medium">
                  <i className="fa-solid fa-check-circle text-[10px]" /> Double-entry balanced
                </span>
                {/* Entity rule depends on intent clarity */}
                {parseResult.intent !== "ambiguous" ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-success/10 border border-brand-success/20 text-brand-success text-[11px] rounded-full font-medium">
                    <i className="fa-solid fa-check-circle text-[10px]" /> SAK EMKM entity rule passed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning text-[11px] rounded-full font-medium">
                    <i className="fa-solid fa-triangle-exclamation text-[10px]" /> SAK EMKM entity review required
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-info/10 border border-brand-info/20 text-brand-info text-[11px] rounded-full font-medium">
                  <i className="fa-solid fa-scale-balanced text-[10px]" /> Intent: {parseResult.intent.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
              <span className="text-[10px] text-muted italic">Tinjau sebelum menyimpan ke ledger.</span>
              <div className="flex gap-3">
                <button 
                  onClick={resetFlow}
                  className="px-4 py-2 text-muted hover:text-primary font-medium transition-colors text-sm"
                >
                  Batalkan
                </button>
                <button 
                  onClick={() => handleCommit()}
                  className="bg-brand-success text-on-brand px-6 py-2.5 rounded-lg font-bold hover:opacity-90 shadow-sm transition flex items-center gap-2 text-sm"
                >
                  <i className="fa-solid fa-lock text-[11px]" />
                  Commit ke Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jurnal Tersimpan — Committed State */}
      {commitSuccessData && !isProcessing && (
        <div className="bg-card border border-brand-success/40 rounded-xl shadow-sm animate-fade-in text-primary overflow-hidden">
          {/* Committed Header */}
          <div className="bg-brand-success/10 border-b border-brand-success/20 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center">
                <i className="fa-solid fa-lock text-[10px]" />
              </div>
              <h3 className="font-bold text-sm text-brand-success">Jurnal Tersimpan</h3>
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-success bg-brand-success/10 px-2 py-0.5 rounded border border-brand-success/20">
                Committed to Ledger
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted">Vault Block #{commitSuccessData.vaultBlock?.blockIndex}</span>
          </div>

          <div className="p-5 space-y-4">
            {/* Committed journal rows */}
            <table className="w-full text-sm border border-brand-success/20 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-brand-success/5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="text-left px-4 py-2">Akun</th>
                  <th className="text-right px-4 py-2 text-brand-primary">Debit</th>
                  <th className="text-right px-4 py-2 text-secondary">Kredit</th>
                </tr>
              </thead>
              <tbody>
                {commitSuccessData.journalEntries?.map((entry: any, i: number) => (
                  <tr key={i} className="border-t border-brand-success/10">
                    <td className={`px-4 py-2.5 font-medium ${i > 0 ? 'pl-8 text-secondary' : 'text-primary'}`}>{entry.accountName}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-brand-primary">
                      {entry.entryType === 'debit' ? `Rp ${entry.amount.toLocaleString('id-ID')}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-secondary">
                      {entry.entryType === 'credit' ? `Rp ${entry.amount.toLocaleString('id-ID')}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Evidence metadata */}
            <div className="bg-brand-success/5 border border-brand-success/20 rounded-lg px-4 py-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-muted uppercase tracking-wider text-[9px] block mb-0.5">Transaction ID</span>
                <span className="text-primary font-bold truncate block">{commitSuccessData.transactionId}</span>
              </div>
              <div>
                <span className="text-muted uppercase tracking-wider text-[9px] block mb-0.5">Vault Block</span>
                <span className="text-brand-success font-bold">#{commitSuccessData.vaultBlock?.blockIndex} — SHA-256 Sealed</span>
              </div>
              <div>
                <span className="text-muted uppercase tracking-wider text-[9px] block mb-0.5">Saldo Kas</span>
                <span className="text-primary font-bold">Rp {commitSuccessData.ledgerSummary?.cashBalance?.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-muted uppercase tracking-wider text-[9px] block mb-0.5">KasAI Score</span>
                <span className="text-brand-warning font-bold">{commitSuccessData.scoreSnapshot?.totalScore}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-1 border-t border-border-subtle">
              <button 
                onClick={resetFlow}
                className="bg-brand-success text-on-brand px-5 py-2 rounded-lg font-medium hover:opacity-90 transition text-sm"
              >
                Buat Transaksi Baru
              </button>
              {onSwitchToBank && (
                <button 
                  onClick={onSwitchToBank}
                  className="bg-brand-primary text-on-brand px-5 py-2 rounded-lg font-medium hover:opacity-90 transition text-sm"
                >
                  Lihat Audit Trail →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
