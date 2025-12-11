"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { BackAtPicker } from "../ui/back-at-picker";
import type { SyncState } from "./types";

interface QoitNodeProps {
  data: {
    isQoit: boolean;
    onToggle: () => void;
    onTimeChange?: (date: Date | null) => void;
    syncState: SyncState;
    username?: string | null;
  };
}

export function QoitNode({ data }: QoitNodeProps) {
  const { isQoit, onToggle, onTimeChange, syncState, username } = data;

  // Calculate "back at" time (current time + 1 hour for demo)
  const defaultBackAtTime = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d;
  }, []);

  const [backAtTime, setBackAtTime] = useState<Date | null>(isQoit ? defaultBackAtTime : null);
  const isSyncingRef = useRef(false); // Track if we're syncing state to prevent double triggers

  // Sync backAtTime with isQoit state (only when state changes externally, not from slider)
  useEffect(() => {
    if (isSyncingRef.current) return; // Don't sync if we're in the middle of a sync operation
    
    if (isQoit && !backAtTime) {
      setBackAtTime(defaultBackAtTime);
    } else if (!isQoit && backAtTime) {
      // When switching to available, clear the time
      setBackAtTime(null);
    }
  }, [isQoit, backAtTime, defaultBackAtTime]);

  // Use ref to track latest backAtTime for countdown check
  const backAtTimeRef = useRef(backAtTime);
  useEffect(() => {
    backAtTimeRef.current = backAtTime;
  }, [backAtTime]);

  // Check if countdown has reached 0 and switch to available
  useEffect(() => {
    if (!isQoit) return;

    const checkCountdown = () => {
      const currentBackAtTime = backAtTimeRef.current;
      if (!currentBackAtTime) return;
      
      const now = Date.now();
      const timeLeft = currentBackAtTime.getTime() - now;
      
      // If time has passed or is 0, switch to available
      if (timeLeft <= 0) {
        isSyncingRef.current = true;
        if (onTimeChange) {
          onTimeChange(null);
        } else {
          onToggle();
        }
        // Reset sync flag after a brief delay
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 100);
      }
    };

    // Check immediately
    checkCountdown();
    
    // Then check every second
    const interval = setInterval(checkCountdown, 1000);
    return () => clearInterval(interval);
  }, [isQoit, onTimeChange, onToggle]);

  const handleBackAtChange = (date: Date | null) => {
    isSyncingRef.current = true;
    setBackAtTime(date);
    
    // Check if time is in the future (> 0 seconds from now)
    const now = Date.now();
    const isFutureTime = date !== null && date.getTime() > now;
    
    // Use onTimeChange if provided (from IntegrationsFlow), otherwise use onToggle
    if (onTimeChange) {
      onTimeChange(isFutureTime ? date : null);
    } else {
      // Fallback to toggle behavior
      if (isFutureTime && !isQoit) {
        onToggle();
      } else if (!isFutureTime && isQoit) {
        onToggle();
      }
    }
    
    // Reset sync flag after a brief delay
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 100);
  };

  return (
    <div
      className="relative nodrag nopan select-none"
      style={{ pointerEvents: "all" }}
    >
      <motion.div
        className="relative bg-[#1a1a18] rounded-3xl w-[420px] overflow-hidden"
        animate={{
          boxShadow: isQoit
            ? "0 0 0 2px #4a5d4a, 0 30px 60px -15px rgba(74, 93, 74, 0.35)"
            : "0 0 0 1px #2a2a28, 0 30px 60px -15px rgba(0, 0, 0, 0.4)",
        }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                animate={{ backgroundColor: isQoit ? "#4a5d4a" : "#faf9f7" }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={{ backgroundColor: isQoit ? "#faf9f7" : "#1a1915" }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#faf9f7]">qoit</span>
                <span className="text-[10px] text-[#6a6a65] font-mono">
                  qoit.page/{username || "maya"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor: isQoit ? "#4a5d4a" : "#22c55e",
                  boxShadow: isQoit ? "0 0 8px #4a5d4a" : "0 0 8px #22c55e",
                }}
              />
              <motion.span
                className="text-[10px] font-medium uppercase tracking-wider"
                animate={{ color: isQoit ? "#6a8a6a" : "#22c55e" }}
              >
                {isQoit ? "Quiet" : "Active"}
              </motion.span>
            </div>
          </div>

          {/* Content changes based on state - fixed height container */}
          <div className="relative h-[60px]">
            <AnimatePresence mode="wait">
              {isQoit ? (
                <motion.div
                  key="qoit-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.3
                  }}
                  className="absolute inset-0 flex flex-col justify-center space-y-3"
                >
                  <div>
                    <p className="text-[10px] text-[#6a6a65] uppercase tracking-wider mb-1">
                      When will you be back?
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="available-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.3
                  }}
                  className="absolute inset-0 flex flex-col justify-center py-2"
                >
                  <p className="text-sm text-[#8a8a85] mb-3">Ready for messages</p>
                  <p className="text-[10px] text-[#6a6a65] uppercase tracking-wider">
                    Set when you'll be back
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Timer Slider */}
        <div 
          className="px-5 pb-5" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="nodrag nopan" style={{ pointerEvents: "all" }}>
            <BackAtPicker value={backAtTime} onChange={handleBackAtChange} />
          </div>
          
          {/* Sync status indicator - fixed height container */}
          <div className="relative h-[24px] mt-3">
            <AnimatePresence>
              {isQoit && syncState === "syncing" && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-[#6a8a6a]"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.span>
                  Syncing...
                </motion.div>
              )}
              {isQoit && syncState === "synced" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-[#6a8a6a]"
                >
                  <span>✓</span>
                  All synced
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#4a5d4a] !border-0 !right-[-6px]"
      />
    </div>
  );
}

