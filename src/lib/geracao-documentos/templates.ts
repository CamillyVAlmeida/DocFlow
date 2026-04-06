/** Geração determinística em texto simples (sem Markdown). Nomes *Markdown mantidos por compatibilidade com imports. */

export function planoTestesMarkdown(contexto: string, dataGeracao: string): string {
  return `PLANO DE TESTES
=============

Data de geração: ${dataGeracao}

1. CONTEXTO E ESCOPO
--------------------
${contexto}

2. OBJETIVOS DO TESTE
---------------------
  - (validar requisitos funcionais e não funcionais relacionados ao escopo acima)

3. ESTRATÉGIA SUGERIDA
---------------------
Tipo: Funcional
  Foco: Fluxos principais e regras de negócio

Tipo: Integração
  Foco: APIs, serviços e bancos relacionados

Tipo: Regressão
  Foco: Áreas impactadas por alterações recentes

4. CENÁRIOS DE TESTE
--------------------
CT-01 — Cenário: (preencher)
  Pré-condição:
  Passos:
  Resultado esperado:

CT-02 — Cenário: (preencher)
  Pré-condição:
  Passos:
  Resultado esperado:

5. CRITÉRIOS DE ACEITE
----------------------
(liste critérios verificáveis, alinhados ao contexto)

6. AMBIENTE E FERRAMENTAS
-------------------------
Ambiente:
Navegador / SO:
Dados de teste:
Ferramentas (ex.: Postman, DevTools):
`;
}

export function relatoBugQAMarkdown(contexto: string, dataGeracao: string): string {
  return `RELATO DE BUG
=============

Data: ${dataGeracao}

RESUMO
------
(uma ou duas frases sobre o problema)

DESCRIÇÃO DETALHADA
-------------------
${contexto}

DETALHES TÉCNICOS
-----------------
Ambiente (SO, navegador, versões):

Mensagens de erro / stack:

Componente ou serviço afetado:

Logs relevantes:

PASSOS PARA REPRODUZIR
----------------------
1. (detalhar com base no contexto acima)

COMPORTAMENTO ESPERADO X OBSERVADO
-----------------------------------
Esperado:

Observado:

SEVERIDADE SUGERIDA
-------------------
(Crítico / Alto / Médio / Baixo)

EVIDÊNCIAS
----------
(screenshots, IDs de requisição, etc.)
`;
}

export function relatoBugClienteMarkdown(contexto: string, dataGeracao: string): string {
  return `RELATO DE BUG (INTERNO — A PARTIR DO CLIENTE)
===============================================

Data: ${dataGeracao}

RESUMO TÉCNICO
--------------
(síntese do problema em linguagem objetiva)

RELATO DO CLIENTE
-----------------
${contexto}

INTERPRETAÇÃO TÉCNICA
---------------------
Ambiente provável:

Passos para reproduzir (inferidos):

Impacto sugerido:

SEVERIDADE E CATEGORIA SUGERIDAS
--------------------------------
Severidade: (Crítico / Alto / Médio / Baixo)
Categoria: (funcional, desempenho, interface, etc.)

AÇÕES SUGERIDAS PARA O TIME
---------------------------
  - (ex.: validar com QA, solicitar logs, reproduzir em homologação)
`;
}

export function documentacaoApiMarkdown(contexto: string, dataGeracao: string): string {
  return `DOCUMENTAÇÃO DE API
==================

Data de geração: ${dataGeracao}

VISÃO GERAL
-----------
${contexto}

BASE URL E AMBIENTES
--------------------
Desenvolvimento — URL base: https://
Homologação — URL base: https://
Produção — URL base: https://

ENDPOINTS
---------
Método:
Path:
Descrição:

(detalhe do endpoint — repetir seção conforme necessário)

Parâmetros: query / path / body
Resposta de sucesso: (JSON de exemplo)
Respostas de erro: códigos e corpos

AUTENTICAÇÃO E HEADERS
----------------------
(Bearer, API keys, headers obrigatórios)

CÓDIGOS HTTP COMUNS
-------------------
200:
400:
401:
404:
500:

EXEMPLOS
--------
Requisição (JSON):
{}

Resposta (JSON):
{}
`;
}

