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

    const prompt = `${instrucaoPadrao}Você é um especialista do time de suporte. Com base no relato do cliente abaixo, gere um RELATO DE BUG estruturado em Markdown para uso interno (time de suporte, desenvolvimento e QA).

O objetivo é transformar a descrição do cliente em um documento claro e padronizado, com interpretação técnica quando necessário.

Inclua:
1. Título e data (use: ${dataGeracao})
2. Resumo do problema (uma ou duas frases, em linguagem técnica quando possível)
3. Relato do cliente (transcreva ou resuma fielmente o que foi informado)
4. Interpretação / detalhes técnicos: o que o time de suporte entendeu, ambiente provável, passos para reproduzir inferidos, impacto sugerido
5. Severidade sugerida (Crítico/Alto/Médio/Baixo) e categoria (funcional, desempenho, interface, etc.)
6. Ações sugeridas para o time (ex.: validar com QA, solicitar logs, reproduzir em homologação)

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.

RELATO DO CLIENTE:
---
${contexto}
---`;

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar relato de bug.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
