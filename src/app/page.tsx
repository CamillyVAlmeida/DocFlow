import Link from "next/link";

function IconQA() {
  return (
    <div className="mb-3 flex h-14 w-14 items-center justify-center">
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle
          cx="28"
          cy="28"
          r="24"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-accent-qa"
        />
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
    <div className="mb-3 flex h-14 w-14 items-center justify-center">
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* < */}
        <path
          d="M32 16L18 28l14 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-dev"
        />
        {/* > */}
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
    <div className="mb-3 flex h-14 w-14 items-center justify-center">
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M14 8h22l8 8v32H14V8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-req"
        />
        <path
          d="M44 16H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-accent-req"
        />
        <path
          d="M36 8v8h8l-8-8z"
          fill="currentColor"
          className="text-accent-req"
        />
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
    title: "Quality Assurance",
    description:
      "Plano de testes e relato de bug com detalhes técnicos.",
    color: "accent-qa",
    Icon: IconQA,
  },
  {
    href: "/suporte",
    title: "Suporte e Atendimento",
    description:
      "Geração de relatos de bug estruturados a partir dos relatos dos clientes.",
    color: "accent-dev",
    Icon: IconSuporte,
  },
  {
    href: "/requisitos",
    title: "Requisitos e Especificação",
    description:
      "Documentação de requisitos e especificações.",
    color: "accent-req",
    Icon: IconRequisitos,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="mb-3 text-4xl font-bold text-slate-800 dark:text-slate-100">
          DocFlow
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Sistema de geração de documentação para QA, Suporte e Requisitos
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {modules.map(({ href, title, description, color, Icon }) => (
          <Link key={href} href={href}>
            <article
              className={`card h-full border-l-4 ${
                color === "accent-qa"
                  ? "border-accent-qa"
                  : color === "accent-dev"
                    ? "border-accent-dev"
                    : "border-accent-req"
              }`}
            >
              <Icon />
              <h2 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
                {title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{description}</p>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}
