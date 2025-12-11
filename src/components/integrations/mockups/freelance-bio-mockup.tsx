"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Clock, Zap, Calendar, ArrowUpRight } from "lucide-react";

interface FreelanceBioMockupProps {
  isQoit: boolean;
  backAtTime: Date | null;
  animationDelay: number;
  username?: string | null;
}

export function FreelanceBioMockup({ isQoit, backAtTime, animationDelay, username }: FreelanceBioMockupProps) {
  const [localState, setLocalState] = useState(isQoit);
  const [localBackAtTime, setLocalBackAtTime] = useState<Date | null>(backAtTime);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalState(isQoit);
      setLocalBackAtTime(backAtTime);
    }, animationDelay * 1000);
    return () => clearTimeout(timer);
  }, [isQoit, backAtTime, animationDelay]);

  // Calculate time until back
  const getTimeUntil = () => {
    if (!localBackAtTime) return null;
    const diff = localBackAtTime.getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const timeUntil = getTimeUntil();
  const displayName = username || "maya";

  // Response pattern dots (Mon-Sun, showing active weekdays)
  const weekdayPattern = [true, true, true, true, true, false, false];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <motion.div
      className="bg-[#1a1a18] rounded-2xl overflow-hidden border border-[#2a2a28] w-[280px]"
      animate={{
        borderColor: localState ? "#4a5d4a" : "#2a2a28",
        boxShadow: localState 
          ? "0 0 30px rgba(74, 93, 74, 0.15)" 
          : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Portfolio site header bar */}
      <div className="bg-[#0d0d0b] px-3 py-2 flex items-center gap-2 border-b border-[#2a2a28]">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#3a3a38]" />
          <div className="w-2 h-2 rounded-full bg-[#3a3a38]" />
          <div className="w-2 h-2 rounded-full bg-[#3a3a38]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="text-[10px] text-[#5a5a55] font-mono">
            {displayName}design.com
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a962] to-[#8a7340] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1a18]"
                animate={{
                  backgroundColor: localState ? "#f59e0b" : "#22c55e",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div>
              <div className="font-medium text-[#faf9f7] text-xs capitalize">{displayName}</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={localState ? "qoit" : "available"}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className="text-[9px]"
                >
                  {localState ? (
                    <span className="text-[#f59e0b]">Focusing</span>
                  ) : (
                    <span className="text-[#22c55e]">Taking clients</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Fast responder badge */}
          <motion.div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-medium"
            animate={{
              backgroundColor: localState ? "rgba(245, 158, 11, 0.15)" : "rgba(74, 93, 74, 0.2)",
              color: localState ? "#f59e0b" : "#4a5d4a",
            }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-2.5 h-2.5" />
            Fast responder
          </motion.div>
        </div>

        {/* Response stats */}
        <div className="bg-[#0d0d0b] rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-[9px] text-[#5a5a55] font-medium uppercase tracking-wide mb-2">
            <Clock className="w-3 h-3" />
            Response times
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] text-[#6a6a65]">Avg. response</div>
              <motion.div 
                className="text-lg font-semibold text-[#faf9f7]"
                animate={{ opacity: localState ? 0.5 : 1 }}
              >
                {localState ? "—" : "2h"}
              </motion.div>
            </div>
            <div>
              <div className="text-[9px] text-[#6a6a65]">Response rate</div>
              <div className="text-lg font-semibold text-[#4a5d4a]">98%</div>
            </div>
          </div>
        </div>

        {/* Weekly availability pattern */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[9px] text-[#5a5a55] font-medium uppercase tracking-wide">
            <Calendar className="w-3 h-3" />
            Usually active
          </div>
          <div className="flex justify-between px-1">
            {weekdayPattern.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <motion.div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-medium"
                  animate={{
                    backgroundColor: active 
                      ? (localState ? "rgba(245, 158, 11, 0.2)" : "rgba(74, 93, 74, 0.3)") 
                      : "rgba(42, 42, 40, 0.5)",
                    color: active 
                      ? (localState ? "#f59e0b" : "#4a5d4a") 
                      : "#4a4a45",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {dayLabels[i]}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Back in notice */}
        <AnimatePresence>
          {localState && timeUntil && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-[#f59e0b]/10 rounded-lg border border-[#f59e0b]/20"
            >
              <span className="text-[10px] text-[#f59e0b] font-medium">
                Back in {timeUntil}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact CTA */}
        <motion.button
          className="w-full py-2 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          animate={{
            backgroundColor: localState ? "#2a2a28" : "#4a5d4a",
            color: localState ? "#6a6a65" : "#faf9f7",
          }}
          transition={{ duration: 0.3 }}
        >
          {localState ? (
            "Leave a message"
          ) : (
            <>
              Contact me
              <ArrowUpRight className="w-3 h-3" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
