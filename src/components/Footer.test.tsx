import { render, screen } from "@testing-library/react";
import React from "react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renderiza informações do site e autoria", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "DocFlow" })).toBeInTheDocument();
    expect(
      screen.getByText(/Sistema de geração de documentação/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Projeto acadêmico desenvolvido por/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Camilly Vitória/i })
    ).toBeInTheDocument();
  });
});

