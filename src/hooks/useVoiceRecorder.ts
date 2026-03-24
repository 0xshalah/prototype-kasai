"use client";

import { useState, useRef, useCallback } from 'react';

export type RecorderState = 'inactive' | 'recording' | 'processing' | 'error';

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>('inactive');
  const [recordingMode, setRecordingMode] = useState<'native' | 'backend' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [nativeTranscript, setNativeTranscript] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async (mode: 'native' | 'backend' = 'backend') => {
    try {
      setErrorMessage(null);
      setAudioBlob(null);
      setNativeTranscript(null);
      setRecordingMode(mode);
      chunksRef.current = [];

      if (mode === 'native') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error('Browser tidak mendukung Quick Voice (SpeechRecognition).');
        }
        
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          setNativeTranscript(event.results[0][0].transcript);
        };
        
        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          setErrorMessage('Gagal merekam: ' + event.error);
          setState('error');
        };

        recognition.onend = () => {
            if (recognitionRef.current) setState('processing');
        };
        
        recognitionRef.current = recognition;
        recognition.start();
        setState('recording');
        return; 
      }

      // Backend mode (Primary Reliable Path)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState('recording');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengakses mikrofon');
      setState('error');
      setRecordingMode(null);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (state === 'recording') {
      if (recognitionRef.current && recordingMode === 'native') {
         recognitionRef.current.stop();
      } else if (mediaRecorderRef.current && recordingMode === 'backend') {
         mediaRecorderRef.current.stop();
      }
      setState('processing');
    }
  }, [state, recordingMode]);

  const resetRecording = useCallback(() => {
    setState('inactive');
    setRecordingMode(null);
    setAudioBlob(null);
    setNativeTranscript(null);
    setErrorMessage(null);
    chunksRef.current = [];
    recognitionRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  return { state, trackingMode: recordingMode, setState, errorMessage, audioBlob, nativeTranscript, startRecording, stopRecording, resetRecording };
}
