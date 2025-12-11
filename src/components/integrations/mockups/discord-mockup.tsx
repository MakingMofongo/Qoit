"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface DiscordMockupProps {
  isQoit: boolean;
  animationDelay: number;
}

export function DiscordMockup({ isQoit, animationDelay }: DiscordMockupProps) {
  const [localState, setLocalState] = useState(isQoit);

  useEffect(() => {
    const timer = setTimeout(() => setLocalState(isQoit), animationDelay * 1000);
    return () => clearTimeout(timer);
  }, [isQoit, animationDelay]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      className="bg-[#313338] rounded-2xl overflow-hidden border border-[#2a2a28] w-[280px]"
      animate={{
        borderColor: localState ? "#4a5d4a" : "#2a2a28",
        boxShadow: localState ? "0 0 30px rgba(74, 93, 74, 0.15)" : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Channel header */}
      <div className="bg-[#2b2d31] px-3 py-2 flex items-center gap-2 border-b border-[#1e1f22]">
        <span className="text-[#80848e]">#</span>
        <span className="text-white text-xs font-medium">status-updates</span>
      </div>

      {/* Message area */}
      <div className="p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={localState ? "qoit" : "available"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3"
          >
            {/* Bot avatar */}
            <div className="w-10 h-10 rounded-full bg-[#1a1915] flex items-center justify-center shrink-0 border-2 border-[#4a5d4a]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#faf9f7]" />
            </div>

            {/* Message content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#faf9f7]">Qoit Status</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#5865f2] text-white font-medium">
                  APP
                </span>
                <span className="text-[10px] text-[#80848e]">{timeStr}</span>
              </div>

              {/* Embed */}
              <div
                className={`mt-2 rounded-lg p-3 border-l-4 ${
                  localState
                    ? "bg-[#2b2d31] border-[#faa61a]"
                    : "bg-[#2b2d31] border-[#3ba55c]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{localState ? "🌙" : "✅"}</span>
                  <span className="text-sm font-semibold text-[#faf9f7]">
                    {localState ? "Going Quiet" : "Back & Available"}
                  </span>
                </div>
                <p className="text-xs text-[#b5bac1]">
                  Status changed to {localState ? "Focus Mode" : "Available"}
                </p>
                <p className="text-[10px] text-[#80848e] mt-1.5">
                  Synced from Qoit • Today at {timeStr}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}



