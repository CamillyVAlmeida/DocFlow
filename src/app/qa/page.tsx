"use client";

import { GeradorDocumento } from "@/components/GeradorDocumento";
import { usePadraoIA } from "@/context/PadraoIAContext";

export default function QAPage() {
  const { padraoQAPlanoTestes, padraoQARelatoBug } = usePadraoIA();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Módulo QA
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gere planos de teste e relatos de bug com detalhes técnicos para o time
          de qualidade e desenvolvimento.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          1. Plano de testes
        </h2>
        <GeradorDocumento
          titulo="Plano de testes"
          mostrarTituloCard={false}
          placeholder="Descreva a funcionalidade, escopo e critérios de aceite para gerar o plano de testes..."
          endpoint="/api/gerar/plano-testes"
          labelBotao="Gerar plano de testes"
          padrao={padraoQAPlanoTestes}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          2. Relato de bug
        </h2>
        <GeradorDocumento
          titulo="Relato de bug"
          mostrarTituloCard={false}
          placeholder="Descreva o bug com detalhes técnicos: ambiente, passos para reproduzir, mensagens de erro, componente afetado, logs..."
          endpoint="/api/gerar/relato-bug"
          labelBotao="Gerar relato de bug"
          padrao={padraoQARelatoBug}
        />
      </section>
    </div>
  );
}
