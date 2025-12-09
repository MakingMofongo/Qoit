"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { EmailSignup } from "@/components/email-signup";
import { AnimatedNumber } from "@/components/ui/animated-number";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -30]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-[#faf9f7]">
      
      {/* Shader background - fades out as "quiet" fades in */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1, ease: "easeOut" }}
      >
        <ShaderAnimation className="w-full h-full" duration={3000} />
      </motion.div>
      
      {/* Main content */}
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 bg-[#f5f4f0] border border-[#e8e6e1] rounded-full px-4 py-2 mb-12"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#4a5d4a] opacity-75 animate-ping" style={{ animationDuration: "3s" }} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a5d4a]" />
            </span>
            <span className="text-sm text-[#8a8780]">Launching soon</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-display font-semibold tracking-tight mb-8 leading-[1.05]"
          >
            <span className="block text-[#8a8780]">The art of going</span>
            
            {/* "quiet" - fades in as shader fades out */}
            <motion.span 
              className="block text-[#1a1915]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              quiet
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-[#8a8780] max-w-lg mx-auto mb-12"
          >
            A personal status page for when you need the world to wait.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            <EmailSignup />
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-4 text-sm text-[#8a8780]"
          >
            <div className="flex -space-x-2">
              {["S", "M", "P", "J"].map((initial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8e6e1] to-[#d8d6d1] border-2 border-[#faf9f7] flex items-center justify-center text-xs font-medium text-[#8a8780]"
                >
                  {initial}
                </motion.div>
              ))}
            </div>
            <span>Join <span className="font-medium text-[#1a1915]"><AnimatedNumber value={2847} /></span> others</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-[#e8e6e1] flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1 h-1.5 bg-[#c9c8c4] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

