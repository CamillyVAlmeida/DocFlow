import { mensagemErroDeCorpoJson } from "./mensagem-erro-api-cliente";

describe("mensagemErroDeCorpoJson", () => {
  it("retorna null para não-objeto", () => {
    expect(mensagemErroDeCorpoJson(null)).toBeNull();
    expect(mensagemErroDeCorpoJson(undefined)).toBeNull();
    expect(mensagemErroDeCorpoJson("x")).toBeNull();
  });

  it("prioriza campos conhecidos na raiz", () => {
    expect(mensagemErroDeCorpoJson({ erro: "e1" })).toBe("e1");
    expect(mensagemErroDeCorpoJson({ error: "e2" })).toBe("e2");
    expect(mensagemErroDeCorpoJson({ message: "m1" })).toBe("m1");
    expect(mensagemErroDeCorpoJson({ detail: "d1" })).toBe("d1");
    expect(mensagemErroDeCorpoJson({ description: "d2" })).toBe("d2");
    expect(mensagemErroDeCorpoJson({ msg: "m2" })).toBe("m2");
  });

  it("ignora strings só com espaço", () => {
    expect(mensagemErroDeCorpoJson({ message: "   " })).toBeNull();
  });

  it("lê message aninhado em erro ou error", () => {
    expect(mensagemErroDeCorpoJson({ erro: { message: "nested" } })).toBe("nested");
    expect(mensagemErroDeCorpoJson({ error: { message: "n2" } })).toBe("n2");
  });
});
