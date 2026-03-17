"use client";

import { useId, useState, useEffect } from "react";
import { usePadraoIA } from "@/context/PadraoIAContext";

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
  const [erroDoc, setErroDoc] = useState("");
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
  const [erroReuniao, setErroReuniao] = useState("");
  const [sucessoReuniao, setSucessoReuniao] = useState("");

  async function handleGerarDocumentacao() {
    if (!cliente.trim() || !analistaRequisitos.trim()) {
      setErroDoc("Cliente e Analista de Requisitos são obrigatórios.");
      return;
    }
    setErroDoc("");
    setCarregandoDoc(true);
    try {
      const res = await fetch("/api/gerar/documentacao-requisitos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: cliente.trim(),
          analistaRequisitos: analistaRequisitos.trim(),
          requisitos: requisitos.trim() || undefined,
          padrao: padraoRequisitosDocumentacao?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao gerar.");
      setDocumento(data.documento);
    } catch (e) {
      setErroDoc(e instanceof Error ? e.message : "Erro ao gerar documentação.");
    } finally {
      setCarregandoDoc(false);
    }
  }

  async function handleRegistrarTresAmigos() {
    if (!lider.trim() || !desenvolvedor.trim() || !qa.trim() || !dataReuniao || !observacoes.trim()) {
      setErroReuniao(
        "Preencha todos os campos: Líder, Desenvolvedor, QA, Data da reunião e Observações."
      );
      return;
    }
    setErroReuniao("");
    setSucessoReuniao("");
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
          padrao: padraoRequisitosTresAmigos?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao registrar.");
      setSucessoReuniao("Decisão da reunião Três Amigos registrada com sucesso.");
    } catch (e) {
      setErroReuniao(
        e instanceof Error ? e.message : "Erro ao registrar decisão."
      );
    } finally {
      setCarregandoReuniao(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Módulo Requisitos
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gere documentação de requisitos (com Cliente e Analista) e registre a
          decisão da reunião Três Amigos (Líder, Dev, QA).
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
            <label className="label" htmlFor={requisitosId}>Requisitos coletados</label>
            <textarea
              id={requisitosId}
              className="input-field min-h-[140px] resize-y"
              placeholder="Descreva os requisitos, módulos, melhorias e alterações..."
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
            />
          </div>
          {erroDoc && (
            <p className="text-sm text-red-600 dark:text-red-400">{erroDoc}</p>
          )}
          <button
            type="button"
            onClick={handleGerarDocumentacao}
            disabled={carregandoDoc}
            className="btn-primary disabled:opacity-50"
          >
            {carregandoDoc ? "Gerando..." : "Gerar documentação"}
          </button>
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

      {mostrarCopiado && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg dark:border-green-800 dark:bg-green-900/50 dark:text-green-200"
        >
          Texto copiado com sucesso!
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          2. Reunião Três Amigos – Registrar decisão
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Após a reunião com Líder, Desenvolvedor e QA, registre os participantes e a data.
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
            <label className="label" htmlFor={observacoesId}>Observações *</label>
            <textarea
              id={observacoesId}
              className="input-field min-h-[80px] resize-y"
              placeholder="Observações da reunião..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
          {erroReuniao && (
            <p className="text-sm text-red-600 dark:text-red-400">{erroReuniao}</p>
          )}
          {sucessoReuniao && (
            <p className="text-sm text-green-700 dark:text-green-400">{sucessoReuniao}</p>
          )}
          <button
            type="button"
            onClick={handleRegistrarTresAmigos}
            disabled={carregandoReuniao}
            className="btn-primary disabled:opacity-50"
          >
            {carregandoReuniao ? "Registrando..." : "Registrar decisão"}
          </button>
        </div>
      </section>
    </div>
  );
}
