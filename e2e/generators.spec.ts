import { test, expect } from "@playwright/test";
import { createRandomQA, createRandomRequisitos } from "../src/test-utils/randomData";

test("QA: gera plano de testes e relato de bug (com mock de API)", async ({ page }) => {
  const qaData = createRandomQA();
  await page.route("**/api/gerar/plano-testes", async (route) => {
    const body = route.request().postDataJSON() as { contexto: string; padrao?: string };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        documento: `# Plano\n\nCTX:${body.contexto}\nPAD:${body.padrao ?? ""}`,
      }),
    });
  });

  await page.route("**/api/gerar/relato-bug", async (route) => {
    const body = route.request().postDataJSON() as { contexto: string; padrao?: string };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        documento: `# Bug\n\nCTX:${body.contexto}\nPAD:${body.padrao ?? ""}`,
      }),
    });
  });

  await page.goto("/qa");

  // 1) Plano de testes
  await page.getByRole("heading", { name: "1. Plano de Testes" }).scrollIntoViewIfNeeded();
  await page.getByLabel("Contexto").first().fill(qaData.contextoPlano);
  await page.getByRole("button", { name: /Gerar plano de testes/i }).click();
  await expect(page.getByText("Documento gerado").first()).toBeVisible();
  await expect(page.getByText(/# Plano/)).toBeVisible();

  // 2) Relato de bug
  await page.getByRole("heading", { name: "2. Relato de Bug" }).scrollIntoViewIfNeeded();
  await page.getByLabel("Contexto").nth(1).fill(qaData.contextoBug);
  await page.getByRole("button", { name: /Gerar relato de bug/i }).click();
  await expect(page.getByText(/# Bug/)).toBeVisible();
});

test("Requisitos: gera documentação (mock) e registra Três Amigos (mock)", async ({ page }) => {
  const dados = createRandomRequisitos();
  await page.route("**/api/gerar/documentacao-requisitos", async (route) => {
    const body = route.request().postDataJSON() as {
      cliente: string;
      analistaRequisitos: string;
      requisitos?: string;
      padrao?: string;
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        documento: `# Requisitos\n\nCliente:${body.cliente}\nAnalista:${body.analistaRequisitos}`,
      }),
    });
  });

  await page.route("**/api/tres-amigos", async (route) => {
    const body = route.request().postDataJSON() as {
      lider: string;
      desenvolvedor: string;
      qa: string;
      dataReuniao: string;
      observacoes: string;
      padrao?: string;
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        mensagem: "Decisão da reunião Três Amigos registrada com sucesso.",
        registro: { reuniaoTresAmigos: { participantes: body } },
        documento: `# Reunião\n\n${body.lider}/${body.desenvolvedor}/${body.qa}`,
      }),
    });
  });

  await page.goto("/requisitos");

  // Documentação
  await page.getByLabel(/Cliente \*/i).fill(dados.cliente);
  await page.getByLabel(/Analista de Requisitos \*/i).fill(dados.analista);
  await page.getByRole("button", { name: /Gerar documentação/i }).click();
  await expect(page.getByText(/# Requisitos/)).toBeVisible();

  // Reunião Três Amigos
  await page.getByLabel("Líder *").fill(dados.lider);
  await page.getByLabel("Desenvolvedor *").fill(dados.desenvolvedor);
  await page.getByLabel("QA *").fill(dados.qa);
  await page.getByLabel("Data da reunião *").fill(dados.dataReuniao);
  await page.getByLabel("Observações *").fill(dados.observacoes);
  await page.getByRole("button", { name: /Registrar decisão/i }).click();
  await expect(page.getByText(/registrada com sucesso/i)).toBeVisible();
});

