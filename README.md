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
- **IA:** [OpenRouter](https://openrouter.ai/) (prioritário) ou Google Gemini – geração de documentos em todos os módulos
- **Testes unitários:** Jest + React Testing Library
- **Testes E2E:** Playwright (fluxos principais de QA, Suporte e Requisitos)

## Integração com IA

As rotas de geração enviam o contexto como prompt e recebem o documento em Markdown.

**Prioridade:** se **`OPENROUTER_API_KEY`** estiver definida (não vazia), usa [OpenRouter](https://openrouter.ai/) com modelo padrão **`nvidia/nemotron-3-super-120b-a12b:free`** (sobrescreva com `OPENROUTER_MODEL` se quiser). Caso contrário, se **`GOOGLE_AI_API_KEY`** estiver definida, usa **Google Gemini** (`gemini-2.5-flash`).

**Configuração** (`.env.local` na raiz):

```
# Uma das duas (OpenRouter tem prioridade se preenchida)
OPENROUTER_API_KEY=sua_chave_openrouter
GOOGLE_AI_API_KEY=sua_chave_google
```

Opcionais OpenRouter: `OPENROUTER_MODEL`, `OPENROUTER_SITE_URL=https://seu-site.com`.

Para usar **apenas Gemini**, deixe `OPENROUTER_API_KEY` ausente ou comente a linha (uma linha `OPENROUTER_API_KEY=` vazia é ignorada e o Gemini é usado).

O arquivo `.env.local` não é commitado.

### Por que funciona no PC e não no site publicado?

As chaves ficam **só no seu computador** dentro de `.env.local`. Esse arquivo **não sobe** para o GitHub/GitLab (está no `.gitignore`), então o **servidor de hospedagem não recebe** essas variáveis automaticamente. No ambiente local o Next.js lê `.env.local`; na nuvem você precisa **cadastrar manualmente** as mesmas variáveis.

**O que fazer no provedor** (ex.: Netlify, Vercel, Railway):

1. Abra o projeto → **Site settings** / **Settings** → **Environment variables**.
2. Adicione **`OPENROUTER_API_KEY`** e/ou **`GOOGLE_AI_API_KEY`** com os mesmos valores que você usa no `.env.local`.
3. Marque os ambientes desejados (Production, Preview).
4. **Salve** e dispare um **novo deploy** (rebuild), para as funções serverless carregarem as chaves.

Sem isso, as rotas `/api/gerar/*` rodam sem chave e retornam erro.

**Ainda falha após configurar?** Faça um deploy limpo (**Clear cache and deploy**). Confira se a variável vale para **Production** (não só Preview). Se usar OpenRouter, cadastre também **`OPENROUTER_SITE_URL`** com a URL do seu site (ex.: `https://seu-app.netlify.app`) — alguns provedores exigem isso. O toast de erro na interface passa a mostrar a **mensagem retornada pela API** (ou um trecho da resposta HTML) para facilitar o diagnóstico.

## Padrões da IA por módulo

Na interface existe um modal de **Configuração de IA** (botão no header) que permite definir prompts fixos para cada fluxo:

- QA — Plano de Testes
- QA — Relato de Bug
- Suporte — Relato de bug a partir do cliente
- Requisitos — Documentação
- Requisitos — Reunião Três Amigos

Esses textos são salvos no `localStorage` e enviados como campo `padrao`. **Se você preencher um padrão**, o documento segue **somente** esse padrão (estrutura e estilo); o modelo de seções padrão do DocFlow não é misturado. Se o campo ficar vazio, a geração usa o modelo interno daquele fluxo (listas de seções sugeridas).

## Como rodar

```bash
npm install
cp .env.example .env.local   # depois edite e preencha OPENROUTER_API_KEY e/ou GOOGLE_AI_API_KEY
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
