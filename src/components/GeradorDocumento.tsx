"use client";

import { useState, useEffect } from "react";
import { usePadraoIA } from "@/context/PadraoIAContext";

type ModuloPadrao = "qa" | "suporte";

type GeradorDocumentoProps = {
  titulo: string;
  placeholder: string;
  endpoint: string;
  labelBotao?: string;
  modulo: ModuloPadrao;
};

export function GeradorDocumento({
  titulo,
  placeholder,
  endpoint,
  labelBotao = "Gerar documentação",
  modulo,
}: GeradorDocumentoProps) {
  const { padraoQA, padraoSuporte } = usePadraoIA();
  const padrao = modulo === "qa" ? padraoQA : padraoSuporte;
  const [contexto, setContexto] = useState("");
  const [documento, setDocumento] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarCopiado, setMostrarCopiado] = useState(false);

  useEffect(() => {
    if (!mostrarCopiado) return;
    const t = setTimeout(() => setMostrarCopiado(false), 2500);
    return () => clearTimeout(t);
  }, [mostrarCopiado]);

  async function handleGerar() {
    if (!contexto.trim()) {
      setErro("Informe o contexto.");
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contexto: contexto.trim(),
          padrao: padrao?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao gerar.");
      setDocumento(data.documento);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao gerar documentação.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="card">
      <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{titulo}</h3>
      <label className="label">Contexto</label>
      <textarea
        className="input-field min-h-[120px] resize-y"
        placeholder={placeholder}
        value={contexto}
        onChange={(e) => setContexto(e.target.value)}
      />
      {erro && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erro}</p>}
      <button
        type="button"
        onClick={handleGerar}
        disabled={carregando}
        className="btn-primary mt-3 disabled:opacity-50"
      >
        {carregando ? "Gerando..." : labelBotao}
      </button>
      {documento && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Documento gerado</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(documento);
                setMostrarCopiado(true);
              }}
              className="btn-secondary text-sm"
            >
              Copiar
            </button>
          </div>
          <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {documento}
          </pre>
        </div>
      )}
      {mostrarCopiado && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg dark:border-green-800 dark:bg-green-900/50 dark:text-green-200"
        >
          Texto copiado com sucesso!
        </div>
      )}
    </div>
  );
}
