import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { GeradorDocumento } from "./GeradorDocumento";
import { createRandomQA } from "@/test-utils/randomData";

describe("GeradorDocumento", () => {
  beforeEach(() => {
    // @ts-expect-error - fetch is mocked in tests
    global.fetch = undefined;
    jest.clearAllMocks();
  });

  it("exibe erro quando contexto está vazio", async () => {
    const user = userEvent.setup();
    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="x"
        endpoint="/api/x"
        labelBotao="Gerar"
      />
    );

    await user.click(screen.getByRole("button", { name: "Gerar" }));
    expect(screen.getByText("Informe o contexto.")).toBeInTheDocument();
  });

  it("chama o endpoint com contexto e padrão e renderiza o documento ao sucesso", async () => {
    const user = userEvent.setup();
    const qaData = createRandomQA();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ documento: "DOC_OK" }),
    });
    // @ts-expect-error - assign fetch mock
    global.fetch = fetchMock;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="contexto"
        endpoint="/api/gerar"
        labelBotao="Gerar"
        padrao="  PAD  "
      />
    );

    await user.type(screen.getByLabelText("Contexto"), `  ${qaData.contextoPlano}  `);
    await user.click(screen.getByRole("button", { name: "Gerar" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(options.body)).toEqual({
      contexto: qaData.contextoPlano,
      padrao: "PAD",
    });

    expect(await screen.findByText("Documento gerado")).toBeInTheDocument();
    expect(screen.getByText("DOC_OK")).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando o endpoint retorna erro", async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ erro: "Falhou" }),
    });
    // @ts-expect-error - assign fetch mock
    global.fetch = fetchMock;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="x"
        endpoint="/api/gerar"
        labelBotao="Gerar"
      />
    );

    await user.type(screen.getByLabelText("Contexto"), "CONTEXTO");
    await user.click(screen.getByRole("button", { name: "Gerar" }));

    expect(await screen.findByText("Falhou")).toBeInTheDocument();
  });

  it("copia o documento para a área de transferência", async () => {
    const user = userEvent.setup();
    const writeSpy = jest.spyOn(navigator.clipboard, "writeText");
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ documento: "DOC_COPY" }),
    });
    // @ts-expect-error - assign fetch mock
    global.fetch = fetchMock;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="x"
        endpoint="/api/gerar"
        labelBotao="Gerar"
      />
    );

    await user.type(screen.getByLabelText("Contexto"), "CONTEXTO");
    await user.click(screen.getByRole("button", { name: "Gerar" }));
    await screen.findByText("DOC_COPY");

    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(writeSpy).toHaveBeenCalledWith("DOC_COPY");
    expect(await screen.findByRole("alert")).toHaveTextContent("Texto copiado com sucesso!");
  });
});

