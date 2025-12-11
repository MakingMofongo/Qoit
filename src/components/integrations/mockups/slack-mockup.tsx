"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SlackMockupProps {
  isQoit: boolean;
  animationDelay: number;
}

export function SlackMockup({ isQoit, animationDelay }: SlackMockupProps) {
  const [localState, setLocalState] = useState(isQoit);

  useEffect(() => {
    const timer = setTimeout(() => setLocalState(isQoit), animationDelay * 1000);
    return () => clearTimeout(timer);
  }, [isQoit, animationDelay]);

  return (
    <motion.div
      className="bg-[#1a1a18] rounded-2xl overflow-hidden border border-[#2a2a28] w-[280px]"
      animate={{
        borderColor: localState ? "#4a5d4a" : "#2a2a28",
        boxShadow: localState ? "0 0 30px rgba(74, 93, 74, 0.15)" : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Slack sidebar header */}
      <div className="bg-[#3F0E40] px-3 py-2 flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">#</span>
        </div>
        <span className="text-white text-xs font-medium">Acme Inc</span>
        <span className="text-white/60 text-xs ml-auto">▾</span>
      </div>

      {/* Profile section */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-[#1a1a18]"
              animate={{
                backgroundColor: localState ? "#E8A230" : "#2BAC76",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[#faf9f7] text-sm">You</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={localState ? "qoit" : "active"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1"
              >
                {localState ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🌙</span>
                    <span className="text-xs text-[#E8A230] font-medium">
                      In focus mode
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-[#2BAC76] font-medium">Active</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Status detail */}
        <AnimatePresence>
          {localState && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-[#2a2a28]"
            >
              <div className="text-[10px] text-[#6a6a65] flex items-center gap-1">
                <span>Notifications paused</span>
                <span className="text-[#4a5d4a]">• Until 4:49 PM</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


