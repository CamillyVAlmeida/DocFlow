import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { idRequisito, lider, desenvolvedor, qa, dataReuniao, decisao, observacoes } =
      await request.json();

    if (!idRequisito || !lider || !desenvolvedor || !qa || !dataReuniao || !decisao) {
      return NextResponse.json(
        {
          erro:
            "Campos obrigatórios: idRequisito, lider, desenvolvedor, qa, dataReuniao, decisao (Aprovado ou Não Aprovado).",
        },
        { status: 400 }
      );
    }

    const decisaoValida = ["Aprovado", "Não Aprovado"].includes(decisao);
    if (!decisaoValida) {
      return NextResponse.json(
        { erro: "Decisão deve ser 'Aprovado' ou 'Não Aprovado'." },
        { status: 400 }
      );
    }

    const registro = {
      idRequisito,
      reuniaoTresAmigos: {
        participantes: { lider, desenvolvedor, qa },
        data: dataReuniao,
        decisao,
        observacoes: observacoes || "",
      },
      registradoEm: new Date().toISOString(),
    };

    return NextResponse.json({
      mensagem: "Decisão da reunião Três Amigos registrada com sucesso.",
      registro,
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro ao registrar decisão da reunião Três Amigos." },
      { status: 500 }
    );
  }
}
