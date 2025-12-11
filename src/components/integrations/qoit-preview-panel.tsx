"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { StatusDot } from "../ui/status-dot";
import { SoundWave } from "../ui/sound-wave";

interface QoitPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isQoit: boolean;
  backAtTime: Date | null;
}

function CountdownTimer({ backAt }: { backAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = backAt.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [backAt]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return <span className="text-[#4a5d4a] text-xl font-medium">Back soon</span>;
  }

  return (
    <div className="flex items-baseline gap-1">
      {timeLeft.days > 0 && (
        <>
          <span className="text-3xl font-semibold font-mono text-[#1a1915]">{timeLeft.days}</span>
          <span className="text-[#8a8780] text-sm">d</span>
        </>
      )}
      <span className="text-3xl font-semibold font-mono ml-1 text-[#1a1915]">{timeLeft.hours}</span>
      <span className="text-[#8a8780] text-sm">h</span>
      {timeLeft.days === 0 && (
        <>
          <span className="text-3xl font-semibold font-mono ml-1 text-[#1a1915]">{timeLeft.minutes}</span>
          <span className="text-[#8a8780] text-sm">m</span>
        </>
      )}
    </div>
  );
}

export function QoitPreviewPanel({ isOpen, onClose, isQoit, backAtTime }: QoitPreviewPanelProps) {
  // Use default time if in qoit mode but no backAtTime set
  const displayBackAtTime = backAtTime || (isQoit ? new Date(Date.now() + 60 * 60 * 1000) : null);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Browser Window - positioned on the right */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-8 top-1/2 -translate-y-1/2 w-[480px] bg-[#f5f4f0] z-50 rounded-lg shadow-2xl overflow-hidden"
            style={{ pointerEvents: "all" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Browser chrome */}
            <div className="bg-[#f5f4f0] border-b border-[#e8e6e1] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#faf9f7] rounded-lg px-4 py-1.5 text-sm text-[#8a8780] font-mono flex items-center gap-2 max-w-[300px]">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="truncate">qoit.page/maya</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#e8e6e1]/50 transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-[#8a8780]" />
              </button>
            </div>

            {/* Card content */}
            <div className="relative bg-[#faf9f7] p-8 max-h-[600px] overflow-y-auto">
                {/* Subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#f5f4f0]/50 pointer-events-none" />

              <div className="relative space-y-6 z-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    {isQoit ? (
                      <div className="flex items-center gap-3">
                        <StatusDot status="qoit" />
                        <span className="text-sm font-medium text-[#4a5d4a]">Qoit Mode</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <StatusDot status="available" />
                        <span className="text-sm font-medium text-[#22c55e]">Available</span>
                      </div>
                    )}
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1a1915]">Maya Chen</h3>
                    <p className="text-[#8a8780] text-sm">Product Designer</p>
                  </div>

                  {isQoit && displayBackAtTime && (
                    <div className="text-right">
                      <p className="text-xs text-[#8a8780] uppercase tracking-wider">Back in</p>
                      <CountdownTimer backAt={displayBackAtTime} />
                    </div>
                  )}
                </div>

                {/* Sound wave */}
                <div className="flex items-center gap-4 text-[#8a8780]">
                  <SoundWave muted={isQoit} size="small" />
                  <span className="text-sm italic">
                    {isQoit ? "Taking a creative break" : "Ready for messages"}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#e8e6e1] to-transparent" />

                {/* Response times */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#f5f4f0] rounded-xl p-3">
                    <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium text-sm text-[#1a1915]">~48h</p>
                  </div>
                  <div className="bg-[#f5f4f0] rounded-xl p-3">
                    <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">DMs</p>
                    <p className="font-medium text-sm text-[#1a1915]">{isQoit ? "When back" : "~4h"}</p>
                  </div>
                  <div className="bg-[#f5f4f0] rounded-xl p-3">
                    <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">Urgent</p>
                    <p className="font-medium text-sm text-[#a85d5d]">Call</p>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-[#f5f4f0] rounded-xl p-4 border-l-2 border-[#c9a962]">
                  <p className="text-[#1a1915] handwritten text-lg leading-relaxed">
                    "Stepping away to recharge. Leave a note and I'll get back with fresh eyes ✨"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button className="bg-transparent text-[#8a8780] rounded-xl px-4 py-2.5 text-sm font-medium hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 transition-colors border border-[#e8e6e1]/50">
                    Leave a message
                  </button>
                  <button className="border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1a1915] hover:bg-[#f5f4f0] transition-colors flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a85d5d]" />
                    Emergency contact
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

