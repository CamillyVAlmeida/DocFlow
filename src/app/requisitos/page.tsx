"use client";

import { useId, useState, useEffect } from "react";
import { usePadraoIA } from "@/context/PadraoIAContext";
import {
  ToastDocumento,
  type ToastDocumentoVariante,
} from "@/components/ToastDocumento";

export default function RequisitosPage() {
  const { padraoRequisitosDocumentacao, padraoRequisitosTresAmigos } = usePadraoIA();

  const clienteId = useId();
  const analistaId = useId();
  const requisitosId = useId();
  const liderId = useId();
  const desenvolvedorId = useId();
  const qaId = useId();
  const dataReuniaoId = useId();
  const observacoesId = useId();

  const [cliente, setCliente] = useState("");
  const [analistaRequisitos, setAnalistaRequisitos] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [documento, setDocumento] = useState("");
  const [carregandoDoc, setCarregandoDoc] = useState(false);
  const [toastGeracao, setToastGeracao] = useState<ToastDocumentoVariante>(null);
  const [mostrarCopiado, setMostrarCopiado] = useState(false);

  useEffect(() => {
    if (!mostrarCopiado) return;
    const t = setTimeout(() => setMostrarCopiado(false), 2500);
    return () => clearTimeout(t);
  }, [mostrarCopiado]);

  const [lider, setLider] = useState("");
  const [desenvolvedor, setDesenvolvedor] = useState("");
  const [qa, setQa] = useState("");
  const [dataReuniao, setDataReuniao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [carregandoReuniao, setCarregandoReuniao] = useState(false);
  const [documentoReuniao, setDocumentoReuniao] = useState("");

  async function handleGerarDocumentacao() {
    if (
      !cliente.trim() ||
      !analistaRequisitos.trim() ||
      !requisitos.trim()
    ) {
      setToastGeracao("validacao");
      return;
    }
    setCarregandoDoc(true);
    try {
      const res = await fetch("/api/gerar/documentacao-requisitos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: cliente.trim(),
          analistaRequisitos: analistaRequisitos.trim(),
          requisitos: requisitos.trim(),
          padrao: padraoRequisitosDocumentacao?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToastGeracao("api");
        return;
      }
      setDocumento(data.documento);
      setToastGeracao("sucesso");
    } catch {
      setToastGeracao("api");
    } finally {
      setCarregandoDoc(false);
    }
  }

  async function handleRegistrarTresAmigos() {
    if (!lider.trim() || !desenvolvedor.trim() || !qa.trim() || !dataReuniao || !observacoes.trim()) {
      setToastGeracao("validacao");
      return;
    }
    setCarregandoReuniao(true);
    try {
      const res = await fetch("/api/tres-amigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lider: lider.trim(),
          desenvolvedor: desenvolvedor.trim(),
          qa: qa.trim(),
          dataReuniao: dataReuniao,
          observacoes: observacoes.trim(),
          padrao:
            padraoRequisitosTresAmigos?.trim() ||
            padraoRequisitosDocumentacao?.trim() ||
            undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToastGeracao("api");
        return;
      }
      setDocumentoReuniao(typeof data.documento === "string" ? data.documento : "");
      setToastGeracao("sucesso");
    } catch {
      setToastGeracao("api");
    } finally {
      setCarregandoReuniao(false);
    }
  }

  function handleLimparDocumentacao() {
    setCliente("");
    setAnalistaRequisitos("");
    setRequisitos("");
    setDocumento("");
    setToastGeracao(null);
  }

  function handleLimparTresAmigos() {
    setLider("");
    setDesenvolvedor("");
    setQa("");
    setDataReuniao("");
    setObservacoes("");
    setDocumentoReuniao("");
    setToastGeracao(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Módulo Requisitos
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gere documentação de requisitos (com Cliente e Analista) e produza a ata da reunião Três
          Amigos (Líder, Dev, QA) com base nas notas e no padrão de requisitos.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          1. Gerar documentação de requisitos
        </h2>
        <div className="card space-y-4">
          <div>
            <label className="label" htmlFor={clienteId}>Cliente *</label>
            <input
              id={clienteId}
              type="text"
              className="input-field"
              placeholder="Nome do cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor={analistaId}>Analista de Requisitos *</label>
            <input
              id={analistaId}
              type="text"
              className="input-field"
              placeholder="Nome do analista"
              value={analistaRequisitos}
              onChange={(e) => setAnalistaRequisitos(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor={requisitosId}>
              Requisitos coletados <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <textarea
              id={requisitosId}
              className="input-field min-h-[140px] resize-y"
              placeholder="Descreva os requisitos, módulos, melhorias e alterações..."
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              required
              aria-required={true}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGerarDocumentacao}
              disabled={carregandoDoc}
              className="btn-primary disabled:opacity-50"
            >
              {carregandoDoc ? "Gerando..." : "Gerar documentação"}
            </button>
            <button
              type="button"
              onClick={handleLimparDocumentacao}
              disabled={carregandoDoc}
              className="btn-secondary disabled:opacity-50"
            >
              Limpar texto
            </button>
          </div>
          {documento && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Documento gerado
                </span>
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
              <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                {documento}
              </pre>
            </div>
          )}
        </div>
      </section>

      <ToastDocumento
        variante={toastGeracao}
        onFechar={() => setToastGeracao(null)}
      />
      {mostrarCopiado && (
        <div
          role="alert"
          className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg dark:border-green-800 dark:bg-green-900/50 dark:text-green-200"
        >
          Texto copiado com sucesso!
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          2. Reunião Três Amigos – Gerar ata
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Informe participantes, data e notas sobre decisões e planejamento da reunião. O sistema gera
          um texto estruturado seguindo o padrão de requisitos (em &quot;Personalização&quot;:
          usa o padrão da reunião Três Amigos; se estiver vazio, o padrão da documentação de
          requisitos).
        </p>
        <div className="card space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor={liderId}>Líder *</label>
              <input
                id={liderId}
                type="text"
                className="input-field"
                placeholder="Nome do líder"
                value={lider}
                onChange={(e) => setLider(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor={desenvolvedorId}>Desenvolvedor *</label>
              <input
                id={desenvolvedorId}
                type="text"
                className="input-field"
                placeholder="Nome do dev"
                value={desenvolvedor}
                onChange={(e) => setDesenvolvedor(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor={qaId}>QA *</label>
              <input
                id={qaId}
                type="text"
                className="input-field"
                placeholder="Nome do QA"
                value={qa}
                onChange={(e) => setQa(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor={dataReuniaoId}>Data da reunião *</label>
            <input
              id={dataReuniaoId}
              type="date"
              className="input-field"
              value={dataReuniao}
              onChange={(e) => setDataReuniao(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor={observacoesId}>Notas da reunião *</label>
            <textarea
              id={observacoesId}
              className="input-field min-h-[120px] resize-y"
              placeholder="Decisões tomadas, planejamento, pontos discutidos, pendências, alinhamentos..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRegistrarTresAmigos}
              disabled={carregandoReuniao}
              className="btn-primary disabled:opacity-50"
            >
              {carregandoReuniao ? "Gerando ata..." : "Gerar ata da reunião"}
            </button>
            <button
              type="button"
              onClick={handleLimparTresAmigos}
              disabled={carregandoReuniao}
              className="btn-secondary disabled:opacity-50"
            >
              Limpar texto
            </button>
          </div>
          {documentoReuniao && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Ata da reunião gerada
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(documentoReuniao);
                    setMostrarCopiado(true);
                  }}
                  className="btn-secondary text-sm"
                >
                  Copiar
                </button>
              </div>
              <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                {documentoReuniao}
              </pre>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
