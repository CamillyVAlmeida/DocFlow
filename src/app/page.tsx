import Link from "next/link";

const modules = [
  {
    href: "/qa",
    title: "Módulo QA",
    description:
      "Plano de testes, análise de causa raiz e documentação de novas funcionalidades.",
    color: "accent-qa",
    icon: "✓",
  },
  {
    href: "/devs",
    title: "Módulo DEVs",
    description: "Geração de documentação de APIs a partir do contexto fornecido.",
    color: "accent-dev",
    icon: "{}",
  },
  {
    href: "/requisitos",
    title: "Módulo Requisitos",
    description:
      "Documentação de requisitos e fluxo da reunião Três Amigos (aprovação).",
    color: "accent-req",
    icon: "📋",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="mb-3 text-4xl font-bold text-slate-800">
          DocFlow
        </h1>
        <p className="text-lg text-slate-600">
          Sistema de geração de documentação para QA, DEVs e Requisitos
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {modules.map(({ href, title, description, color, icon }) => (
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
              <div className="mb-3 text-3xl">{icon}</div>
              <h2 className="mb-2 text-lg font-semibold text-slate-800">
                {title}
              </h2>
              <p className="text-slate-600">{description}</p>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}
