# Especificação da interface DocFlow — para Figma

Documento para orientar a criação de protótipos e design system no Figma.

---

## 1. Visão geral do sistema

**DocFlow** é um sistema web de geração de documentação com três módulos: **QA**, **DEVs** e **Requisitos**. A interface é limpa, com foco em formulários e blocos de texto gerados por IA, suporta **tema claro e escuro** e usa uma paleta baseada em slate com acentos por módulo.

---

## 2. Estrutura de navegação e layout global

### 2.1 Header (barra superior fixa)

- **Posição:** sticky no topo (`top: 0`), z-index alto.
- **Conteúdo (da esquerda para a direita):**
  - **Logo/marca:** texto "DocFlow", link para a home, peso bold, cor primária (azul).
  - **Links de navegação:** Início | QA | DEVs | Requisitos.
  - **Botões à direita:**
    - Alternar tema: "🌙 Modo escuro" ou "☀️ Modo claro" (borda, fundo claro/escuro).
    - "Configuração de IA" (mesmo estilo de botão secundário).
- **Estilo:** fundo branco/escuro com leve transparência e blur; borda inferior sutil (slate 200/700).
- **Estado ativo do link:** fundo primário claro (primary-100) e texto primário; inativo: texto slate com hover.

### 2.2 Área principal (main)

- **Fundo:** `slate-50` (claro) ou `slate-900` (escuro).
- **Conteúdo:** centralizado com `max-width` (home: 6xl; páginas de módulo: 4xl), padding horizontal e vertical, com espaço inferior para não ficar colado no rodapé.

---

## 3. Páginas e telas

### 3.1 Página inicial (Início)

