import { NextRequest, NextResponse } from "next/server";
import { adminCookieHeader } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": adminCookieHeader(password) } },
  );
}
