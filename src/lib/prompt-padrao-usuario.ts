/** Campo opcional `padrao` enviado pelo cliente (localStorage) para personalizar o documento. */

export function padraoUsuarioDefinido(padrao: unknown): string | null {
  if (typeof padrao !== "string") return null;
  const t = padrao.trim();
  return t.length > 0 ? t : null;
}