- **Título:** "DocFlow" — tamanho grande (4xl), bold, cor slate-800/slate-100.
- **Subtítulo:** "Sistema de geração de documentação para QA, DEVs e Requisitos" — texto médio (lg), slate-600/slate-400.
- **Grid de módulos:** 3 cards em grid (1 coluna no mobile, 3 em telas maiores), com gap.
- **Card de módulo:**
  - Borda esquerda colorida (accent): QA = verde (#10b981), DEVs = violeta (#8b5cf6), Requisitos = âmbar (#f59e0b).
  - Ícone em destaque (✓, {}, 📋).
  - Título do módulo (ex.: "Módulo QA").
  - Descrição em uma ou duas linhas.
  - Estilo: card arredondado, borda, sombra leve, hover com sombra um pouco maior.
  - Todo o card é clicável e leva à rota do módulo.

### 3.2 Página QA

- **Cabeçalho da página:** título "Módulo QA", subtítulo sobre plano de testes e relato de bug.
- **Blocos sequenciais (cards):**
  1. **Plano de Testes:** título "1. Plano de Testes", textarea "Contexto" com placeholder longo, botão "Gerar plano de testes".
  2. **Relato de Bug:** título "2. Relato de Bug", mesma estrutura (textarea + botão "Gerar relato de bug").
- Após gerar: área "Documento gerado" com botão "Copiar" e bloco de texto (pre) com scroll se necessário.

### 3.3 Página DEVs

- **Cabeçalho:** "Suporte e atendimento" (ou título equivalente) e descrição sobre relatos de bug / documentação de API.
- **Um único card:** "Documentação de API" — textarea de contexto, botão "Gerar documentação da API", depois área de documento gerado + Copiar.

### 3.4 Página Requisitos

- **Cabeçalho:** "Módulo Requisitos" e texto sobre documentação de requisitos e reunião Três Amigos.

- **Seção 1 — Gerar documentação de requisitos**
  - Card com:
    - Campos: Cliente *, Analista de Requisitos *, Requisitos coletados (textarea).
    - Mensagem de erro (texto vermelho) se validação falhar.
    - Botão "Gerar documentação" (estado "Gerando..." quando loading).
    - Bloco "Documento gerado" com "Copiar" e conteúdo em pre.

- **Seção 2 — Reunião Três Amigos**
  - Subtítulo explicando que é para registrar a decisão após a reunião.
  - Card com:
    - Grid 3 colunas (em desktop): Líder *, Desenvolvedor *, QA *.
    - Data da reunião * (input date).
    - Observações * (textarea).
    - Mensagens de erro (vermelho) e sucesso (verde).
    - Botão "Registrar decisão" (ou "Registrando..." em loading).

---

## 4. Componentes reutilizáveis (design system)

### 4.1 Card

- Bordas arredondadas (xl), borda slate 200/700, fundo branco/slate-800, padding 6, sombra leve.
- Hover: sombra um pouco maior (opcional nas telas de formulário).

### 4.2 Botões

- **Primário (btn-primary):** fundo primary-600, texto branco, arredondado (lg), padding, hover primary-700, focus ring primary.
- **Secundário (btn-secondary):** borda slate, fundo branco/slate-700, texto slate; hover e focus ring slate.

### 4.3 Campos de formulário

- **Label (.label):** texto pequeno (sm), font-medium, slate-700/slate-300, margem inferior pequena.
- **Input/textarea (.input-field):** largura total, borda arredondada (lg), borda slate, padding; focus com borda e ring primário. No dark: fundo slate-700, texto slate-100.

### 4.4 Mensagens

- **Erro:** texto sm, vermelho (red-600/red-400).
- **Sucesso:** texto sm, verde (green-700/green-400).
- **Toast "Texto copiado com sucesso!":** fixo na parte inferior central da tela, fundo verde claro/escuro, borda verde, sombra, z-index alto; some após ~2,5s.

---

## 5. Modal — Configuração de IA

- **Overlay:** tela cheia, fundo preto com 50% de opacidade; clique fora fecha.
- **Container do modal:** largura máxima 2xl, max-height 90vh com scroll interno, centralizado; bordas arredondadas (xl), fundo branco/slate-800, borda slate, sombra forte.
- **Conteúdo:**
  - Título: "Configurar padrão da IA".
  - Parágrafo explicando que são instruções por módulo.
  - Três blocos, cada um com:
    - Label (ex.: "Padrão para módulo QA").
    - Texto de ajuda em tamanho menor (onde o padrão é aplicado).
    - Textarea com placeholder de exemplo.
  - Rodapé do modal: botões "Cancelar" (secundário) e "Salvar" (primário), alinhados à direita.

---

## 6. Paleta de cores (referência para Figma)

### 6.1 Modo claro

- **Background geral:** #f8fafc (slate-50).
- **Background header:** branco com leve transparência.
- **Texto principal:** #0f172a (slate-800) / foreground.
- **Texto secundário:** slate-600.
- **Cards:** branco, borda slate-200.
- **Primary (links, botão primário, focus):** escala 50–900; uso principal em 600/700 (ex.: #0284c7, #0369a1).
- **Accent QA:** #10b981 (verde).
- **Accent DEVs:** #8b5cf6 (violeta).
- **Accent Requisitos:** #f59e0b (âmbar).

### 6.2 Modo escuro

- **Background geral:** #0f172a (slate-900).
- **Header:** slate-900 com transparência, borda slate-700.
- **Texto:** slate-100 (principal), slate-400 (secundário).
- **Cards:** slate-800, borda slate-700.
- **Inputs:** fundo slate-700, texto slate-100.

### 6.3 Estados e feedback

- Erro: red-600 / red-400.
- Sucesso / toast copiado: green-800, green-50/900 para fundos.

---

## 7. Tipografia

- **Fonte:** Inter (Latin).
- **Hierarquia:** 
  - Título da aplicação (home): 4xl, bold.
  - Títulos de página: 2xl, bold.
  - Títulos de seção/card: lg ou xl, semibold.
  - Labels: sm, medium.
  - Corpo e placeholders: base ou sm, cores slate conforme hierarquia.

---

## 8. Espaçamento e larguras

- **Container home:** max-width 6xl (~72rem), padding 4 (1rem).
- **Container módulos (QA, DEVs, Requisitos):** max-width 4xl (~56rem), padding 4, py 8.
- **Gap entre cards/seções:** 6–8 (1.5rem–2rem).
- **Padding interno dos cards:** 6 (1.5rem).

---

## 9. Interações e estados

- Links do header: hover com fundo slate-100/slate-800; item ativo com fundo primary-100 e texto primary.
- Botões: hover mais escuro no primário; no secundário, fundo slate-50/slate-700.
- Cards da home: hover com sombra maior.
- Botões de ação (Gerar, Salvar, etc.): estado disabled com opacidade reduzida e texto "Gerando..." ou "Registrando..." quando aplicável.
- Modal: abrir pelo botão "Configuração de IA"; fechar por botão "Cancelar", clique no overlay ou tecla Escape.

---

Este documento descreve a interface atual do DocFlow para reprodução fiel no Figma (layout, componentes, cores e temas claro/escuro). Use-o como base para criar frames, componentes e variantes de tema no design system.
