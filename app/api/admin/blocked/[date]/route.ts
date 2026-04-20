import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { date } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("blocked_dates").delete().eq("date_key", date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
