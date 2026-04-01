import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gera texto via Google Gemini.
 * Exige GOOGLE_AI_API_KEY no ambiente.
 */
export async function gerarComGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY ausente.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text?.trim()) {
    throw new Error("Resposta vazia da IA.");
  }
  return text;
}
