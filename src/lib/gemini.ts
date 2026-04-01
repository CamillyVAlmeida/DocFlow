import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_AI_API_KEY não configurada. Defina em .env.local"
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Gera texto usando o Gemini com o prompt informado.
 * Usado para análise de contexto e geração de documentação em cada módulo.
 */
export async function gerarComIA(prompt: string): Promise<string> {
  const genAI = getGenAI();
  // Modelos disponíveis: gemini-2.5-flash (estável), gemini-3-flash-preview, gemini-2.0-flash
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  if (!text) {
    throw new Error("Resposta vazia da IA.");
  }
  return text;
}
