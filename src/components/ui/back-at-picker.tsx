"use client";

import * as React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { format } from "date-fns";
import { X, Zap, Coffee, Clock, Moon, Sun, Sparkles } from "lucide-react";

// Tactile tick sound generator (like iOS picker)
const createTickSound = () => {
  let audioContext: AudioContext | null = null;
  let lastTickTime = 0;
  const minTickInterval = 25; // ms between ticks
  
  return {
    play: (intensity: number = 0.5) => {
      const now = Date.now();
      if (now - lastTickTime < minTickInterval) return;
      lastTickTime = now;
      
      try {
        if (!audioContext) {
          audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        
        // Create nodes
        const oscillator = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const gainNode2 = audioContext.createGain();
        const masterGain = audioContext.createGain();
        
        oscillator.connect(gainNode);
        oscillator2.connect(gainNode2);
        gainNode.connect(masterGain);
        gainNode2.connect(masterGain);
        masterGain.connect(audioContext.destination);
        
        const t = audioContext.currentTime;
        
        // Primary tone - deep thunk
        oscillator.frequency.value = 80 + intensity * 40;
        oscillator.type = "sine";
        
        // Secondary tone - adds click attack
        oscillator2.frequency.value = 400 + intensity * 200;
        oscillator2.type = "triangle";
        
        // Deep thunk envelope
        const baseVolume = 0.15 + intensity * 0.1;
        gainNode.gain.setValueAtTime(baseVolume, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        
        // Click attack envelope (faster decay)
        gainNode2.gain.setValueAtTime(0.08 + intensity * 0.04, t);
        gainNode2.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        
        // Master volume
        masterGain.gain.value = 0.6;
        
        oscillator.start(t);
        oscillator.stop(t + 0.05);
        oscillator2.start(t);
        oscillator2.stop(t + 0.02);
      } catch {
        // Audio not supported, fail silently
      }
    }
  };
};

const tickSound = createTickSound();

interface BackAtPickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

// Slider config - logarithmic scale from 0 to 7 days (in seconds internally)
const MIN_SECONDS = 0; // 0 seconds = you're back
const MAX_SECONDS = 60 * 60 * 24 * 7; // 7 days in seconds
const SECONDS_THRESHOLD = 60 * 2; // Below 2 min, allow second-level precision
const MIN_LOG_SECONDS = 1; // Use 1 second for log calculations (log(0) is undefined)

// Convert slider position (0-1) to seconds using logarithmic scale
const positionToSeconds = (position: number): number => {
  // Handle position 0 (leftmost) as 0 seconds
  if (position === 0) return 0;
  
  const minLog = Math.log(MIN_LOG_SECONDS);
  const maxLog = Math.log(MAX_SECONDS);
  const seconds = Math.exp(minLog + position * (maxLog - minLog));
  
  // Below threshold: allow second precision
  // Above: round to nearest minute
  if (seconds < SECONDS_THRESHOLD) {
    return Math.round(seconds);
  }
  return Math.round(seconds / 60) * 60;
};

// Convert seconds to slider position (0-1)
const secondsToPosition = (seconds: number): number => {
  // Handle 0 seconds as position 0
  if (seconds === 0) return 0;
  
  const minLog = Math.log(MIN_LOG_SECONDS);
  const maxLog = Math.log(MAX_SECONDS);
  return (Math.log(seconds) - minLog) / (maxLog - minLog);
};

// Legacy helpers for compatibility
const positionToMinutes = (position: number): number => {
  return positionToSeconds(position) / 60;
};

const minutesToPosition = (minutes: number): number => {
  return secondsToPosition(minutes * 60);
};

// Format minutes into readable string (for slider display)
const formatDuration = (minutes: number): { value: string; unit: string } => {
  if (minutes === 0) {
    return { value: "0", unit: "now" };
  }
  if (minutes < 60) {
    return { value: String(Math.round(minutes)), unit: "min" };
  } else if (minutes < 60 * 24) {
    const hours = Math.round(minutes / 60 * 10) / 10;
    return { 
      value: hours % 1 === 0 ? String(Math.floor(hours)) : hours.toFixed(1), 
      unit: hours === 1 ? "hour" : "hours"
    };
  } else {
    const days = Math.round(minutes / (60 * 24) * 10) / 10;
    return { 
      value: days % 1 === 0 ? String(Math.floor(days)) : days.toFixed(1), 
      unit: days === 1 ? "day" : "days"
    };
  }
};

// Format remaining time as live countdown
const formatCountdown = (targetDate: Date): { 
  display: string; 
  parts: { value: number; unit: string }[];
  isExpired: boolean;
} => {
  const now = Date.now();
  const diff = targetDate.getTime() - now;
  
  if (diff <= 0) {
    return { display: "Now", parts: [{ value: 0, unit: "s" }], isExpired: true };
  }
  
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const parts: { value: number; unit: string }[] = [];
  
  if (days > 0) {
    parts.push({ value: days, unit: "d" });
    parts.push({ value: hours, unit: "h" });
  } else if (hours > 0) {
    parts.push({ value: hours, unit: "h" });
    parts.push({ value: minutes, unit: "m" });
  } else if (minutes > 0) {
    parts.push({ value: minutes, unit: "m" });
    parts.push({ value: seconds, unit: "s" });
  } else {
    parts.push({ value: seconds, unit: "s" });
  }
  
  const display = parts.map(p => `${p.value}${p.unit}`).join(" ");
  return { display, parts, isExpired: false };
};

// Get icon and color based on duration
const getDurationStyle = (minutes: number): { icon: React.ReactNode; color: string; gradient: string } => {
  if (minutes <= 30) {
    return { icon: <Zap className="w-6 h-6" />, color: "#22c55e", gradient: "from-[#22c55e] to-[#4ade80]" };
  } else if (minutes <= 120) {
    return { icon: <Coffee className="w-6 h-6" />, color: "#4a5d4a", gradient: "from-[#4a5d4a] to-[#6b8e6b]" };
  } else if (minutes <= 60 * 6) {
    return { icon: <Clock className="w-6 h-6" />, color: "#c9a962", gradient: "from-[#c9a962] to-[#e0c98a]" };
  } else if (minutes <= 60 * 24) {
    return { icon: <Moon className="w-6 h-6" />, color: "#8b5cf6", gradient: "from-[#8b5cf6] to-[#a78bfa]" };
  } else if (minutes <= 60 * 24 * 3) {
    return { icon: <Sun className="w-6 h-6" />, color: "#f59e0b", gradient: "from-[#f59e0b] to-[#fbbf24]" };
  } else {
    return { icon: <Sparkles className="w-6 h-6" />, color: "#a85d5d", gradient: "from-[#a85d5d] to-[#c98b8b]" };
  }
};

// Markers for the timeline
const MARKERS = [
  { minutes: 0, label: "Now" },
  { minutes: 1, label: "1m" },
  { minutes: 5, label: "5m" },
  { minutes: 15, label: "15m" },
  { minutes: 60, label: "1h" },
  { minutes: 240, label: "4h" },
  { minutes: 60 * 24, label: "1d" },
  { minutes: 60 * 24 * 7, label: "1w" },
];

export function BackAtPicker({ value, onChange }: BackAtPickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasMoved, setHasMoved] = React.useState(false); // Track if user has moved since drag start
  
  // Track if component has mounted (for hydration safety)
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // The target "back at" time - this is the source of truth
  // Use a stable initial value for SSR, then update on client
  const [targetTime, setTargetTime] = React.useState<Date>(() => {
    if (value) return value;
    // Use a fixed default for SSR - will be updated immediately on mount
    return new Date(0);
  });
  
  // Initialize targetTime on mount to avoid hydration mismatch
  React.useEffect(() => {
    if (!value) {
      setTargetTime(new Date(Date.now() + 120 * 60 * 1000));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Calculate remaining seconds from target time
  const getRemainingSeconds = React.useCallback(() => {
    const remaining = Math.max(0, (targetTime.getTime() - Date.now()) / 1000);
    // Allow 0, clamp to max
    return Math.min(MAX_SECONDS, remaining);
  }, [targetTime]);
  
  // Position derived from remaining time (0-1)
  const [position, setPosition] = React.useState(0); // Start at 0 for SSR
  
  // Spring-animated position - smooth for countdown, instant when dragging
  const springPosition = useSpring(position, {
    stiffness: isDragging ? 1000 : 120,
    damping: isDragging ? 50 : 20,
    mass: isDragging ? 0.1 : 0.3,
  });
  
  // Update spring target when position changes
  React.useEffect(() => {
    springPosition.set(position);
  }, [position, springPosition]);
  
  // Transform spring value to percentage for CSS
  const progressWidth = useTransform(springPosition, (v) => `${v * 100}%`);
  const thumbLeft = useTransform(springPosition, (v) => `${v * 100}%`);
  
  // Current values derived from position
  const currentSeconds = positionToSeconds(position);
  const currentMinutes = currentSeconds / 60;
  const style = getDurationStyle(currentMinutes);
  
  // Time display logic:
  // - While dragging: show preview of what you're selecting (frozen, based on slider position)
  // - While not dragging: show live countdown to target
  
  // Countdown state - use stable initial value for SSR
  const [countdown, setCountdown] = React.useState<ReturnType<typeof formatCountdown>>({
    display: "--",
    parts: [{ value: 0, unit: "h" }, { value: 0, unit: "m" }],
    isExpired: false
  });
  
  // Initialize position after mount to avoid hydration mismatch
  React.useEffect(() => {
    if (isDragging) return; // Don't override position while dragging
    const remaining = getRemainingSeconds();
    setPosition(secondsToPosition(remaining));
  }, [getRemainingSeconds, isDragging]);
  
  // Display time for "Back at" label
  // Only show preview time if dragging AND has moved
  const displayTime = (isDragging && hasMoved)
    ? new Date(Date.now() + currentSeconds * 1000)
    : targetTime;
  
  // Update countdown display
  React.useEffect(() => {
    // Case 1: Dragging and has moved - show preview based on slider position
    if (isDragging && hasMoved) {
      setCountdown(formatCountdown(new Date(Date.now() + currentSeconds * 1000)));
      return;
    }
    
    // Case 2: Dragging but hasn't moved - freeze, keep current countdown value
    if (isDragging && !hasMoved) {
      // Do nothing - keep the countdown frozen at whatever it was
      return;
    }
    
    // Case 3: Not dragging - live countdown using targetTime directly
    const tick = () => setCountdown(formatCountdown(targetTime));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // Note: currentSeconds only matters when hasMoved is true
  }, [isDragging, hasMoved, currentSeconds, targetTime]);
  
  // Sync position to remaining time every second (when not dragging)
  React.useEffect(() => {
    if (isDragging) return;
    
    // Sync position to remaining time
    const syncPosition = () => {
      const remaining = getRemainingSeconds();
      setPosition(secondsToPosition(remaining));
    };
    
    // Only sync on interval, not immediately on release
    // This prevents position rounding from affecting the countdown on release
    const interval = setInterval(syncPosition, 1000);
    return () => clearInterval(interval);
  }, [targetTime, isDragging, getRemainingSeconds]);
  
  // Note: We intentionally DON'T sync from value prop after initial mount
  // The BackAtPicker owns its own targetTime state and only updates parent via onChange
  // This prevents the parent's stale Date object from resetting our live countdown

  // Handle mouse/touch drag
  const dragStartX = React.useRef<number | null>(null);
  const dragStartTime = React.useRef<number>(0); // When drag started (for pausing timer)
  const startPosition = React.useRef<number>(0); // Position when drag started
  const MOVE_THRESHOLD = 8; // pixels - must move at least this much to count as a "move"
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent click from bubbling to track
    setIsDragging(true);
    setHasMoved(false);
    dragStartX.current = e.clientX; // Remember where we started
    dragStartTime.current = Date.now(); // Remember when we started (for pausing)
    startPosition.current = position; // Remember the position when we started
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Track last tick position for sound
  const lastTickPos = React.useRef<number>(0);
  const ticksPerFullSlide = 60; // Total ticks across the full slider

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // Check if user has moved past threshold
    const movedDistance = dragStartX.current !== null 
      ? Math.abs(e.clientX - dragStartX.current) 
      : 0;
    
    // Don't update position until user has actually moved past threshold
    if (!hasMoved && movedDistance < MOVE_THRESHOLD) {
      return; // Still within threshold, don't move yet
    }
    
    // Mark that user has crossed the threshold
    if (!hasMoved) {
      setHasMoved(true);
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPos = Math.max(0, Math.min(1, x / rect.width));
    
    // Tick based on position, with intensity ramping up from start to end
    const tickStep = 1 / ticksPerFullSlide;
    const currentTickIndex = Math.floor(newPos / tickStep);
    const lastTickIndex = Math.floor(lastTickPos.current / tickStep);
    
    if (currentTickIndex !== lastTickIndex) {
      // Intensity ramps from 0.3 at start to 1.0 at end
      const intensity = 0.3 + newPos * 0.7;
      tickSound.play(intensity);
      lastTickPos.current = newPos;
    }
    
    setPosition(newPos);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      lastDragEnd.current = Date.now(); // Mark when we stopped dragging
      
      if (hasMoved) {
        // User moved - commit the new time based on slider position
        const newTargetTime = new Date(Date.now() + currentSeconds * 1000);
        setTargetTime(newTargetTime);
        onChange(newTargetTime);
      } else {
        // User didn't move - "unpause" by adding elapsed hold time to target
        const elapsedMs = Date.now() - dragStartTime.current;
        const adjustedTarget = new Date(targetTime.getTime() + elapsedMs);
        setTargetTime(adjustedTarget);
        onChange(adjustedTarget);
      }
      
      setHasMoved(false);
    }
  };

  // Track when we last finished dragging to avoid false track clicks
  const lastDragEnd = React.useRef<number>(0);
  
  // Handle click on track
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    // Ignore clicks that happen right after dragging (within 100ms)
    if (Date.now() - lastDragEnd.current < 100) return;
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPos = Math.max(0, Math.min(1, clickX / rect.width));
    
    setPosition(newPos);
    
    setTimeout(() => {
      const secs = positionToSeconds(newPos);
      const newTargetTime = new Date(Date.now() + secs * 1000);
      setTargetTime(newTargetTime);
      onChange(newTargetTime);
    }, 100);
  };

  const handleClear = () => {
    const defaultTarget = new Date(Date.now() + 120 * 60 * 1000);
    setTargetTime(defaultTarget);
    setPosition(secondsToPosition(120 * 60));
    onChange(null);
  };

  const handlePresetClick = (minutes: number) => {
    tickSound.play(0.8); // Satisfying click on preset
    const newPos = secondsToPosition(minutes * 60);
    setPosition(newPos);
    setTimeout(() => {
      const newTargetTime = new Date(Date.now() + minutes * 60 * 1000);
      setTargetTime(newTargetTime);
      onChange(newTargetTime);
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Main display */}
      <motion.div 
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${style.color}15, ${style.color}05)`,
        }}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              animate={{ backgroundColor: style.color }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white">{style.icon}</div>
            </motion.div>
            
            <div>
              {/* Live countdown display */}
              <div className="flex items-baseline gap-1">
                {countdown.parts.map((part, i) => (
                  <React.Fragment key={i}>
                    <div className="relative">
                      <motion.span 
                        key={`${part.unit}-${part.value}`}
                        className="text-5xl font-bold text-[#faf9f7] font-mono tabular-nums inline-block"
                        initial={{ opacity: 0.7, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {String(part.value).padStart(2, '0')}
                      </motion.span>
                    </div>
                    <span className="text-xl text-[#8a8780] mr-3">{part.unit}</span>
                    {i < countdown.parts.length - 1 && (
                      <motion.span 
                        className="text-3xl text-[#3a3935] mr-3 font-light"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        :
                      </motion.span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-sm text-[#6a6965] mt-1">
                {hasMounted ? (
                  <>Back at {format(displayTime, "h:mm a")} • {format(displayTime, "EEE, MMM d")}</>
                ) : (
                  <>Back at --:-- -- • --</>
                )}
              </p>
            </div>
          </div>

          {value && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-[#8a8780] hover:text-[#faf9f7]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Slider track */}
      <div 
        className="px-2"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div 
          ref={containerRef}
          className="relative h-16 cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Track background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full bg-[#2a2925]" />
          
          {/* Filled track - uses spring animation */}
          <motion.div 
            className={`absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-gradient-to-r ${style.gradient}`}
            style={{ width: progressWidth }}
          />

          {/* Markers */}
          {MARKERS.map((marker) => {
            const pos = secondsToPosition(marker.minutes * 60);
            return (
              <div
                key={marker.minutes}
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                style={{ left: `${pos * 100}%` }}
              >
                <div className="w-0.5 h-3 bg-[#3a3935] rounded-full mb-5" />
                <span className="text-[10px] text-[#6a6965] font-mono">{marker.label}</span>
              </div>
            );
          })}

          {/* Thumb - uses spring animation */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 touch-none select-none"
            style={{ left: thumbLeft }}
            onPointerDown={handlePointerDown}
            onClick={(e) => e.stopPropagation()} // Prevent click from reaching track
          >
            <motion.div
              className="relative cursor-grab active:cursor-grabbing"
              animate={{ scale: isDragging ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Outer glow - pulses subtly */}
              <motion.div
                className="absolute inset-0 rounded-full blur-lg"
                style={{ backgroundColor: style.color }}
                animate={{ 
                  opacity: isDragging ? 0.7 : 0.4,
                  scale: isDragging ? 2 : 1.4,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              
              {/* Secondary glow ring */}
              <motion.div
                className="absolute inset-[-4px] rounded-full"
                style={{ backgroundColor: style.color }}
                animate={{ 
                  opacity: isDragging ? 0.3 : 0,
                  scale: isDragging ? 1.6 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
              
              {/* Main thumb */}
              <motion.div
                className="relative w-8 h-8 rounded-full border-4 border-[#1a1915] shadow-xl flex items-center justify-center"
                animate={{ backgroundColor: style.color }}
                transition={{ duration: 0.15 }}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ scale: isDragging ? 0.8 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "30 min", minutes: 30 },
          { label: "1 hour", minutes: 60 },
          { label: "2 hours", minutes: 120 },
          { label: "4 hours", minutes: 240 },
          { label: "Tomorrow", minutes: (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            return Math.max(60, Math.round((tomorrow.getTime() - Date.now()) / 60000));
          })() },
          { label: "Next week", minutes: 60 * 24 * 7 },
        ].map((preset) => {
          const isActive = Math.abs(currentMinutes - preset.minutes) < preset.minutes * 0.15;
          return (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.minutes)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#4a5d4a] text-white"
                  : "bg-[#252520] text-[#8a8780] hover:bg-[#2a2925] hover:text-[#faf9f7]"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
