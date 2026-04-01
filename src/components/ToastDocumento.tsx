"use client";

import { useEffect, useRef } from "react";

export const MSG_DOCUMENTO_SUCESSO = "documento gerado com sucesso.";
export const MSG_DOCUMENTO_VALIDACAO = "informe os dados nos campos obrigatórios";
export const MSG_DOCUMENTO_ERRO_API = "erro ao gerar documento";

export type ToastDocumentoVariante = "sucesso" | "validacao" | "api" | null;

type ToastDocumentoProps = {
  variante: ToastDocumentoVariante;
  onFechar: () => void;
  /** Quando a API retorna texto (campo `erro`), substitui a mensagem genérica. */
  mensagemDetalhe?: string | null;
};

/**
 * Popup fixo para feedback de geração de documento (sucesso, validação ou falha de API).
 */
export function ToastDocumento({
  variante,
  onFechar,
  mensagemDetalhe,
}: ToastDocumentoProps) {
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;

  useEffect(() => {
    if (!variante) return;
    const t = setTimeout(() => onFecharRef.current(), 2500);
    return () => clearTimeout(t);
  }, [variante]);

  if (!variante) return null;

  const detalhe = mensagemDetalhe?.trim();
  const mensagem =
    variante === "sucesso"
      ? MSG_DOCUMENTO_SUCESSO
      : variante === "validacao"
        ? MSG_DOCUMENTO_VALIDACAO
        : variante === "api" && detalhe
          ? detalhe
          : MSG_DOCUMENTO_ERRO_API;

  const erro = variante !== "sucesso";

  return (
    <div
      role="alert"
      data-testid="toast-documento"
      className={
        erro
          ? "fixed bottom-6 left-1/2 z-[60] max-w-[min(100vw-2rem,28rem)] -translate-x-1/2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800 shadow-lg dark:border-red-800 dark:bg-red-900/50 dark:text-red-200 break-words"
          : "fixed bottom-6 left-1/2 z-[60] max-w-[min(100vw-2rem,28rem)] -translate-x-1/2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800 shadow-lg dark:border-green-800 dark:bg-green-900/50 dark:text-green-200"
      }
    >
      {mensagem}
    </div>
  );
}
