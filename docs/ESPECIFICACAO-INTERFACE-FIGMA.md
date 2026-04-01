# Especificação da interface DocFlow — para Figma

Documento para orientar **protótipos de alta fidelidade**, **fluxos** e **design system** no Figma, alinhado ao código atual do repositório.

---

## 0. Como usar no Figma (rápido)

1. Crie um arquivo com **duas páginas**: `Tema claro` e `Tema escuro` (ou use **variáveis de cor** e um modo Light/Dark).
2. Defina **frames de referência**: `Desktop 1440`, `Tablet 768`, `Mobile 390` (larguras comuns; o app é responsivo com Tailwind).
3. Monte **componentes** na ordem: tokens → botões/inputs → card → header → footer → telas compostas.
4. Para **protótipo navegável**, ligue: Home (visitante) → Login/Cadastro → Home (logado) → módulos; inclua `/tarefas` e os três modais de padrão de IA.

**Rotas principais**

| Rota | Observação |
|------|------------|
| `/` | Home: conteúdo diferente se **não logado** (landing) ou **logado** (grid de módulos). |
| `/login`, `/cadastro` | Formulários; sem atalhos de módulos no header até autenticar. |
| `/qa`, `/suporte`, `/requisitos`, `/tarefas` | **Exigem login** (redirecionam para `/login?from=…` se não houver sessão). |

---

## 1. Visão geral do sistema

**DocFlow** é um sistema web de geração de documentação com três módulos: **QA**, **Suporte** e **Requisitos**, mais uma área de **Tarefas** (projetos e quadro tipo Kanban). A interface é limpa, com foco em formulários e texto gerado por IA; há **tema claro e escuro** e paleta **slate** com **acentos por módulo** (QA verde, Suporte violeta, Requisitos âmbar).

**Stack visual de referência:** fonte **Inter**, layout com `max-w-6xl` no header/footer e em várias telas; módulos de IA em `max-w-4xl`; login/cadastro em `max-w-md`.

---

## 2. Estrutura de navegação e layout global

### 2.1 Header (barra superior fixa)

- **Posição:** `sticky` no topo, `z-index` alto (50).
- **Layout:** grid de **3 colunas** (`max-w-6xl`, padding horizontal): **esquerda** marca | **centro** navegação | **direita** conta + tema.
- **Marca:** texto **DocFlow**, link para `/`, `text-xl font-bold`, cor primária (`primary-700` / dark `primary-400`).
- **Centro — visitante (não autenticado):** área central pode ficar **vazia** ou mínima (no app o bloco central não lista links até haver sessão).
- **Centro — usuário autenticado:** links em lista horizontal com gap pequeno:
  - **Início** (`/`)
  - **Tarefas** (`/tarefas`)
  - Botões que **abrem modal** (não são rotas): **Padrão QA**, **Padrão Suporte**, **Padrão Requisitos**
- **Estado ativo** (Início / Tarefas): fundo `primary-100`, texto `primary-700` (dark: `primary-900/50`, `primary-300`).
- **Direita — visitante:** links **Entrar** (`/login`) estilo ghost; **Cadastro** (`/cadastro`) botão primário preenchido.
- **Direita — logado:** nome do usuário (truncado em telas pequenas), botão secundário **Sair da conta**, e botão **ícone** somente (lua/sol) para alternar tema — **sem** texto “Modo escuro” no botão.
- **Estilo:** fundo branco/escuro com leve transparência e blur; borda inferior `slate-200` / `slate-700`.

### 2.2 Área principal (`main`)

- **Fundo:** `slate-50` (claro) ou `slate-900` (escuro).
- **Conteúdo:** `flex-1`, padding inferior; larguras máximas conforme a tela (ver seção 8).

### 2.3 Footer

