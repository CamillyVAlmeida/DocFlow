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
    "Nenhuma chave de IA no servidor. Local: defina OPENROUTER_API_KEY e/ou GOOGLE_AI_API_KEY em .env.local e reinicie (npm run dev). Produção: o .env.local não vai para o deploy — cadastre as mesmas variáveis no painel do provedor (Site settings → Environment variables) e faça um novo deploy."
  );
}
