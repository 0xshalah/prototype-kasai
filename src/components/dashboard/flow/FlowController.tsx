"use client";

import { useState } from "react";
import { VoiceInput } from "./VoiceInput";
import { TransactionReview } from "./TransactionReview";
import { LedgerLiveStatus } from "./LedgerLiveStatus";
import { useVoiceCapture } from "@/hooks/useVoiceCapture";
import { parseTransaction, commitTransaction, TransactionParseResult, CommitRequest, CommitResponseData } from "@/lib/api/transaction";
import { transcribeAudio } from "@/lib/api/transcribe";

type FlowState = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'CONFIRMING' | 'COMMITTED' | 'ERROR';

interface FlowControllerProps {
  onCommitSuccess?: () => void;
  onSwitchToBank?: () => void;
}

export function FlowController({ onCommitSuccess, onSwitchToBank }: FlowControllerProps) {
  const [flowState, setFlowState] = useState<FlowState>('IDLE');
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [parseResult, setParseResult] = useState<TransactionParseResult | null>(null);
  const [ambiguityError, setAmbiguityError] = useState<{message: string, details: TransactionParseResult | null} | null>(null);
  const [commitSuccessData, setCommitSuccessData] = useState<CommitResponseData | null>(null);

  const voiceCapture = useVoiceCapture();

  const resetFlow = () => {
    setFlowState('IDLE');
    setInputText("");
    setParseResult(null);
    setAmbiguityError(null);
    setCommitSuccessData(null);
    setErrorMessage(null);
    voiceCapture.resetCapture();
  };

  const handleStopVoice = async () => {
    if (flowState === 'PROCESSING') return; // Double-call protection
    setFlowState('PROCESSING');
    const blob = await voiceCapture.stopRecording();
    if (!blob) {
      setFlowState('IDLE');
      return;
    }

    try {
      // Add a timeout of 15s for the VPS transcription
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await transcribeAudio(blob);
      clearTimeout(timeoutId);
      if (res.success && res.data) {
        if (!res.data.transcript || res.data.transcript.trim() === "") {
           setErrorMessage("Suara tidak terdengar jelas. Silakan ulangi rekaman atau ketik manual.");
           setFlowState('IDLE');
           return;
        }
        const appended = inputText ? `${inputText} ${res.data.transcript}`.trim() : res.data.transcript;
        setInputText(appended);
        // Automatically parse after transcription arrives
        await executeParse(appended);
      } else {
        setErrorMessage(`Gagal transkripsi suara: ${res.error?.message}. Coba ketik secara manual.`);
        setFlowState('IDLE');
      }
    } catch {
       setErrorMessage("Kesalahan jaringan saat transkripsi.");
       setFlowState('IDLE');
    }
  };

  const executeParse = async (textToParse: string) => {
    if (flowState === 'PROCESSING' && inputText === textToParse) return; // Prevent spam
    setFlowState('PROCESSING');
    setErrorMessage(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await parseTransaction(textToParse);
      clearTimeout(timeoutId);
      
      if (res.success && res.data) {
        setParseResult(res.data);
        setFlowState('CONFIRMING');
      } else if (res.error?.code === "NEEDS_HUMAN_REVIEW") {
        setAmbiguityError({
          message: res.error.message,
          details: res.error.details as TransactionParseResult
        });
        setFlowState('CONFIRMING');
      } else {
        setErrorMessage(res.error?.message || "Gagal memparsing teks");
        setFlowState('IDLE');
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan saat parsing");
      setFlowState('IDLE');
    }
  };

  const handleCommit = async (overrideIntent?: "expense" | "prive") => {
    if (flowState === 'PROCESSING') return; // Double-commit protection
    setFlowState('PROCESSING');
    setErrorMessage(null);
    
    const targetData = parseResult || (ambiguityError?.details as TransactionParseResult | null);
    if (!targetData) {
       setFlowState('IDLE');
       return;
    }

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
        setFlowState('COMMITTED');
        onCommitSuccess?.(); 
      } else {
        const msg = res.error?.message || "Transaksi ditolak";
        const hint = res.error?.code === "INSUFFICIENT_FUNDS" ? " — Saldo Kas tidak cukup." : "";
        setErrorMessage(msg + hint);
        setFlowState('CONFIRMING'); // Return to confirming so user can adjust or cancel
      }
    } catch {
      setErrorMessage("Gagal terhubung ke server.");
      setFlowState('CONFIRMING');
    }
  };

  const isProcessingIndicator = flowState === 'PROCESSING';

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-primary">Terminal KasAI UMKM</h2>
        <p className="text-secondary text-sm">Rekam transaksi bisnismu menggunakan suara atau ketikan natural.</p>
      </div>

      <VoiceInput 
        inputText={inputText}
        onInputChange={setInputText}
        onParseText={() => executeParse(inputText)}
        isProcessing={isProcessingIndicator}
        voiceState={voiceCapture.state}
        onStartVoice={() => {
           setFlowState('RECORDING');
           voiceCapture.startRecording();
        }}
        onStopVoice={handleStopVoice}
        voiceErrorMessage={voiceCapture.errorMessage}
      />

      {errorMessage && (
        <div className="bg-brand-danger/10 border-l-4 border-brand-danger p-4 rounded-md flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation text-brand-danger mt-0.5 shrink-0" />
          <div>
            <p className="text-brand-danger font-bold">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-xs text-brand-danger/80 mt-1 underline">Tutup</button>
          </div>
        </div>
      )}

      {flowState === 'CONFIRMING' && (
        <TransactionReview 
          isProcessing={isProcessingIndicator}
          parseResult={parseResult}
          ambiguityError={ambiguityError}
          onCommit={handleCommit}
          onCancel={resetFlow}
        />
      )}

      {flowState === 'COMMITTED' && (
        <LedgerLiveStatus 
          commitSuccessData={commitSuccessData}
          isProcessing={isProcessingIndicator}
          onReset={resetFlow}
          onSwitchToBank={onSwitchToBank}
        />
      )}
    </div>
  );
}
