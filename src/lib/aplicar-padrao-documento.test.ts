import { aplicarPadraoDocumento } from "./aplicar-padrao-documento";

describe("aplicarPadraoDocumento", () => {
  it("sem padrão retorna o documento base", () => {
    expect(aplicarPadraoDocumento("", "ctx", "Documento base")).toBe("Documento base");
    expect(aplicarPadraoDocumento(undefined, "ctx", "Documento base")).toBe("Documento base");
  });

  it("substitui {{contexto}}", () => {
    expect(aplicarPadraoDocumento("Título\n\n{{contexto}}", "olá", "ignorado")).toBe("Título\n\nolá");
    expect(aplicarPadraoDocumento("{{CONTEXTO}}", "x", "y")).toBe("x");
  });

  it("sem placeholder anexa seção com o contexto", () => {
    expect(aplicarPadraoDocumento("Padrão do usuário", "texto", "Base")).toBe(
      "Padrão do usuário\n\n---\n\nCONTEÚDO INFORMADO\n------------------\ntexto"
    );
  });
});
