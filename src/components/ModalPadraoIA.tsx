"use client";

import { useEffect, useId, useState } from "react";
import { usePadraoIA } from "@/context/PadraoIAContext";

export function ModalPadraoIA() {
  const {
    isModalOpen,
    modalSection,
    closeModal,
    savePadroes,
    padraoQAPlanoTestes,
    padraoQARelatoBug,
    padraoSuporte,
    padraoRequisitosDocumentacao,
    padraoRequisitosTresAmigos,
  } = usePadraoIA();
  const [valorQAPlanoTestes, setValorQAPlanoTestes] = useState(padraoQAPlanoTestes);
  const [valorQARelatoBug, setValorQARelatoBug] = useState(padraoQARelatoBug);
  const [valorSuporte, setValorSuporte] = useState(padraoSuporte);
  const [valorRequisitosDocumentacao, setValorRequisitosDocumentacao] =
    useState(padraoRequisitosDocumentacao);
  const [valorRequisitosTresAmigos, setValorRequisitosTresAmigos] =
    useState(padraoRequisitosTresAmigos);

  const idQAPlano = useId();
  const idQABug = useId();
  const idSuporte = useId();
  const idReqDoc = useId();
  const idReqTres = useId();

  useEffect(() => {
    if (isModalOpen) {
      setValorQAPlanoTestes(padraoQAPlanoTestes);
      setValorQARelatoBug(padraoQARelatoBug);
      setValorSuporte(padraoSuporte);
      setValorRequisitosDocumentacao(padraoRequisitosDocumentacao);
      setValorRequisitosTresAmigos(padraoRequisitosTresAmigos);
    }
  }, [
    isModalOpen,
    padraoQAPlanoTestes,
    padraoQARelatoBug,
    padraoSuporte,
    padraoRequisitosDocumentacao,
    padraoRequisitosTresAmigos,
  ]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    if (!isModalOpen || !modalSection) return;
    const id = `secao-${modalSection}`;
    const el = document.getElementById(id);
    if (el) {
      const t = requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(t);
    }
  }, [isModalOpen, modalSection]);

  if (!isModalOpen) return null;

  function handleSalvar() {
    savePadroes({
      qaPlanoTestes: valorQAPlanoTestes,
      qaRelatoBug: valorQARelatoBug,
      suporte: valorSuporte,
      requisitosDocumentacao: valorRequisitosDocumentacao,
      requisitosTresAmigos: valorRequisitosTresAmigos,
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-600 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="modal-padrao-title"
          className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100"
        >
          {modalSection === "qa"
            ? "Configurar padrão QA"
            : modalSection === "suporte"
              ? "Configurar padrão Suporte"
              : "Configurar padrão Requisitos"}
        </h2>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Defina o prompt ou as instruções que a IA deve seguir neste módulo.
        </p>

        <div className="space-y-5">
          {modalSection === "qa" && (
            <>
              <div id="secao-qa">
                <label
                  className="label font-medium text-slate-800 dark:text-slate-200"
                  htmlFor={idQAPlano}
                >
                  Padrão QA — Plano de Testes
                </label>
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                  Aplicado na geração do plano de testes.
                </p>
                <textarea
                  id={idQAPlano}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Defina aqui o padrão que a IA deve seguir para o plano de testes."
                  value={valorQAPlanoTestes}
                  onChange={(e) => setValorQAPlanoTestes(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="label font-medium text-slate-800 dark:text-slate-200"
                  htmlFor={idQABug}
                >
                  Padrão QA — Relato de Bug
                </label>
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                  Aplicado na geração do relato de bug encontrado pelo QA.
                </p>
                <textarea
                  id={idQABug}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Defina aqui o padrão que a IA deve seguir para o relato de bug."
                  value={valorQARelatoBug}
                  onChange={(e) => setValorQARelatoBug(e.target.value)}
                />
              </div>
            </>
          )}

          {modalSection === "suporte" && (
            <div id="secao-suporte">
              <label
                className="label font-medium text-slate-800 dark:text-slate-200"
                htmlFor={idSuporte}
              >
                Padrão para módulo Suporte
              </label>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                Aplicado na geração de relatos de bug a partir do relato do cliente.
              </p>
              <textarea
                id={idSuporte}
                className="input-field min-h-[100px] resize-y"
                placeholder="Defina aqui o padrão que a IA deve seguir para o relato de bug do cliente."
                value={valorSuporte}
                onChange={(e) => setValorSuporte(e.target.value)}
              />
            </div>
          )}

          {modalSection === "requisitos" && (
            <>
              <div id="secao-requisitos">
                <label
                  className="label font-medium text-slate-800 dark:text-slate-200"
                  htmlFor={idReqDoc}
                >
                  Padrão Requisitos — Documentação
                </label>
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                  Aplicado na geração da documentação de requisitos (cliente, analista, módulos, melhorias).
                </p>
                <textarea
                  id={idReqDoc}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Defina aqui o padrão que a IA deve seguir na documentação de requisitos."
                  value={valorRequisitosDocumentacao}
                  onChange={(e) => setValorRequisitosDocumentacao(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="label font-medium text-slate-800 dark:text-slate-200"
                  htmlFor={idReqTres}
                >
                  Padrão Requisitos — Reunião Três Amigos
                </label>
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                  Aplicado ao gerar a ata em Markdown da reunião Três Amigos (decisões, planejamento,
                  participantes). Se vazio, usa o padrão da documentação de requisitos acima.
                </p>
                <textarea
                  id={idReqTres}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Defina estrutura e tom da ata (ex.: seções, tabelas, nível de detalhe)."
                  value={valorRequisitosTresAmigos}
                  onChange={(e) => setValorRequisitosTresAmigos(e.target.value)}
                />
              </div>
            </>
          )}
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
