import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = await createClient();
  const [profile, settings, children, events] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("children").select("*").eq("user_id", user.id),
    supabase.from("events").select("*").is("archived_at", null),
  ]);
  const error =
    profile.error ?? settings.error ?? children.error ?? events.error;
  if (error)
    return NextResponse.json({ error: "export_failed" }, { status: 500 });
  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      profile: profile.data,
      settings: settings.data,
      children: children.data,
      events: events.data,
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="kidmemoir-export-${new Date().toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "private, no-store",
      },
    },
  );
}
