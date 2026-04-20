import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

export async function GET() {
  const supabase = createAdminClient();

  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    supabase.from("bookings").select("date_keys, status").in("status", ["pending", "confirmed"]),
    supabase.from("blocked_dates").select("date_key"),
  ]);

  const pending: string[] = [];
  const confirmed: string[] = [];

  for (const b of bookings ?? []) {
    for (const key of b.date_keys as string[]) {
      if (b.status === "pending") pending.push(key);
      else if (b.status === "confirmed") confirmed.push(key);
    }
  }

  return NextResponse.json({
    pending,
    confirmed,
    blocked: (blocked ?? []).map((b) => b.date_key as string),
  });
}
