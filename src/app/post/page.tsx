"use client";

import { motion } from "framer-motion";

export default function PostPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-8">
      {/* Card container - optimized for Twitter screenshot */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[540px] relative"
      >
        {/* Main card */}
        <div className="bg-[#faf9f7] border border-[#e8e6e1] rounded-3xl p-12 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5f4f0] via-[#faf9f7] to-[#f0efeb] opacity-60" />
          
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-[#4a5d4a]/5 blur-2xl" />
          <div className="absolute bottom-12 left-6 w-32 h-32 rounded-full bg-[#c9a962]/5 blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 mb-10">
              <div className="w-2 h-2 rounded-full bg-[#4a5d4a]" />
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight leading-[1.15] mb-6">
              <span className="text-[#8a8780]">Introducing</span>
              <br />
              <span className="text-[#1a1915]">Qoit</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-[#1a1915] mb-3 leading-relaxed">
              A personal status page for when you need the world to wait.
            </p>
            
            {/* Description */}
            <p className="text-[#8a8780] text-base leading-relaxed mb-10">
              Not "out of office." Not "be right back."
              <br />
              Just... <span className="italic">qoit</span>.
            </p>
            
            {/* CTA hint */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#8a8780]">
                Join the waitlist →
              </p>
              <p className="text-sm font-medium text-[#1a1915]">
                qoit.page
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

