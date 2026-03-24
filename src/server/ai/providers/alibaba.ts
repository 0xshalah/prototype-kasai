import { AIProvider } from "../provider";
import OpenAI from "openai";
import { TransactionParseResult } from "@/lib/api/transaction";
import { z } from "zod";

export class AlibabaModelStudioProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY || "",
      baseURL: process.env.ALIBABA_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    });
  }

  async parseTransaction(text: string): Promise<TransactionParseResult | null> {
    if (!process.env.DASHSCOPE_API_KEY || process.env.DEMO_MODE === 'true') return null;

    try {
      const completion = await this.client.chat.completions.create({
        model: "qwen-plus",
        messages: [
          {
            role: "system",
            content: `You are an expert accountant extraction AI for Indonesian micro-businesses. 
Extract transaction details from the user's text. 
Return ONLY a valid JSON object matching this schema exactly:
{
  "intent": "expense" | "prive" | "ambiguous",
  "amount": number,
  "debitAccount": "Beban Operasional" | "Prive Pemilik" | string,
  "creditAccount": "Kas" | string,
  "needsHumanReview": boolean,
  "reviewReason": string | null
}
Rules:
- If it's clearly for personal use (pribadi/prive), intent is "prive" and debitAccount is "Prive Pemilik".
- If it's clearly for business (usaha), intent is "expense" and debitAccount is "Beban Operasional".
- If it's ambiguous (e.g., "tarik tunai 100 ribu" without context), intent is "ambiguous", needsHumanReview is true, reviewReason is "ENTITY_SEPARATION_AMBIGUOUS".
- amount must be an integer.
No markdown, no markdown blocks, just raw JSON string.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      if (!responseText) return null;

      // Clean up markdown block if the model ignores the "no markdown" rule
      const cleanJson = responseText.replace(/^```json/i, "").replace(/```$/, "").trim();
      
      const parsed = JSON.parse(cleanJson);
      return {
        rawText: text,
        intent: parsed.intent,
        amount: parsed.amount,
        currency: "IDR",
        debitAccount: parsed.debitAccount,
        creditAccount: parsed.creditAccount,
        confidence: 0.90, // Qwen text confidence estimate
        needsHumanReview: parsed.needsHumanReview,
        reviewReason: parsed.reviewReason
      };
    } catch (e) {
      console.error("[Alibaba Provider] Text Parse Error:", e);
      return null;
    }
  }

  async transcribeAudio(file: File): Promise<{ transcript: string; confidence: number; } | null> {
    if (process.env.DEMO_MODE === 'true') return null;

    try {
      // Qwen3-ASR natively requires file_urls (OSS). To allow direct binary buffer upload 
      // without an OSS intermediary, we use the OpenAI-compatible endpoint with 'sensevoice-v1'.
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: "sensevoice-v1",
        language: "id"
      });

      return {
        transcript: transcription.text,
        confidence: 0.95
      };
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error("[Alibaba Provider] Transcription Error:", err.message);
      throw new Error(`Alibaba ASR Failed: ${err.message}`);
    }
  }
}
