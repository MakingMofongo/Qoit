"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Profile, StatusMode, Database } from "@/types/database";

type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { StatusDot } from "@/components/ui/status-dot";
import { SoundWave } from "@/components/ui/sound-wave";

interface ProfilePageProps {
  profile: Profile;
}

const STATUS_CONFIG: Record<StatusMode, { label: string; color: string }> = {
  available: {
    label: "Available",
    color: "#22c55e",
  },
  qoit: {
    label: "Qoit Mode",
    color: "#4a5d4a",
  },
  focused: {
    label: "Deep Work",
    color: "#c9a962",
  },
  away: {
    label: "Away",
    color: "#a85d5d",
  },
};

function CountdownTimer({ backAt }: { backAt: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(backAt).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(interval);
  }, [backAt]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return <span className="text-[#4a5d4a] text-xl font-medium">Back soon</span>;
  }

  return (
    <div className="flex items-baseline gap-1">
      {timeLeft.days > 0 && (
        <>
          <span className="text-5xl md:text-6xl font-semibold font-mono">{timeLeft.days}</span>
          <span className="text-[#8a8780] text-lg">d</span>
        </>
      )}
      <span className="text-5xl md:text-6xl font-semibold font-mono ml-2">{timeLeft.hours}</span>
      <span className="text-[#8a8780] text-lg">h</span>
      {timeLeft.days === 0 && (
        <>
          <span className="text-5xl md:text-6xl font-semibold font-mono ml-2">{timeLeft.minutes}</span>
          <span className="text-[#8a8780] text-lg">m</span>
        </>
      )}
    </div>
  );
}

export function ProfilePage({ profile }: ProfilePageProps) {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const statusConfig = STATUS_CONFIG[profile.status];
  const supabase = createClient();

  const handleSendMessage = async (e: React.FormEvent, isUrgent: boolean = false) => {
    e.preventDefault();
    setSending(true);

    const messageData: MessageInsert = {
      profile_id: profile.id,
      sender_name: formData.name,
      sender_email: formData.email,
      content: formData.message,
      is_urgent: isUrgent,
    };
    const { error } = await supabase.from("messages").insert(messageData as never);

    setSending(false);

    if (!error) {
      setMessageSent(true);
      setShowMessageForm(false);
      setShowEmergencyForm(false);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  const isMuted = profile.status !== "available";

  return (
    <div className="min-h-screen bg-[#faf9f7] relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f7] via-[#faf9f7] to-[#f5f4f0]" />
      
      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Main content area */}
        <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="space-y-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <StatusDot status={profile.status} />
                    <span className="text-sm font-medium uppercase tracking-wider" style={{ color: statusConfig.color }}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
                    {profile.display_name || profile.username}
                  </h1>
                  {profile.title && (
                    <p className="text-xl text-[#8a8780]">{profile.title}</p>
                  )}
                </div>

                {profile.back_at && profile.status !== "available" && (
                  <div className="md:text-right">
                    <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-2">Back in</p>
                    <CountdownTimer backAt={profile.back_at} />
                  </div>
                )}
              </div>

              {/* Sound wave with status message */}
              {profile.status_message && (
                <div className="flex items-center gap-4 text-[#8a8780]">
                  <SoundWave muted={isMuted} />
                  <span className="text-lg italic">{profile.status_message}</span>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#e8e6e1] to-transparent" />

              {/* Response times */}
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                <div className="bg-[#f5f4f0] rounded-2xl p-6">
                  <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-2">Email</p>
                  <p className="text-xl font-medium">{profile.email_response_time || "~24h"}</p>
                </div>
                <div className="bg-[#f5f4f0] rounded-2xl p-6">
                  <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-2">DMs</p>
                  <p className="text-xl font-medium">{profile.dm_response_time || "~4h"}</p>
                </div>
                <div className="bg-[#f5f4f0] rounded-2xl p-6">
                  <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-2">Urgent</p>
                  <p className="text-xl font-medium text-[#a85d5d]">{profile.urgent_method || "Call"}</p>
                </div>
              </div>

              {/* Personal note */}
              {profile.personal_note && (
                <div className="bg-[#f5f4f0] rounded-2xl p-8 border-l-4 border-[#c9a962]">
                  <p className="text-[#1a1915] handwritten text-2xl md:text-3xl leading-relaxed">
                    "{profile.personal_note}"
                  </p>
                </div>
              )}

              {/* Message sent confirmation */}
              {messageSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#4a5d4a] text-white rounded-2xl p-8 text-center"
                >
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-xl font-medium">Message sent!</p>
                  <p className="text-white/70 mt-2">They'll get back to you when available.</p>
                </motion.div>
              )}

              {/* Message form */}
              {showMessageForm && !messageSent && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={(e) => handleSendMessage(e, false)}
                  className="bg-white rounded-2xl border border-[#e8e6e1] p-8 space-y-6"
                >
                  <h3 className="text-xl font-semibold">Leave a message</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="px-5 py-4 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1915] text-lg"
                      required
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email"
                      className="px-5 py-4 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1915] text-lg"
                      required
                    />
                  </div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1915] resize-none text-lg"
                    required
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 bg-[#1a1915] text-white py-4 rounded-xl font-medium text-lg hover:bg-[#2a2925] transition-colors disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send message"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="px-8 py-4 rounded-xl border border-[#e8e6e1] hover:bg-[#f5f4f0] transition-colors text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Emergency form */}
              {showEmergencyForm && !messageSent && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={(e) => handleSendMessage(e, true)}
                  className="bg-white rounded-2xl border border-[#e8e6e1] p-8 space-y-6"
                >
                  <div className="bg-[#a85d5d]/10 border border-[#a85d5d]/20 rounded-xl p-4">
                    <p className="text-[#a85d5d]">
                      <strong>⚠️ Emergency contact:</strong> Only use this for truly urgent matters.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="px-5 py-4 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#a85d5d] text-lg"
                      required
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email"
                      className="px-5 py-4 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#a85d5d] text-lg"
                      required
                    />
                  </div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What's urgent?"
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#a85d5d] resize-none text-lg"
                    required
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 bg-[#a85d5d] text-white py-4 rounded-xl font-medium text-lg hover:bg-[#8b4d4d] transition-colors disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send urgent message"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmergencyForm(false)}
                      className="px-8 py-4 rounded-xl border border-[#e8e6e1] hover:bg-[#f5f4f0] transition-colors text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Action buttons */}
              {!showMessageForm && !showEmergencyForm && !messageSent && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowMessageForm(true)}
                    className="flex-1 bg-white text-[#1a1915] rounded-2xl px-8 py-5 font-medium text-lg hover:bg-[#f5f4f0] transition-colors border border-[#e8e6e1]"
                  >
                    Leave a message
                  </button>
                  <button
                    onClick={() => setShowEmergencyForm(true)}
                    className="flex-1 bg-white rounded-2xl px-8 py-5 font-medium text-lg hover:bg-[#f5f4f0] transition-colors border border-[#e8e6e1] flex items-center justify-center gap-3"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a85d5d]" />
                    Emergency contact
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center">
          <Link
            href="/"
            className="text-sm text-[#8a8780] hover:text-[#1a1915] transition-colors"
          >
            Powered by <span className="font-medium">qoit</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
