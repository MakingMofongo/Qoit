"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Profile, Message, StatusMode, IntegrationType } from "@/types/database";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { BackAtPicker } from "@/components/ui/back-at-picker";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings, MessageSquare, ChevronDown, ChevronUp, Trash2, Link2, Unlink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface DashboardClientProps {
  user: User;
  profile: Profile | null;
  messages: Message[];
}

interface IntegrationInfo {
  id: string;
  type: IntegrationType;
  team_name: string | null;
  is_active: boolean;
  created_at: string;
}

const INTEGRATION_CONFIG: Record<IntegrationType, { name: string; icon: React.ReactNode; description: string; available: boolean }> = {
  slack: {
    name: "Slack",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
    description: "Sync your status to Slack",
    available: true,
  },
  google_calendar: {
    name: "Google Calendar",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15c0 .825.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zm0 16.5h-15V8h15v11.5zM7.5 10.5h3v3h-3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3z"/>
      </svg>
    ),
    description: "Block focus time on your calendar",
    available: true,
  },
  discord: {
    name: "Discord",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    description: "Post status updates to a channel",
    available: true,
  },
};

const STATUS_OPTIONS: { 
  id: StatusMode; 
  label: string; 
  emoji: string; 
  color: string;
  defaults: { email: string; dm: string; urgent: string };
}[] = [
  { 
    id: "available", 
    label: "Available", 
    emoji: "✓", 
    color: "#22c55e",
    defaults: { email: "~1h", dm: "~30min", urgent: "Call" }
  },
  { 
    id: "qoit", 
    label: "Qoit", 
    emoji: "🌙", 
    color: "#4a5d4a",
    defaults: { email: "~24-48h", dm: "~12h", urgent: "Call" }
  },
  { 
    id: "focused", 
    label: "Deep Work", 
    emoji: "⚡", 
    color: "#c9a962",
    defaults: { email: "~4h", dm: "~2h", urgent: "Text" }
  },
  { 
    id: "away", 
    label: "Away", 
    emoji: "✈️", 
    color: "#a85d5d",
    defaults: { email: "When back", dm: "When back", urgent: "Emergency only" }
  },
];

