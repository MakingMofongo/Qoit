"use client";

import { motion } from "framer-motion";

export function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#faf9f7]/80 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#1a1915] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#faf9f7]" />
          </div>
          <span className="font-semibold text-lg tracking-tight">qoit</span>
        </div>

        <a 
          href="#waitlist"
          className="text-sm font-medium px-5 py-2.5 rounded-full bg-transparent text-[#8a8780] hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 transition-colors border border-[#e8e6e1]/50"
        >
          Get Early Access
        </a>
      </div>
    </motion.nav>
  );
}

