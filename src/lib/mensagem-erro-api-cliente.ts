/** Extrai texto de erro de corpos JSON típicos de APIs (DocFlow, Next e proxies/CDNs). */
export function mensagemErroDeCorpoJson(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const raiz = (k: string) => {
    const v = d[k];
    return typeof v === "string" && v.trim() ? v : null;
  };
  for (const k of ["erro", "error", "message", "detail", "description", "msg"] as const) {
    const s = raiz(k);
    if (s) return s;
  }

  const e = d.erro;
  const err = d.error;
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return null;
}
