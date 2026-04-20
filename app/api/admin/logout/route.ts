import { NextResponse } from "next/server";
import { clearAdminCookieHeader } from "@/lib/admin-auth";

export async function POST() {
  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": clearAdminCookieHeader() } },
  );
}
