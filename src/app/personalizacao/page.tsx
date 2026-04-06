"use client";

import { useEffect, useId, useState } from "react";
import { usePadraoIA } from "@/context/PadraoIAContext";

export default function PersonalizacaoPage() {
  const {
    padraoQAPlanoTestes,
    padraoQARelatoBug,
    padraoSuporte,
    padraoRequisitosDocumentacao,
    padraoRequisitosTresAmigos,
    savePadroes,
  } = usePadraoIA();

  const [valorQAPlanoTestes, setValorQAPlanoTestes] = useState(padraoQAPlanoTestes);
  const [valorQARelatoBug, setValorQARelatoBug] = useState(padraoQARelatoBug);
  const [valorSuporte, setValorSuporte] = useState(padraoSuporte);
  const [valorRequisitosDocumentacao, setValorRequisitosDocumentacao] =
    useState(padraoRequisitosDocumentacao);
  const [valorRequisitosTresAmigos, setValorRequisitosTresAmigos] =
    useState(padraoRequisitosTresAmigos);
  const [salvo, setSalvo] = useState(false);

  const idQAPlano = useId();
  const idQABug = useId();
  const idSuporte = useId();
  const idReqDoc = useId();
  const idReqTres = useId();

  useEffect(() => {
    setValorQAPlanoTestes(padraoQAPlanoTestes);
    setValorQARelatoBug(padraoQARelatoBug);
    setValorSuporte(padraoSuporte);
    setValorRequisitosDocumentacao(padraoRequisitosDocumentacao);
    setValorRequisitosTresAmigos(padraoRequisitosTresAmigos);
  }, [
    padraoQAPlanoTestes,
    padraoQARelatoBug,
    padraoSuporte,
    padraoRequisitosDocumentacao,
    padraoRequisitosTresAmigos,
  ]);

  useEffect(() => {
    if (!salvo) return;
    const t = setTimeout(() => setSalvo(false), 3500);
    return () => clearTimeout(t);
  }, [salvo]);

  function handleSalvar() {
    savePadroes({
      qaPlanoTestes: valorQAPlanoTestes,
      qaRelatoBug: valorQARelatoBug,
      suporte: valorSuporte,
      requisitosDocumentacao: valorRequisitosDocumentacao,
      requisitosTresAmigos: valorRequisitosTresAmigos,
    });
    setSalvo(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Personalização
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Defina em um só lugar os padrões de texto usados na geração de documentos do QA, do Suporte
          e de Requisitos. Opcional: use{" "}
          <code className="rounded bg-slate-200 px-1 text-sm dark:bg-slate-700">{"{{contexto}}"}</code>{" "}
          onde o conteúdo dos formulários deve aparecer; se não houver esse placeholder, o contexto é
          anexado ao final do padrão, na seção &quot;Conteúdo informado&quot;.
        </p>
      </header>

      <div className="card space-y-10">
        <section aria-labelledby="personalizacao-qa">
          <h2
            id="personalizacao-qa"
            className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            QA
          </h2>
          <div className="space-y-5">
            <div>
              <label className="label font-medium text-slate-800 dark:text-slate-200" htmlFor={idQAPlano}>
                Plano de testes
              </label>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                Aplicado na geração do plano de testes (módulo QA).
              </p>
              <textarea
                id={idQAPlano}
                className="input-field min-h-[100px] resize-y"
                placeholder="Opcional: modelo em texto (use {{contexto}} para inserir o texto do campo Contexto)."
                value={valorQAPlanoTestes}
                onChange={(e) => setValorQAPlanoTestes(e.target.value)}
              />
            </div>
            <div>
              <label className="label font-medium text-slate-800 dark:text-slate-200" htmlFor={idQABug}>
                Relato de bug
              </label>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                Aplicado na geração do relato de bug encontrado pelo QA.
              </p>
              <textarea
                id={idQABug}
                className="input-field min-h-[100px] resize-y"
                placeholder="Opcional: modelo em texto (use {{contexto}} para inserir o texto do campo Contexto)."
                value={valorQARelatoBug}
                onChange={(e) => setValorQARelatoBug(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="personalizacao-suporte">
          <h2
            id="personalizacao-suporte"
            className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            Suporte
          </h2>
          <div>
            <label className="label font-medium text-slate-800 dark:text-slate-200" htmlFor={idSuporte}>
              Relato de bug (a partir do cliente)
            </label>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Aplicado na geração de relatos de bug a partir do relato do cliente (módulo Suporte).
            </p>
            <textarea
              id={idSuporte}
              className="input-field min-h-[100px] resize-y"
              placeholder="Opcional: modelo em texto (use {{contexto}} para inserir o relato do cliente)."
              value={valorSuporte}
              onChange={(e) => setValorSuporte(e.target.value)}
            />
          </div>
        </section>

        <section aria-labelledby="personalizacao-requisitos">
          <h2
            id="personalizacao-requisitos"
            className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            Requisitos
          </h2>
          <div className="space-y-5">
            <div>
              <label className="label font-medium text-slate-800 dark:text-slate-200" htmlFor={idReqDoc}>
                Documentação de requisitos
              </label>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                Aplicado na geração da documentação (cliente, analista, requisitos coletados).
              </p>
              <textarea
                id={idReqDoc}
                className="input-field min-h-[100px] resize-y"
                placeholder="Opcional: modelo em texto (use {{contexto}} para dados cliente/analista/requisitos)."
                value={valorRequisitosDocumentacao}
                onChange={(e) => setValorRequisitosDocumentacao(e.target.value)}
              />
            </div>
            <div>
              <label className="label font-medium text-slate-800 dark:text-slate-200" htmlFor={idReqTres}>
                Reunião Três Amigos (ata)
              </label>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                Aplicado ao gerar a ata da reunião. Se vazio, o fluxo pode usar o padrão da documentação
                acima.
              </p>
              <textarea
                id={idReqTres}
                className="input-field min-h-[100px] resize-y"
                placeholder="Defina estrutura e tom da ata (ex.: seções, nível de detalhe)."
                value={valorRequisitosTresAmigos}
                onChange={(e) => setValorRequisitosTresAmigos(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-600">
          {salvo ? (
            <p className="mr-auto text-sm font-medium text-green-700 dark:text-green-400" role="status">
              Padrões salvos no navegador.
            </p>
          ) : null}
          <button type="button" onClick={handleSalvar} className="btn-primary">
            Salvar padrões
          </button>
        </div>
      </div>
    </div>
  );
}