- Borda superior, fundo branco (dark: `slate-800/50`).
- Duas colunas em desktop: **esquerda** — link DocFlow + texto curto (“Sistema de geração… Next.js e Google Gemini”); **direita** — bloco “Projeto acadêmico…”, nome com link LinkedIn, PUC Goiás, copyright com ano dinâmico.
- Útil no Figma como componente fixo no rodapé das telas completas.

---

## 3. Páginas e telas (mapa para frames)

### 3.1 Home — visitante (não logado)

- Container estreito (`max-w-3xl`), card único com **borda esquerda** `primary-500`.
- **Título:** DocFlow — `3xl`/`4xl` bold.
- **Parágrafo** explicando o sistema (QA, Suporte, Requisitos + IA).
- **Lista** com bullets coloridos (acentos QA / Suporte / Requisitos) e texto “O que você pode fazer após entrar”.
- **Nota** em texto menor: módulos só após autenticação; usar **Cadastro** ou **Entrar** no canto superior direito.

### 3.2 Home — usuário logado

- Seção superior **centralizada:** título DocFlow + subtítulo “Sistema de geração de documentação para QA, Suporte e Requisitos”.
- **Grid 3 colunas** (1 coluna no mobile) de **cards**:
  - **QA & Testes** → `/qa` — borda esquerda accent QA, ícone custom (círculo + check).
  - **Suporte & Atendimento** → `/suporte` — accent violeta.
  - **Requisitos & Especificação** → `/requisitos` — accent âmbar.
- Cada card: título, descrição curta, parágrafo explicativo menor, botão primário full width **Acessar módulo** (não é o card inteiro clicável — só o botão).

### 3.3 Login (`/login`)

- Container `max-w-md`, card com título **Entrar**, subtítulo curto.
- Campos: **E-mail**, **Senha** (hint: 8 caracteres alfanuméricos).
- Alerta de erro em caixa vermelha clara se falhar.
- Botão primário full width: **Entrar** / estado **Entrando…**
- Rodapé do card: link para Cadastro.

### 3.4 Cadastro (`/cadastro`)

- Mesmo padrão visual do login.
- Campos: **Nome**, **E-mail**, **Senha**, **Confirmar senha**.
- Botão **Criar conta** / **Criando conta…**
- Link para Entrar.

### 3.5 Módulo QA (`/qa`)

- Cabeçalho: **Módulo QA** (`text-2xl` bold) + descrição em slate secundário.
- **Seção 1 — Plano de testes:** `h2` “1. Plano de testes”; card com label **Contexto \***, textarea ~200px altura mínima, botão **Gerar plano de testes**; bloco **Documento gerado** + **Copiar** + `pre` com scroll após gerar.
- **Seção 2 — Relato de bug:** `h2` “2. Relato de bug”; mesma estrutura; botão **Gerar relato de bug**.

### 3.6 Módulo Suporte (`/suporte`)

- Cabeçalho: **Módulo Suporte** + texto sobre relatos a partir do cliente.
- **Um card** `GeradorDocumento` com título visível no card: **Relato de bug (a partir do relato do cliente)** — Contexto *, textarea, **Gerar relato de bug**, área de documento gerado.

### 3.7 Módulo Requisitos (`/requisitos`)

- Cabeçalho: **Módulo Requisitos** + descrição (documentação + Três Amigos).

**Seção 1 — Gerar documentação de requisitos**

- `h2`: “1. Gerar documentação de requisitos”.
- Card: **Cliente \***, **Analista de Requisitos \***, **Requisitos coletados \*** (textarea grande), botão **Gerar documentação** / **Gerando...**
- Toasts de validação/erro/sucesso (componente de feedback); área **Documento gerado** + Copiar + `pre`.

**Seção 2 — Três Amigos**

