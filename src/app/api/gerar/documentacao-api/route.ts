import { NextRequest, NextResponse } from "next/server";
import { aplicarPadraoDocumento } from "@/lib/aplicar-padrao-documento";
import { documentacaoApiMarkdown } from "@/lib/geracao-documentos/templates";

export async function POST(request: NextRequest) {
  try {
    const { contexto, padrao } = await request.json();
    if (!contexto || typeof contexto !== "string") {
      return NextResponse.json(
        { erro: "Campo 'contexto' é obrigatório." },
        { status: 400 }
      );
    }

    const ctx = contexto.trim();
    const dataGeracao = new Date().toLocaleDateString("pt-BR");
    const base = documentacaoApiMarkdown(ctx, dataGeracao);
    const documento = aplicarPadraoDocumento(padrao, ctx, base);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar documentação da API.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
