import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Sobre o site */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-primary-700 dark:text-primary-400"
            >
              DocFlow
            </Link>
            <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Sistema de geração de documentação para QA, Suporte e Requisitos.
              Desenvolvido com Next.js e Google Gemini.
            </p>
          </div>

          {/* Autoria / instituição */}
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Projeto acadêmico desenvolvido por:
            </p>
            <p className="mt-0.5">
              <Link
                href="https://www.linkedin.com/in/camilly-vit%C3%B3ria-almeida-884431265/"
                target="_blank"
                className="text-primary-700 dark:text-primary-400"
              >
                Camilly Vitória dos Santos Almeida
              </Link>
            </p>
            <p className="mt-0.5">
              Pontifícia Universidade Católica de Goiás — PUC Goiás
            </p>
            <p className="mt-1">
              © {currentYear} DocFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
