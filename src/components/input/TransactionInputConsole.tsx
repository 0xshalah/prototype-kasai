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
    <div className="flex flex-col gap-4 bg-card p-5 lg:p-6 rounded-2xl shadow-md border border-border-subtle">
      <div className="flex flex-col gap-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis atau ucapkan transaksi... (Cth: 'Bayar listrik 300 ribu')"
          className="w-full resize-none bg-page border outline-none border-border-strong rounded-xl p-4 text-primary placeholder:text-muted focus:ring-2 focus:ring-brand-primary focus:border-transparent transition text-base"
          rows={3}
          disabled={isProcessing}
        />
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          <div className="col-span-1">
            <VoiceRecorder 
              onTranscript={(text) => onChange(value ? `${value} ${text}`.trim() : text)} 
              disabled={isProcessing} 
            />
          </div>
          <button
            onClick={onParse}
            disabled={!value.trim() || isProcessing}
            className="col-span-3 sm:col-span-4 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-card-muted disabled:text-muted disabled:border disabled:border-border-strong disabled:shadow-none text-on-brand font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                Menganalisa...
              </>
            ) : !value.trim() ? (
              <>
                <i className="fa-solid fa-keyboard opacity-50" />
                Masukan Transaksi
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
      
      <div className="flex items-center justify-center gap-2 px-3 py-2 bg-brand-warning/10 border border-brand-warning/20 rounded-lg text-brand-warning">
        <i className="fa-solid fa-bolt" /> 
        <span className="text-xs font-bold uppercase tracking-wider">AI otomatis memproses jurnal SAK EMKM</span>
      </div>
    </div>
  );
}
