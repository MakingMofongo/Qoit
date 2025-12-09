"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { EmailSignup } from "@/components/email-signup";
import { AnimatedNumber } from "@/components/ui/animated-number";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -30]);
  
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  
  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => setWaitlistCount(data.count))
      .catch(() => setWaitlistCount(0));
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-[#faf9f7]">
      
      {/* Shader background - converges onto "quiet", then snaps out */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.25 }}
        animate={{ opacity: 0, scale: 0.98 }}
        transition={{ 
          opacity: { delay: 2.2, duration: 0.3, ease: "easeIn" },
          scale: { delay: 2.2, duration: 0.3, ease: "easeIn" }
        }}
      >
        <ShaderAnimation 
          className="w-full h-full" 
          duration={3000} 
          target={{ x: 0, y: 0.05 }}
        />
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
            
            {/* "quiet" - emerges as rings give way */}
            <span className="block relative overflow-visible">
              {/* Text materializes from the convergence point */}
              <motion.span 
                className="relative inline-block text-[#1a1915]"
                initial={{ 
                  scale: 0.9,
                  opacity: 0
                }}
                animate={{ 
                  scale: 1,
                  opacity: 1
                }}
                transition={{ 
                  delay: 2.15,
                  duration: 0.5,
                  ease: [0.0, 0.0, 0.2, 1]
                }}
              >
                {/* Letters spread out from center */}
                {"quiet".split("").map((letter, i) => {
                  const centerIndex = 2; // 'i' is center
                  const distFromCenter = i - centerIndex;
                  return (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ 
                        x: -distFromCenter * 15,
                        filter: "blur(4px)",
                        opacity: 0
                      }}
                      animate={{ 
                        x: 0,
                        filter: "blur(0px)",
                        opacity: 1
                      }}
                      transition={{ 
                        delay: 2.2 + Math.abs(distFromCenter) * 0.05,
                        duration: 0.4,
                        ease: [0.0, 0.0, 0.2, 1]
                      }}
                    >
                      {letter}
                    </motion.span>
                  );
                })}
              </motion.span>
              
            </span>
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

          {/* Social proof - only show if there are waitlist signups */}
          {waitlistCount !== null && waitlistCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-2 text-sm text-[#8a8780]"
            >
              <span>Join <span className="font-medium text-[#1a1915]"><AnimatedNumber value={waitlistCount} /></span> {waitlistCount === 1 ? "other" : "others"} on the waitlist</span>
            </motion.div>
          )}
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

