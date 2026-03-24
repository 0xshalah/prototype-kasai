async function testMainland() {
  const apiKey = "sk-5c94499d0a3a4b38a46f6941a64da128";
  
  const dummyBuffer = Buffer.from('RIFF$   WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00', 'binary');
  const blob = new Blob([dummyBuffer], { type: 'audio/wav' });

  const formData = new FormData();
  formData.append('file', blob, 'test.wav');
  formData.append('model', 'sensevoice-v1');

  try {
    const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      body: formData
    });
    console.log("Mainland Compatible Response:", res.status, await res.text());
  } catch(e) {
    console.log("Mainland Compatible Error:", e.message);
  }
}

testMainland();
