"use client";

import { VoiceRecorder } from "./VoiceRecorder";

interface TransactionInputConsoleProps {
  value: string;
  onChange: (val: string) => void;
  onParse: () => void;
  isProcessing: boolean;
}

export function TransactionInputConsole({
  value,
  onChange,
  onParse,
  isProcessing
}: TransactionInputConsoleProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isProcessing) {
        onParse();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-card p-5 rounded-2xl shadow-md border border-border-subtle">
      <div className="flex flex-col gap-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis atau ucapkan transaksi... (Cth: 'Bayar listrik 300 ribu')"
          className="w-full resize-none bg-card-muted border outline-none border-border-strong rounded-xl p-4 text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent transition text-base"
          rows={3}
          disabled={isProcessing}
        />
        
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1">
            <VoiceRecorder 
              onTranscript={(text) => onChange(value ? `${value} ${text}`.trim() : text)} 
              disabled={isProcessing} 
            />
          </div>
          <button
            onClick={onParse}
            disabled={!value.trim() || isProcessing}
            className="col-span-3 bg-brand-primary hover:opacity-90 disabled:opacity-50 text-on-brand font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                Menganalisa...
              </>
            ) : (
              <>
                PROSES TRANSAKSI
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="text-[10px] text-muted text-center uppercase tracking-widest font-medium">
        <i className="fa-solid fa-bolt mr-1 text-brand-warning" /> 
        AI akan otomatis memproses akuntansi SAK EMKM
      </div>
    </div>
  );
}
