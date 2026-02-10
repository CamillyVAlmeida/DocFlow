"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_QA = "docflow_padrao_qa";
const STORAGE_DEVS = "docflow_padrao_devs";
const STORAGE_REQUISITOS = "docflow_padrao_requisitos";

export type PadroesIA = {
  qa: string;
  devs: string;
  requisitos: string;
};

type PadraoIAContextType = {
  padraoQA: string;
  padraoDevs: string;
  padraoRequisitos: string;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  savePadroes: (padroes: PadroesIA) => void;
};

const PadraoIAContext = createContext<PadraoIAContextType | null>(null);

export function PadraoIAProvider({ children }: { children: ReactNode }) {
  const [padraoQA, setPadraoQA] = useState("");
  const [padraoDevs, setPadraoDevs] = useState("");
  const [padraoRequisitos, setPadraoRequisitos] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const qa = localStorage.getItem(STORAGE_QA);
    const devs = localStorage.getItem(STORAGE_DEVS);
    const req = localStorage.getItem(STORAGE_REQUISITOS);
    if (qa !== null) setPadraoQA(qa);
    if (devs !== null) setPadraoDevs(devs);
    if (req !== null) setPadraoRequisitos(req);
  }, []);

  const savePadroes = useCallback((padroes: PadroesIA) => {
    setPadraoQA(padroes.qa);
    setPadraoDevs(padroes.devs);
    setPadraoRequisitos(padroes.requisitos);
    localStorage.setItem(STORAGE_QA, padroes.qa);
    localStorage.setItem(STORAGE_DEVS, padroes.devs);
    localStorage.setItem(STORAGE_REQUISITOS, padroes.requisitos);
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <PadraoIAContext.Provider
      value={{
        padraoQA,
        padraoDevs,
        padraoRequisitos,
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
