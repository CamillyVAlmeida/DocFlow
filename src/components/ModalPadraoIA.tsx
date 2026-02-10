"use client";

import { useEffect, useState } from "react";
import { usePadraoIA } from "@/context/PadraoIAContext";

export function ModalPadraoIA() {
  const { isModalOpen, closeModal, savePadroes, padraoQA, padraoDevs, padraoRequisitos } =
    usePadraoIA();
  const [valorQA, setValorQA] = useState(padraoQA);
  const [valorDevs, setValorDevs] = useState(padraoDevs);
  const [valorRequisitos, setValorRequisitos] = useState(padraoRequisitos);

  useEffect(() => {
    if (isModalOpen) {
      setValorQA(padraoQA);
      setValorDevs(padraoDevs);
      setValorRequisitos(padraoRequisitos);
    }
  }, [isModalOpen, padraoQA, padraoDevs, padraoRequisitos]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  function handleSalvar() {
    savePadroes({
      qa: valorQA,
      devs: valorDevs,
      requisitos: valorRequisitos,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-padrao-title"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="modal-padrao-title"
          className="mb-2 text-xl font-semibold text-slate-800"
        >
          Configurar padrão da IA
        </h2>
        <p className="mb-6 text-sm text-slate-600">
          Defina o prompt ou as instruções que a IA deve seguir em cada módulo.
          Cada módulo usa seu próprio padrão ao gerar documentos.
        </p>

        <div className="space-y-5">
          <div>
            <label className="label font-medium text-slate-800">
              Padrão para módulo QA
            </label>
            <p className="mb-1 text-xs text-slate-500">
              Aplicado em: plano de testes, análise de causa raiz e documentação de novas funcionalidades.
            </p>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="Ex.: Use linguagem objetiva. Inclua sempre uma seção de riscos. Priorize cenários em tabela."
              value={valorQA}
              onChange={(e) => setValorQA(e.target.value)}
            />
          </div>

          <div>
            <label className="label font-medium text-slate-800">
              Padrão para módulo DEVs
            </label>
            <p className="mb-1 text-xs text-slate-500">
              Aplicado na geração da documentação de APIs.
            </p>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="Ex.: Inclua exemplos de request/response em JSON. Documente códigos de erro. Use tabelas para parâmetros."
              value={valorDevs}
              onChange={(e) => setValorDevs(e.target.value)}
            />
          </div>

          <div>
            <label className="label font-medium text-slate-800">
              Padrão para módulo Requisitos
            </label>
            <p className="mb-1 text-xs text-slate-500">
              Aplicado na documentação de requisitos (cliente, analista, módulos, melhorias).
            </p>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="Ex.: Estruture por prioridade. Inclua critérios de aceite por item. Use linguagem formal."
              value={valorRequisitos}
              onChange={(e) => setValorRequisitos(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button type="button" onClick={handleSalvar} className="btn-primary">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
