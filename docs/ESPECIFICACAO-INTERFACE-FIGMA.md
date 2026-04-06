# Especificação da interface DocFlow — para Figma

Documento para orientar **protótipos de alta fidelidade**, **fluxos clicáveis** e **design system** no Figma, alinhado ao código atual do repositório.

---

## 0. Como usar no Figma (passo a passo)

### 0.1 Estrutura sugerida do arquivo

| Página no Figma | Conteúdo |
|-----------------|----------|
| **00 — Tokens** | Cores (modos Light / Dark), tipografia, raios, sombras, espaçamentos |
| **01 — Componentes** | Botões, inputs, labels, card, badges, toasts, modais de tarefas |
| **02 — Layout global** | Header (variantes), Footer |
| **03 — Telas — Light** | Todos os frames desktop principais |
| **04 — Telas — Dark** | Duplicar ou usar **variáveis de cor** com modo Dark |

### 0.2 Frames de referência (larguras)

Crie frames nomeados de forma fixa para consistência:

- **Desktop** `1440 × 900` (ou altura livre com scroll)
- **Tablet** `768 × 1024`
- **Mobile** `390 × 844`

O app usa Tailwind responsivo; priorize **Desktop** para o protótipo navegável e, se quiser, uma variante mobile do header (grid pode colapsar).

### 0.3 Ordem de montagem recomendada

1. Tokens e variáveis (Light/Dark).
2. **Card** (`.card`), **botões** (`.btn-primary`, `.btn-secondary`), **campos** (`.input-field`, `.label`).
3. **Header** com variantes: visitante | logado (com estado ativo em Início / Tarefas / Personalização).
4. **Footer**.
5. Telas compostas ligadas no **Prototype** (links entre frames).

### 0.4 Protótipo navegável — fluxo principal

Ligue os hotspots nesta ordem lógica:

1. **Home (visitante)** → **Cadastro** ou **Entrar** (header).
2. **Login** ↔ **Cadastro** (links no rodapé dos cards).
3. Após “login” (simulado): **Home (logado)** → **QA**, **Suporte**, **Requisitos** (botões dos cards) **ou** **Tarefas** / **Personalização** (header).
4. **Personalização** → **Salvar padrões** (feedback verde inline + permanência simulada).
5. **Tarefas** → abrir **modal Nova tarefa** ou **Editar projeto** (overlay).

**Importante:** no app real, **QA, Suporte, Requisitos, Personalização e Tarefas exigem sessão**; sem cookie válido o middleware redireciona para `/login?from=…`. No Figma, basta simular o “estado logado” com frames separados.

---

## 1. Rotas e mapa de telas

| Rota | Quem acessa | Descrição |
|------|-------------|-----------|
| `/` | Qualquer um | Home: **landing** se não logado; **grid de módulos** se logado. |
| `/login`, `/cadastro` | Qualquer um | Autenticação. |
| `/qa`, `/suporte`, `/requisitos` | **Só logado** | Módulos de geração de documentos. |
| `/personalizacao` | **Só logado** | Uma página com todos os padrões de texto (substitui modais no header). |
| `/tarefas` | **Só logado** | Projetos + quadro Kanban. |

---

## 2. Visão geral do produto

**DocFlow** gera documentação para **QA**, **Suporte** e **Requisitos**, com **gestão de tarefas** (projetos e quadro). Interface limpa, foco em formulários e texto gerado; **tema claro/escuro**; paleta **slate** com acentos por módulo:

- **QA:** verde (`accent-qa`)
- **Suporte:** violeta (`accent-dev` no código — mesma cor)
- **Requisitos:** âmbar (`accent-req`)

**Tipografia:** **Inter** (Google Font), via Next.js.

**Larguras máximas típicas:**

- Header e footer: `max-w-6xl` (~1152px)
- Home logada: `max-w-6xl`
- Home visitante: `max-w-3xl`
- QA / Suporte / Requisitos / Personalização: `max-w-4xl`
- Login / Cadastro: `max-w-md`

