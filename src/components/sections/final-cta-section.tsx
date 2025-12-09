"use client";

import { motion } from "framer-motion";
import { FloatingElement } from "@/components/ui/floating-element";
import { EmailSignup } from "@/components/email-signup";

export function FinalCTASection() {
  return (
    <section id="waitlist" className="py-28 px-6 bg-[#1a1915] text-[#faf9f7]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FloatingElement delay={0}>
            <div className="w-20 h-20 rounded-full bg-[#faf9f7]/10 flex items-center justify-center mx-auto mb-10">
              <div className="w-6 h-6 rounded-full bg-[#faf9f7]" />
            </div>
          </FloatingElement>

          <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight mb-6">
            Ready to go qoit?
          </h2>
          <p className="text-xl text-[#faf9f7]/60 mb-12">
            Join the waitlist. We'll whisper when it's your turn.
          </p>

          <div className="max-w-md mx-auto">
            <EmailSignup dark />
          </div>

          <p className="text-sm text-[#faf9f7]/40 mt-8">
            Free during beta. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

