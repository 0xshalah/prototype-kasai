"use client";

import { useEffect, useState } from "react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { transcribeAudio } from "@/lib/api/transcribe";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const { state, errorMessage, audioBlob, nativeTranscript, startRecording, stopRecording, resetRecording } = useVoiceRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  useEffect(() => {
    async function handleTranscription() {
      if (state === 'processing' && !isTranscribing) {
        // Option 1: Native Speech Recognition delivered the string instantly
        if (nativeTranscript) {
           onTranscript(nativeTranscript);
           resetRecording();
           return;
        }

        // Option 2: Fallback to backend processing of the MediaRecorder Blob
        if (audioBlob) {
          setIsTranscribing(true);
          try {
            const res = await transcribeAudio(audioBlob);
            if (res.success && res.data) {
              setTranscriptionError(null);
              onTranscript(res.data.transcript);
            } else {
              setTranscriptionError(`Transkripsi suara sedang tidak tersedia. ${res.error?.message || ''}. Anda tetap bisa melanjutkan dengan input teks manual.`);
            }
          } catch (e) {
            setTranscriptionError("Terjadi kesalahan jaringan saat transkripsi. Anda tetap bisa melanjutkan dengan input teks manual.");
          } finally {
            setIsTranscribing(false);
            resetRecording();
          }
        }
      }
    }
    handleTranscription();
  }, [audioBlob, nativeTranscript, state, isTranscribing, onTranscript, resetRecording]);

  const handleToggle = () => {
    if (state === 'inactive' || state === 'error') startRecording('backend');
    else if (state === 'recording') stopRecording();
  };

  const isRecording = state === 'recording';
  const isProcessing = isTranscribing || state === 'processing';

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        type="button"
        disabled={disabled || isProcessing}
        onClick={handleToggle}
        className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-bold border shadow-sm ${
          isRecording
            ? 'bg-brand-danger text-on-brand border-brand-danger animate-pulse' 
            : isProcessing ? 'bg-brand-primary/50 text-on-brand border-transparent cursor-wait' 
            : 'bg-brand-primary text-on-brand border-brand-primary hover:bg-brand-primary-hover shadow-brand-primary/20'
        } disabled:opacity-50`}
      >
        {isProcessing ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
        )}
        <span className="text-sm">
          {isRecording ? 'Berhenti Merekam...' : isProcessing ? 'Memproses...' : 'Rekam Suara'}
        </span>
      </button>

      {errorMessage && <span className="text-brand-danger text-xs">{errorMessage}</span>}
      {transcriptionError && (
        <div className="text-secondary text-xs bg-card-muted border border-border-strong p-3 rounded-lg mt-2 leading-relaxed">
          <i className="fa-solid fa-circle-exclamation text-brand-warning mr-2"></i>
          {transcriptionError}
        </div>
      )}
    </div>
  );
}
