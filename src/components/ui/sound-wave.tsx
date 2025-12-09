"use client";

import { motion } from "framer-motion";

export function SoundWave({ muted = false, size = "default" }: { muted?: boolean; size?: "small" | "default" }) {
  const bars = size === "small" ? 16 : 24;
  const height = size === "small" ? "h-5" : "h-8";
  const gap = size === "small" ? "gap-[2px]" : "gap-[3px]";
  const width = size === "small" ? "w-[1.5px]" : "w-[2px]";
  
  return (
    <div className={`flex items-end ${gap} ${height}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`${width} bg-current rounded-full`}
          style={{ height: muted ? "4px" : "100%" }}
          animate={
            muted
              ? { scaleY: 0.15 }
              : { scaleY: [0.3, 1, 0.5, 0.8, 0.3] }
          }
          transition={
            muted
              ? { duration: 0.5 }
              : {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}

