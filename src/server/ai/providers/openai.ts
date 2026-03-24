import { AIProvider } from "../provider";
import OpenAI from "openai";
import { TransactionParseResult } from "@/lib/api/transaction";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  async parseTransaction(text: string): Promise<TransactionParseResult | null> {
    if (!process.env.OPENAI_API_KEY || process.env.DEMO_MODE === 'true') return null;

    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert accountant extraction AI for Indonesian micro-businesses. 
Extract transaction details from the user's text. 
Return ONLY a JSON object:
{ "intent": "expense"|"prive"|"ambiguous", "amount": number, "debitAccount": string, "creditAccount": "Kas", "needsHumanReview": boolean, "reviewReason": string|null }`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) return null;
      
      const parsed = JSON.parse(responseText);
      return {
        rawText: text,
        intent: parsed.intent,
        amount: parsed.amount,
        currency: "IDR",
        debitAccount: parsed.debitAccount,
        creditAccount: parsed.creditAccount,
        confidence: 0.95,
        needsHumanReview: parsed.needsHumanReview,
        reviewReason: parsed.reviewReason
      };
    } catch (e) {
      console.error("[OpenAI Provider] Text Parse Error:", e);
      return null;
    }
  }

  async transcribeAudio(file: File): Promise<{ transcript: string; confidence: number; } | null> {
    if (!process.env.OPENAI_API_KEY || process.env.DEMO_MODE === 'true') return null;

    try {
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        language: "id"
      });

      return {
        transcript: transcription.text,
        confidence: 0.98
      };
    } catch (e) {
      console.error("[OpenAI Provider] Transcription Error:", e);
      return null;
    }
  }
}
