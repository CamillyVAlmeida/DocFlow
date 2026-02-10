"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePadraoIA } from "@/context/PadraoIAContext";

const links = [
  { href: "/", label: "Início" },
  { href: "/qa", label: "QA" },
  { href: "/devs", label: "DEVs" },
  { href: "/requisitos", label: "Requisitos" },
];

export function Nav() {
  const pathname = usePathname();
  const { openModal } = usePadraoIA();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary-700">
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
                      ? "bg-primary-100 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={openModal}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Configuração de IA
          </button>
        </div>
      </nav>
    </header>
  );
}
