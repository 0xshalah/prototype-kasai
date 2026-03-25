import { ApiResponse } from "./transaction";

export type TranscribeData = {
  transcript: string;
  confidence: number;
  durationSeconds: number;
};

export async function transcribeAudio(audioBlob: Blob, signal?: AbortSignal): Promise<ApiResponse<TranscribeData>> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
    signal,
  });
  
  return res.json();
}
