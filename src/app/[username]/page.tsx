import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfilePage } from "./profile-page";
import type { Profile } from "@/types/database";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single<Profile>();

  if (!profile) {
    return {
      title: "Not Found - Qoit",
    };
  }

  return {
    title: `${profile.display_name || profile.username} - Qoit`,
    description: profile.status_message || `${profile.display_name || profile.username}'s status page`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single<Profile>();

  if (!profile) {
    notFound();
  }

  return <ProfilePage profile={profile} />;
}

