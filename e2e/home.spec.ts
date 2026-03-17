import { test, expect } from "@playwright/test";

test("home carrega e navega para módulos", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "DocFlow" })).toBeVisible();
  await expect(page.getByText(/Sistema de geração de documentação/i).first()).toBeVisible();

  await page.getByRole("link", { name: "QA" }).click();
  await expect(page).toHaveURL(/\/qa$/);
  await expect(page.getByRole("heading", { name: /Módulo QA/i })).toBeVisible();

  await page.getByRole("link", { name: "Suporte" }).click();
  await expect(page).toHaveURL(/\/suporte$/);
  await expect(page.getByRole("heading", { name: /Módulo Suporte/i })).toBeVisible();

  await page.getByRole("link", { name: "Requisitos" }).click();
  await expect(page).toHaveURL(/\/requisitos$/);
  await expect(page.getByRole("heading", { name: /Módulo Requisitos/i })).toBeVisible();
});

