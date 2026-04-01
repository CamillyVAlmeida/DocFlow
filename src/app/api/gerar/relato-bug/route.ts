import { NextRequest, NextResponse } from "next/server";
import { gerarComIA } from "@/lib/gerar-ia";
import { montarPromptGeracao } from "@/lib/prompt-padrao-usuario";

export async function POST(request: NextRequest) {
  try {
    const { contexto, padrao } = await request.json();
    if (typeof contexto !== "string" || !contexto.trim()) {
      return NextResponse.json(
        { erro: "Campo 'contexto' é obrigatório." },
        { status: 400 }
      );
    }

    const contextoLimpo = contexto.trim();
    const dataGeracao = new Date().toLocaleDateString("pt-BR");

    const promptSemPadrao = `Você é um especialista em documentação de bugs. Com base no contexto abaixo, gere um RELATO DE BUG completo em Markdown, com foco em detalhes técnicos do problema.

Inclua:
1. Título e data (use: ${dataGeracao})
2. Resumo do problema (uma ou duas frases)
3. Descrição detalhada do bug
4. **Detalhes técnicos**: ambiente (SO, navegador, versões), stack trace ou mensagens de erro quando aplicável, componente/serviço afetado, logs relevantes, passos para reproduzir com dados de exemplo
5. Comportamento esperado vs. comportamento observado
6. Severidade sugerida (Crítico/Alto/Médio/Baixo) e impacto
7. Evidências (screenshots, IDs de requisição, etc.) quando mencionadas no contexto

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.

CONTEXTO DO BUG:
---
${contextoLimpo}
---`;

    const prompt = montarPromptGeracao({
      padrao,
      papel: "um especialista em documentação de bugs",
      tarefaComPadrao:
        "Produza um único relato de bug em Markdown aplicando exclusivamente o padrão acima.",
      promptSemPadrao,
      conteudoEntrada: contextoLimpo,
      labelConteudo: "CONTEXTO DO BUG",
    });

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar relato de bug.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
