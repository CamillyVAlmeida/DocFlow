import { NextResponse } from "next/server";
import { getSessionOrNull } from "@/lib/get-session";
import { deleteProject, getProject, updateProject } from "@/lib/projects-store";

export const runtime = "nodejs";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = context.params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = context.params;
  let body: { title?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const project = await updateProject(id, {
    title: typeof body.title === "string" ? body.title : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
  });
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = context.params;
  const ok = await deleteProject(id);
  if (!ok) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
