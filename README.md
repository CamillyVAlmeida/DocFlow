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
- **Documentos:** modelos fixos em texto simples montados no servidor a partir do contexto que você informa
- **Testes unitários:** Jest + React Testing Library

## Padrões por módulo

No menu (após entrar), acesse **Personalização** para definir, em uma única tela, os padrões de texto do **QA**, **Suporte** e **Requisitos**. Opcionalmente, cole um **modelo em texto** usado na geração:

- Se o modelo contiver `{{contexto}}`, esse trecho é substituído pelo texto dos campos (contexto, requisitos, notas da reunião, etc.).
- Se não houver `{{contexto}}`, o conteúdo informado é anexado após o seu modelo, na seção **Conteúdo informado**.

Se o campo de padrão ficar vazio, o DocFlow usa o **template padrão** daquele fluxo (seções e orientações para preenchimento manual quando fizer sentido).

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

Para detalhes de como rodar e o que cada suíte cobre, veja `docs/TESTES.md`.
