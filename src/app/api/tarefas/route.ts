import { NextResponse } from "next/server";
import { getSessionOrNull } from "@/lib/get-session";
import { getProject } from "@/lib/projects-store";
import { isTaskTipo } from "@/lib/tarefas-tipo";
import { createTask, listTasks, type TaskPriority, type TaskStatus } from "@/lib/tasks-store";
import { findUserById } from "@/lib/users-store";

export const runtime = "nodejs";

const STATUSES: TaskStatus[] = ["a_fazer", "em_andamento", "concluida"];
const PRIORITIES: TaskPriority[] = ["baixa", "media", "alta"];

function isStatus(s: unknown): s is TaskStatus {
  return typeof s === "string" && STATUSES.includes(s as TaskStatus);
}

function isPriority(p: unknown): p is TaskPriority {
  return typeof p === "string" && PRIORITIES.includes(p as TaskPriority);
}

export async function GET(request: Request) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId")?.trim() || undefined;
  const tasks = await listTasks(projectId ? { projectId } : undefined);
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  let body: {
    projectId?: string;
    title?: string;
    description?: string;
    tipo?: unknown;
    status?: unknown;
    assigneeId?: unknown;
    priority?: unknown;
    dueDate?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  if (!projectId) {
    return NextResponse.json({ error: "projectId é obrigatório" }, { status: 400 });
  }
  const project = await getProject(projectId);
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  let assigneeId: string | null = null;
  if (body.assigneeId !== undefined && body.assigneeId !== null && body.assigneeId !== "") {
    if (typeof body.assigneeId !== "string") {
      return NextResponse.json({ error: "assigneeId inválido" }, { status: 400 });
    }
    const u = await findUserById(body.assigneeId);
    if (!u) {
      return NextResponse.json({ error: "Responsável não encontrado" }, { status: 400 });
    }
    assigneeId = u.id;
  }

  let dueDate: string | null = null;
  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== "") {
    if (typeof body.dueDate !== "string") {
      return NextResponse.json({ error: "dueDate inválido" }, { status: 400 });
    }
    dueDate = body.dueDate;
  }

  if (!isTaskTipo(body.tipo)) {
    return NextResponse.json(
      { error: "Tipo da tarefa é obrigatório (bug QA, plano de teste, bug de cliente ou documento de requisitos)" },
      { status: 400 }
    );
  }

  try {
    const task = await createTask({
      projectId,
      title: typeof body.title === "string" ? body.title : "",
      description: typeof body.description === "string" ? body.description : undefined,
      tipo: body.tipo,
      status: isStatus(body.status) ? body.status : undefined,
      assigneeId,
      priority: isPriority(body.priority) ? body.priority : undefined,
      dueDate,
      createdById: session.sub,
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao criar tarefa";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
