"use client";

import { GeradorDocumento } from "@/components/GeradorDocumento";

export default function QAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Módulo QA</h1>
        <p className="text-slate-600">
          Gere planos de teste e análise de causa raiz.
        </p>
      </header>

      <div className="space-y-8">
        <GeradorDocumento
          titulo="1. Plano de Testes"
          placeholder="Descreva a funcionalidade, escopo e critérios de aceite para gerar o plano de testes..."
          endpoint="/api/gerar/plano-testes"
          labelBotao="Gerar plano de testes"
          modulo="qa"
        />

        <GeradorDocumento
          titulo="2. Análise de Causa Raiz"
          placeholder="Descreva o bug, passos para reproduzir, ambiente e qualquer informação relevante..."
          endpoint="/api/gerar/causa-raiz"
          labelBotao="Gerar análise de causa raiz"
          modulo="qa"
        />
      </div>
    </div>
  );
}
