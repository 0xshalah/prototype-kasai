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

    const voiceApiUrl = process.env.VOICE_API_URL;

    if (!voiceApiUrl) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VOICE_API_NOT_CONFIGURED",
          message: "Sovereign AI VPS URL belum dikonfigurasi di .env",
          details: {}
        }
      }, { status: 503 });
    }

    try {
      console.log(`[Voice Pipeline] Forwarding payload ke Sovereign AI: ${voiceApiUrl}`);

      // Forward file-nya saja ke VPS menggunakan formData Node native
      const vpsFormData = new FormData();
      vpsFormData.append('audio', audioFile, audioFile.name || 'recording.webm');
      
      const response = await fetch(voiceApiUrl, {
        method: 'POST',
        body: vpsFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `VPS Transcription failed with status ${response.status}`);
      }

      const transcriptText = data.transcript || "";

      if (!transcriptText.trim()) {
        throw new Error("Transkripsi mengembalikan hasil kosong");
      }

      return NextResponse.json({
          success: true,
          data: {
              transcript: transcriptText,
              confidence: 0.99, // Assumption from VPS
              durationSeconds: 0,
              provider: "vps-sovereign",
              fallbackTriggered: false
          }
      });
    } catch (primaryError: unknown) {
        const pErr = primaryError instanceof Error ? primaryError : new Error(String(primaryError));
        console.error(`[Voice Pipeline] VPS Provider Failed: ${pErr.message}`);
        
        return NextResponse.json({
            success: false,
            error: {
                code: "TRANSCRIPTION_FAILED",
                message: "Gagal memproses audio di Sovereign AI",
                details: { error: pErr.message }
            }
        }, { status: 500 });
    }

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
