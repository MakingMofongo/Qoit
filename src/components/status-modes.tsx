"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function StatusModes() {
  const [activeMode, setActiveMode] = useState<"qoit" | "focused" | "away">("qoit");
  
  const modes = [
    { 
      id: "qoit" as const, 
      label: "Qoit", 
      desc: "Taking a breather", 
      time: "Back in 2 days",
      response: "~24-48h",
      color: "#4a5d4a",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" />
          <line x1="12" y1="2" x2="12" y2="12" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      id: "focused" as const, 
      label: "Deep Work", 
      desc: "In the zone", 
      time: "Available at 5pm",
      response: "~4-6h",
      color: "#c9a962",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      id: "away" as const, 
      label: "Away", 
      desc: "On vacation", 
      time: "Returns Dec 20",
      response: "When back",
      color: "#a85d5d",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
  ];

  const currentMode = modes.find(m => m.id === activeMode)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[#f5f4f0] rounded-3xl p-8 md:p-12 relative overflow-hidden"
    >
      {/* Subtle background glow based on active mode */}
      <motion.div 
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20"
        animate={{ backgroundColor: currentMode.color }}
        transition={{ duration: 0.5 }}
      />
      
      <div className="relative">
        <div className="flex flex-wrap gap-3 mb-8">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeMode === mode.id
                  ? "text-[#faf9f7]"
                  : "text-[#8a8780] hover:text-[#4a5d4a] hover:bg-[#e8e6e1]/50"
              }`}
              style={{
                backgroundColor: activeMode === mode.id ? mode.color : "transparent",
              }}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {modes.map(
            (mode) =>
              activeMode === mode.id && (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#faf9f7]"
                      style={{ backgroundColor: mode.color }}
                    >
                      {mode.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{mode.desc}</p>
                      <p className="text-[#8a8780]">{mode.time}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-[#8a8780] uppercase tracking-wider">Response time</p>
                    <p className="font-mono text-xl font-medium">{mode.response}</p>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

