import { AIProvider } from "../provider";
import OpenAI from "openai";
import { TransactionParseResult } from "@/lib/api/transaction";

export class GroqProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY || "",
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async parseTransaction(text: string): Promise<TransactionParseResult | null> {
    if (!process.env.GROQ_API_KEY) return null;

    try {
      const completion = await this.client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Anda adalah AI asisten akuntansi untuk UMKM Indonesia berbasis SAK EMKM.
Ekstrak transaksi dari input teks user.
ATURAN SAK EMKM:
- Pemasukan/Penjualan (Sales): intent="revenue", debitAccount="Kas", creditAccount="Pendapatan Usaha"
- Pengeluaran operasional (Expense): intent="expense", debitAccount="Beban Operasional", creditAccount="Kas"
- Keperluan pribadi pemilik (Prive): intent="prive", debitAccount="Prive Pemilik", creditAccount="Kas"
- Jika teks membingungkan atau tidak terkait keuangan: intent="ambiguous", needsHumanReview=true.

Return WAJIB dalam format JSON object berikut (tanpa markdown atau teks lain):
{ "intent": "revenue"|"expense"|"prive"|"ambiguous", "amount": number, "debitAccount": string, "creditAccount": string, "needsHumanReview": boolean, "reviewReason": string|null }`
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
        confidence: 0.99,
        needsHumanReview: parsed.needsHumanReview,
        reviewReason: parsed.reviewReason
      };
    } catch (e) {
      console.error("[Groq Provider] Text Parse Error:", e);
      return null;
    }
  }

  async transcribeAudio(file: File): Promise<{ transcript: string; confidence: number; } | null> {
    if (!process.env.GROQ_API_KEY) return null;

    try {
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
        language: "id"
      });

      return {
        transcript: transcription.text,
        confidence: 0.99
      };
    } catch (e) {
      console.error("[Groq Provider] Transcription Error:", e);
      return null;
    }
  }
}
