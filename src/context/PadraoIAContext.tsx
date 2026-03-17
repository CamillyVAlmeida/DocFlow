"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Legacy (antes o QA tinha um único padrão)
const STORAGE_QA_LEGACY = "docflow_padrao_qa";
// Novo: QA separado por tipo de documento
const STORAGE_QA_PLANO_TESTES = "docflow_padrao_qa_plano_testes";
const STORAGE_QA_RELATO_BUG = "docflow_padrao_qa_relato_bug";
const STORAGE_SUPORTE = "docflow_padrao_suporte";
// Legacy (antes Requisitos tinha um único padrão)
const STORAGE_REQUISITOS_LEGACY = "docflow_padrao_requisitos";
// Novo: Requisitos separado por fluxo
const STORAGE_REQUISITOS_DOCUMENTACAO = "docflow_padrao_requisitos_documentacao";
const STORAGE_REQUISITOS_TRES_AMIGOS = "docflow_padrao_requisitos_tres_amigos";

export type PadroesIA = {
  qaPlanoTestes: string;
  qaRelatoBug: string;
  suporte: string;
  requisitosDocumentacao: string;
  requisitosTresAmigos: string;
};

type PadraoIAContextType = {
  padraoQAPlanoTestes: string;
  padraoQARelatoBug: string;
  padraoSuporte: string;
  padraoRequisitosDocumentacao: string;
  padraoRequisitosTresAmigos: string;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  savePadroes: (padroes: PadroesIA) => void;
};

const PadraoIAContext = createContext<PadraoIAContextType | null>(null);

export function PadraoIAProvider({ children }: { children: ReactNode }) {
  const [padraoQAPlanoTestes, setPadraoQAPlanoTestes] = useState("");
  const [padraoQARelatoBug, setPadraoQARelatoBug] = useState("");
  const [padraoSuporte, setPadraoSuporte] = useState("");
  const [padraoRequisitosDocumentacao, setPadraoRequisitosDocumentacao] = useState("");
  const [padraoRequisitosTresAmigos, setPadraoRequisitosTresAmigos] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const qaPlano = localStorage.getItem(STORAGE_QA_PLANO_TESTES);
    const qaBug = localStorage.getItem(STORAGE_QA_RELATO_BUG);
    const qaLegacy = localStorage.getItem(STORAGE_QA_LEGACY);
    const suporte = localStorage.getItem(STORAGE_SUPORTE);
    const reqDoc = localStorage.getItem(STORAGE_REQUISITOS_DOCUMENTACAO);
    const reqTres = localStorage.getItem(STORAGE_REQUISITOS_TRES_AMIGOS);
    const reqLegacy = localStorage.getItem(STORAGE_REQUISITOS_LEGACY);

    // Migração: se existir apenas o padrão antigo, replica para os dois campos novos.
    if (qaPlano !== null) setPadraoQAPlanoTestes(qaPlano);
    else if (qaLegacy !== null) setPadraoQAPlanoTestes(qaLegacy);

    if (qaBug !== null) setPadraoQARelatoBug(qaBug);
    else if (qaLegacy !== null) setPadraoQARelatoBug(qaLegacy);

    if (suporte !== null) setPadraoSuporte(suporte);

    // Migração: se existir apenas o padrão antigo de requisitos, replica para os dois fluxos novos.
    if (reqDoc !== null) setPadraoRequisitosDocumentacao(reqDoc);
    else if (reqLegacy !== null) setPadraoRequisitosDocumentacao(reqLegacy);

    if (reqTres !== null) setPadraoRequisitosTresAmigos(reqTres);
    else if (reqLegacy !== null) setPadraoRequisitosTresAmigos(reqLegacy);
  }, []);

  const savePadroes = useCallback((padroes: PadroesIA) => {
    setPadraoQAPlanoTestes(padroes.qaPlanoTestes);
    setPadraoQARelatoBug(padroes.qaRelatoBug);
    setPadraoSuporte(padroes.suporte);
    setPadraoRequisitosDocumentacao(padroes.requisitosDocumentacao);
    setPadraoRequisitosTresAmigos(padroes.requisitosTresAmigos);
    localStorage.setItem(STORAGE_QA_PLANO_TESTES, padroes.qaPlanoTestes);
    localStorage.setItem(STORAGE_QA_RELATO_BUG, padroes.qaRelatoBug);
    localStorage.setItem(STORAGE_SUPORTE, padroes.suporte);
    localStorage.setItem(STORAGE_REQUISITOS_DOCUMENTACAO, padroes.requisitosDocumentacao);
    localStorage.setItem(STORAGE_REQUISITOS_TRES_AMIGOS, padroes.requisitosTresAmigos);
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <PadraoIAContext.Provider
      value={{
        padraoQAPlanoTestes,
        padraoQARelatoBug,
        padraoSuporte,
        padraoRequisitosDocumentacao,
        padraoRequisitosTresAmigos,
        isModalOpen,
        openModal,
        closeModal,
        savePadroes,
      }}
    >
      {children}
    </PadraoIAContext.Provider>
  );
}

export function usePadraoIA() {
  const ctx = useContext(PadraoIAContext);
  if (!ctx) throw new Error("usePadraoIA deve ser usado dentro de PadraoIAProvider");
  return ctx;
}
