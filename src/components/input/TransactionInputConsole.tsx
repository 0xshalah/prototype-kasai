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
    <div className="flex flex-col gap-3 bg-card p-4 rounded-xl shadow-sm border border-border-subtle">
      <div className="flex items-center gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis atau ucapkan transaksi... (Cth: 'Bayar listrik 300 ribu')"
          className="flex-1 resize-none bg-card-muted border outline-none border-border-strong rounded-lg p-3 text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
          rows={2}
          disabled={isProcessing}
        />
        
        <div className="flex flex-col gap-2">
          <VoiceRecorder 
            onTranscript={(text) => onChange(value ? `${value} ${text}`.trim() : text)} 
            disabled={isProcessing} 
          />
          <button
            onClick={onParse}
            disabled={!value.trim() || isProcessing}
            className="bg-brand-primary hover:opacity-90 disabled:opacity-50 text-on-brand font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isProcessing ? "Menganalisa..." : "Parse"}
          </button>
        </div>
      </div>
      
      <div className="text-xs text-muted">
        Engine KasAI akan mengekstrak nominal, niat (intent), dan memisahkan entitas bisnis.
      </div>
    </div>
  );
}
