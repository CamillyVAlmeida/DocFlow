"use client";

import { useId, useState, useEffect } from "react";
import { mensagemErroDeCorpoJson } from "@/lib/mensagem-erro-api-cliente";
import { ToastDocumento, type ToastDocumentoVariante } from "./ToastDocumento";

type GeradorDocumentoProps = {
  titulo: string;
  placeholder: string;
  endpoint: string;
  labelBotao?: string;
  padrao?: string;
  /** Quando false, o título não é exibido no card (útil quando a página já define o título na seção). */
  mostrarTituloCard?: boolean;
};

export function GeradorDocumento({
  titulo,
  placeholder,
  endpoint,
  labelBotao = "Gerar documentação",
  padrao,
  mostrarTituloCard = true,
}: GeradorDocumentoProps) {
  const contextoId = useId();
  const [contexto, setContexto] = useState("");
  const [documento, setDocumento] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [toastGeracao, setToastGeracao] = useState<ToastDocumentoVariante>(null);
  const [detalheErroApi, setDetalheErroApi] = useState<string | null>(null);
  const [mostrarCopiado, setMostrarCopiado] = useState(false);

  useEffect(() => {
    if (!mostrarCopiado) return;
    const t = setTimeout(() => setMostrarCopiado(false), 2500);
    return () => clearTimeout(t);
  }, [mostrarCopiado]);

  async function handleGerar() {
    if (!contexto.trim()) {
      setDetalheErroApi(null);
      setToastGeracao("validacao");
      return;
    }
    setCarregando(true);
    setDetalheErroApi(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contexto: contexto.trim(),
          padrao: padrao?.trim() || undefined,
        }),
      });
      const raw = await res.text();
      let data: unknown;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        const trecho = raw.replace(/\s+/g, " ").trim().slice(0, 320);
        setDetalheErroApi(
          trecho
            ? `Resposta não é JSON (HTTP ${res.status}): ${trecho}`
            : `Resposta vazia (HTTP ${res.status}). Verifique deploy e variáveis de ambiente no Netlify.`
        );
        setToastGeracao("api");
        return;
      }
      if (!res.ok) {
        const msg =
          mensagemErroDeCorpoJson(data) ??
          (res.status === 502 || res.status === 503
            ? `Erro HTTP ${res.status} (gateway ou função serverless indisponível/timeout). No Netlify: Site → Functions e o log do deploy.`
            : `Erro HTTP ${res.status}. A API não retornou mensagem em texto.`);
        setDetalheErroApi(msg);
        setToastGeracao("api");
        return;
      }
      const ok = data as { documento?: unknown };
      setDocumento(typeof ok.documento === "string" ? ok.documento : "");
      setToastGeracao("sucesso");
    } catch (err) {
      setDetalheErroApi(
        err instanceof Error ? err.message : "Falha de rede ao chamar a API."
      );
      setToastGeracao("api");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="card">
      {mostrarTituloCard && (
        <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{titulo}</h3>
      )}
      <label className="label" htmlFor={contextoId}>
        Contexto <span className="text-red-600 dark:text-red-400">*</span>
      </label>
      <textarea
        id={contextoId}
        className="input-field h-[200px] min-h-[200px] resize-y"
        placeholder={placeholder}
        value={contexto}
        onChange={(e) => setContexto(e.target.value)}
        required
        aria-required={true}
      />
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
      <ToastDocumento
        variante={toastGeracao}
        mensagemDetalhe={detalheErroApi}
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
    </div>
  );
}
