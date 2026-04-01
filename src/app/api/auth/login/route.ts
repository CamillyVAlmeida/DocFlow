import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, CADASTRO_SENHA_REGEX, SESSION_MAX_AGE_SEC } from "@/lib/auth-constants";
import { createSessionToken } from "@/lib/session";
import { findUserByEmail, verifyPassword } from "@/lib/users-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
  }

  if (!CADASTRO_SENHA_REGEX.test(password)) {
    return NextResponse.json(
      { error: "Senha deve ter exatamente 8 caracteres, usando apenas letras e números" },
      { status: 400 }
    );
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(user, password))) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
