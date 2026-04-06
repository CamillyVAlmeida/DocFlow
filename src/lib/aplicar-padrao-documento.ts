import { padraoUsuarioDefinido } from "@/lib/prompt-padrao-usuario";

/**
 * Com padrão definido: substitui `{{contexto}}` no texto; se não houver placeholder,
 * concatena o contexto em uma seção "Conteúdo informado".
 */
export function aplicarPadraoDocumento(
  padrao: unknown,
  contexto: string,
  documentoSemPadrao: string
): string {
  const p = padraoUsuarioDefinido(padrao);
  const ctx = contexto.trim();
  if (!p) return documentoSemPadrao;
  if (/\{\{\s*contexto\s*\}\}/i.test(p)) {
    return p.replace(/\{\{\s*contexto\s*\}\}/gi, ctx);
  }
  return `${p.trim()}\n\n---\n\n## Conteúdo informado\n\n${ctx}`;
}
