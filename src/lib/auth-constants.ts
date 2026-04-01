export const AUTH_COOKIE_NAME = "docflow_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 dias

/** Senha no cadastro e no login: exatamente este tamanho, apenas letras (A–Z, a–z) e números. */
export const CADASTRO_SENHA_COMPRIMENTO = 8;
export const CADASTRO_SENHA_REGEX = /^[A-Za-z0-9]{8}$/;

/** Remove caracteres que não sejam letra ou número e limita ao comprimento da senha. */
export function sanitizarSenhaAlfanumerica(valor: string): string {
  return valor.replace(/[^A-Za-z0-9]/g, "").slice(0, CADASTRO_SENHA_COMPRIMENTO);
}

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "docflow-dev-secret-altere-em-producao";
}
