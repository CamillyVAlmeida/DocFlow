import { NextRequest, NextResponse } from "next/server";
import { gerarComIA } from "@/lib/gerar-ia";
import { montarPromptGeracao } from "@/lib/prompt-padrao-usuario";

export async function POST(request: NextRequest) {
  try {
    const { contexto, padrao } = await request.json();
    if (!contexto || typeof contexto !== "string") {
      return NextResponse.json(
        { erro: "Campo 'contexto' é obrigatório." },
        { status: 400 }
      );
    }

    const dataGeracao = new Date().toLocaleDateString("pt-BR");

    const promptSemPadrao = `Você é um especialista em documentação de software. Com base no contexto abaixo, gere uma DOCUMENTAÇÃO DE NOVAS FUNCIONALIDADES em Markdown, descrevendo o funcionamento para a equipe (incluindo QA).

Inclua:
1. Título e data (use: ${dataGeracao})
2. Visão geral (resumindo o contexto)
3. Funcionalidades entregues (lista com nome, descrição breve e valor para o usuário)
4. Comportamento esperado (fluxo principal, regras de negócio, validações e mensagens)
5. Critérios de aceite (lista verificável)
6. Observações para QA (pontos de atenção para testes, dependências, dados de teste sugeridos)

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.

CONTEXTO DA NOVA FUNCIONALIDADE:
---
${contexto}
---`;

    const prompt = montarPromptGeracao({
      padrao,
      papel: "um especialista em documentação de software",
      tarefaComPadrao:
        "Produza uma única documentação de novas funcionalidades em Markdown aplicando exclusivamente o padrão acima.",
      promptSemPadrao,
      conteudoEntrada: contexto,
      labelConteudo: "CONTEXTO DA NOVA FUNCIONALIDADE",
    });

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar documentação de novas funcionalidades.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
