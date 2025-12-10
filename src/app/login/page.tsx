"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
          <h1 className="text-2xl font-semibold mb-2 text-center">Welcome back</h1>
          <p className="text-[#8a8780] text-center mb-8">Sign in to manage your status</p>

          <form onSubmit={handleLogin} className="space-y-4">
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
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1915] text-[#faf9f7] py-3 rounded-xl font-medium hover:bg-[#2a2925] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8a8780] mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#1a1915] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

