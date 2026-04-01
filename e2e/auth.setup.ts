import { test as setup, expect } from "@playwright/test";

/** E-mail único por execução evita conflito com senha antiga em data/users.json */
const E2E_EMAIL = `e2e-playwright-${Date.now()}@docflow.test`;
/** 8 caracteres alfanuméricos (regra de cadastro) */
const E2E_PASSWORD = "E2eTest1";

setup("autenticar", async ({ page }) => {
  await page.goto("/cadastro");
  await page.locator("#cadastro-name").fill("Usuário E2E");
  await page.locator("#cadastro-email").fill(E2E_EMAIL);
  await page.locator("#cadastro-password").fill(E2E_PASSWORD);
  await page.locator("#cadastro-confirm").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: /Criar conta/i }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
  await page.context().storageState({ path: "e2e/.auth/user.json" });
});
