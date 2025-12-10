"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#1a1915] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#faf9f7] rounded-full" />
          </div>
          <span className="text-2xl font-display font-semibold tracking-tight">qoit</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-[#e8e6e1] shadow-sm">
          <h1 className="text-2xl font-semibold mb-2 text-center">Create your page</h1>
          <p className="text-[#8a8780] text-center mb-8">Set up your personal status page</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1a1915] mb-2">
                Display name
              </label>
              <input
                id="name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1915] transition-shadow"
                placeholder="Maya Chen"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1915] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1915] transition-shadow"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1915] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e6e1] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1915] transition-shadow"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="text-xs text-[#8a8780] mt-1">At least 6 characters</p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1915] text-[#faf9f7] py-3 rounded-xl font-medium hover:bg-[#2a2925] transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8a8780] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1a1915] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

