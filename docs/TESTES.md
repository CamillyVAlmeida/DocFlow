# Testes do DocFlow

Este documento descreve como os testes do projeto estão organizados e como executá-los.

---

## Visão geral

O DocFlow possui três camadas principais de testes:

- **Unitários** (Jest + React Testing Library)
- **E2E de interface** (Playwright)
- **Geração de dados aleatórios** para cenários de QA, Suporte e Requisitos (reutilizados em unitários e E2E)

---

## 1. Testes unitários (Jest)

### 1.1. Configuração

- Arquivo de configuração: `jest.config.js`
- Setup global: `jest.setup.ts`
  - Registra `@testing-library/jest-dom`.
  - Cria mocks para `window.matchMedia` e `navigator.clipboard`.

Scripts no `package.json`:

```bash
npm test        # roda toda a suíte Jest uma vez
npm run test:watch  # roda Jest em modo watch
```

### 1.2. O que é testado

#### Contextos

- `src/context/ThemeContext.test.tsx`
  - Carregamento do tema a partir do `localStorage`.
  - Aplicação/remoção da classe `dark` no `<html>`.
  - Alternância de tema (`toggleTheme`) e persistência.

- `src/context/PadraoIAContext.test.tsx`
  - Migração de padrões legacy (`docflow_padrao_qa`, `docflow_padrao_requisitos`) para os novos campos:
    - QA — Plano de Testes
    - QA — Relato de Bug
    - Requisitos — Documentação
    - Requisitos — Reunião Três Amigos
  - Prioridade dos novos valores quando coexistem com os antigos.
  - Persistência de todos os padrões via `savePadroes`.

#### Componentes

- `src/components/Nav.test.tsx`
  - Renderização do header.
  - Botão de tema alternando entre “Modo escuro” e “Modo claro” e aplicação de `dark` no `<html>`.

- `src/components/Footer.test.tsx`
  - Renderização do nome do sistema, descrição e informações de autoria/instituição.

- `src/components/GeradorDocumento.test.tsx`
  - Exibição de mensagem de erro quando o contexto está vazio.
  - Chamada do endpoint correto com `contexto` normalizado e `padrao` (mock de `fetch`).
  - Renderização do documento retornado.
  - Tratamento de erro quando a API responde com `erro`.
  - Cópia do documento para a área de transferência (`navigator.clipboard.writeText`) e exibição do toast “Texto copiado com sucesso!”.

---

## 2. Testes E2E (Playwright)

### 2.1. Configuração

- Arquivo de configuração: `playwright.config.ts`
  - `testDir: "./e2e"`
  - `baseURL: "http://localhost:3000"`
  - `webServer`: executa `npm run dev` automaticamente antes dos testes.
  - Projeto padrão: `chromium`.

Scripts no `package.json`:

```bash
npm run test:e2e     # roda os testes E2E em modo headless
npm run test:e2e:ui  # abre a UI do Playwright
```

### 2.2. O que é testado

- `e2e/home.spec.ts`
  - Carregamento da página inicial.
  - Navegação entre os módulos QA, Suporte e Requisitos via header.

- `e2e/theme-and-modal.spec.ts`
  - Alternância de tema (claro/escuro) e persistência via `localStorage`.
  - Abertura do modal de **Configuração de IA**.
  - Preenchimento e salvamento dos padrões:
    - QA — Plano de Testes
    - QA — Relato de Bug
    - Suporte
    - Requisitos — Documentação
    - Requisitos — Reunião Três Amigos
  - Verificação de que os valores foram salvos no `localStorage` com as chaves esperadas.

- `e2e/generators.spec.ts`
  - **QA**:
    - Geração de Plano de Testes.
    - Geração de Relato de Bug.
    - As rotas `/api/gerar/plano-testes` e `/api/gerar/relato-bug` são **interceptadas e mockadas** para não depender da API de IA.
  - **Requisitos**:
    - Geração de documentação de requisitos via `/api/gerar/documentacao-requisitos` (mock).
    - Registro da Reunião Três Amigos via `/api/tres-amigos` (mock), verificando a mensagem de sucesso.

---

## 3. Utilitários de dados aleatórios

Para tornar os testes mais realistas e reaproveitáveis, existe o módulo:

- `src/test-utils/randomData.ts`

Ele expõe funções:

- `createRandomQA()` – textos de contexto para:
  - Plano de Testes
  - Relato de Bug
- `createRandomRequisitos()` – dados de:
  - Cliente, Analista, Requisitos
  - Líder, Desenvolvedor, QA
  - Data da reunião (ISO `yyyy-mm-dd`)
  - Observações
- `createRandomSuporte()` – contexto típico de relato de cliente para o módulo de Suporte.

Essas funções são usadas em:

- **E2E** (`e2e/generators.spec.ts`) para preencher formulários com dados plausíveis.
- **Unitários** (`src/components/GeradorDocumento.test.tsx`) para validar o envio de contexto para as rotas de geração.

---

## 4. Boas práticas e próximos passos

- Manter novos fluxos cobertos sempre que adicionar:
  - Novos módulos ou tipos de documento com IA.
  - Novas telas que mexam com o estado global (tema, padrões da IA).
- Para APIs adicionais:
  - Criar testes unitários focados na lógica de prompt e validação.
  - Adicionar cenários E2E com **interceptação das rotas** (como já feito em `e2e/generators.spec.ts`).

Com isso, o DocFlow passa a ter uma base sólida de testes cobrindo:

- Lógica de contexto.
- Componentes de UI críticos.
- Fluxos completos de geração de documentação fim-a-fim.

