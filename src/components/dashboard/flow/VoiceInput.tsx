"use client";

import { VoiceCaptureState } from "@/hooks/useVoiceCapture";

interface VoiceInputProps {
  inputText: string;
  onInputChange: (val: string) => void;
  onParseText: () => void;
  isProcessing: boolean;
  voiceState: VoiceCaptureState;
  onStartVoice: () => void;
  onStopVoice: () => void;
  voiceErrorMessage: string | null;
}

export function VoiceInput({
  inputText,
  onInputChange,
  onParseText,
  isProcessing,
  voiceState,
  onStartVoice,
  onStopVoice,
  voiceErrorMessage,
}: VoiceInputProps) {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isProcessing) {
        onParseText();
      }
    }
  };

  const isRecording = voiceState === 'RECORDING';
  const isVoiceProcessing = voiceState === 'PROCESSING';

  return (
    <div className="flex flex-col gap-4 bg-card p-5 lg:p-6 rounded-2xl shadow-md border border-border-subtle animate-fade-in text-primary">
      <div className="flex flex-col gap-4">
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Mendengarkan..." : "Tulis atau ucapkan transaksi... (Cth: 'Bayar listrik 300 ribu')"}
          className={`w-full resize-none bg-page border outline-none rounded-xl p-4 text-primary placeholder:text-muted focus:ring-2 focus:ring-brand-primary focus:border-transparent transition text-base ${
            isRecording ? "border-brand-danger bg-brand-danger/5" : "border-border-strong"
          }`}
          rows={3}
          disabled={isProcessing || isRecording || isVoiceProcessing}
        />
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          <div className="col-span-1 flex flex-col gap-2 w-full">
            <button
              type="button"
              disabled={isProcessing || isVoiceProcessing}
              onClick={isRecording ? onStopVoice : onStartVoice}
              className={`px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold border shadow-md ${
                isRecording
                  ? 'bg-brand-danger text-on-brand border-brand-danger animate-pulse shadow-brand-danger/30' 
                  : isVoiceProcessing 
                    ? 'bg-brand-primary/50 text-on-brand border-transparent cursor-wait' 
                    : 'bg-card border-border-strong hover:bg-page text-primary'
              } disabled:opacity-50`}
            >
              {isVoiceProcessing ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                 <i className={`fa-solid ${isRecording ? 'fa-stop text-white' : 'fa-microphone text-brand-primary'}`} />
              )}
            </button>
          </div>
          <button
            onClick={onParseText}
            disabled={!inputText.trim() || isProcessing || isRecording || isVoiceProcessing}
            className="col-span-3 sm:col-span-4 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-card-muted disabled:text-muted disabled:border disabled:border-border-strong disabled:shadow-none text-on-brand font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                Menganalisa...
              </>
            ) : !inputText.trim() ? (
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
      
      {voiceErrorMessage && (
         <span className="text-brand-danger text-xs px-2">{voiceErrorMessage}</span>
      )}

      <div className="flex items-center justify-center gap-2 px-3 py-2 bg-brand-warning/10 border border-brand-warning/20 rounded-lg text-brand-warning">
        <i className="fa-solid fa-bolt" /> 
        <span className="text-xs font-bold uppercase tracking-wider">AI otomatis memproses jurnal SAK EMKM</span>
      </div>
    </div>
  );
}
