"use client";

import { GeradorDocumento } from "@/components/GeradorDocumento";

export default function SuportePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Módulo Suporte
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gere relatos de bug estruturados a partir do que os clientes reportam,
          para uso pelo time de suporte, desenvolvimento e QA.
        </p>
      </header>

      <GeradorDocumento
        titulo="Relato de bug (a partir do relato do cliente)"
        placeholder="Cole ou descreva o que o cliente reportou: mensagem, e-mail, chamado, descrição do problema, tela ou fluxo afetado..."
        endpoint="/api/gerar/relato-bug-cliente"
        labelBotao="Gerar relato de bug"
        modulo="suporte"
      />
    </div>
  );
}