- `h2`: “2. Reunião Três Amigos – Gerar ata”.
- Parágrafo explicativo (padrão no menu Padrão Requisitos).
- Card: grid **3 colunas** em `sm+`: **Líder \***, **Desenvolvedor \***, **QA \***; **Data da reunião \*** (date); **Notas da reunião \*** (textarea; placeholder sobre decisões e planejamento).
- Botão **Gerar ata da reunião** / **Gerando ata...**
- Bloco **Ata da reunião gerada** + Copiar (mesmo padrão visual do documento acima).

### 3.8 Tarefas (`/tarefas`)

- `max-w-6xl`, cabeçalho **Tarefas** + parágrafo sobre projetos e quadro.

**Blocos (ordem vertical):**

1. **Alerta global** (opcional): mensagem de erro em faixa vermelha clara.
2. **Card Projetos:** título “Projetos”; formulário inline: **Novo projeto — título (obrigatório)**, **Descrição (opcional)**, botão **Criar projeto**; lista de projetos com **Editar** / **Excluir**; empty state explicando que é obrigatório ter projeto antes das tarefas.
3. **Barra:** label **Filtrar por projeto** + select (Todos / projetos) + botão **Nova tarefa**.
4. **Quadro:** grid **3 colunas** em `md+`: **A fazer** | **Em andamento** | **Concluída** — cabeçalho em uppercase com contador `(n)`.
5. **Cards de tarefa** na coluna: arrastáveis; mostram título, badge de **prioridade** (Baixa/Média/Alta — cores diferenciadas), **tipo** (Bug QA, Plano de teste, Bug de cliente, Documento de requisitos), nome do projeto, descrição opcional, responsável, prazo, links **Editar** / **Excluir**.

**Modais (overlay escuro 50%):**

- **Editar projeto:** título obrigatório, descrição opcional, Cancelar / Salvar.
- **Nova tarefa / Editar tarefa:** Projeto, **Tipo da tarefa** (obrigatório) + texto de ajuda, Título, Descrição, Responsável (select com usuários), Prioridade, Prazo (date), Cancelar / Salvar.

---

## 4. Componentes reutilizáveis (design system)

### 4.1 Card

- Bordas arredondadas (`rounded-xl`), borda slate, fundo branco / `slate-800`, padding generoso, sombra leve.

### 4.2 Botões

- **Primário:** fundo `primary-600`, texto branco, `rounded-lg`, hover `primary-700`, focus ring primário.
- **Secundário:** borda slate, fundo branco / slate-700, texto slate.
- **Link primário** (Editar): texto `primary-600`, sublinhado no hover.
- **Destrutivo** (Excluir): texto vermelho, sublinhado no hover.

### 4.3 Campos

- **Label:** `text-sm font-medium` slate.
- **Input / textarea / select:** largura total, borda arredondada, focus ring primário; no escuro fundo `slate-700`, texto claro.

### 4.4 Feedback

- **Toast** (`ToastDocumento`): validação / sucesso API / erro — posicionamento conforme componente (geralmente topo ou canto; alinhar ao protótipo ao inspecionar `ToastDocumento.tsx` se necessário).
- **Cópia:** toast fixo inferior central: “Texto copiado com sucesso!” — verde, some após ~2,5 s.

---

## 5. Modal — Padrões de IA (três entradas)

Não existe mais um único botão “Configuração de IA”. O utilizador autenticado abre **um modal por vez** conforme o item do header:

| Entrada no header | Título do modal |
|-------------------|-----------------|
| Padrão QA | Configurar padrão QA |
| Padrão Suporte | Configurar padrão Suporte |
| Padrão Requisitos | Configurar padrão Requisitos |

- **Overlay:** fullscreen, `bg-black/50`, clique fora fecha.
- **Painel:** `max-w-2xl`, `max-h-[90vh]` com scroll, cantos arredondados, borda, sombra forte.
- **Texto intro:** “Defina o prompt ou as instruções que a IA deve seguir neste módulo.”

**Conteúdo por variante:**

