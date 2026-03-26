import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const SUPPORTED_MIME_TYPES = [
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "video/webm",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioField = formData.get("audio");

    if (!audioField || typeof audioField === "string") {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Field 'audio' tidak ditemukan atau bukan berupa file biner",
          details: {}
        }
      }, { status: 400 });
    }

    const audioFile = audioField as File;

    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Ukuran file audio maksimal 25MB",
          details: { maxSize: MAX_FILE_SIZE, actualSize: audioFile.size }
        }
      }, { status: 413 });
    }

    const fileType = audioFile.type.split(';')[0];
    if (!SUPPORTED_MIME_TYPES.some(type => audioFile.type.includes(type) || fileType === type)) {
      return NextResponse.json({
        success: false,
        error: {
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Format audio tidak didukung",
          details: { supportedFormats: ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav"] }
        }
      }, { status: 415 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const voiceApiUrl = process.env.VOICE_API_URL;
    const openaiApiKey = process.env.OPENAI_API_KEY;


    // --- 1. Primary: Groq (High Performance) ---
    if (groqApiKey) {
      try {
        console.log(`[Voice Pipeline] Trying Groq Cloud (whisper-large-v3)`);
        const groqController = new AbortController();
        const groqTimeout = setTimeout(() => groqController.abort(), 10000);

        const groqFormData = new FormData();
        groqFormData.append('file', audioFile, 'recording.webm');
        groqFormData.append('model', 'whisper-large-v3');
        groqFormData.append('language', 'id');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${groqApiKey}` },
          body: groqFormData,
          signal: groqController.signal,
        });
        clearTimeout(groqTimeout);

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || `Groq status ${response.status}`);

        const transcriptText = (data.text || "").trim();
        
        // Hallucination filters
        const hallucinations = ["Terimakasih", "Terima kasih", "Thanks for watching", "Thank you"];
        const isHallucination = hallucinations.some((h: string) => 
          transcriptText.toLowerCase() === h.toLowerCase() || 
          (transcriptText.toLowerCase().includes(h.toLowerCase()) && transcriptText.length < 15)
        );

        if (!transcriptText || isHallucination) {
           throw new Error(`Kualitas audio rendah atau suara tidak terdeteksi.`);
        }

        return NextResponse.json({
            success: true,
            data: { transcript: transcriptText, confidence: 0.99, durationSeconds: 0, provider: "groq-whisper", fallbackTriggered: false }
        });
      } catch (groqError: unknown) {
        const gErr = groqError instanceof Error ? groqError : new Error(String(groqError));
        console.warn(`[Voice Pipeline] Groq failed (${gErr.message}), falling back...`);
      }
    }

    // --- 2. Secondary: Sovereign VPS ---
    if (voiceApiUrl) {
      try {
        console.log(`[Voice Pipeline] Trying Sovereign AI VPS: ${voiceApiUrl}`);
        const vpsController = new AbortController();
        const vpsTimeout = setTimeout(() => vpsController.abort(), 12000);

        const vpsFormData = new FormData();
        vpsFormData.append('audio', audioFile, audioFile.name || 'recording.webm');
        
        const response = await fetch(voiceApiUrl, {
          method: 'POST',
          body: vpsFormData,
          signal: vpsController.signal,
        });
        clearTimeout(vpsTimeout);

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `VPS status ${response.status}`);

        const transcriptText = (data.transcript || "").trim();
        console.log(`[DEBUG-RAW] VPS transcript: "${transcriptText}"`);
        
        // Hallucination filters
        const hallucinations = ["Terimakasih", "Terima kasih", "Thanks for watching", "Thank you"];
        if (!transcriptText || hallucinations.some((h: string) => transcriptText.toLowerCase().includes(h.toLowerCase()) && transcriptText.length < 20)) {
           throw new Error("Suara tidak terdengar jelas atau mengandung gangguan (Hallucination detected)");
        }

        return NextResponse.json({
            success: true,
            data: { transcript: transcriptText, confidence: 0.99, durationSeconds: 0, provider: "vps-sovereign", fallbackTriggered: true }
        });
      } catch (vpsError: unknown) {
        const vErr = vpsError instanceof Error ? vpsError : new Error(String(vpsError));
        console.warn(`[Voice Pipeline] VPS failed (${vErr.message}), trying OpenAI Whisper fallback...`);
      }
    }

    // --- 3. Tertiary: OpenAI Whisper ---
    if (openaiApiKey) {
      try {
        console.log('[Voice Pipeline] Falling back to OpenAI Whisper API');
        const whisperFormData = new FormData();
        whisperFormData.append('file', audioFile, audioFile.name || 'recording.webm');
        whisperFormData.append('model', 'whisper-1');
        whisperFormData.append('language', 'id');

        const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${openaiApiKey}` },
          body: whisperFormData,
        });

        const whisperData = await whisperRes.json();
        if (!whisperRes.ok) throw new Error(whisperData.error?.message || `Whisper status ${whisperRes.status}`);

        const transcriptText = (whisperData.text || "").trim();
        
        // Hallucination filters (common when there's silence or noise)
        const hallucinations = ["Terimakasih", "Terima kasih", "Thanks for watching", "Thank you"];
        if (!transcriptText || hallucinations.some(h => transcriptText.toLowerCase().includes(h.toLowerCase()) && transcriptText.length < 20)) {
           throw new Error("Suara tidak terdengar jelas atau mengandung gangguan (Hallucination detected)");
        }

        return NextResponse.json({
            success: true,
            data: { transcript: transcriptText, confidence: 0.95, durationSeconds: 0, provider: "openai-whisper", fallbackTriggered: true }
        });
      } catch (whisperError: unknown) {
        const wErr = whisperError instanceof Error ? whisperError : new Error(String(whisperError));
        console.error(`[Voice Pipeline] All providers failed: ${wErr.message}`);
        return NextResponse.json({
            success: false,
            error: { code: "TRANSCRIPTION_FAILED", message: "Gagal memproses audio di semua provider", details: { error: wErr.message } }
        }, { status: 500 });
      }
    }

    // No provider configured
    return NextResponse.json({
      success: false,
      error: { code: "VOICE_API_NOT_CONFIGURED", message: "Tidak ada provider transkripsi (GROQ, VPS, atau OPENAI)", details: {} }
    }, { status: 503 });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to handle transcribe request",
          details: {}
        }
    }, { status: 500 });
  }
}
