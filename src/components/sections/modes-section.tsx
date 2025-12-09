"use client";

import { motion } from "framer-motion";
import { StatusModes } from "@/components/status-modes";

export function ModesSection() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">Modes</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
            Your status, your way
          </h2>
        </motion.div>

        <StatusModes />
      </div>
    </section>
  );
}

