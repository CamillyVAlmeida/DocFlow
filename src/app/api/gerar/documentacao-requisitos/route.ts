import { NextRequest, NextResponse } from "next/server";
import { gerarComIA } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { cliente, analistaRequisitos, requisitos, padrao } = await request.json();
    const clienteLimpo = typeof cliente === "string" ? cliente.trim() : "";
    const analistaLimpo =
      typeof analistaRequisitos === "string" ? analistaRequisitos.trim() : "";
    const requisitosLimpos = typeof requisitos === "string" ? requisitos.trim() : "";

    if (!clienteLimpo || !analistaLimpo) {
      return NextResponse.json(
        { erro: "Campos 'cliente' e 'analistaRequisitos' são obrigatórios." },
        { status: 400 }
      );
    }
    if (!requisitosLimpos) {
      return NextResponse.json(
        { erro: "Campo 'requisitos' (requisitos coletados) é obrigatório." },
        { status: 400 }
      );
    }

    const dataGeracao = new Date().toLocaleDateString("pt-BR");
    const textoRequisitos = requisitosLimpos;
    const instrucaoPadrao =
      padrao && typeof padrao === "string" && padrao.trim()
        ? `\nPADRÃO DEFINIDO PELO USUÁRIO (siga rigorosamente ao escrever o documento):\n${padrao.trim()}\n\n`
        : "";

    const prompt = `${instrucaoPadrao}Você é um analista de requisitos. Gere uma DOCUMENTAÇÃO DE REQUISITOS completa e pronta em Markdown com as informações abaixo.

Dados obrigatórios:
- Cliente: ${clienteLimpo}
- Analista de Requisitos: ${analistaLimpo}
- Requisitos coletados / contexto: ${textoRequisitos}

O documento deve incluir:
1. Título "Documentação de Requisitos" e data (use: ${dataGeracao})
2. Identificação em tabela: Cliente e Analista de Requisitos
3. Requisitos coletados: organize e estruture o texto dos requisitos (módulos do sistema, melhorias, alterações), melhorando a redação se necessário
4. Módulos / melhorias / alterações: liste de forma clara os módulos envolvidos, melhorias solicitadas e alterações em funcionalidades existentes, com base no que foi informado
5. Próximos passos: reunião Três Amigos (Líder, Desenvolvedor, QA), análise do pedido do cliente, decisão Aprovado ou Não Aprovado

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.`;

    const documento = await gerarComIA(prompt);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar documentação de requisitos.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
