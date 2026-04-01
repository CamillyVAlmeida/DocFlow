"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CADASTRO_SENHA_COMPRIMENTO, sanitizarSenhaAlfanumerica } from "@/lib/auth-constants";
import { parseJsonResponse } from "@/lib/parse-json-response";

export default function CadastroPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const parsed = await parseJsonResponse<{ error?: string }>(res);
      if (!parsed.ok) {
        setError(parsed.message);
        return;
      }
      const data = parsed.data;
      if (!res.ok) {
        setError(data.error ?? "Não foi possível cadastrar");
        return;
      }
      await refresh();
      router.push("/");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor. Confirme se o app está rodando (`npm run dev`).");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-10">
      <div className="card">
        <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">Criar conta</h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Cadastre-se para usar os módulos do sistema.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="cadastro-name" className="label">
              Nome
            </label>
            <input
              id="cadastro-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="cadastro-email" className="label">
              E-mail
            </label>
            <input
              id="cadastro-email"
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
            <label htmlFor="cadastro-password" className="label">
              Senha
            </label>
            <input
              id="cadastro-password"
              name="password"
              type="password"
              autoComplete="new-password"
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
          <div>
            <label htmlFor="cadastro-confirm" className="label">
              Confirmar senha
            </label>
            <input
              id="cadastro-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={CADASTRO_SENHA_COMPRIMENTO}
              maxLength={CADASTRO_SENHA_COMPRIMENTO}
              pattern="[A-Za-z0-9]{8}"
              title="8 caracteres: letras e números"
              value={confirm}
              onChange={(e) => setConfirm(sanitizarSenhaAlfanumerica(e.target.value))}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Criando conta…" : "Criar conta"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
