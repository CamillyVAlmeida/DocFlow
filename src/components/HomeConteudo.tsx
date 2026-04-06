"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function IconQA() {
  return (
    <div className="mb-2 flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="2.5" className="text-accent-qa" />
        <path
          d="M18 28l7 7 13-14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-qa"
        />
      </svg>
    </div>
  );
}

function IconSuporte() {
  return (
    <div className="mb-2 flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path
          d="M32 16L18 28l14 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-dev"
        />
        <path
          d="M24 16l14 12-14 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-dev"
        />
      </svg>
    </div>
  );
}

function IconRequisitos() {
  return (
    <div className="mb-2 flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path
          d="M14 8h22l8 8v32H14V8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-req"
        />
        <path d="M44 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent-req" />
        <path d="M36 8v8h8l-8-8z" fill="currentColor" className="text-accent-req" />
        <path
          d="M18 24h20M18 32h14M18 40h20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-accent-req"
        />
      </svg>
    </div>
  );
}

const modules = [
  {
    href: "/qa",
    title: "QA & Testes",
    description: "Plano de testes e relato de bug com detalhes técnicos.",
    explicacao:
      "Gere planos de teste a partir do contexto da funcionalidade e relatos de bug estruturados (ambiente, passos, evidências) para uso da equipe de desenvolvimento.",
    color: "accent-qa" as const,
    Icon: IconQA,
  },
  {
    href: "/suporte",
    title: "Suporte & Atendimento",
    description: "Relatos de bug estruturados a partir dos relatos dos clientes.",
    explicacao:
      "Transforme descrições informais de clientes em relatos de bug padronizados, prontos para o time técnico e QA, com severidade e passos para reproduzir.",
    color: "accent-dev" as const,
    Icon: IconSuporte,
  },
  {
    href: "/requisitos",
    title: "Requisitos & Especificação",
    description: "Documentação de requisitos e fluxo da reunião Três Amigos.",
    explicacao:
      "Documente requisitos (cliente, analista, módulos) e registre a decisão da reunião Três Amigos (Líder, Dev, QA) com ata e próximos passos.",
    color: "accent-req" as const,
    Icon: IconRequisitos,
  },
];

function LandingVisitante() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col px-4 py-10 sm:py-14">
      <div className="card border-l-4 border-primary-500 p-6 sm:p-8">
        <h1 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100 sm:text-4xl">DocFlow</h1>
        <p className="mb-6 text-lg text-slate-600 dark:text-slate-300">
          Sistema web para gerar documentação alinhada a QA, Suporte e Requisitos — textos estruturados a
          partir do que você informa, para padronizar comunicação técnica e registro de decisões.
        </p>

        <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">O que você pode fazer após entrar</h2>
        <ul className="mb-8 space-y-3 text-slate-600 dark:text-slate-400">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-qa" aria-hidden />
            <span>
              <strong className="text-slate-800 dark:text-slate-200">QA e testes:</strong> planos de teste e relatos
              de bug estruturados (contexto, passos, evidências).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-dev" aria-hidden />
            <span>
              <strong className="text-slate-800 dark:text-slate-200">Suporte:</strong> converter relatos de clientes em
              documentação pronta para desenvolvimento e QA.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-req" aria-hidden />
            <span>
              <strong className="text-slate-800 dark:text-slate-200">Requisitos:</strong> documentar demandas e registrar
              a reunião Três Amigos (Líder, Dev, QA).
            </span>
          </li>
        </ul>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Os módulos ficam disponíveis apenas para usuários autenticados. Use <strong className="font-medium text-slate-700 dark:text-slate-300">Cadastro</strong> ou{" "}
          <strong className="font-medium text-slate-700 dark:text-slate-300">Entrar</strong> no canto superior direito da página.
        </p>
      </div>
    </div>
  );
}

function ModulosLogado() {
  return (
    <>
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100 sm:text-4xl">DocFlow</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 sm:text-lg">
          Sistema de geração de documentação para QA, Suporte e Requisitos e gestão de atividades.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {modules.map(({ href, title, description, explicacao, color, Icon }) => (
          <article
            key={href}
            className={`card flex h-full flex-col border-l-4 p-4 ${
              color === "accent-qa"
                ? "border-accent-qa"
                : color === "accent-dev"
                  ? "border-accent-dev"
                  : "border-accent-req"
            }`}
          >
            <Icon />
            <h2 className="mb-1.5 text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">{title}</h2>
            <p className="mb-1.5 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            <p className="mb-3 flex-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{explicacao}</p>
            <Link
              href={href}
              className="mt-auto flex w-full justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Acessar módulo
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}

export function HomeConteudo() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-col justify-center px-4 py-16" aria-busy="true">
        <div className="mx-auto h-48 max-w-lg animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/50" />
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Carregando…</p>
      </div>
    );
  }

  if (!user) {
    return <LandingVisitante />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col justify-center px-4 py-6">
      <ModulosLogado />
    </div>
  );
}