---

## 3. Layout global

### 3.1 Header (`Nav`) — sticky

- **Posição:** fixo no topo ao rolar (`sticky top-0`), `z-index` 50.
- **Layout:** grid **3 colunas** dentro de `max-w-6xl`, padding horizontal `16px`, vertical ~12px.
- **Coluna 1 — Marca:** “**DocFlow**”, link `/`, `text-xl font-bold`, cor `primary-700` (dark: `primary-400`).
- **Coluna 2 — Navegação (só se autenticado):** links horizontais com `gap` pequeno:
  - **Início** → `/`
  - **Tarefas** → `/tarefas`
  - **Personalização** → `/personalizacao`
- **Estado ativo** (rota atual): fundo `primary-100`, texto `primary-700` (dark: `primary-900/50`, `primary-300`).
- **Estado inativo:** texto slate, hover com fundo slate claro/escuro.
- **Coluna 3 — Ações:**
  - **Visitante:** link **Entrar** (ghost) + botão preenchido **Cadastro**.
  - **Logado:** nome do usuário (truncado em telas estreitas, `max-w` ~140px), botão **Sair da conta** (`btn-secondary`), ícone **lua/sol** só (sem texto no botão) para tema.
- **Fundo:** branco/escuro ~95% opacidade + `backdrop-blur`; borda inferior `slate-200` / `slate-700`.

**Não desenhar:** botões “Padrão QA / Suporte / Requisitos” no header — **foram substituídos** pela rota **Personalização**.

### 3.2 Área principal (`main`)

- **Fundo:** `slate-50` (claro) / `slate-900` (escuro) — alinhar a variável `--background` do `globals.css` se usar CSS no handoff.
- **Comportamento:** `flex-1`, padding inferior (`pb-6`).

### 3.3 Footer

- Borda superior; fundo branco (dark: `slate-800/50`).
- Container `max-w-6xl`, padding vertical ~20px.
- **Mobile:** coluna única; **desktop (`sm+`):** duas colunas (`flex-row`, space-between).
- **Esquerda:** link “DocFlow” (mesmo estilo da marca) + texto: *Sistema de geração de documentação para QA, Suporte e Requisitos e gestão de atividades. Desenvolvido com Next.js.*
- **Direita:** “Projeto acadêmico desenvolvido por:”, nome com link LinkedIn, “PUC Goiás”, copyright com ano dinâmico.

---

## 4. Telas detalhadas (frames)

### 4.1 Home — visitante (não logado)

- Container `max-w-3xl`, padding vertical generoso.
- **Card** único com **borda esquerda 4px** `primary-500`.
- **H1:** DocFlow — `text-3xl` / `sm:text-4xl` bold.
- Parágrafo introdutório (sistema web, QA/Suporte/Requisitos).
- **H2:** “O que você pode fazer após entrar” + lista com **bullets coloridos** (pontos `accent-qa`, `accent-dev`, `accent-req`).
- Nota em texto menor: módulos só autenticados; usar **Cadastro** ou **Entrar** no canto superior direito.

### 4.2 Home — carregando (opcional para UX)

- `max-w-6xl`, retângulo **skeleton** animado (`animate-pulse`), altura ~192px, cantos `rounded-xl`.
- Texto “Carregando…” centralizado abaixo.

### 4.3 Home — usuário logado

- Container `max-w-6xl`, `py-6`.
- **Bloco centralizado:** H1 DocFlow + subtítulo: *Sistema de geração de documentação para QA, Suporte e Requisitos e gestão de atividades.*
- **Grid:** 1 coluna no mobile; **3 colunas** a partir de `sm`.
- **Cards de módulo** (um por linha no mobile):
  - Borda esquerda 4px na cor do módulo (QA / Suporte / Requisitos).
  - Ícone SVG grande no topo (círculo+check QA; setas Suporte; documento Requisitos).
  - Título (`text-base` / `sm:text-lg` semibold), descrição curta, parágrafo explicativo menor (`text-xs` / `sm:text-sm`).
  - Botão primário full width: **Acessar módulo** (único CTA clicável do card).
