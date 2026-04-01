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

    const promptSemPadrao = `Você é um especialista em análise de causa raiz de bugs. Com base no contexto abaixo, gere uma ANÁLISE DE CAUSA RAIZ completa em Markdown.

Inclua:
1. Título e data (use: ${dataGeracao})
2. Descrição do bug / contexto (resumindo o que foi informado)
3. Passos para reproduzir (quando aplicável, extraia do contexto)
4. Análise 5 Porquês: preencha a tabela com perguntas "Por quê?" e respostas até chegar à causa raiz provável
5. Causa raiz identificada (categoria: Código/Configuração/Dados/Processo/Outro) e descrição
6. Ações corretivas em tabela (Ação, Responsável, Prazo)
7. Conclusão resumida

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.

CONTEXTO DO BUG:
---
${contexto}
---`;

    const prompt = montarPromptGeracao({
      padrao,
      papel: "um especialista em análise de causa raiz de bugs",
      tarefaComPadrao:
        "Produza uma única análise de causa raiz em Markdown aplicando exclusivamente o padrão acima.",
      promptSemPadrao,
      conteudoEntrada: contexto,
      labelConteudo: "CONTEXTO DO BUG",
    });

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar análise de causa raiz.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
