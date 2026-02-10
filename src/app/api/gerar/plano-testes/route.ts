import { NextRequest, NextResponse } from "next/server";
import { gerarComIA } from "@/lib/gemini";

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
    const instrucaoPadrao =
      padrao && typeof padrao === "string" && padrao.trim()
        ? `\nPADRÃO DEFINIDO PELO USUÁRIO (siga rigorosamente ao escrever o documento):\n${padrao.trim()}\n\n`
        : "";

    const prompt = `${instrucaoPadrao}Você é um especialista em QA e testes de software. Com base no contexto abaixo, gere um PLANO DE TESTES completo em Markdown, pronto para uso pela equipe.

Inclua:
1. Título e data de geração (use: ${dataGeracao})
2. Contexto e escopo (resumindo o que foi informado)
3. Objetivos do teste
4. Estratégia de testes (funcional, integração, regressão)
5. Cenários de teste em tabela (ID, Cenário, Pré-condição, Passos, Resultado esperado) - crie cenários concretos a partir do contexto
6. Critérios de aceite
7. Ambiente e ferramentas sugeridas

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.

CONTEXTO FORNECIDO PELO QA:
---
${contexto}
---`;

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar plano de testes.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
