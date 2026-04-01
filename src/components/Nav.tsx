"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePadraoIA } from "@/context/PadraoIAContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import type { ModalSection } from "@/context/PadraoIAContext";

function IconMoon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

const configLinks: { section: ModalSection; label: string }[] = [
  { section: "qa", label: "Padrão QA" },
  { section: "suporte", label: "Padrão Suporte" },
  { section: "requisitos", label: "Padrão Requisitos" },
];

export function Nav() {
  const pathname = usePathname();
  const { openModal } = usePadraoIA();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const mostrarAtalhosApp = Boolean(!loading && user);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary-700 dark:text-primary-400">
          DocFlow
        </Link>
        <ul className="flex min-h-[40px] items-center justify-center gap-1">
          {mostrarAtalhosApp ? (
            <>
              <li>
                <Link
                  href="/"
                  className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === "/"
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/tarefas"
                  className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === "/tarefas"
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  Tarefas
                </Link>
              </li>
              {configLinks.map(({ section, label }) => (
                <li key={section}>
                  <button
                    type="button"
                    onClick={() => openModal(section)}
                    className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </>
          ) : null}
        </ul>
        <div className="flex items-center justify-end gap-2">
          {!loading && user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-sm text-slate-600 dark:text-slate-300 sm:inline" title={user.email}>
                {user.name}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="btn-secondary px-3 py-2 text-sm"
                title="Encerrar sessão e voltar à tela inicial"
              >
                Sair da conta
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
              >
                Cadastro
              </Link>
            </>
          ) : null}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {theme === "light" ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </nav>
    </header>
  );
}
