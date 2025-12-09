"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function EmailSignup({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${dark ? "bg-[#faf9f7] text-[#1a1915]" : "bg-[#4a5d4a] text-[#faf9f7]"} rounded-2xl p-8 text-center`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className={`w-16 h-16 rounded-full ${dark ? "bg-[#1a1915]/10" : "bg-[#faf9f7]/20"} flex items-center justify-center mx-auto mb-4`}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">You're on the list</h3>
        <p className={dark ? "text-[#8a8780]" : "text-[#faf9f7]/70"}>
          We'll reach out when it's your turn. Until then... go qoit.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        animate={{
          boxShadow: focused
            ? dark ? "0 0 0 2px #faf9f7" : "0 0 0 2px #1a1915"
            : dark ? "0 0 0 1px #2a2925" : "0 0 0 1px #e8e6e1",
        }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl overflow-hidden ${dark ? "bg-[#2a2925]" : "bg-[#f5f4f0]"}`}
      >
        <div className="flex flex-col sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="you@example.com"
            className={`flex-1 bg-transparent px-6 py-4 outline-none text-lg ${
              dark ? "text-[#faf9f7] placeholder:text-[#faf9f7]/40" : "placeholder:text-[#8a8780]"
            }`}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`${
              dark ? "bg-[#faf9f7] text-[#8a8780] hover:bg-[#e8e6e1] hover:text-[#1a1915]" : "bg-transparent text-[#8a8780] hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 border border-[#e8e6e1]/50"
            } px-8 py-4 font-medium transition-colors sm:rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </span>
            ) : (
              "Join Waitlist"
            )}
          </button>
        </div>
      </motion.div>
      {error && (
        <p className={`text-xs mt-3 text-center sm:text-left text-red-500`}>
          {error}
        </p>
      )}
      {!error && (
      <p className={`text-xs mt-3 text-center sm:text-left ${dark ? "text-[#faf9f7]/40" : "text-[#8a8780]"}`}>
        No spam. Just one email when we launch.
      </p>
      )}
    </form>
  );
}

