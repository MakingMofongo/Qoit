"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Globe, Clock, MessageCircle, Zap } from "lucide-react";

interface QoitPageMockupProps {
  isQoit: boolean;
  backAtTime: Date | null;
  animationDelay: number;
  username?: string | null;
}

export function QoitPageMockup({ isQoit, backAtTime, animationDelay, username }: QoitPageMockupProps) {
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

  return (
    <motion.div
      className="bg-[#faf9f7] rounded-2xl overflow-hidden border border-[#e8e6e1] w-[280px] shadow-lg"
      animate={{
        borderColor: localState ? "#4a5d4a" : "#e8e6e1",
        boxShadow: localState 
          ? "0 0 30px rgba(74, 93, 74, 0.2), 0 4px 20px rgba(0,0,0,0.1)" 
          : "0 4px 20px rgba(0,0,0,0.05)",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Browser-like header */}
      <div className="bg-[#f5f4f0] px-3 py-2 flex items-center gap-2 border-b border-[#e8e6e1]">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded px-2 py-0.5 text-[10px] text-[#8a8780] font-mono flex items-center gap-1">
            <Globe className="w-2.5 h-2.5" />
            qoit.page/{displayName}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="p-4 space-y-3">
        {/* Profile header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a5d4a] to-[#2d3a2d] flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#faf9f7]"
              animate={{
                backgroundColor: localState ? "#f59e0b" : "#22c55e",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[#1a1915] text-sm capitalize">{displayName}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={localState ? "qoit" : "available"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[10px] font-medium"
              >
                {localState ? (
                  <span className="text-[#f59e0b]">In focus mode</span>
                ) : (
                  <span className="text-[#22c55e]">Available now</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Response times card */}
        <motion.div 
          className="bg-[#f5f4f0] rounded-xl p-3 space-y-2"
          animate={{
            backgroundColor: localState ? "#fef3c7" : "#f5f4f0",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-1.5 text-[10px] text-[#6a6a65] font-medium uppercase tracking-wide">
            <Clock className="w-3 h-3" />
            Response times
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <div className="text-[10px] text-[#8a8780]">Typically</div>
              <div className="text-sm font-semibold text-[#1a1915]">
                {localState ? "When back" : "~2 hours"}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-[#8a8780]">Active hours</div>
              <div className="text-sm font-semibold text-[#1a1915]">9am–6pm</div>
            </div>
          </div>
        </motion.div>

        {/* Back in indicator */}
        <AnimatePresence>
          {localState && timeUntil && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-[#4a5d4a]/10 rounded-lg border border-[#4a5d4a]/20"
            >
              <Zap className="w-3.5 h-3.5 text-[#4a5d4a]" />
              <span className="text-[11px] text-[#4a5d4a] font-medium">
                Back in {timeUntil}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact button */}
        <motion.button
          className="w-full py-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          animate={{
            backgroundColor: localState ? "#f5f4f0" : "#1a1915",
            color: localState ? "#8a8780" : "#faf9f7",
          }}
          transition={{ duration: 0.3 }}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {localState ? "Leave a message" : "Get in touch"}
        </motion.button>
      </div>
    </motion.div>
  );
}
