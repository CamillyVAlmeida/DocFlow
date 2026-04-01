"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CADASTRO_SENHA_COMPRIMENTO, sanitizarSenhaAlfanumerica } from "@/lib/auth-constants";
import { parseJsonResponse } from "@/lib/parse-json-response";

function safeRedirectPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return "/";
  }
  if (from === "/login" || from === "/cadastro") {
    return "/";
  }
  return from;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = safeRedirectPath(searchParams.get("from"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const parsed = await parseJsonResponse<{ error?: string }>(res);
      if (!parsed.ok) {
        setError(parsed.message);
        return;
      }
      const data = parsed.data;
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar");
        return;
      }
      await refresh();
      router.push(from);
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor. Confirme se o app está rodando (`npm run dev`).");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">Entrar</h1>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Acesse os módulos DocFlow com sua conta.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="login-email" className="label">
            E-mail
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="label">
            Senha
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={CADASTRO_SENHA_COMPRIMENTO}
            maxLength={CADASTRO_SENHA_COMPRIMENTO}
            inputMode="text"
            pattern="[A-Za-z0-9]{8}"
            title="8 caracteres: letras e números"
            value={password}
            onChange={(e) => setPassword(sanitizarSenhaAlfanumerica(e.target.value))}
            className="input-field"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {CADASTRO_SENHA_COMPRIMENTO} caracteres, apenas letras e números (sem espaços ou símbolos).
          </p>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="card min-h-[320px] animate-pulse bg-slate-100 dark:bg-slate-800/80" aria-hidden />
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-10">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
