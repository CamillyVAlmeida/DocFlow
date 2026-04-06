import { NextRequest, NextResponse } from "next/server";
import { aplicarPadraoDocumento } from "@/lib/aplicar-padrao-documento";
import { ataTresAmigosMarkdown } from "@/lib/geracao-documentos/templates";

export async function POST(request: NextRequest) {
  try {
    const { idRequisito, lider, desenvolvedor, qa, dataReuniao, observacoes, padrao } =
      await request.json();

    const obs = typeof observacoes === "string" ? observacoes.trim() : "";
    if (!lider || !desenvolvedor || !qa || !dataReuniao || !obs) {
      return NextResponse.json(
        {
          erro:
            "Campos obrigatórios: lider, desenvolvedor, qa, data da reunião e observações.",
        },
        { status: 400 }
      );
    }

    const id = idRequisito?.trim() || `REQ-${Date.now()}`;

    const registro = {
      idRequisito: id,
      reuniaoTresAmigos: {
        participantes: { lider, desenvolvedor, qa },
        data: dataReuniao,
        observacoes: obs,
      },
      registradoEm: new Date().toISOString(),
    };

    const conteudoEntrada = `- ID do requisito: ${id}
- Data da reunião: ${dataReuniao}
- Participantes:
  - Líder: ${lider}
  - Desenvolvedor: ${desenvolvedor}
  - QA: ${qa}
- Notas da reunião (decisões, planejamento, pontos discutidos):
${obs}`;

    const dataGeracao = new Date().toLocaleDateString("pt-BR");
    const base = ataTresAmigosMarkdown({
      idRequisito: id,
      dataReuniao,
      lider,
      desenvolvedor,
      qa,
      observacoes: obs,
      dataGeracao,
    });
    const documento = aplicarPadraoDocumento(padrao, conteudoEntrada, base);

    return NextResponse.json({
      mensagem: "Decisão da reunião Três Amigos registrada com sucesso.",
      registro,
      documento,
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro ao registrar decisão da reunião Três Amigos." },
      { status: 500 }
    );
  }
}
