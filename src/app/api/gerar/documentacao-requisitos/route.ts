import { NextRequest, NextResponse } from "next/server";
import { aplicarPadraoDocumento } from "@/lib/aplicar-padrao-documento";
import { documentacaoRequisitosMarkdown } from "@/lib/geracao-documentos/templates";

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

    const conteudoEntrada = `Cliente: ${clienteLimpo}
Analista de Requisitos: ${analistaLimpo}
Requisitos coletados / contexto:
${requisitosLimpos}`;

    const base = documentacaoRequisitosMarkdown(
      clienteLimpo,
      analistaLimpo,
      requisitosLimpos,
      dataGeracao
    );
    const documento = aplicarPadraoDocumento(padrao, conteudoEntrada, base);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar documentação de requisitos.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
