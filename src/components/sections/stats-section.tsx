"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";

export function StatsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#faf9f7] to-[#f5f4f0]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: 2847, label: "On waitlist", icon: "👥" },
            { value: 94, suffix: "%", label: "Feel less guilty", icon: "✨" },
            { value: 3.2, suffix: "x", label: "Faster response when back", icon: "⚡" },
            { value: 12, suffix: "h", label: "Avg. qoit time per week", icon: "🌿" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div 
                className="text-2xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2 }}
              >
                {stat.icon}
              </motion.div>
              <p className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-2 tracking-tight">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-[#8a8780] max-w-[120px] mx-auto">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

