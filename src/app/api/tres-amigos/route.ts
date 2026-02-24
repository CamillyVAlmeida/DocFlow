import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { idRequisito, lider, desenvolvedor, qa, dataReuniao, observacoes } =
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