- **Hover no card (código):** leve elevação (`hover:-translate-y-0.5`, sombra um pouco maior).

### 4.4 Login (`/login`)

- `max-w-md`, card com título **Entrar**, subtítulo.
- Campos: **E-mail**, **Senha** (hint: 8 caracteres alfanuméricos).
- Erro: faixa/caixa vermelha clara.
- Botão primário full width: **Entrar** / estado **Entrando…**
- Link para **Cadastro**.

### 4.5 Cadastro (`/cadastro`)

- Mesmo padrão visual do login.
- Campos: **Nome**, **E-mail**, **Senha**, **Confirmar senha**.
- Botão **Criar conta** / **Criando conta…**
- Link para **Entrar**.

### 4.6 Personalização (`/personalizacao`)

- `max-w-4xl`, `py-8`.
- **Cabeçalho:** H1 **Personalização** + parágrafo explicando padrões únicos para QA, Suporte e Requisitos; mencionar placeholder técnico `{{contexto}}` (mostrar como *código inline*: fundo slate claro, padding horizontal mínimo, cantos arredondados).
- **Um card grande** (`card`) com **três seções** separadas por **H2 com borda inferior**:
  1. **QA** — subcampos:
     - **Plano de testes** (label + texto de ajuda xs + textarea `min-height` ~100px, redimensionável).
     - **Relato de bug** (idem).
  2. **Suporte** — **Relato de bug (a partir do cliente)** (label + ajuda + textarea).
  3. **Requisitos** — **Documentação de requisitos** + **Reunião Três Amigos (ata)** (cada um: label, ajuda, textarea).
- **Rodapé do card:** borda superior; à esquerda (quando aplicável) mensagem de sucesso em verde: *Padrões salvos no navegador.*; à direita botão **Salvar padrões** (`btn-primary`).
- **Comportamento:** não é modal — é **página inteira**.

### 4.7 Módulo QA (`/qa`)

- `max-w-4xl`, cabeçalho **Módulo QA** (`text-2xl` bold) + descrição slate secundário.
- **Seção 1:** H2 “1. Plano de testes” → card gerador (ver §5).
- **Seção 2:** H2 “2. Relato de bug” → segundo card gerador.
- Títulos **não** repetem dentro do card (`mostrarTituloCard={false}`); o H2 da página substitui.

### 4.8 Módulo Suporte (`/suporte`)

- Cabeçalho **Módulo Suporte** + texto sobre relatos a partir do cliente.
- **Um** `GeradorDocumento` com título **visível no card**: *Relato de bug (a partir do relato do cliente)*.

### 4.9 Módulo Requisitos (`/requisitos`)

- Cabeçalho **Módulo Requisitos** + descrição (documentação + Três Amigos).

**Seção 1 — Gerar documentação de requisitos**

- H2: “1. Gerar documentação de requisitos”.
- Card com campos: **Cliente \***, **Analista de Requisitos \***, **Requisitos coletados \*** (textarea grande), botão **Gerar documentação** / **Gerando...**
- Toasts de validação/erro/sucesso (`ToastDocumento`); bloco **Documento gerado** + **Copiar** + `pre` com scroll.

**Seção 2 — Três Amigos**

- H2: “2. Reunião Três Amigos – Gerar ata”.
- Texto explicativo (alinhar ao copy da página).
- Card: em `sm+`, grid **3 colunas** para **Líder \***, **Desenvolvedor \***, **QA \***; **Data da reunião \***; **Notas da reunião \*** (textarea).
- Botão **Gerar ata da reunião** / **Gerando ata...**
- Bloco **Ata da reunião gerada** + Copiar (mesmo padrão visual da seção 1).

### 4.10 Tarefas (`/tarefas`)

