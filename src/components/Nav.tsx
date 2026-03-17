"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePadraoIA } from "@/context/PadraoIAContext";
import { useTheme } from "@/context/ThemeContext";

const links = [
  { href: "/", label: "Início" },
  { href: "/qa", label: "QA" },
  { href: "/suporte", label: "Suporte" },
  { href: "/requisitos", label: "Requisitos" },
];

function IconMoon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { openModal } = usePadraoIA();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary-700 dark:text-primary-400">
          DocFlow
        </Link>
        <div className="flex items-center gap-2">
          <ul className="flex gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === href
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex min-w-[8.75rem] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {theme === "light" ? (
              <>
                <IconMoon />
                <span>Modo escuro</span>
              </>
            ) : (
              <>
                <IconSun />
                <span>Modo claro</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={openModal}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Configuração de IA
          </button>
        </div>
      </nav>
    </header>
  );
}
