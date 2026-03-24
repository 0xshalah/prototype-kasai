import { TransactionParseResult } from "@/lib/api/transaction";

export interface AIProvider {
  /**
   * Translates a natural language string into a structured transaction object
   * Returns null if the AI fails to generate a confident/valid structure 
   * (so the caller can fallback to rule-based parsing).
   */
  parseTransaction(text: string): Promise<TransactionParseResult | null>;

  /**
   * Transcribes an audio file into text.
   * Returns null if it fails.
   */
  transcribeAudio(file: File): Promise<{ transcript: string; confidence: number } | null>;
}

// A simple factory to load the active provider based on env
export async function getActiveAIProvider(): Promise<AIProvider | null> {
  const activeName = process.env.AI_PROVIDER || 'openai';
  
  if (activeName === 'alibaba') {
    const { AlibabaModelStudioProvider } = await import('./providers/alibaba');
    return new AlibabaModelStudioProvider();
  } else if (activeName === 'openai') {
    const { OpenAIProvider } = await import('./providers/openai');
    return new OpenAIProvider();
  }
  
  return null;
}
