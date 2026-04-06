"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TASK_TIPO,
  TASK_TIPO_LABELS,
  TASK_TIPO_VALUES,
  type TaskTipo,
} from "@/lib/tarefas-tipo";

type TaskStatus = "a_fazer" | "em_andamento" | "concluida";
type TaskPriority = "baixa" | "media" | "alta";

type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  tipo: TaskTipo;
  status: TaskStatus;
  assigneeId: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
};

const COLUNAS: { status: TaskStatus; titulo: string }[] = [
  { status: "a_fazer", titulo: "A fazer" },
  { status: "em_andamento", titulo: "Em andamento" },
  { status: "concluida", titulo: "Concluída" },
];

const prioridadeLabel: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

function prioridadeClass(p: TaskPriority): string {
  if (p === "alta") return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
  if (p === "media") return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100";
  return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T & { error?: string }) : ({} as T);
  if (!res.ok) {
    const err = (data as { error?: string }).error ?? res.statusText;
    throw new Error(err);
  }
  return data as T;
}

export function TarefasBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtroProjeto, setFiltroProjeto] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [novoProjTitulo, setNovoProjTitulo] = useState("");
  const [novoProjDesc, setNovoProjDesc] = useState("");
  const [projetoEmEdicao, setProjetoEmEdicao] = useState<Project | null>(null);
  const [editProjTitulo, setEditProjTitulo] = useState("");
  const [editProjDesc, setEditProjDesc] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Task | null>(null);
  const [formProjetoId, setFormProjetoId] = useState("");
  const [formTitulo, setFormTitulo] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<TaskPriority>("media");
  const [formTipo, setFormTipo] = useState<TaskTipo>(DEFAULT_TASK_TIPO);
  const [formDue, setFormDue] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [pRes, tRes] = await Promise.all([
        fetchJson<{ projects: Project[] }>("/api/projetos"),
        fetchJson<{ tasks: Task[] }>("/api/tarefas"),
      ]);
      setProjects(pRes.projects);
      setTasks(tRes.tasks);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const projetoTitulo = useCallback(
    (id: string) => projects.find((p) => p.id === id)?.title ?? id,
    [projects]
  );

  const tasksFiltradas = useMemo(() => {
    if (filtroProjeto === "all") return tasks;
    return tasks.filter((t) => t.projectId === filtroProjeto);
  }, [tasks, filtroProjeto]);

  const porColuna = useCallback(
    (status: TaskStatus) => tasksFiltradas.filter((t) => t.status === status),
    [tasksFiltradas]
  );

  async function criarProjeto(e: React.FormEvent) {
    e.preventDefault();
    if (!novoProjTitulo.trim()) return;
    setSalvando(true);
    setErro(null);
    try {
      const { project } = await fetchJson<{ project: Project }>("/api/projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: novoProjTitulo.trim(), description: novoProjDesc.trim() }),
      });
      setProjects((prev) => [...prev, project].sort((a, b) => a.title.localeCompare(b.title, "pt-BR")));
      setNovoProjTitulo("");
      setNovoProjDesc("");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar projeto");
    } finally {
      setSalvando(false);
    }
  }

  function abrirEdicaoProjeto(p: Project) {
    setErro(null);
    setProjetoEmEdicao(p);
    setEditProjTitulo(p.title);
    setEditProjDesc(p.description);
  }

  function fecharModalProjeto() {
    setProjetoEmEdicao(null);
    setEditProjTitulo("");
    setEditProjDesc("");
  }

  async function salvarEdicaoProjeto(e: React.FormEvent) {
    e.preventDefault();
    if (!projetoEmEdicao || !editProjTitulo.trim()) return;
    setSalvando(true);
    setErro(null);
    try {
      const { project } = await fetchJson<{ project: Project }>(`/api/projetos/${projetoEmEdicao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editProjTitulo.trim(), description: editProjDesc.trim() }),
      });
      setProjects((prev) =>
        prev
          .map((x) => (x.id === project.id ? project : x))
          .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"))
      );
      fecharModalProjeto();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar projeto");
    } finally {
      setSalvando(false);
    }
  }

  function mensagemConfirmarExclusaoProjeto(id: string): string {
    const n = tasks.filter((t) => t.projectId === id).length;
    if (n > 0) {
      const plural = n === 1 ? "tarefa vinculada" : "tarefas vinculadas";
      return (
        `Este projeto possui ${n} ${plural}.\n\n` +
        "Ao confirmar, o projeto e todas essas tarefas serão excluídos permanentemente.\n\n" +
        "Tem certeza de que deseja continuar?"
      );
    }
    return "Excluir este projeto? Esta ação não pode ser desfeita.";
  }

  async function excluirProjeto(id: string) {
    if (!window.confirm(mensagemConfirmarExclusaoProjeto(id))) return;
    setErro(null);
    try {
      await fetchJson(`/api/projetos/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTasks((prev) => prev.filter((t) => t.projectId !== id));
      if (filtroProjeto === id) setFiltroProjeto("all");
      if (projetoEmEdicao?.id === id) fecharModalProjeto();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir projeto");
    }
  }

  function abrirNovaTarefa() {
    if (projects.length === 0) {
      setErro("Campo obrigatório: crie um projeto na seção Projetos acima antes de adicionar uma tarefa.");
      document.getElementById("np-titulo")?.focus();
      return;
    }
    setErro(null);
    setEditando(null);
    setFormProjetoId(projects[0]?.id ?? "");
    setFormTitulo("");
    setFormDesc("");
    setFormPriority("media");
    setFormTipo(DEFAULT_TASK_TIPO);
    setFormDue("");
    setModalAberto(true);
  }

  function abrirEdicao(t: Task) {
    setEditando(t);
    setFormProjetoId(t.projectId);
    setFormTitulo(t.title);
    setFormDesc(t.description);
    setFormPriority(t.priority);
    setFormTipo(t.tipo ?? DEFAULT_TASK_TIPO);
    setFormDue(t.dueDate ? t.dueDate.slice(0, 10) : "");
    setModalAberto(true);
  }

  async function salvarTarefa(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitulo.trim() || !formProjetoId) return;
    setSalvando(true);
    setErro(null);
    try {
      const body = {
        projectId: formProjetoId,
        title: formTitulo.trim(),
        description: formDesc.trim(),
        tipo: formTipo,
        priority: formPriority,
        dueDate: formDue || null,
      };
      if (editando) {
        const { task } = await fetchJson<{ task: Task }>(`/api/tarefas/${editando.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            projectId: formProjetoId,
          }),
        });
        setTasks((prev) => prev.map((x) => (x.id === task.id ? task : x)));
      } else {
        const { task } = await fetchJson<{ task: Task }>("/api/tarefas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setTasks((prev) => [...prev, task]);
      }
      setModalAberto(false);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar tarefa");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirTarefa(id: string) {
    if (!window.confirm("Excluir esta tarefa?")) return;
    setErro(null);
    try {
      await fetchJson(`/api/tarefas/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir";
      if (/não encontrada/i.test(msg)) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        return;
      }
      setErro(msg);
    }
  }

  async function moverStatus(taskId: string, status: TaskStatus) {
    setErro(null);
    try {
      const { task } = await fetchJson<{ task: Task }>(`/api/tarefas/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao mover tarefa");
    }
  }

  function onDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onDrop(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    void moverStatus(taskId, status);
  }

  if (loading) {
    return (
      <p className="text-slate-600 dark:text-slate-400" role="status">
        Carregando tarefas…
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {erro ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {erro}
        </div>
      ) : null}

      <section className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Projetos</h2>
        <form onSubmit={criarProjeto} className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="np-titulo" className="label">
              Novo projeto — título <span className="text-red-600 dark:text-red-400">(obrigatório)</span>
            </label>
            <input
              id="np-titulo"
              className="input-field"
              value={novoProjTitulo}
              onChange={(e) => setNovoProjTitulo(e.target.value)}
              placeholder="Ex.: Release março, Cliente X…"
            />
          </div>
          <div className="min-w-0 flex-[2]">
            <label htmlFor="np-desc" className="label">
              Descrição (opcional)
            </label>
            <input
              id="np-desc"
              className="input-field"
              value={novoProjDesc}
              onChange={(e) => setNovoProjDesc(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary shrink-0" disabled={salvando || !novoProjTitulo.trim()}>
            Criar projeto
          </button>
        </form>
        {projects.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400" id="projeto-obrigatorio-ajuda">
            É obrigatório cadastrar pelo menos um projeto aqui antes de criar tarefas no quadro abaixo.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-600">
            {projects.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{p.title}</span>
                  {p.description ? (
                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{p.description}</span>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => abrirEdicaoProjeto(p)}
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void excluirProjeto(p.id)}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="filtro-proj" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Filtrar por projeto
          </label>
          <select
            id="filtro-proj"
            className="input-field max-w-xs"
            value={filtroProjeto}
            onChange={(e) => setFiltroProjeto(e.target.value)}
          >
            <option value="all">Todos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={abrirNovaTarefa}
          aria-describedby={projects.length === 0 ? "projeto-obrigatorio-ajuda" : undefined}
        >
          Nova tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUNAS.map(({ status, titulo }) => (
          <div
            key={status}
            className="flex min-h-[280px] flex-col rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-800/80"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
          >
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-center text-sm font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:text-slate-300">
              {titulo}
              <span className="ml-2 font-normal text-slate-400">({porColuna(status).length})</span>
            </h3>
            <ul className="flex flex-1 flex-col gap-2">
              {porColuna(status).map((t) => (
                <li
                  key={t.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, t.id)}
                  className="cursor-grab rounded-lg border border-slate-200 bg-slate-50 p-3 text-left shadow-sm active:cursor-grabbing dark:border-slate-600 dark:bg-slate-900/50"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{t.title}</span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${prioridadeClass(t.priority)}`}>
                      {prioridadeLabel[t.priority]}
                    </span>
                  </div>
                  <p className="mb-1 text-xs font-medium text-primary-700 dark:text-primary-300">
                    {TASK_TIPO_LABELS[t.tipo] ?? t.tipo}
                  </p>
                  <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{projetoTitulo(t.projectId)}</p>
                  {t.description ? (
                    <p className="mb-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{t.description}</p>
                  ) : null}
                  {t.dueDate ? (
                    <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      Prazo: {new Date(t.dueDate + "T12:00:00").toLocaleDateString("pt-BR")}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="text-xs text-primary-600 hover:underline dark:text-primary-400" onClick={() => abrirEdicao(t)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                      onClick={() => void excluirTarefa(t.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {projetoEmEdicao ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Editar projeto</h3>
            <form onSubmit={(e) => void salvarEdicaoProjeto(e)} className="space-y-4">
              <div>
                <label htmlFor="ep-titulo" className="label">
                  Título <span className="text-red-600 dark:text-red-400">(obrigatório)</span>
                </label>
                <input
                  id="ep-titulo"
                  className="input-field"
                  value={editProjTitulo}
                  onChange={(e) => setEditProjTitulo(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="ep-desc" className="label">
                  Descrição (opcional)
                </label>
                <input
                  id="ep-desc"
                  className="input-field"
                  value={editProjDesc}
                  onChange={(e) => setEditProjDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={fecharModalProjeto}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={salvando || !editProjTitulo.trim()}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {modalAberto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              {editando ? "Editar tarefa" : "Nova tarefa"}
            </h3>
            <form onSubmit={(e) => void salvarTarefa(e)} className="space-y-4">
              <div>
                <label htmlFor="ft-proj" className="label">
                  Projeto
                </label>
                <select
                  id="ft-proj"
                  className="input-field"
                  value={formProjetoId}
                  onChange={(e) => setFormProjetoId(e.target.value)}
                  required
                >
                  <option value="">Selecione…</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ft-tipo" className="label">
                  Tipo da tarefa <span className="text-red-600 dark:text-red-400">(obrigatório)</span>
                </label>
                <select
                  id="ft-tipo"
                  className="input-field"
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as TaskTipo)}
                  required
                >
                  {TASK_TIPO_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {TASK_TIPO_LABELS[v]}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Relaciona a tarefa ao fluxo de QA, Suporte ou Requisitos do DocFlow.
                </p>
              </div>
              <div>
                <label htmlFor="ft-titulo" className="label">
                  Título
                </label>
                <input
                  id="ft-titulo"
                  className="input-field"
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="ft-desc" className="label">
                  Descrição
                </label>
                <textarea id="ft-desc" className="input-field min-h-[80px]" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ft-prio" className="label">
                    Prioridade
                  </label>
                  <select
                    id="ft-prio"
                    className="input-field"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ft-due" className="label">
                    Prazo
                  </label>
                  <input
                    id="ft-due"
                    type="date"
                    className="input-field"
                    value={formDue}
                    onChange={(e) => setFormDue(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={salvando}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
