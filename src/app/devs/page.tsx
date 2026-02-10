"use client";

import { GeradorDocumento } from "@/components/GeradorDocumento";

export default function DevsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Módulo DEVs</h1>
        <p className="text-slate-600">
          Gere documentação de API a partir do contexto de como a API funciona
          (endpoints, parâmetros, exemplos).
        </p>
      </header>

      <GeradorDocumento
        titulo="Documentação de API"
        placeholder="Descreva como a API funciona: endpoints, métodos, parâmetros, exemplos de request/response, regras de negócio..."
        endpoint="/api/gerar/documentacao-api"
        labelBotao="Gerar documentação da API"
        modulo="devs"
      />
    </div>
  );
}
