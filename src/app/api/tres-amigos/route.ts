import { NextRequest, NextResponse } from "next/server";
import { gerarComIA } from "@/lib/gemini";

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

    const instrucaoPadrao =
      padrao && typeof padrao === "string" && padrao.trim()
        ? `\nPADRÃO DEFINIDO PELO USUÁRIO (siga rigorosamente ao escrever o documento):\n${padrao.trim()}\n\n`
        : "";

    // Se não houver padrão, mantém o comportamento antigo (sem uso de IA).
    if (!instrucaoPadrao) {
      return NextResponse.json({
        mensagem: "Decisão da reunião Três Amigos registrada com sucesso.",
        registro,
      });
    }

    const prompt = `${instrucaoPadrao}Você é um analista de requisitos. Gere um REGISTRO DA REUNIÃO TRÊS AMIGOS em Markdown, pronto para arquivamento.

Dados:
- ID do requisito: ${id}
- Data da reunião: ${dataReuniao}
- Participantes:
  - Líder: ${lider}
  - Desenvolvedor: ${desenvolvedor}
  - QA: ${qa}
- Observações informadas:
${obs}

O documento deve incluir:
1. Título \"Reunião Três Amigos\" e data
2. Identificação do requisito (ID)
3. Participantes (em tabela ou lista)
4. Decisão (Aprovado / Não aprovado / Pendente) — se não estiver explícito nas observações, sinalize como \"Pendente\" e justifique
5. Pendências e responsáveis (se aplicável)
6. Próximos passos

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.`;

    const documento = await gerarComIA(prompt);

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
