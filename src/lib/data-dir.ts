import path from "path";

/**
 * Diretório onde ficam users.json, projects.json e tasks.json.
 *
 * - Local: `<projeto>/data`
 * - Vercel / AWS Lambda: `/tmp/docflow-data` (único filesystem gravável; ver nota abaixo)
 * - Override: variável de ambiente `DOCFLOW_DATA_DIR` (caminho absoluto ou relativo ao cwd)
 *
 * Em ambientes serverless, `/tmp` é efêmero e não é compartilhado entre todas as instâncias
 * (cadastro/login podem parecer inconsistentes em produção sem banco de dados). Para uso
 * estável em produção, use persistência externa (ex.: Postgres, KV).
 */
export function getDataDir(): string {
  const fromEnv = process.env.DOCFLOW_DATA_DIR?.trim();
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.join(process.cwd(), fromEnv);
  }
  if (process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp/docflow-data";
  }
  return path.join(process.cwd(), "data");
}

export function dataFilePath(fileName: string): string {
  return path.join(getDataDir(), fileName);
}
