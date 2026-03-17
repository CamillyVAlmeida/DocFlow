import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        toggle
      </button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("carrega o tema do localStorage e aplica a classe 'dark' no <html>", async () => {
    localStorage.setItem("docflow-theme", "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    // efeito roda após mount
    expect(await screen.findByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("alterna tema e persiste em localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    expect(await screen.findByTestId("theme")).toHaveTextContent("light");

    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(localStorage.getItem("docflow-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

