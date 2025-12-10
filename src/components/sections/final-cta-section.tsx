"use client";

import { motion } from "framer-motion";
import { FloatingElement } from "@/components/ui/floating-element";
import Link from "next/link";

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
            Create your personal status page in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#faf9f7] text-[#1a1915] rounded-2xl font-medium hover:bg-[#e8e6e1] transition-colors text-lg"
            >
              Create your page
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-[#faf9f7]/70 rounded-2xl font-medium hover:text-[#faf9f7] hover:bg-[#faf9f7]/10 transition-colors border border-[#faf9f7]/20"
            >
              Sign in
            </Link>
          </div>

          <p className="text-sm text-[#faf9f7]/40 mt-8">
            Free to use. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
