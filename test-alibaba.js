const fs = require('fs');
const path = require('path');

async function testDashScope() {
  const apiKey = "sk-5c94499d0a3a4b38a46f6941a64da128"; // Extracted from user's env summary above
  
  // We'll test text completion just to verify if the KEY is valid and which endpoint works
  const body = JSON.stringify({
    model: "qwen-plus",
    messages: [{ role: "user", content: "test" }]
  });

  const urls = [
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
  ];

  for (const url of urls) {
    try {
      console.log("Testing:", url);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body
      });
      console.log(url, "->", res.status, await res.text());
    } catch(e) {
      console.log(url, "Error ->", e.message);
    }
  }
}

testDashScope();
