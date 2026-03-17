# DocFlow

Sistema web de geração de documentação para QA, Suporte e Requisitos.

## Módulos

- **QA:** Plano de testes, relato de bug (com detalhes técnicos), documentação de novas funcionalidades
- **Suporte:** Geração de relatos de bug estruturados a partir dos relatos dos clientes (para uso do time de suporte, desenvolvimento e QA)
- **Requisitos:** Documentação de requisitos (Cliente + Analista) e fluxo reunião Três Amigos (Líder, Dev, QA)

## Tecnologias

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- **Modo escuro:** alternância na barra de navegação (preferência salva no navegador)
- **IA:** Google Gemini – análise de contexto e geração de documentos em todos os módulos
- **Testes unitários:** Jest + React Testing Library
- **Testes E2E:** Playwright (fluxos principais de QA, Suporte e Requisitos)

## Integração com IA

Todas as funções de geração de documentação (plano de testes, relato de bug, relato de bug a partir do cliente, novas funcionalidades e documentação de requisitos) usam a **API Google Gemini** para analisar o contexto informado e gerar o documento em Markdown.

**Configuração:** a chave da API deve estar em `.env.local`:

```
GOOGLE_AI_API_KEY=sua_chave_aqui
```

O arquivo `.env.local` não é commitado (está no `.gitignore`). Para produção, defina a variável `GOOGLE_AI_API_KEY` no ambiente do seu provedor de hospedagem.

## Padrões da IA por módulo

Na interface existe um modal de **Configuração de IA** (botão no header) que permite definir prompts fixos para cada fluxo:

- QA — Plano de Testes
- QA — Relato de Bug
- Suporte — Relato de bug a partir do cliente
- Requisitos — Documentação
- Requisitos — Reunião Três Amigos

Esses textos são salvos no `localStorage` e enviados para as rotas de geração como campo `padrao`, sendo injetados no prompt do Gemini.

## Como rodar

```bash
npm install
cp .env.example .env.local   # depois edite e coloque sua chave Gemini
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Documentação de requisitos

Ver `docs/REQUISITOS_SISTEMA_DOCFLOW.md`.

## Testes

- **Unitários (Jest):**
  - Contextos: `ThemeContext` (tema claro/escuro com `localStorage`) e `PadraoIAContext` (migração e persistência dos padrões da IA).
  - Componentes: `Nav`, `Footer` e `GeradorDocumento` (validação, chamada de API e cópia para área de transferência).
- **E2E (Playwright):**
  - Arquivos em `e2e/` cobrem:
    - Home e navegação entre módulos.
    - Alternância de tema e modal de configuração da IA.
    - Geração de documentos em QA e Requisitos com **mock das rotas de API**.

Para detalhes de como rodar e o que cada suíte cobre, veja `docs/TESTES.md`.
