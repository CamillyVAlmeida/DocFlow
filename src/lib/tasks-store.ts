import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_TASK_TIPO,
  type TaskTipo,
  TASK_TIPO_VALUES,
} from "@/lib/tarefas-tipo";

export type { TaskTipo } from "@/lib/tarefas-tipo";
export { TASK_TIPO_LABELS, TASK_TIPO_VALUES } from "@/lib/tarefas-tipo";

export type TaskStatus = "a_fazer" | "em_andamento" | "concluida";
export type TaskPriority = "baixa" | "media" | "alta";

export type TaskRecord = {
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

type TasksFile = { tasks: TaskRecord[] };

function dataPath(): string {
  return path.join(process.cwd(), "data", "tasks.json");
}

async function ensureDataDir(): Promise<void> {
  const dir = path.join(process.cwd(), "data");
  await fs.mkdir(dir, { recursive: true });
}

function normalizeTaskTipo(t: TaskRecord | (Omit<TaskRecord, "tipo"> & { tipo?: TaskTipo })): TaskRecord {
  const tipo = t.tipo && TASK_TIPO_VALUES.includes(t.tipo) ? t.tipo : DEFAULT_TASK_TIPO;
  return { ...(t as TaskRecord), tipo };
}

async function readFile(): Promise<TasksFile> {
  try {
    const raw = await fs.readFile(dataPath(), "utf-8");
    const parsed = JSON.parse(raw) as TasksFile;
    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      return { tasks: [] };
    }
    parsed.tasks = parsed.tasks.map((row) => normalizeTaskTipo(row as TaskRecord));
    return parsed;
  } catch {
    return { tasks: [] };
  }
}

async function writeFile(data: TasksFile): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(dataPath(), JSON.stringify(data, null, 2), "utf-8");
}

export async function listTasks(filter?: { projectId?: string }): Promise<TaskRecord[]> {
  let { tasks } = await readFile();
  if (filter?.projectId) {
    tasks = tasks.filter((t) => t.projectId === filter.projectId);
  }
  return [...tasks].sort((a, b) => {
    const da = a.dueDate ?? "";
    const db = b.dueDate ?? "";
    if (da !== db) return da.localeCompare(db);
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export async function getTask(id: string): Promise<TaskRecord | undefined> {
  const { tasks } = await readFile();
  return tasks.find((t) => t.id === id);
}

export async function createTask(input: {
  projectId: string;
  title: string;
  description?: string;
  tipo?: TaskTipo;
  status?: TaskStatus;
  assigneeId?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  createdById: string;
}): Promise<TaskRecord> {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Título da tarefa é obrigatório");
  }
  const tipo =
    input.tipo && TASK_TIPO_VALUES.includes(input.tipo) ? input.tipo : DEFAULT_TASK_TIPO;
  const now = new Date().toISOString();
  const task: TaskRecord = {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    title,
    description: typeof input.description === "string" ? input.description.trim() : "",
    tipo,
    status: input.status ?? "a_fazer",
    assigneeId: input.assigneeId === undefined ? null : input.assigneeId,
    priority: input.priority ?? "media",
    dueDate: input.dueDate === undefined ? null : input.dueDate,
    createdAt: now,
    updatedAt: now,
    createdById: input.createdById,
  };
  const file = await readFile();
  file.tasks.push(task);
  await writeFile(file);
  return task;
}

export async function updateTask(
  id: string,
  input: Partial<
    Pick<TaskRecord, "title" | "description" | "tipo" | "status" | "assigneeId" | "priority" | "dueDate" | "projectId">
  >
): Promise<TaskRecord | undefined> {
  const file = await readFile();
  const t = file.tasks.find((x) => x.id === id);
  if (!t) return undefined;
  if (typeof input.title === "string") {
    const s = input.title.trim();
    if (s) t.title = s;
  }
  if (typeof input.description === "string") {
    t.description = input.description.trim();
  }
  if (input.tipo !== undefined && TASK_TIPO_VALUES.includes(input.tipo)) {
    t.tipo = input.tipo;
  }
  if (input.status !== undefined) {
    t.status = input.status;
  }
  if (input.assigneeId !== undefined) {
    t.assigneeId = input.assigneeId;
  }
  if (input.priority !== undefined) {
    t.priority = input.priority;
  }
  if (input.dueDate !== undefined) {
    t.dueDate = input.dueDate;
  }
  if (typeof input.projectId === "string" && input.projectId.trim()) {
    t.projectId = input.projectId.trim();
  }
  t.updatedAt = new Date().toISOString();
  await writeFile(file);
  return t;
}

export async function deleteTask(id: string): Promise<boolean> {
  const file = await readFile();
  const idx = file.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  file.tasks.splice(idx, 1);
  await writeFile(file);
  return true;
}

export async function deleteTasksByProjectId(projectId: string): Promise<void> {
  const file = await readFile();
  file.tasks = file.tasks.filter((t) => t.projectId !== projectId);
  await writeFile(file);
}
