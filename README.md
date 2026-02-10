# DocFlow

Sistema web de geração de documentação para QA, DEVs e Requisitos.

## Módulos

- **QA:** Plano de testes, análise de causa raiz, documentação de novas funcionalidades
- **DEVs:** Documentação de API a partir do contexto
- **Requisitos:** Documentação de requisitos (Cliente + Analista) e fluxo reunião Três Amigos (Líder, Dev, QA → Aprovado/Não Aprovado)

## Tecnologias

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- **IA:** Google Gemini – análise de contexto e geração de documentos em todos os módulos

## Integração com IA

Todas as funções de geração de documentação (plano de testes, causa raiz, novas funcionalidades, documentação de API e documentação de requisitos) usam a **API Google Gemini** para analisar o contexto informado e gerar o documento em Markdown.

**Configuração:** a chave da API deve estar em `.env.local`:

```
GOOGLE_AI_API_KEY=sua_chave_aqui
```

O arquivo `.env.local` não é commitado (está no `.gitignore`). Para produção, defina a variável `GOOGLE_AI_API_KEY` no ambiente do seu provedor de hospedagem.

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
