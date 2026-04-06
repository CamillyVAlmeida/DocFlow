import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { GeradorDocumento } from "./GeradorDocumento";
import { MSG_DOCUMENTO_SUCESSO, MSG_DOCUMENTO_VALIDACAO } from "./ToastDocumento";
import { createRandomQA } from "@/test-utils/randomData";

describe("GeradorDocumento", () => {
  beforeEach(() => {
    global.fetch = undefined as typeof fetch;
    jest.clearAllMocks();
  });

  it("exibe popup quando contexto está vazio", async () => {
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
    expect(await screen.findByTestId("toast-documento")).toHaveTextContent(
      MSG_DOCUMENTO_VALIDACAO
    );
  });

  it("chama o endpoint com contexto e padrão e renderiza o documento ao sucesso", async () => {
    const user = userEvent.setup();
    const qaData = createRandomQA();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ documento: "DOC_OK" }),
    });
    global.fetch = fetchMock as typeof fetch;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="contexto"
        endpoint="/api/gerar"
        labelBotao="Gerar"
        padrao="  PAD  "
      />
    );

    await user.type(screen.getByLabelText(/^Contexto/), `  ${qaData.contextoPlano}  `);
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
    expect(await screen.findByTestId("toast-documento")).toHaveTextContent(
      MSG_DOCUMENTO_SUCESSO
    );
  });

  it("mostra mensagem de erro quando o endpoint retorna erro", async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => JSON.stringify({ erro: "Falhou" }),
    });
    global.fetch = fetchMock as typeof fetch;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="x"
        endpoint="/api/gerar"
        labelBotao="Gerar"
      />
    );

    await user.type(screen.getByLabelText(/^Contexto/), "CONTEXTO");
    await user.click(screen.getByRole("button", { name: "Gerar" }));

    expect(await screen.findByTestId("toast-documento")).toHaveTextContent("Falhou");
  });

  it("limpa contexto e documento gerado ao clicar em Limpar texto", async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ documento: "DOC_CLEAR" }),
    });
    global.fetch = fetchMock as typeof fetch;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="x"
        endpoint="/api/gerar"
        labelBotao="Gerar"
      />
    );

    const contexto = screen.getByLabelText(/^Contexto/);
    await user.type(contexto, "TEXTO");
    await user.click(screen.getByRole("button", { name: "Gerar" }));
    await screen.findByText("DOC_CLEAR");

    await user.click(screen.getByRole("button", { name: "Limpar texto" }));

    expect(contexto).toHaveValue("");
    expect(screen.queryByText("DOC_CLEAR")).not.toBeInTheDocument();
  });

  it("copia o documento para a área de transferência", async () => {
    const user = userEvent.setup();
    const writeSpy = jest.spyOn(navigator.clipboard, "writeText");
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ documento: "DOC_COPY" }),
    });
    global.fetch = fetchMock as typeof fetch;

    render(
      <GeradorDocumento
        titulo="Teste"
        placeholder="x"
        endpoint="/api/gerar"
        labelBotao="Gerar"
      />
    );

    await user.type(screen.getByLabelText(/^Contexto/), "CONTEXTO");
    await user.click(screen.getByRole("button", { name: "Gerar" }));
    await screen.findByText("DOC_COPY");

    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(writeSpy).toHaveBeenCalledWith("DOC_COPY");
    expect(
      await screen.findByText("Texto copiado com sucesso!")
    ).toBeInTheDocument();
  });
});

