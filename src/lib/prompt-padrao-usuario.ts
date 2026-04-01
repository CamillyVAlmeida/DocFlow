/**
 * Quando há padrão em Configuração de IA, não misturamos instruções fixas (listas de seções)
 * com o padrão — a IA tendia a gerar dois documentos ou estruturas duplicadas.
 */

export function padraoUsuarioDefinido(padrao: unknown): string | null {
  if (typeof padrao !== "string") return null;
  const t = padrao.trim();
  return t.length > 0 ? t : null;
}

type MontarPromptGeracaoArgs = {
  padrao: unknown;
  /** Ex.: "um especialista em documentação de bugs" */
  papel: string;
  /** Uma frase curta sobre o que gerar (modo com padrão). */
  tarefaComPadrao: string;
  /** Prompt completo usado quando o usuário não definiu padrão. */
  promptSemPadrao: string;
  /** Texto que alimenta o documento (contexto, notas, etc.). */
  conteudoEntrada: string;
  /** Rótulo do bloco (ex.: CONTEXTO DO BUG). */
  labelConteudo: string;
};

export function montarPromptGeracao({
  padrao,
  papel,
  tarefaComPadrao,
  promptSemPadrao,
  conteudoEntrada,
  labelConteudo,
}: MontarPromptGeracaoArgs): string {
  const p = padraoUsuarioDefinido(padrao);
  if (!p) return promptSemPadrao;

  const entrada = conteudoEntrada.trim();

  return `Você é ${papel}.

O usuário definiu EXCLUSIVAMENTE o formato e a estrutura do documento. Siga APENAS o padrão abaixo. Não adicione outra lista de seções do sistema, não combine com um modelo alternativo e não gere um segundo documento.

PADRÃO:
---
${p}
---

${tarefaComPadrao}

Use as informações abaixo para preencher o documento conforme o padrão. Se o padrão exigir um dado que não exista nas informações, use "não informado" ou equivalente.

${labelConteudo}:
---
${entrada}
---

Responda APENAS com UM único documento em Markdown, sem texto introdutório antes ou depois.`;
}
