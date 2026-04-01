import { gerarComGemini } from "@/lib/gemini";
import { gerarComOpenRouter } from "@/lib/openrouter";

/**
 * Gera texto com IA: prioriza OpenRouter; se não houver chave, usa Google Gemini.
 */
export async function gerarComIA(prompt: string): Promise<string> {
  if (process.env.OPENROUTER_API_KEY?.trim()) {
    return gerarComOpenRouter(prompt);
  }
  if (process.env.GOOGLE_AI_API_KEY?.trim()) {
    return gerarComGemini(prompt);
  }
  throw new Error(
    "Nenhuma chave de IA configurada. Defina OPENROUTER_API_KEY ou GOOGLE_AI_API_KEY em .env.local e reinicie o servidor (npm run dev)."
  );
}
