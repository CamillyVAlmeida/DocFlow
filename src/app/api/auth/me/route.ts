import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { verifySessionToken } from "@/lib/session";

export async function GET() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }
  try {
    const payload = await verifySessionToken(token);
    return NextResponse.json({
      user: { id: payload.sub, email: payload.email, name: payload.name },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
