"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { format, differenceInMinutes, differenceInDays, isSameDay } from "date-fns";

interface CalendarMockupProps {
  isQoit: boolean;
  backAtTime: Date | null;
  animationDelay: number;
}

type ViewMode = "hours" | "days" | "week";

export function CalendarMockup({ isQoit, backAtTime, animationDelay }: CalendarMockupProps) {
  const [localState, setLocalState] = useState(isQoit);
  const [localBackAtTime, setLocalBackAtTime] = useState<Date | null>(backAtTime);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalState(isQoit);
      setLocalBackAtTime(backAtTime);
    }, animationDelay * 1000);
    return () => clearTimeout(timer);
  }, [isQoit, backAtTime, animationDelay]);

  // Update now every minute to keep calendar current
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine view mode based on duration
  const viewMode: ViewMode = useMemo(() => {
    if (!localBackAtTime) return "hours";
    const days = differenceInDays(localBackAtTime, now);
    if (days >= 3) return "week";
    if (days >= 1) return "days";
    return "hours";
  }, [now, localBackAtTime]);

  // Format hour for display (12-hour format)
  const formatHour = (hour: number) => {
    const normalizedHour = ((hour % 24) + 24) % 24;
    const h = normalizedHour % 12 || 12;
    const ampm = normalizedHour >= 12 ? "PM" : "AM";
    return `${h} ${ampm}`;
  };

  // Calculate data for hours view
  const hoursViewData = useMemo(() => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const slotHeight = 25;
    
    if (!localBackAtTime) {
      return {
        slots: [
          { hour: currentHour, isEllipsis: false },
          { hour: currentHour + 1, isEllipsis: false },
          { hour: currentHour + 2, isEllipsis: false },
          { hour: currentHour + 3, isEllipsis: false },
        ],
        eventHeight: 0,
        eventTop: 0,
        timeRangeLabel: "",
        slotHeight,
      };
    }

    const durationMinutes = Math.max(0, differenceInMinutes(localBackAtTime, now));
    const durationHours = durationMinutes / 60;
    
    // Calculate the final slot hour based on duration from current hour
    // Use ceiling of duration to get the last hour slot we need to show
    // (if ends at 6:24 PM and it's 2 PM, that's 4.4 hours, ceiling = 5, so show 7 PM as final slot)
    const hoursUntilEnd = Math.ceil(durationHours);
    const finalSlotHour = currentHour + hoursUntilEnd;
    
    // Determine if we need ellipsis (event spans more than 3 hours from current)
    const needsEllipsis = hoursUntilEnd > 3;
    
    let slots: { hour: number; isEllipsis: boolean }[];
    
    if (needsEllipsis) {
      // Show: current, current+1, ellipsis, final hour
      slots = [
        { hour: currentHour, isEllipsis: false },
        { hour: currentHour + 1, isEllipsis: false },
        { hour: -1, isEllipsis: true }, // -1 indicates ellipsis
        { hour: finalSlotHour, isEllipsis: false },
      ];
    } else {
      // Normal sequential slots
      slots = Array.from({ length: 4 }, (_, i) => ({
        hour: currentHour + i,
        isEllipsis: false,
      }));
    }
    
    const minuteOffset = currentMinute / 60;
    const eventTop = minuteOffset * slotHeight;
    
    // Event fills to the bottom (since last slot is the end hour)
    const eventHeight = needsEllipsis 
      ? (4 - minuteOffset) * slotHeight - 2  // Fill to bottom
      : Math.max(24, Math.min(durationHours, 4 - minuteOffset) * slotHeight);
    
    const startTimeStr = format(now, "h:mm");
    const sameDay = isSameDay(now, localBackAtTime);
    const endTimeStr = sameDay 
      ? format(localBackAtTime, "h:mm a")
      : format(localBackAtTime, "MMM d, h:mm a");
    
    return {
      slots,
      eventHeight: Math.min(eventHeight, 4 * slotHeight - eventTop - 2),
      eventTop: Math.max(0, eventTop),
      timeRangeLabel: `${startTimeStr} – ${endTimeStr}`,
      slotHeight,
    };
  }, [now, localBackAtTime]);

  // Calculate data for days view (1-3 days)
  const daysViewData = useMemo(() => {
    if (!localBackAtTime) return { days: [], eventSpan: 0 };
    
    const totalDays = Math.min(4, Math.ceil(differenceInDays(localBackAtTime, now)) + 1);
    const days = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      return {
        dayName: format(date, "EEE"),
        dayNum: format(date, "d"),
        isToday: i === 0,
      };
    });
    
    const eventSpan = Math.min(totalDays, Math.ceil(differenceInMinutes(localBackAtTime, now) / (60 * 24)) + 1);
    
    return { days, eventSpan };
  }, [now, localBackAtTime]);

  // Calculate data for week view (3-7 days)
  const weekViewData = useMemo(() => {
    if (!localBackAtTime) return { days: [], eventSpan: 0, endDayLabel: "" };
    
    const totalDays = 7;
    const days = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      return {
        dayName: format(date, "EEEEE"), // Single letter
        dayNum: format(date, "d"),
        isToday: i === 0,
        isEndDay: isSameDay(date, localBackAtTime),
      };
    });
    
    const durationDays = differenceInDays(localBackAtTime, now);
    const eventSpan = Math.min(7, durationDays + 1);
    
    return { 
      days, 
      eventSpan,
      endDayLabel: format(localBackAtTime, "EEE, MMM d 'at' h:mm a"),
    };
  }, [now, localBackAtTime]);

  // Get current date for calendar header
  const currentMonth = useMemo(() => format(now, "MMMM yyyy"), [now]);
  const currentDay = useMemo(() => format(now, "d"), [now]);

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
              {currentDay}
            </text>
          </svg>
          <span className="text-white text-xs font-medium">{currentMonth}</span>
        </div>
        <span className="text-[#8ab4f8] text-[10px]">Today</span>
      </div>

      {/* Dynamic view based on duration */}
      <div className="p-3">
        <AnimatePresence mode="wait">
          {viewMode === "hours" && (
            <motion.div
              key="hours-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Hour markers */}
              {hoursViewData.slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2 text-[10px] text-[#5a5a55] h-[25px]">
                  <span className="w-12 text-right shrink-0">
                    {slot.isEllipsis ? (
                      <span className="tracking-wider">•••</span>
                    ) : (
                      formatHour(slot.hour)
                    )}
                  </span>
                  <div className={`flex-1 h-px ${slot.isEllipsis ? "bg-transparent" : "bg-[#2a2a28]"}`} />
                </div>
              ))}

              {/* Event block */}
              <AnimatePresence>
                {localState && localBackAtTime && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: hoursViewData.eventHeight,
                      top: hoursViewData.eventTop,
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.4, 0, 0.2, 1],
                      height: { type: "spring", stiffness: 300, damping: 30 },
                    }}
                    className="absolute left-14 right-0 bg-[#4a5d4a] rounded-lg p-2 border-l-4 border-[#6a9a6a] overflow-hidden"
                    style={{ transformOrigin: "top" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🌙</span>
                      <span className="text-xs font-medium text-[#faf9f7]">Qoit Mode</span>
                    </div>
                    <motion.div 
                      className="text-[10px] text-[#9fcf9f] mt-0.5 truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {hoursViewData.timeRangeLabel}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === "days" && (
            <motion.div
              key="days-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {/* Day columns */}
              <div className="flex gap-1">
                {daysViewData.days.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className={`text-[9px] ${day.isToday ? "text-[#8ab4f8]" : "text-[#5a5a55]"}`}>
                      {day.dayName}
                    </div>
                    <div className={`text-xs font-medium ${day.isToday ? "text-[#8ab4f8]" : "text-[#8a8a85]"}`}>
                      {day.dayNum}
                    </div>
                  </div>
                ))}
              </div>

              {/* Event spanning days */}
              <AnimatePresence>
                {localState && localBackAtTime && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scaleX: 1,
                      width: `${(daysViewData.eventSpan / daysViewData.days.length) * 100}%`,
                    }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.4, 0, 0.2, 1],
                      width: { type: "spring", stiffness: 200, damping: 25 },
                    }}
                    style={{ transformOrigin: "left" }}
                    className="bg-[#4a5d4a] rounded-lg p-2.5 border-l-4 border-[#6a9a6a]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🌙</span>
                      <span className="text-xs font-medium text-[#faf9f7]">Qoit Mode</span>
                    </div>
                    <motion.div 
                      className="text-[10px] text-[#9fcf9f] mt-0.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      Until {format(localBackAtTime, "EEE h:mm a")}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === "week" && (
            <motion.div
              key="week-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {/* Week day headers */}
              <div className="flex">
                {weekViewData.days.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className={`text-[8px] ${day.isToday ? "text-[#8ab4f8]" : "text-[#5a5a55]"}`}>
                      {day.dayName}
                    </div>
                    <motion.div 
                      className={`text-[10px] font-medium w-5 h-5 mx-auto flex items-center justify-center rounded-full
                        ${day.isToday ? "bg-[#8ab4f8] text-[#1a1a18]" : day.isEndDay ? "bg-[#4a5d4a] text-white" : "text-[#8a8a85]"}`}
                      animate={day.isEndDay ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {day.dayNum}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Event bar spanning the week */}
              <AnimatePresence>
                {localState && localBackAtTime && (
                  <motion.div
                    className="relative h-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (weekViewData.eventSpan / 7) * 100)}%`,
                      }}
                      transition={{ 
                        duration: 0.5, 
                        ease: [0.4, 0, 0.2, 1],
                        width: { type: "spring", stiffness: 150, damping: 20 },
                      }}
                      className="absolute left-0 top-0 h-full bg-[#4a5d4a] rounded-lg border-l-4 border-[#6a9a6a] flex items-center px-2 gap-1.5 overflow-hidden"
                    >
                      <span className="text-xs shrink-0">🌙</span>
                      <motion.span 
                        className="text-[10px] font-medium text-[#faf9f7] whitespace-nowrap"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Qoit Mode
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* End date label */}
              <AnimatePresence>
                {localState && localBackAtTime && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ delay: 0.3 }}
                    className="text-[10px] text-[#9fcf9f] text-center"
                  >
                    Back {weekViewData.endDayLabel}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}



