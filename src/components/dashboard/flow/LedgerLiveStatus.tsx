"use client";

interface CommitSuccessData {
  transactionId: string;
  vaultBlock?: { blockIndex: number };
  ledgerSummary?: { cashBalance: number };
  scoreSnapshot?: { totalScore: number };
  journalEntries?: { accountName: string; entryType: string; amount: number }[];
}

interface LedgerLiveStatusProps {
  commitSuccessData: CommitSuccessData | null;
  isProcessing: boolean;
  onReset: () => void;
  onSwitchToBank?: () => void;
}

export function LedgerLiveStatus({
  commitSuccessData,
  isProcessing,
  onReset,
  onSwitchToBank
}: LedgerLiveStatusProps) {
  if (!commitSuccessData || isProcessing) return null;

  return (
    <div className="bg-card border border-brand-success/40 rounded-xl shadow-sm animate-fade-in text-primary overflow-hidden">
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
        <table className="w-full text-sm border border-brand-success/20 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-brand-success/5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <th className="text-left px-4 py-2">Akun</th>
              <th className="text-right px-4 py-2 text-brand-primary">Debit</th>
              <th className="text-right px-4 py-2 text-secondary">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {commitSuccessData.journalEntries?.map((entry, i) => (
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

        <div className="flex gap-3 justify-end pt-1 border-t border-border-subtle">
          <button 
            onClick={onReset}
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
  );
}
