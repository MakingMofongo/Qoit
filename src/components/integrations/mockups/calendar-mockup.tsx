"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CalendarMockupProps {
  isQoit: boolean;
  animationDelay: number;
}

export function CalendarMockup({ isQoit, animationDelay }: CalendarMockupProps) {
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
      {/* Calendar header */}
      <div className="bg-[#202124] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <rect fill="#4285F4" x="2" y="4" width="20" height="3" rx="1" />
            <rect fill="#EA4335" x="2" y="7" width="20" height="15" rx="1" />
            <text
              fill="white"
              x="12"
              y="17"
              fontSize="8"
              textAnchor="middle"
              fontWeight="bold"
            >
              11
            </text>
          </svg>
          <span className="text-white text-xs font-medium">December 2024</span>
        </div>
        <span className="text-[#8ab4f8] text-[10px]">Today</span>
      </div>

      {/* Time grid */}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2 text-[10px] text-[#5a5a55]">
          <span className="w-12 text-right">2 PM</span>
          <div className="flex-1 h-px bg-[#2a2a28]" />
        </div>

        {/* Event block */}
        <div className="ml-14 relative min-h-[60px]">
          <AnimatePresence>
            {localState && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-x-0 top-0 bg-[#4a5d4a] rounded-lg p-2.5 border-l-4 border-[#6a9a6a]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🌙</span>
                  <span className="text-xs font-medium text-[#faf9f7]">Qoit Mode</span>
                </div>
                <div className="text-[10px] text-[#9fcf9f] mt-0.5">2:00 – 4:49 PM</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#5a5a55]">
          <span className="w-12 text-right">3 PM</span>
          <div className="flex-1 h-px bg-[#2a2a28]" />
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#5a5a55]">
          <span className="w-12 text-right">4 PM</span>
          <div className="flex-1 h-px bg-[#2a2a28]" />
        </div>
      </div>
    </motion.div>
  );
}


