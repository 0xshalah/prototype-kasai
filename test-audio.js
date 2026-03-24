const fs = require('fs');
const path = require('path');

async function testNativeAudio() {
  const apiKey = "sk-5c94499d0a3a4b38a46f6941a64da128";
  
  // Create a minimal fake wav file payload for testing
  const dummyBuffer = Buffer.from('RIFF$   WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00', 'binary');
  
  const blob = new Blob([dummyBuffer], { type: 'audio/wav' });

  // Native File Upload attempt (not OSS)
  const formData = new FormData();
  formData.append('file', blob, 'test.wav');
  formData.append('model', 'qwen3-asr-flash');
  // API might also expect 'file_urls' only, but some REST endpoints allow fallback multipart.

  console.log("Testing multipart/form-data...");
  try {
    const res = await fetch("https://dashscope-intl.aliyuncs.com/api/v1/services/audio/asr/transcription", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "X-DashScope-Async": "disable"
      },
      body: formData
    });
    console.log("Multipart Response:", res.status, await res.text());
  } catch(e) {
    console.log("Multipart Error:", e.message);
  }
}

testNativeAudio();
