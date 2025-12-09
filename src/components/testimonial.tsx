"use client";

import { motion } from "framer-motion";

export function Testimonial({
  quote,
  author,
  role,
  delay = 0,
  featured = false,
}: {
  quote: string;
  author: string;
  role: string;
  delay?: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className={`relative rounded-2xl p-6 md:p-8 border transition-all group hover:shadow-lg hover:shadow-[#1a1915]/5 ${
        featured 
          ? "bg-[#1a1915] text-[#faf9f7] border-[#1a1915]" 
          : "bg-[#faf9f7] border-[#e8e6e1] hover:border-[#c9a962]/30"
      }`}
    >
      {/* Large quote mark */}
      <div className={`absolute top-4 right-6 font-display text-7xl leading-none select-none ${
        featured ? "text-[#faf9f7]/10" : "text-[#e8e6e1]"
      }`}>
        "
      </div>
      
      <p className={`text-lg mb-6 relative z-10 leading-relaxed pr-8 ${
        featured ? "text-[#faf9f7]/90" : ""
      }`}>
        {quote}
      </p>
      
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
          featured 
            ? "bg-[#faf9f7]/10 text-[#faf9f7]" 
            : "bg-gradient-to-br from-[#e8e6e1] to-[#d8d6d1] text-[#8a8780]"
        }`}>
          {author.charAt(0)}
        </div>
        <div>
          <p className={`font-medium text-sm ${featured ? "text-[#faf9f7]" : ""}`}>{author}</p>
          <p className={`text-xs ${featured ? "text-[#faf9f7]/50" : "text-[#8a8780]"}`}>{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

