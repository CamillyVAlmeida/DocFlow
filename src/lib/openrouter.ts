const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Modelo padrão (OpenRouter). Sobrescreva com OPENROUTER_MODEL no ambiente. */
export const OPENROUTER_MODEL_DEFAULT =
  "nvidia/nemotron-3-super-120b-a12b:free";

type OpenRouterErrorBody = {
  error?: { message?: string };
};

type OpenRouterChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

/**
 * Gera texto via OpenRouter (API compatível com OpenAI).
 * Exige OPENROUTER_API_KEY no ambiente.
 */
export async function gerarComOpenRouter(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY ausente.");
  }

  const model =
    process.env.OPENROUTER_MODEL?.trim() || OPENROUTER_MODEL_DEFAULT;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(process.env.OPENROUTER_SITE_URL?.trim()
        ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL.trim() }
        : {}),
      "X-Title": "DocFlow",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = (await res.json().catch(() => ({}))) as
    | OpenRouterChatResponse
    | OpenRouterErrorBody;

  if (!res.ok) {
    const msg =
      typeof (data as OpenRouterErrorBody).error?.message === "string"
        ? (data as OpenRouterErrorBody).error!.message!
        : `OpenRouter: HTTP ${res.status}`;
    throw new Error(msg);
  }

  const text = (data as OpenRouterChatResponse).choices?.[0]?.message
    ?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Resposta vazia da IA.");
  }
  return text;
}
