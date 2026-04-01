/** Evita que res.json() lance quando o servidor devolve HTML (ex.: erro 500) em vez de JSON. */
export async function parseJsonResponse<T>(res: Response): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  const text = await res.text();
  if (!text.trim()) {
    return { ok: false, message: "Resposta vazia do servidor. Inicie o app com `npm run dev` e tente de novo." };
  }
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return {
      ok: false,
      message:
        "Resposta inválida do servidor (não é JSON). Verifique se o Next.js está rodando e se a URL está correta.",
    };
  }
}
