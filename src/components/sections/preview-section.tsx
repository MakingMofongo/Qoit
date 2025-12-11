"use client";

import { motion } from "framer-motion";
import { PreviewCard } from "@/components/preview-card";

export function PreviewSection() {
  return (
    <section className="py-28 px-6 bg-[#f5f4f0]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">Your qoit page</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight leading-tight">
            A personal status page<br />
            <span className="text-[#8a8780]">that respects boundaries</span>
          </h2>
        </motion.div>

        <PreviewCard />

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {["Custom URL", "Response Times", "Countdown", "Emergency Contact", "Personal Note", "Auto-responses"].map((feature, i) => (
            <motion.span
              key={feature}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              viewport={{ once: true }}
              className="px-4 py-2 bg-[#faf9f7] rounded-full text-sm border border-[#e8e6e1] hover:border-[#c9a962]/50 transition-colors cursor-default"
            >
              {feature}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

