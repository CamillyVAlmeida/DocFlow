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
- **Documentos:** modelos fixos em Markdown montados no servidor a partir do contexto que você informa (sem serviço de IA externo)
- **Testes unitários:** Jest + React Testing Library
- **Testes E2E:** Playwright (fluxos principais de QA, Suporte e Requisitos)

## Padrões por módulo

Na interface existem atalhos **Padrão QA**, **Padrão Suporte** e **Padrão Requisitos** no header. Lá você pode opcionalmente colar um **modelo em Markdown** usado na geração:

- Se o modelo contiver `{{contexto}}`, esse trecho é substituído pelo texto dos campos (contexto, requisitos, notas da reunião, etc.).
- Se não houver `{{contexto}}`, o conteúdo informado é anexado após o seu modelo, na seção **Conteúdo informado**.

Se o campo de padrão ficar vazio, o DocFlow usa o **template padrão** daquele fluxo (tabelas, seções e placeholders para preenchimento manual quando fizer sentido).

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Variáveis opcionais: veja `.env.example` (ex.: `DOCFLOW_DATA_DIR` para localização dos JSON de dados).

## Build

```bash
npm run build
npm start
```

## Documentação de requisitos

Ver `docs/REQUISITOS_SISTEMA_DOCFLOW.md`.

## Testes

- **Unitários (Jest):**
  - Contextos: `ThemeContext` (tema claro/escuro com `localStorage`) e `PadraoIAContext` (persistência dos padrões de documento).
  - Componentes: `Nav`, `Footer` e `GeradorDocumento` (validação, chamada de API e cópia para área de transferência).
- **E2E (Playwright):**
  - Arquivos em `e2e/` cobrem:
    - Home e navegação entre módulos.
    - Alternância de tema e modal de padrões.
    - Geração de documentos em QA e Requisitos com **mock das rotas de API** (respostas fixas nos testes).

Para detalhes de como rodar e o que cada suíte cobre, veja `docs/TESTES.md`.