- `max-w-6xl`, cabeçalho **Tarefas** + parágrafo sobre projetos e quadro.

**Ordem vertical:**

1. **Alerta de erro** (faixa vermelha clara), se houver falha de API.
2. **Card Projetos:** título “Projetos”; formulário **Novo projeto** (título obrigatório, descrição opcional), **Criar projeto**; lista com **Editar** / **Excluir**; empty state orientando criar projeto antes das tarefas.
3. Barra: **Filtrar por projeto** (select: Todos + projetos) + **Nova tarefa**.
4. **Quadro Kanban:** 3 colunas em `md+`: **A fazer** | **Em andamento** | **Concluída** — título em estilo uppercase com contador `(n)`.
5. **Cards de tarefa:** arrastáveis; exibem título, **badge de prioridade** (Baixa / Média / Alta — cores §7.3), **tipo** da tarefa (rótulos exatos abaixo), projeto, descrição, responsável, prazo, **Editar** / **Excluir**.

**Tipos de tarefa (labels fixos para o Figma):**

| Valor interno | Texto na UI |
|---------------|-------------|
| `bug_qa` | Bug QA |
| `plano_teste` | Plano de teste |
| `bug_cliente` | Bug de cliente |
| `doc_requisitos` | Documento de requisitos |

**Modais (overlay `bg-black/50`):**

- **Editar projeto:** título, descrição, Cancelar / Salvar.
- **Nova tarefa / Editar tarefa:** Projeto, **Tipo da tarefa** (select obrigatório) + texto de ajuda, Título, Descrição, Responsável (select de usuários), Prioridade, Prazo (date), Cancelar / Salvar.

---

## 5. Padrão “GeradorDocumento” (card reutilizável)

Use um **componente principal** no Figma com boolean “mostrar título no card”.

- **Opcional:** H3 título dentro do card (`text-lg` semibold).
- **Label:** “Contexto *” (asterisco vermelho).
- **Textarea:** altura mínima **200px**, `resize` vertical, `input-field`.
- **Ações em linha:** botão primário (texto dinâmico: *Gerar plano de testes*, *Gerar relato de bug*, etc.) + botão secundário **Limpar texto** (desabilitados durante “Gerando...”).
- **Após gerar:** bloco com borda, fundo slate claro; cabeçalho “Documento gerado” + botão **Copiar**; área `pre` altura máx. ~400px com scroll, texto pré-formatado.

---

## 6. Feedback (toasts)

### 6.1 Toast de geração (`ToastDocumento`)

- **Posição:** `fixed`, **inferior central**: `bottom-24` (6 = 1.5rem) em relação ao viewport, centralizado (`left-1/2`, `-translate-x-1/2`).
- **Largura máx.:** ~`min(100vw - 2rem, 28rem)`.
- **Sucesso:** borda/fundo verde claro, texto verde escuro (e variantes dark).
- **Erro / validação:** borda/fundo vermelho claro.
- **Mensagens base:** sucesso → *documento gerado com sucesso.*; validação → *informe os dados nos campos obrigatórios*; API → *erro ao gerar documento* ou detalhe retornado.
- **Auto-dismiss:** ~2,5 s.

### 6.2 Toast de cópia (GeradorDocumento)

- Posição similar, **`bottom-20`** (acima do toast de geração se ambos aparecessem).
- Texto: **Texto copiado com sucesso!**
- Estilo verde, ~2,5 s.

---

## 7. Design tokens (cores exatas — `tailwind.config.ts`)

Defina **variáveis de cor** no Figma com estes hex para fidelidade ao código:

### 7.1 Primary (ações e links)

| Token | Hex |
|-------|-----|
| primary-50 | `#f0f9ff` |
| primary-100 | `#e0f2fe` |
| primary-200 | `#bae6fd` |
| primary-300 | `#7dd3fc` |
| primary-400 | `#38bdf8` |
| primary-500 | `#0ea5e9` |
| primary-600 | `#0284c7` |
| primary-700 | `#0369a1` |
| primary-800 | `#075985` |
| primary-900 | `#0c4a6e` |

