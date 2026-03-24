import fs from 'fs';
import path from 'path';

// Buat dummy WAV yang valid (44 bytes silence)
function createDummyWav(): Buffer {
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36, 4); // File size - 8
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(1, 22); // NumChannels
  buffer.writeUInt32LE(44100, 24); // SampleRate
  buffer.writeUInt32LE(44100 * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(0, 40); // Data volume size (0 for silence)
  return buffer;
}

async function runTests() {
  console.log("=========================================");
  console.log("🎙️ STARTING VOICE (WHISPER) E2E TESTING");
  console.log("=========================================");

  const dummyWav = createDummyWav();
  
  // Create a minimal multipart/form-data request without external libraries
  const boundary = '----WebKitFormBoundary7x9l3z4k';
  
  const header = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="audio"; filename="dummy.wav"\r\n` +
    `Content-Type: audio/wav\r\n\r\n`
  );
  
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  
  const body = Buffer.concat([header, dummyWav, footer]);

  console.log("▶️ Mengirim dummy audio (silence) ke /api/transcribe...");
  console.log("(Ekspektasi: Request berhasil, namun transcript kosong atau kata-kata hening/halusinasi Whisper)");

  try {
    const res = await fetch("http://localhost:3000/api/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: body as any
    });

    const json = await res.json();
    
    console.log(`\nStatus HTTP: ${res.status}`);
    console.log("Response Body:");
    console.dir(json, { depth: null });

    if (json.success && json.data.provider === 'openai') {
      console.log("\n✅ Test passed! Endpoint terhubung ke OpenAI Whisper dengan sukses.");
    } else {
      console.log("\n⚠️ Test failed / Warning! Cek response di atas.");
    }
    
  } catch (e: any) {
    console.error("❌ Request Error:", e.message);
  }

  console.log("\n=========================================");
  console.log("🏁 VOICE E2E TESTS COMPLETED");
  console.log("=========================================");
}

runTests();
