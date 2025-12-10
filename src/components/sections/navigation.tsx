"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#faf9f7]/80 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#1a1915] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#faf9f7]" />
          </div>
          <span className="font-semibold text-lg tracking-tight">qoit</span>
        </Link>

        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#1a1915] text-[#faf9f7] hover:bg-[#2a2925] transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium px-5 py-2.5 text-[#8a8780] hover:text-[#1a1915] transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#1a1915] text-[#faf9f7] hover:bg-[#2a2925] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
