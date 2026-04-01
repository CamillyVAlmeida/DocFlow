import { NextResponse } from "next/server";
import { getSessionOrNull } from "@/lib/get-session";
import { listUsersForAssignment } from "@/lib/users-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const users = await listUsersForAssignment();
  return NextResponse.json({ users });
}
