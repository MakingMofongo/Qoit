"use client";

export function StatusDot({ status, pulse = true }: { status: "qoit" | "available" | "busy"; pulse?: boolean }) {
  const colors = {
    qoit: "bg-[#4a5d4a]",
    available: "bg-[#4a5d4a]",
    busy: "bg-[#c9a962]",
  };

  return (
    <span className="relative flex h-3 w-3">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-40 animate-ping`}
          style={{ animationDuration: "2s" }}
        />
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status]}`} />
    </span>
  );
}

