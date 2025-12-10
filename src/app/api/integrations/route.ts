import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET all integrations for the current user
export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all integrations for this user (don't expose access tokens to client)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: integrations, error } = await (supabase.from("integrations") as any)
    .select("id, type, team_name, is_active, created_at, updated_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to fetch integrations:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ integrations: integrations || [] });
}

