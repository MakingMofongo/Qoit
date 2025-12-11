"use client";

import { motion } from "framer-motion";

export function ManifestoSection() {
  return (
    <section className="py-28 px-6 bg-[#f5f4f0] relative overflow-hidden">
      {/* Large background text - Apple layering style */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display text-[25vw] font-bold text-[#1a1915] leading-none whitespace-nowrap">
          presence
        </span>
      </motion.div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-10">Our belief</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.15] mb-10">
            Silence is not absence.
            <br />
            <span className="text-[#8a8780]">It's presence elsewhere.</span>
          </h2>
          <p className="text-xl md:text-2xl text-[#8a8780] leading-relaxed max-w-2xl mx-auto">
            You are not "away." You are exactly where you need to be—just not 
            here. Qoit is for the creators, the thinkers, the humans who know 
            that the best things happen when you're not performing availability 
            for an audience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

