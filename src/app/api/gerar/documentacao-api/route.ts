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

    const promptSemPadrao = `Você é um especialista em documentação de APIs. Com base no contexto abaixo (como o desenvolvedor descreveu o funcionamento da API), gere uma DOCUMENTAÇÃO DE API completa em Markdown, clara e pronta para uso pelo time ou clientes.

Inclua:
1. Título e data de geração (use: ${dataGeracao})
2. Visão geral (resumindo o que a API faz)
3. Base URL e ambiente (desenvolvimento/produção - use placeholders se não estiver no contexto)
4. Endpoints: para cada endpoint identificado no contexto, descreva método HTTP, path, parâmetros (query/path/body), resposta de sucesso e de erro, com exemplos quando possível
5. Autenticação e headers (se aplicável)
6. Códigos de status HTTP comuns
7. Exemplos de requisição e resposta em JSON

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.

CONTEXTO FORNECIDO PELO DESENVOLVEDOR:
---
${contexto}
---`;

    const prompt = montarPromptGeracao({
      padrao,
      papel: "um especialista em documentação de APIs",
      tarefaComPadrao:
        "Produza uma única documentação de API em Markdown aplicando exclusivamente o padrão acima.",
      promptSemPadrao,
      conteudoEntrada: contexto,
      labelConteudo: "CONTEXTO FORNECIDO PELO DESENVOLVEDOR",
    });

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar documentação da API.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
