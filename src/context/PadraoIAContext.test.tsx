import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { PadraoIAProvider, usePadraoIA } from "./PadraoIAContext";

function Consumer() {
  const {
    padraoQAPlanoTestes,
    padraoQARelatoBug,
    padraoSuporte,
    padraoRequisitosDocumentacao,
    padraoRequisitosTresAmigos,
    savePadroes,
  } = usePadraoIA();

  return (
    <div>
      <div data-testid="qa-plano">{padraoQAPlanoTestes}</div>
      <div data-testid="qa-bug">{padraoQARelatoBug}</div>
      <div data-testid="suporte">{padraoSuporte}</div>
      <div data-testid="req-doc">{padraoRequisitosDocumentacao}</div>
      <div data-testid="req-tres">{padraoRequisitosTresAmigos}</div>

      <button
        type="button"
        onClick={() =>
          savePadroes({
            qaPlanoTestes: "PT",
            qaRelatoBug: "BUG",
            suporte: "SUP",
            requisitosDocumentacao: "REQDOC",
            requisitosTresAmigos: "REQ3",
          })
        }
      >
        salvar
      </button>
    </div>
  );
}

describe("PadraoIAContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("migra padrões legacy para QA e Requisitos quando os novos não existem", async () => {
    localStorage.setItem("docflow_padrao_qa", "LEGACY_QA");
    localStorage.setItem("docflow_padrao_requisitos", "LEGACY_REQ");

    render(
      <PadraoIAProvider>
        <Consumer />
      </PadraoIAProvider>
    );

    expect(await screen.findByTestId("qa-plano")).toHaveTextContent("LEGACY_QA");
    expect(screen.getByTestId("qa-bug")).toHaveTextContent("LEGACY_QA");
    expect(screen.getByTestId("req-doc")).toHaveTextContent("LEGACY_REQ");
    expect(screen.getByTestId("req-tres")).toHaveTextContent("LEGACY_REQ");
  });

  it("prioriza os padrões novos quando existirem", async () => {
    localStorage.setItem("docflow_padrao_qa", "LEGACY_QA");
    localStorage.setItem("docflow_padrao_qa_plano_testes", "NOVO_PT");
    localStorage.setItem("docflow_padrao_qa_relato_bug", "NOVO_BUG");

    localStorage.setItem("docflow_padrao_requisitos", "LEGACY_REQ");
    localStorage.setItem("docflow_padrao_requisitos_documentacao", "NOVO_REQDOC");
    localStorage.setItem("docflow_padrao_requisitos_tres_amigos", "NOVO_REQ3");

    render(
      <PadraoIAProvider>
        <Consumer />
      </PadraoIAProvider>
    );

    expect(await screen.findByTestId("qa-plano")).toHaveTextContent("NOVO_PT");
    expect(screen.getByTestId("qa-bug")).toHaveTextContent("NOVO_BUG");
    expect(screen.getByTestId("req-doc")).toHaveTextContent("NOVO_REQDOC");
    expect(screen.getByTestId("req-tres")).toHaveTextContent("NOVO_REQ3");
  });

  it("savePadroes atualiza estado e persiste no localStorage", async () => {
    const user = userEvent.setup();
    render(
      <PadraoIAProvider>
        <Consumer />
      </PadraoIAProvider>
    );

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(screen.getByTestId("qa-plano")).toHaveTextContent("PT");
    expect(localStorage.getItem("docflow_padrao_qa_plano_testes")).toBe("PT");
    expect(localStorage.getItem("docflow_padrao_qa_relato_bug")).toBe("BUG");
    expect(localStorage.getItem("docflow_padrao_suporte")).toBe("SUP");
    expect(localStorage.getItem("docflow_padrao_requisitos_documentacao")).toBe("REQDOC");
    expect(localStorage.getItem("docflow_padrao_requisitos_tres_amigos")).toBe("REQ3");
  });
});

