import { NextResponse } from "next/server";
import { getSessionOrNull } from "@/lib/get-session";
import { getProject } from "@/lib/projects-store";
import { isTaskTipo } from "@/lib/tarefas-tipo";
import { deleteTask, getTask, updateTask, type TaskPriority, type TaskStatus } from "@/lib/tasks-store";
import { findUserById } from "@/lib/users-store";

export const runtime = "nodejs";

type RouteContext = { params: { id: string } };

const STATUSES: TaskStatus[] = ["a_fazer", "em_andamento", "concluida"];
const PRIORITIES: TaskPriority[] = ["baixa", "media", "alta"];

function isStatus(s: unknown): s is TaskStatus {
  return typeof s === "string" && STATUSES.includes(s as TaskStatus);
}

function isPriority(p: unknown): p is TaskPriority {
  return typeof p === "string" && PRIORITIES.includes(p as TaskPriority);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = context.params;
  const existing = await getTask(id);
  if (!existing) {
    return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  }

  let body: {
    title?: string;
    description?: string;
    tipo?: unknown;
    status?: unknown;
    assigneeId?: unknown;
    priority?: unknown;
    dueDate?: unknown;
    projectId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (body.status !== undefined && !isStatus(body.status)) {
    return NextResponse.json({ error: "status inválido" }, { status: 400 });
  }
  if (body.priority !== undefined && !isPriority(body.priority)) {
    return NextResponse.json({ error: "priority inválida" }, { status: 400 });
  }
  if (body.tipo !== undefined && !isTaskTipo(body.tipo)) {
    return NextResponse.json({ error: "tipo inválido" }, { status: 400 });
  }

  if (typeof body.projectId === "string" && body.projectId.trim()) {
    const p = await getProject(body.projectId.trim());
    if (!p) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 400 });
    }
  }

  let assigneeId: string | null | undefined = undefined;
  if (body.assigneeId !== undefined) {
    if (body.assigneeId === null || body.assigneeId === "") {
      assigneeId = null;
    } else if (typeof body.assigneeId === "string") {
      const u = await findUserById(body.assigneeId);
      if (!u) {
        return NextResponse.json({ error: "Responsável não encontrado" }, { status: 400 });
      }
      assigneeId = u.id;
    } else {
      return NextResponse.json({ error: "assigneeId inválido" }, { status: 400 });
    }
  }

  let dueDate: string | null | undefined = undefined;
  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === "") {
      dueDate = null;
    } else if (typeof body.dueDate === "string") {
      dueDate = body.dueDate;
    } else {
      return NextResponse.json({ error: "dueDate inválido" }, { status: 400 });
    }
  }

  const task = await updateTask(id, {
    title: typeof body.title === "string" ? body.title : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
    tipo: isTaskTipo(body.tipo) ? body.tipo : undefined,
    status: isStatus(body.status) ? body.status : undefined,
    assigneeId,
    priority: isPriority(body.priority) ? body.priority : undefined,
    dueDate,
    projectId: typeof body.projectId === "string" && body.projectId.trim() ? body.projectId.trim() : undefined,
  });

  if (!task) {
    return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = context.params;
  const ok = await deleteTask(id);
  if (!ok) {
    return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
