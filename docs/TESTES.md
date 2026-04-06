# Testes do DocFlow

Este documento descreve como os testes do projeto estão organizados e como executá-los.

---

## Visão geral

O DocFlow possui testes **unitários** (Jest + React Testing Library) e utilitários de **dados aleatórios** reutilizados nesses testes.

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

## 2. Utilitários de dados aleatórios

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

Essas funções são usadas em **unitários** (por exemplo `src/components/GeradorDocumento.test.tsx`) para validar o envio de contexto para as rotas de geração.

---

## 3. Boas práticas e próximos passos

- Manter novos fluxos cobertos sempre que adicionar:
  - Novos módulos ou tipos de documento gerados.
  - Novas telas que mexam com o estado global (tema, padrões de documento).
- Para APIs adicionais:
  - Criar testes unitários focados na lógica de prompt e validação.

Com isso, o DocFlow mantém uma base de testes cobrindo lógica de contexto e componentes de UI críticos.
