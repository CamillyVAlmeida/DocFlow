import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, CADASTRO_SENHA_REGEX, SESSION_MAX_AGE_SEC } from "@/lib/auth-constants";
import { createSessionToken } from "@/lib/session";
import { createUser } from "@/lib/users-store";

/** Garante uso de Node (fs, bcrypt) no servidor. */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    let body: { email?: string; name?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email : "";
    const name = typeof body.name === "string" ? body.name : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
    }
    if (!CADASTRO_SENHA_REGEX.test(password)) {
      return NextResponse.json(
        { error: "Senha deve ter exatamente 8 caracteres, usando apenas letras e números" },
        { status: 400 }
      );
    }

    try {
      const user = await createUser({ email, name, password });
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao cadastrar";
      if (msg === "E-mail já cadastrado") {
        return NextResponse.json({ error: msg }, { status: 409 });
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } catch (e) {
    console.error("[register]", e);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar. Verifique permissões da pasta do projeto e o console do servidor." },
      { status: 500 }
    );
  }
}