export function DashboardClient({ user, profile: initialProfile, messages: initialMessages }: DashboardClientProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [messages] = useState<Message[]>(initialMessages);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationInfo[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form state
  const [status, setStatus] = useState<StatusMode>(profile?.status || "available");
  const [statusMessage, setStatusMessage] = useState(profile?.status_message || "");
  const [backAt, setBackAt] = useState<Date | null>(profile?.back_at ? new Date(profile.back_at) : null);
  const [emailTime, setEmailTime] = useState(profile?.email_response_time || "~24h");
  const [dmTime, setDmTime] = useState(profile?.dm_response_time || "~4h");
  const [urgentMethod, setUrgentMethod] = useState(profile?.urgent_method || "Call");
  
  // Settings form state
  const [username, setUsername] = useState(profile?.username || "");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");

  // Fetch integrations
  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch("/api/integrations");
      const data = await res.json();
      setIntegrations(data.integrations || []);
    } catch (err) {
      console.error("Failed to fetch integrations:", err);
    } finally {
      setLoadingIntegrations(false);
    }
  }, []);

  // Sync status to all connected integrations
  const syncToIntegrations = useCallback(async (newStatus: StatusMode, newMessage: string | null, newBackAt: Date | null) => {
    if (integrations.length === 0) return;
    
    setSyncing(true);
    try {
      const res = await fetch("/api/integrations/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          statusMessage: newMessage,
          backAt: newBackAt?.toISOString() || null,
        }),
      });
      
      const data = await res.json();
      
      if (data.success && data.integrationCount > 0) {
        // Check if any syncs failed
        const failed = Object.entries(data.synced || {}).filter(([, result]) => !(result as { success: boolean }).success);
        if (failed.length > 0) {
          console.warn("Some syncs failed:", failed);
        }
      }
    } catch (err) {
      console.error("Failed to sync to integrations:", err);
    } finally {
      setSyncing(false);
    }
  }, [integrations.length]);

  // Load integrations on mount
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Handle OAuth callback notifications
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    
    if (success === "slack_connected") {
      setNotification({ type: "success", message: "Slack connected! Your status will now sync." });
      fetchIntegrations();
      router.replace("/dashboard");
    } else if (success === "google_calendar_connected") {
      setNotification({ type: "success", message: "Google Calendar connected! Focus blocks will be created when you go quiet." });
      fetchIntegrations();
      router.replace("/dashboard");
    } else if (success === "discord_connected") {
      setNotification({ type: "success", message: "Discord connected! Status updates will post to your channel." });
      fetchIntegrations();
      router.replace("/dashboard");
    } else if (error) {
      const errorMessages: Record<string, string> = {
        slack_auth_failed: "Slack authentication failed. Please try again.",
        slack_not_configured: "Slack integration is not configured.",
        google_auth_failed: "Google authentication failed. Please try again.",
        google_not_configured: "Google Calendar integration is not configured.",
        discord_auth_failed: "Discord authentication failed. Please try again.",
        discord_not_configured: "Discord integration is not configured.",
        invalid_oauth_response: "Invalid OAuth response.",
        oauth_expired: "OAuth session expired. Please try again.",
      };
      setNotification({ type: "error", message: errorMessages[error] || "An error occurred." });
      router.replace("/dashboard");
    }
    
    // Auto-dismiss notification after 5 seconds
    if (success || error) {
      setTimeout(() => setNotification(null), 5000);
    }
  }, [searchParams, fetchIntegrations, router]);

  // Disconnect an integration
  const disconnectIntegration = async (type: IntegrationType) => {
    try {
      const res = await fetch(`/api/integrations/${type}/disconnect`, { method: "POST" });
      if (res.ok) {
        setIntegrations(prev => prev.filter(i => i.type !== type));
        setNotification({ type: "success", message: `${INTEGRATION_CONFIG[type].name} disconnected.` });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  const getIntegration = (type: IntegrationType) => integrations.find(i => i.type === type);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const updateStatus = async (newStatus: StatusMode) => {
    const option = STATUS_OPTIONS.find(o => o.id === newStatus)!;
    
    setStatus(newStatus);
    
    // Apply defaults for the new mode
    setEmailTime(option.defaults.email);
    setDmTime(option.defaults.dm);
    setUrgentMethod(option.defaults.urgent);
    
    // If going available, clear the back_at time and message
    const newMessage = newStatus === "available" ? "" : statusMessage;
    const newBackAt = newStatus === "available" ? null : backAt;
    
    if (newStatus === "available") {
      setStatusMessage("");
      setBackAt(null);
    }

    setSaving(true);

    const updates = { 
      status: newStatus,
      email_response_time: option.defaults.email,
      dm_response_time: option.defaults.dm,
      urgent_method: option.defaults.urgent,
      ...(newStatus === "available" ? { back_at: null, status_message: null } : {})
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    setSaving(false);
    if (data) setProfile(data as Profile);
    
    // Sync to connected integrations
    syncToIntegrations(newStatus, newMessage, newBackAt);
  };

  const saveDetails = async () => {
    setSaving(true);

    const updates = {
      status_message: statusMessage || null,
      back_at: backAt ? backAt.toISOString() : null,
      email_response_time: emailTime,
      dm_response_time: dmTime,
      urgent_method: urgentMethod,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    setSaving(false);
    if (data) setProfile(data as Profile);
    
    // Sync to connected integrations when details change
    syncToIntegrations(status, statusMessage || null, backAt);
  };

  const saveSettings = async () => {
    setSaving(true);

    const updates = {
      username,
      display_name: displayName || null,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    setSaving(false);
    if (data) setProfile(data as Profile);
  };

  const deleteMessage = async (messageId: string) => {
    await supabase.from("messages").delete().eq("id", messageId);
    router.refresh();
  };

  // Auto-save when details change (debounced)
  useEffect(() => {
    if (!profile || status === "available") return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveDetails();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusMessage, backAt, emailTime, dmTime, urgentMethod]);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-[#1a1915]">
      {/* Header */}
      <header className="border-b border-[#2a2925] bg-[#1a1915]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#faf9f7] rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#1a1915] rounded-full" />
            </div>
            <span className="text-lg font-display font-semibold tracking-tight text-[#faf9f7]">qoit</span>
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${profile.username}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View page
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Notification banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                notification.type === "success" 
                  ? "bg-[#4a5d4a]/20 border border-[#4a5d4a]/30" 
                  : "bg-[#a85d5d]/20 border border-[#a85d5d]/30"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-[#4a5d4a]" />
              ) : (
                <AlertCircle className="h-5 w-5 text-[#a85d5d]" />
              )}
              <span className={notification.type === "success" ? "text-[#4a5d4a]" : "text-[#a85d5d]"}>
                {notification.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#8a8780] uppercase tracking-wider">Current Status</h2>
            <div className="flex items-center gap-3">
              {syncing && (
                <span className="text-sm text-[#4a5d4a] flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing...
                </span>
              )}
              <span className={`text-sm text-[#8a8780] transition-opacity ${saving ? "opacity-100" : "opacity-0"}`}>
                Saving...
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUS_OPTIONS.map((option) => {
              const isActive = status === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => updateStatus(option.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all ${
                    isActive
                      ? "shadow-lg scale-[1.02]"
                      : "border-[#2a2925] hover:border-[#3a3935] bg-[#252520]"
                  }`}
                  style={{
                    backgroundColor: isActive ? option.color : undefined,
                    color: isActive ? "white" : "#faf9f7",
                    borderColor: isActive ? option.color : undefined,
                  }}
                >
                  <span className="text-2xl mb-2 block">{option.emoji}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/80"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Details panel - only show when not available */}
        <AnimatePresence>
          {status !== "available" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#252520] rounded-2xl border border-[#2a2925] p-6 mb-8 space-y-6">
                {/* Status message */}
                <div>
                  <label className="block text-sm font-medium text-[#faf9f7] mb-2">
                    What's up?
                  </label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#3a3935] bg-[#1a1915] text-[#faf9f7] placeholder:text-[#6a6965] focus:outline-none focus:ring-2 focus:ring-[#4a5d4a]"
                    placeholder="Taking a break..."
                  />
                </div>

                {/* Back at picker */}
                <div>
                  <label className="block text-sm font-medium text-[#faf9f7] mb-3">
                    When will you be back?
                  </label>
                  <BackAtPicker
                    value={backAt}
                    onChange={setBackAt}
                  />
                </div>

                {/* Response times */}
                <div>
                  <label className="block text-sm font-medium text-[#faf9f7] mb-3">
                    Response times
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-[#8a8780] mb-1.5">Email</label>
                      <input
                        type="text"
                        value={emailTime}
                        onChange={(e) => setEmailTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#3a3935] bg-[#1a1915] text-[#faf9f7] placeholder:text-[#6a6965] focus:outline-none focus:ring-2 focus:ring-[#4a5d4a] text-sm text-center font-medium"
                        placeholder="~24h"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8a8780] mb-1.5">DMs</label>
                      <input
                        type="text"
                        value={dmTime}
                        onChange={(e) => setDmTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#3a3935] bg-[#1a1915] text-[#faf9f7] placeholder:text-[#6a6965] focus:outline-none focus:ring-2 focus:ring-[#4a5d4a] text-sm text-center font-medium"
                        placeholder="~4h"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8a8780] mb-1.5">Urgent</label>
                      <input
                        type="text"
                        value={urgentMethod}
                        onChange={(e) => setUrgentMethod(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#3a3935] bg-[#1a1915] text-[#faf9f7] placeholder:text-[#6a6965] focus:outline-none focus:ring-2 focus:ring-[#4a5d4a] text-sm text-center font-medium"
                        placeholder="Call"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Your page link */}
        {profile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#4a5d4a] to-[#3a4d3a] rounded-2xl p-6 mb-8"
          >
            <p className="text-sm text-white/60 mb-2">Share your status page</p>
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="text-xl font-medium text-white hover:underline"
              >
                qoit.page/{profile.username}
              </Link>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/${profile.username}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Messages section */}
        {messages.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="w-full bg-[#252520] rounded-2xl border border-[#2a2925] p-4 flex items-center justify-between hover:bg-[#2a2925] transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-[#8a8780]" />
                <span className="font-medium text-[#faf9f7]">
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#c9a962] text-[#1a1915] text-xs font-semibold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </span>
              </div>
              {showMessages ? (
                <ChevronUp className="h-5 w-5 text-[#8a8780]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#8a8780]" />
              )}
            </button>

            <AnimatePresence>
              {showMessages && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 mt-3 overflow-hidden"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`bg-[#252520] rounded-xl border p-4 ${
                        message.is_read ? "border-[#2a2925]" : "border-[#c9a962]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[#faf9f7]">{message.sender_name}</span>
                          {message.is_urgent && (
                            <span className="text-xs bg-[#a85d5d] text-white px-1.5 py-0.5 rounded font-medium">
                              Urgent
                            </span>
                          )}
                          {!message.is_read && (
                            <span className="text-xs bg-[#c9a962] text-[#1a1915] px-1.5 py-0.5 rounded font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(message.id)}
                          className="h-8 w-8 text-[#8a8780] hover:text-[#a85d5d]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-[#c9c8c4]">{message.content}</p>
                      <p className="text-xs text-[#6a6965] mt-2">{message.sender_email}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Integrations section */}
        <div className="mb-6">
          <button
            onClick={() => setShowIntegrations(!showIntegrations)}
            className="w-full bg-[#252520] rounded-2xl border border-[#2a2925] p-4 flex items-center justify-between hover:bg-[#2a2925] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Link2 className="h-5 w-5 text-[#8a8780]" />
              <span className="font-medium text-[#faf9f7]">
                Integrations
                {integrations.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-[#4a5d4a] text-white text-xs font-semibold rounded-full">
                    {integrations.length} connected
                  </span>
                )}
              </span>
            </div>
            {showIntegrations ? (
              <ChevronUp className="h-5 w-5 text-[#8a8780]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#8a8780]" />
            )}
          </button>

          <AnimatePresence>
            {showIntegrations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#252520] rounded-2xl border border-[#2a2925] border-t-0 rounded-t-none p-6">
                  <p className="text-sm text-[#8a8780] mb-4">
                    Connect your tools to sync your status everywhere automatically.
                  </p>
                  
                  {loadingIntegrations ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8a8780]" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(Object.entries(INTEGRATION_CONFIG) as [IntegrationType, typeof INTEGRATION_CONFIG[IntegrationType]][]).map(([type, config]) => {
                        const connected = getIntegration(type);
                        return (
                          <div
                            key={type}
                            className={`flex items-center justify-between p-4 rounded-xl border ${
                              connected 
                                ? "border-[#4a5d4a]/50 bg-[#4a5d4a]/10" 
                                : "border-[#3a3935] bg-[#1a1915]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${connected ? "bg-[#4a5d4a]/20 text-[#4a5d4a]" : "bg-[#3a3935] text-[#8a8780]"}`}>
                                {config.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-[#faf9f7]">{config.name}</span>
                                  {connected && (
                                    <span className="text-xs text-[#4a5d4a] flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Connected
                                    </span>
                                  )}
                                  {!config.available && (
                                    <span className="text-xs bg-[#3a3935] text-[#8a8780] px-2 py-0.5 rounded">
                                      Coming soon
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#6a6965]">
                                  {connected?.team_name ? `${connected.team_name}` : config.description}
                                </p>
                              </div>
                            </div>
                            
                            {config.available && (
                              connected ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => disconnectIntegration(type)}
                                  className="text-[#a85d5d] hover:text-[#a85d5d] hover:bg-[#a85d5d]/10"
                                >
                                  <Unlink className="h-4 w-4 mr-1" />
                                  Disconnect
                                </Button>
                              ) : (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  asChild
                                >
                                  <a href={`/api/integrations/${type}/connect`}>
                                    <Link2 className="h-4 w-4 mr-1" />
                                    Connect
                                  </a>
                                </Button>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings section */}
        <div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full bg-[#252520] rounded-2xl border border-[#2a2925] p-4 flex items-center justify-between hover:bg-[#2a2925] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-[#8a8780]" />
              <span className="font-medium text-[#faf9f7]">Profile Settings</span>
            </div>
            {showSettings ? (
              <ChevronUp className="h-5 w-5 text-[#8a8780]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#8a8780]" />
            )}
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#252520] rounded-2xl border border-[#2a2925] border-t-0 rounded-t-none p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#faf9f7] mb-2">Username</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8a8780] text-sm">qoit.page/</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        className="flex-1 px-4 py-3 rounded-xl border border-[#3a3935] bg-[#1a1915] text-[#faf9f7] placeholder:text-[#6a6965] focus:outline-none focus:ring-2 focus:ring-[#4a5d4a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#faf9f7] mb-2">Display name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#3a3935] bg-[#1a1915] text-[#faf9f7] placeholder:text-[#6a6965] focus:outline-none focus:ring-2 focus:ring-[#4a5d4a]"
                      placeholder="Your name"
                    />
                  </div>

                  <Button
                    onClick={saveSettings}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? "Saving..." : "Save settings"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