export function novasFuncionalidadesMarkdown(contexto: string, dataGeracao: string): string {
  return `DOCUMENTAÇÃO DE NOVAS FUNCIONALIDADES
====================================

Data: ${dataGeracao}

VISÃO GERAL
-----------
${contexto}

FUNCIONALIDADES ENTREGUES
-------------------------
Nome:
Descrição breve:
Valor para o usuário:

COMPORTAMENTO ESPERADO
----------------------
Fluxo principal:

Regras de negócio e validações:

Mensagens ao usuário:

CRITÉRIOS DE ACEITE
-------------------
[ ] (critério verificável 1)
[ ] (critério verificável 2)

OBSERVAÇÕES PARA QA
-------------------
Pontos de atenção:

Dependências:

Dados de teste sugeridos:
`;
}

export function causaRaizMarkdown(contexto: string, dataGeracao: string): string {
  return `ANÁLISE DE CAUSA RAIZ
====================

Data: ${dataGeracao}

DESCRIÇÃO DO BUG / CONTEXTO
---------------------------
${contexto}

PASSOS PARA REPRODUZIR
----------------------
1. (extrair do contexto quando possível)

ANÁLISE 5 PORQUÊS
-----------------
1 — Por quê? → Resposta:

2 — Por quê? → Resposta:

3 — Por quê? → Resposta:

4 — Por quê? → Resposta:

5 — Por quê? → Resposta:

CAUSA RAIZ IDENTIFICADA
-----------------------
Categoria: (Código / Configuração / Dados / Processo / Outro)
Descrição:

AÇÕES CORRETIVAS
----------------
Ação:
Responsável:
Prazo:

CONCLUSÃO
---------
(resumo objetivo)
`;
}

export function documentacaoRequisitosMarkdown(
  cliente: string,
  analista: string,
  requisitos: string,
  dataGeracao: string
): string {
  return `DOCUMENTAÇÃO DE REQUISITOS
=========================

Data: ${dataGeracao}

IDENTIFICAÇÃO
-------------
Cliente: ${cliente}
Analista de Requisitos: ${analista}

REQUISITOS COLETADOS
--------------------
${requisitos}

MÓDULOS / MELHORIAS / ALTERAÇÕES
--------------------------------
(organize os módulos envolvidos, melhorias e alterações conforme o texto acima)

Módulo / área:
Melhoria ou alteração:

PRÓXIMOS PASSOS
---------------
  - Reunião Três Amigos (Líder, Desenvolvedor, QA)
  - Análise do pedido do cliente
  - Decisão: Aprovado / Não aprovado (a registrar na ata)
`;
}

export function ataTresAmigosMarkdown(args: {
  idRequisito: string;
  dataReuniao: string;
  lider: string;
  desenvolvedor: string;
  qa: string;
  observacoes: string;
  dataGeracao: string;
}): string {
  const { idRequisito, dataReuniao, lider, desenvolvedor, qa, observacoes, dataGeracao } =
    args;
  return `REUNIÃO TRÊS AMIGOS
===================

Data do documento: ${dataGeracao}

IDENTIFICAÇÃO DO REQUISITO
--------------------------
ID: ${idRequisito}
Data da reunião: ${dataReuniao}

PARTICIPANTES
-------------
Líder: ${lider}
Desenvolvedor: ${desenvolvedor}
QA: ${qa}

NOTAS DA REUNIÃO
----------------
${observacoes}

RESUMO DO QUE FOI DISCUTIDO E DECISÕES
--------------------------------------
(incluir aprovação ou não do pedido, quando aplicável)

PLANEJAMENTO E PRÓXIMOS PASSOS
------------------------------
Ação:
Responsável:
Prazo / observação:

PENDÊNCIAS
---------
(o que ficou a definir ou depende de informação externa)
`;
}