### 7.2 Acentos por módulo

| Token | Hex | Uso |
|-------|-----|-----|
| accent-qa | `#10b981` | QA, bullet landing |
| accent-dev | `#8b5cf6` | Suporte (nome técnico “dev”) |
| accent-req | `#f59e0b` | Requisitos |

### 7.3 Superfícies e estados

- **Página clara:** fundo `#f8fafc` (slate-50); cards brancos, borda `#e2e8f0` (slate-200).
- **Página escura:** fundo `#0f172a` (slate-900); cards `slate-800`, bordas `slate-700`; inputs fundo `slate-700`.
- **Prioridade tarefas:** Alta — vermelho (`red-100` / `red-800`); Média — âmbar; Baixa — slate.

### 7.4 Tipografia (escala sugerida no Figma)

- **H1 landing / home logada:** 30–36px bold (3xl–4xl).
- **H1 módulos / Personalização:** 24px bold (2xl).
- **H2 seção:** 18px semibold (lg).
- **H3 em card:** 18px semibold.
- **Labels:** 14px medium.
- **Corpo:** 16px / 14px conforme hierarquia slate.

---

## 8. Espaçamento e Auto Layout (Figma)

| Área | Max-width |
|------|-----------|
| Header / footer / home logada / tarefas | ~1152px (6xl) |
| Home visitante | ~768px (3xl) |
| QA, Suporte, Requisitos, Personalização | ~896px (4xl) |
| Login / Cadastro | ~448px (md) |

- **Gap** entre seções grandes nos módulos: 40px (`mb-10`).
- **Padding horizontal página:** 16px (`px-4`).
- **Padding vertical módulos:** 32px (`py-8`).

Use **Auto Layout** nos cards: direção vertical, padding 24px (`p-6` no card base).

---

## 9. Interações e estados (Prototype)

- Links do header: hover + estado ativo com fundo primário suave.
- Botões primários: `disabled` com opacidade ~50% durante carregamento.
- Tarefas: **drag and drop** entre colunas — no Figma, anotar como interação avançada ou usar gestos/setas entre estados.
- Modais de tarefa/projeto: fechar por clique no overlay, **Cancelar** ou tecla Escape (comportamento desejável; validar no código se necessário).

---

## 10. Checklist de frames para o protótipo

- [ ] Header — **visitante** (Entrar + Cadastro + tema)
- [ ] Header — **logado** (Início, Tarefas, Personalização + nome + Sair + tema)
- [ ] Header — variantes de **item ativo** (3 estados de link)
- [ ] Home — visitante / carregando / logada (grid 3 cards)
- [ ] Login e Cadastro
- [ ] **Personalização** (página completa com 3 seções + Salvar)
- [ ] QA (2 seções, sem título duplicado no card)
- [ ] Suporte (1 gerador com título no card)
- [ ] Requisitos (2 seções, formulário + Três Amigos)
- [ ] Tarefas — projetos + filtro + quadro 3 colunas + **um** modal (tarefa ou projeto)
- [ ] Toasts — variante sucesso / erro / cópia (fixos embaixo)
- [ ] Footer
- [ ] **Tema escuro:** duplicar frames chave ou variáveis com modo Dark

---

## 11. Referência no repositório

Para ajustes finos após o primeiro protótipo:

- Estilos globais: `src/app/globals.css` (`.card`, `.btn-primary`, `.btn-secondary`, `.input-field`, `.label`).
- Cores: `tailwind.config.ts`.
- Navegação: `src/components/Nav.tsx`.
- Home: `src/components/HomeConteudo.tsx`.
- Personalização: `src/app/personalizacao/page.tsx`.
- Rotas protegidas: `middleware.ts`.

Este documento reflete a interface **atual** do DocFlow (incluindo **Personalização** em página dedicada e ausência de modais de padrão no header).
