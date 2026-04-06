/** Geração determinística em Markdown (sem IA). */

export function planoTestesMarkdown(contexto: string, dataGeracao: string): string {
  return `# Plano de testes

**Data de geração:** ${dataGeracao}

## 1. Contexto e escopo

${contexto}

## 2. Objetivos do teste

- _(validar requisitos funcionais e não funcionais relacionados ao escopo acima)_

## 3. Estratégia sugerida

| Tipo | Foco |
|------|------|
| Funcional | Fluxos principais e regras de negócio |
| Integração | APIs, serviços e bancos relacionados |
| Regressão | Áreas impactadas por alterações recentes |

## 4. Cenários de teste

| ID | Cenário | Pré-condição | Passos | Resultado esperado |
|----|---------|--------------|--------|-------------------|
| CT-01 | _(preencher)_ | | | |
| CT-02 | _(preencher)_ | | | |

## 5. Critérios de aceite

_(Liste critérios verificáveis, alinhados ao contexto.)_

## 6. Ambiente e ferramentas

| Item | Valor |
|------|-------|
| Ambiente | |
| Navegador / SO | |
| Dados de teste | |
| Ferramentas (ex.: Postman, DevTools) | |
`;
}

export function relatoBugQAMarkdown(contexto: string, dataGeracao: string): string {
  return `# Relato de bug

**Data:** ${dataGeracao}

## Resumo

_(Uma ou duas frases sobre o problema.)_

## Descrição detalhada

${contexto}

## Detalhes técnicos

| Campo | Informação |
|-------|------------|
| Ambiente (SO, navegador, versões) | |
| Mensagens de erro / stack | |
| Componente ou serviço afetado | |
| Logs relevantes | |

## Passos para reproduzir

1. _(detalhar com base no contexto acima)_

## Comportamento esperado vs. observado

| Esperado | Observado |
|----------|-----------|
| | |

## Severidade sugerida

_(Crítico / Alto / Médio / Baixo)_

## Evidências

_(screenshots, IDs de requisição, etc.)_
`;
}

export function relatoBugClienteMarkdown(contexto: string, dataGeracao: string): string {
  return `# Relato de bug (interno — a partir do cliente)

**Data:** ${dataGeracao}

## Resumo técnico

_(Síntese do problema em linguagem objetiva.)_

## Relato do cliente

${contexto}

## Interpretação técnica

| Campo | Valor |
|-------|-------|
| Ambiente provável | |
| Passos para reproduzir (inferidos) | |
| Impacto sugerido | |

## Severidade e categoria sugeridas

- **Severidade:** _(Crítico / Alto / Médio / Baixo)_
- **Categoria:** _(funcional, desempenho, interface, etc.)_

## Ações sugeridas para o time

- _(ex.: validar com QA, solicitar logs, reproduzir em homologação)_
`;
}

export function documentacaoApiMarkdown(contexto: string, dataGeracao: string): string {
  return `# Documentação de API

**Data de geração:** ${dataGeracao}

## Visão geral

${contexto}

## Base URL e ambientes

| Ambiente | URL base |
|----------|----------|
| Desenvolvimento | \`https://\` |
| Homologação | \`https://\` |
| Produção | \`https://\` |

## Endpoints

| Método | Path | Descrição |
|--------|------|-----------|
| | | |

### Detalhe do endpoint _(repetir seção conforme necessário)_

- **Parâmetros:** query / path / body
- **Resposta de sucesso:** (JSON de exemplo)
- **Respostas de erro:** códigos e corpos

## Autenticação e headers

_(Bearer, API keys, headers obrigatórios.)_

## Códigos HTTP comuns

| Código | Uso |
|--------|-----|
| 200 | |
| 400 | |
| 401 | |
| 404 | |
| 500 | |

## Exemplos

### Requisição

\`\`\`json
{}
\`\`\`

### Resposta

\`\`\`json
{}
\`\`\`
`;
}

export function novasFuncionalidadesMarkdown(contexto: string, dataGeracao: string): string {
  return `# Documentação de novas funcionalidades

**Data:** ${dataGeracao}

## Visão geral

${contexto}

## Funcionalidades entregues

| Nome | Descrição breve | Valor para o usuário |
|------|------------------|----------------------|
| | | |

## Comportamento esperado

- Fluxo principal:
- Regras de negócio e validações:
- Mensagens ao usuário:

## Critérios de aceite

- [ ] _(critério verificável 1)_
- [ ] _(critério verificável 2)_

## Observações para QA

- Pontos de atenção:
- Dependências:
- Dados de teste sugeridos:
`;
}

export function causaRaizMarkdown(contexto: string, dataGeracao: string): string {
  return `# Análise de causa raiz

**Data:** ${dataGeracao}

## Descrição do bug / contexto

${contexto}

## Passos para reproduzir

1. _(extrair do contexto quando possível)_

## Análise 5 Porquês

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Por quê? | |
| 2 | Por quê? | |
| 3 | Por quê? | |
| 4 | Por quê? | |
| 5 | Por quê? | |

## Causa raiz identificada

- **Categoria:** _(Código / Configuração / Dados / Processo / Outro)_
- **Descrição:**

## Ações corretivas

| Ação | Responsável | Prazo |
|------|-------------|-------|
| | | |

## Conclusão

_(Resumo objetivo.)_
`;
}

export function documentacaoRequisitosMarkdown(
  cliente: string,
  analista: string,
  requisitos: string,
  dataGeracao: string
): string {
  return `# Documentação de requisitos

**Data:** ${dataGeracao}

## Identificação

| Campo | Valor |
|-------|-------|
| Cliente | ${cliente} |
| Analista de Requisitos | ${analista} |

## Requisitos coletados

${requisitos}

## Módulos / melhorias / alterações

_(Organize abaixo os módulos envolvidos, melhorias e alterações, conforme o texto acima.)_

| Módulo / área | Melhoria ou alteração |
|---------------|------------------------|
| | |

## Próximos passos

- Reunião Três Amigos (Líder, Desenvolvedor, QA)
- Análise do pedido do cliente
- Decisão: **Aprovado** / **Não aprovado** _(a registrar na ata)_
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
  return `# Reunião Três Amigos

**Data do documento:** ${dataGeracao}

## Identificação do requisito

**ID:** ${idRequisito}

**Data da reunião:** ${dataReuniao}

## Participantes

| Papel | Nome |
|-------|------|
| Líder | ${lider} |
| Desenvolvedor | ${desenvolvedor} |
| QA | ${qa} |

## Notas da reunião

${observacoes}

## Resumo do que foi discutido e decisões

_(Incluir aprovação ou não do pedido, quando aplicável.)_

## Planejamento e próximos passos

| Ação | Responsável | Prazo / observação |
|------|-------------|-------------------|
| | | |

## Pendências

_(O que ficou "a definir" ou depende de informação externa.)_
`;
}
