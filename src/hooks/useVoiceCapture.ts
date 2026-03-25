import { useState, useRef, useCallback } from 'react';

export type VoiceCaptureState = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'ERROR';

export function useVoiceCapture() {
  const [state, setState] = useState<VoiceCaptureState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage(null);
      setState('RECORDING');
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100); // Capture in 100ms chunks for reliability
      mediaRecorderRef.current = recorder;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(e.message || 'Gagal mengakses mikrofon');
      setState('ERROR');
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (state !== 'RECORDING' || !mediaRecorderRef.current) return null;
    
    setState('PROCESSING');

    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current!;
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        // Stop all audio tracks
        recorder.stream.getTracks().forEach(track => track.stop());
        setState('IDLE');
        resolve(blob);
      };

      recorder.stop();
    });
  }, [state]);

  const resetCapture = useCallback(() => {
    setState('IDLE');
    setErrorMessage(null);
    chunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        mediaRecorderRef.current.stop();
    }
  }, []);

  return { 
    state, 
    errorMessage, 
    startRecording, 
    stopRecording, 
    resetCapture 
  };
}
