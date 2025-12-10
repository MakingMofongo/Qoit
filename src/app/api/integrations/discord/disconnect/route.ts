import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete the Discord integration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("integrations") as any)
    .delete()
    .eq("user_id", user.id)
    .eq("type", "discord");

  if (error) {
    console.error("Failed to disconnect Discord:", error);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

