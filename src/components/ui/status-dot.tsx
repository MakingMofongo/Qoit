"use client";

import type { StatusMode } from "@/types/database";

const STATUS_COLORS: Record<StatusMode, string> = {
  available: "bg-[#22c55e]",
  qoit: "bg-[#4a5d4a]",
  focused: "bg-[#c9a962]",
  away: "bg-[#a85d5d]",
};

export function StatusDot({ 
  status, 
  pulse = true 
}: { 
  status: StatusMode; 
  pulse?: boolean 
}) {
  const color = STATUS_COLORS[status];
  const shouldPulse = pulse && status !== "available";

  return (
    <span className="relative flex h-3 w-3">
      {shouldPulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-40 animate-ping`}
          style={{ animationDuration: "2s" }}
        />
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}
