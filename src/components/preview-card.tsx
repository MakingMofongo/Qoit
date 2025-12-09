"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { StatusDot } from "./ui/status-dot";
import { SoundWave } from "./ui/sound-wave";

export function PreviewCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-[#4a5d4a]/10 via-[#c9a962]/10 to-[#4a5d4a]/10 rounded-3xl blur-xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Browser chrome */}
      <div className="relative bg-[#f5f4f0] rounded-t-2xl border border-[#e8e6e1] border-b-0 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#e8e6e1]" />
          <div className="w-3 h-3 rounded-full bg-[#e8e6e1]" />
          <div className="w-3 h-3 rounded-full bg-[#e8e6e1]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#faf9f7] rounded-lg px-4 py-1.5 text-sm text-[#8a8780] font-mono flex items-center gap-2">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            qoit.page/maya
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="relative bg-[#faf9f7] rounded-b-2xl border border-[#e8e6e1] p-8 md:p-12 overflow-hidden">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#f5f4f0]/50" />

        <div className="relative space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <StatusDot status="qoit" />
                <span className="text-sm font-medium text-[#4a5d4a]">Qoit Mode</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Maya Chen</h3>
              <p className="text-[#8a8780]">Product Designer</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider">Back in</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold font-mono">2</span>
                <span className="text-[#8a8780] text-sm">d</span>
                <span className="text-3xl font-semibold font-mono ml-1">4</span>
                <span className="text-[#8a8780] text-sm">h</span>
              </div>
            </div>
          </div>

          {/* Sound wave - muted */}
          <div className="flex items-center gap-4 text-[#8a8780]">
            <SoundWave muted />
            <span className="text-sm italic">Taking a creative break</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#e8e6e1] to-transparent" />

          {/* Response times */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#f5f4f0] rounded-xl p-4">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">Email</p>
              <p className="font-medium">~48h</p>
            </div>
            <div className="bg-[#f5f4f0] rounded-xl p-4">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">DMs</p>
              <p className="font-medium">When back</p>
            </div>
            <div className="bg-[#f5f4f0] rounded-xl p-4">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">Urgent</p>
              <p className="font-medium text-[#a85d5d]">Call</p>
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#f5f4f0] rounded-xl p-5 border-l-2 border-[#c9a962]">
            <p className="text-[#1a1915] handwritten text-xl leading-relaxed">
              "Stepping away to recharge. Leave a note and I'll get back with fresh eyes ✨"
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-transparent text-[#8a8780] rounded-xl px-6 py-3 font-medium hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 transition-colors border border-[#e8e6e1]/50">
              Leave a message
            </button>
            <button className="flex-1 border border-[#e8e6e1] rounded-xl px-6 py-3 font-medium hover:bg-[#f5f4f0] transition-colors flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a85d5d]" />
              Emergency contact
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

