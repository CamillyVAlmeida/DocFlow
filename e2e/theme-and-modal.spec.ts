import { test, expect } from "@playwright/test";

test("toggle de tema não quebra e persiste", async ({ page }) => {
  await page.goto("/");

  const html = page.locator("html");
  const btn = page.getByRole("button", { name: /modo escuro/i });

  await expect(html).not.toHaveClass(/dark/);
  await btn.click();
  await expect(page.getByRole("button", { name: /modo claro/i })).toBeVisible();
  await expect(html).toHaveClass(/dark/);

  // Recarrega: deve manter o tema via localStorage
  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test("modal de Configuração de IA abre e salva padrões", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Configuração de IA/i }).click();
  await expect(page.getByRole("heading", { name: /Configurar padrão da IA/i })).toBeVisible();

  await page.getByLabel(/Padrão QA — Plano de Testes/i).fill("PAD_QA_PLANO");
  await page.getByLabel(/Padrão QA — Relato de Bug/i).fill("PAD_QA_BUG");
  await page.getByLabel(/Padrão para módulo Suporte/i).fill("PAD_SUPORTE");
  await page.getByLabel(/Padrão Requisitos — Documentação/i).fill("PAD_REQ_DOC");
  await page.getByLabel(/Padrão Requisitos — Reunião Três Amigos/i).fill("PAD_REQ_3");

  await page.getByRole("button", { name: "Salvar" }).click();

  // Modal fecha
  await expect(page.getByRole("heading", { name: /Configurar padrão da IA/i })).toHaveCount(0);

  // Confere persistência no navegador
  const stored = await page.evaluate(() => ({
    qaPlano: localStorage.getItem("docflow_padrao_qa_plano_testes"),
    qaBug: localStorage.getItem("docflow_padrao_qa_relato_bug"),
    suporte: localStorage.getItem("docflow_padrao_suporte"),
    reqDoc: localStorage.getItem("docflow_padrao_requisitos_documentacao"),
    req3: localStorage.getItem("docflow_padrao_requisitos_tres_amigos"),
  }));

  expect(stored).toEqual({
    qaPlano: "PAD_QA_PLANO",
    qaBug: "PAD_QA_BUG",
    suporte: "PAD_SUPORTE",
    reqDoc: "PAD_REQ_DOC",
    req3: "PAD_REQ_3",
  });
});

