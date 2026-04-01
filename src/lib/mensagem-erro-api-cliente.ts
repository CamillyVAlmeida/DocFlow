/** Extrai texto de erro de corpos JSON típicos de APIs ({ erro: "..." } ou { error: { message } }). */
export function mensagemErroDeCorpoJson(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const e = d.erro;
  const err = d.error;
  if (typeof e === "string") return e;
  if (typeof err === "string") return err;
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
