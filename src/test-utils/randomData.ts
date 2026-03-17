export type RequisitoRandom = {
  cliente: string;
  analista: string;
  requisitos: string;
  lider: string;
  desenvolvedor: string;
  qa: string;
  dataReuniao: string;
  observacoes: string;
};

export type QARandom = {
  contextoPlano: string;
  contextoBug: string;
};

export type SuporteRandom = {
  contextoCliente: string;
};

function randomFrom(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomName() {
  const first = ["Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe"];
  const last = ["Silva", "Souza", "Almeida", "Oliveira", "Pereira"];
  return `${randomFrom(first)} ${randomFrom(last)}`;
}

function randomDateISO() {
  const now = new Date();
  const plusDays = Math.floor(Math.random() * 10);
  now.setDate(now.getDate() + plusDays);
  return now.toISOString().slice(0, 10); // yyyy-mm-dd
}

export function createRandomRequisitos(): RequisitoRandom {
  return {
    cliente: `Cliente ${randomName()}`,
    analista: randomName(),
    requisitos:
      "- Cadastro de usuários\n- Tela de login\n- Relatório de vendas diário",
    lider: randomName(),
    desenvolvedor: randomName(),
    qa: randomName(),
    dataReuniao: randomDateISO(),
    observacoes: "Requisitos discutidos e aprovados com ajustes menores.",
  };
}

export function createRandomQA(): QARandom {
  return {
    contextoPlano:
      "Funcionalidade de checkout com cartão, boleto e Pix, incluindo cupons de desconto.",
    contextoBug:
      "Erro 500 ao finalizar compra com Pix quando o usuário tem mais de 50 itens no carrinho.",
  };
}

export function createRandomSuporte(): SuporteRandom {
  return {
    contextoCliente:
      "Cliente relata que ao tentar gerar boleto, a tela fica carregando indefinidamente.",
  };
}

