"use client";

import { motion } from "framer-motion";

export function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ x: 4 }}
      className="group cursor-default"
    >
      <div className="flex gap-5">
        <motion.div 
          className="w-12 h-12 rounded-2xl bg-[#faf9f7] border border-[#e8e6e1] flex items-center justify-center text-[#8a8780] group-hover:bg-[#1a1915] group-hover:text-[#faf9f7] group-hover:border-[#1a1915] transition-all duration-300 shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold mb-1.5 group-hover:text-[#4a5d4a] transition-colors">{title}</h3>
          <p className="text-[#8a8780] leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

