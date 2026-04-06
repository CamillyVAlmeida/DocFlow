import { NextRequest, NextResponse } from "next/server";
import { aplicarPadraoDocumento } from "@/lib/aplicar-padrao-documento";
import { planoTestesMarkdown } from "@/lib/geracao-documentos/templates";

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
    const base = planoTestesMarkdown(contextoLimpo, dataGeracao);
    const documento = aplicarPadraoDocumento(padrao, contextoLimpo, base);
    return NextResponse.json({ documento });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar plano de testes.";
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
