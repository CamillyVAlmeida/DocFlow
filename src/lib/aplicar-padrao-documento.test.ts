import { aplicarPadraoDocumento } from "./aplicar-padrao-documento";

describe("aplicarPadraoDocumento", () => {
  it("sem padrão retorna o documento base", () => {
    expect(aplicarPadraoDocumento("", "ctx", "# Base")).toBe("# Base");
    expect(aplicarPadraoDocumento(undefined, "ctx", "# Base")).toBe("# Base");
  });

  it("substitui {{contexto}}", () => {
    expect(aplicarPadraoDocumento("# T\n\n{{contexto}}", "olá", "ignorado")).toBe("# T\n\nolá");
    expect(aplicarPadraoDocumento("{{CONTEXTO}}", "x", "y")).toBe("x");
  });

  it("sem placeholder anexa seção com o contexto", () => {
    expect(aplicarPadraoDocumento("# P", "texto", "# Base")).toBe(
      "# P\n\n---\n\n## Conteúdo informado\n\ntexto"
    );
  });
});
