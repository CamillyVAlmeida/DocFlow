import { NextRequest, NextResponse } from "next/server";
import { gerarComIA } from "@/lib/gerar-ia";
import { montarPromptGeracao } from "@/lib/prompt-padrao-usuario";

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

    const promptSemPadrao = `Você é um analista de requisitos. Gere um REGISTRO DA REUNIÃO TRÊS AMIGOS em Markdown, pronto para arquivamento.

O documento deve ser uma ata que descreva o que foi discutido na reunião, as decisões tomadas e o planejamento acordado (prazos, próximos passos, responsáveis), com base nas notas abaixo. Não limite o texto a apenas \"aprovado/não aprovado\": desenvolva o contexto das decisões e do alinhamento da equipe.

Dados:
- ID do requisito: ${id}
- Data da reunião: ${dataReuniao}
- Participantes:
  - Líder: ${lider}
  - Desenvolvedor: ${desenvolvedor}
  - QA: ${qa}
- Notas da reunião (decisões, planejamento, pontos discutidos):
${obs}

O documento deve incluir, de forma clara:
1. Título \"Reunião Três Amigos\" e data
2. Identificação do requisito (ID)
3. Participantes (em tabela ou lista)
4. Resumo do que foi discutido e decisões (incluindo aprovação ou não do pedido, quando aplicável)
5. Planejamento e próximos passos (com responsáveis e pendências, se houver)
6. Se alguma decisão não estiver explícita nas notas, sinalize como pendência ou \"a definir\" em vez de inventar fatos

Responda APENAS com o documento em Markdown, sem texto introdutório antes ou depois.`;

    const prompt = montarPromptGeracao({
      padrao,
      papel: "um analista de requisitos",
      tarefaComPadrao:
        "Produza um único registro da reunião Três Amigos em Markdown aplicando exclusivamente o padrão acima.",
      promptSemPadrao,
      conteudoEntrada,
      labelConteudo: "DADOS DA REUNIÃO",
    });

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
