import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, getAuthSecret } from "@/lib/auth-constants";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  try {
    const secret = new TextEncoder().encode(getAuthSecret());
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", request.nextUrl.pathname);
    const res = NextResponse.redirect(login);
    res.cookies.delete(AUTH_COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: [
    "/qa",
    "/suporte",
    "/requisitos",
    "/personalizacao",
    "/tarefas",
    "/api/tarefas/:path*",
    "/api/projetos/:path*",
    "/api/users",
  ],
};
