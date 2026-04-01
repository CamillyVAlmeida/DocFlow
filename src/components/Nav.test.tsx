import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Nav } from "./Nav";
import { ThemeProvider } from "@/context/ThemeContext";
import { PadraoIAProvider } from "@/context/PadraoIAContext";
import { AuthProvider } from "@/context/AuthContext";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("Nav", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: null }),
    } as Response);
  });

  it("exibe o botão de alternar tema e alterna para modo escuro", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <PadraoIAProvider>
          <AuthProvider>
            <Nav />
          </AuthProvider>
        </PadraoIAProvider>
      </ThemeProvider>
    );

    const btn = await screen.findByRole("button", { name: /modo escuro/i });
    await user.click(btn);

    expect(await screen.findByRole("button", { name: /modo claro/i })).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

