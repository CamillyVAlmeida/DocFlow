import { SignJWT, jwtVerify } from "jose";
import { SESSION_MAX_AGE_SEC, getAuthSecret } from "./auth-constants";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secret = new TextEncoder().encode(getAuthSecret());
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const secret = new TextEncoder().encode(getAuthSecret());
  const { payload } = await jwtVerify(token, secret);
  const sub = payload.sub;
  if (!sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
    throw new Error("Token inválido");
  }
  return { sub, email: payload.email, name: payload.name };
}