- **QA:** dois blocos — (1) **Padrão QA — Plano de Testes** + ajuda + textarea; (2) **Padrão QA — Relato de Bug** + ajuda + textarea.
- **Suporte:** um bloco — **Padrão para módulo Suporte** + textarea.
- **Requisitos:** dois blocos — **Padrão Requisitos — Documentação**; **Padrão Requisitos — Reunião Três Amigos** (texto de ajuda menciona fallback para o padrão de documentação).

**Rodapé:** **Cancelar** (secundário) + **Salvar** (primário), alinhados à direita. **Escape** fecha.

---

## 6. Paleta de cores (referência para Figma)

Variáveis sugeridas: `bg/page`, `bg/elevated`, `text/primary`, `text/muted`, `border/default`, `accent/qa`, `accent/suporte`, `accent/requisitos`, `primary/*`, `danger`, `success`.

### 6.1 Modo claro

- **Background geral:** `#f8fafc` (slate-50).
- **Texto principal:** slate-800; **secundário:** slate-600.
- **Cards:** branco, borda slate-200.
- **Primary (ações, links):** ~ `#0284c7` / `#0369a1` (ajustar à escala `primary` do `tailwind.config`).
- **Accent QA:** `#10b981` · **Suporte (dev):** `#8b5cf6` · **Requisitos:** `#f59e0b`.

### 6.2 Modo escuro

- **Background:** `#0f172a` (slate-900).
- **Texto:** slate-100 / slate-400.
- **Cards:** slate-800, borda slate-700.
- **Inputs:** fundo slate-700.

### 6.3 Estados

- Erro: red-600 / red-400; fundos red-50 / red-950.
- Sucesso / cópia: verdes conforme seção 4.4.
- Prioridade tarefas: alta vermelho, média âmbar, baixa slate (ver classes no código de `TarefasBoard`).

---

## 7. Tipografia

- **Família:** Inter (Latin).
- **H1 landing:** 3xl–4xl bold.
- **H1 módulos:** 2xl bold.
- **H2 seções:** lg semibold.
- **H3 em cards:** lg semibold (quando o título está dentro do card).
- **Labels:** sm medium.
- **Corpo:** base/sm, hierarquia slate.

---

## 8. Espaçamento e larguras

| Área | Max-width aproximado |
|------|----------------------|
| Header / footer | 6xl (~72rem) |
| Home logada | 6xl |
| Home visitante | 3xl |
| QA / Suporte / Requisitos | 4xl (~56rem) |
| Login / Cadastro | md (~28rem) |
| Tarefas | 6xl |

- **Gap** entre seções grandes: 8–10; entre cards na home: 4.
- **Padding** página: `px-4`, `py-8` nos módulos.

---

## 9. Interações e estados

- Links do header: hover com fundo slate claro/escuro; item ativo com fundo primário suave.
- Botões de geração: disabled com opacidade; rótulos **Gerando...**, **Gerando ata...**, **Entrando…**, etc.
- Tarefas: **drag and drop** entre colunas (representar no protótipo com setas ou nota de interação).
- Modais: fechar por overlay, Cancelar ou Escape.

---

## 10. Checklist de frames sugeridos (protótipo)

- [ ] Header — visitante / logado (duas variantes)
- [ ] Home — visitante / logado
- [ ] Login e Cadastro
- [ ] QA (duas seções com gerador)
- [ ] Suporte (um gerador com título no card)
- [ ] Requisitos (duas seções completas)
- [ ] Tarefas — lista de projetos + quadro 3 colunas + um modal (tarefa ou projeto)
- [ ] Modal Padrão QA / Suporte / Requisitos (três variantes de componente)
- [ ] Footer
- [ ] Tema escuro: duplicar frames principais ou usar modo de variáveis

---

Este documento reflete a interface **atual** do DocFlow para reprodução fiel no Figma (layout, fluxos de autenticação, módulos, tarefas e modais de IA). Ajuste tokens numéricos ao `tailwind.config` e a `globals.css` se o projeto alterar a escala de cores.
