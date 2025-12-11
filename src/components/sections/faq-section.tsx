"use client";

import { motion } from "framer-motion";
import { FAQItem } from "@/components/faq-item";

export function FAQSection() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
            Questions answered
          </h2>
        </motion.div>

        <div className="space-y-4">
          <FAQItem
            question="How is this different from an auto-responder?"
            answer="Auto-responders are reactive and often ignored. Your qoit page is proactive—a beautiful destination that respects both your time and theirs. People land somewhere thoughtfully designed, not a boring bounce message."
            defaultOpen
          />
          <FAQItem
            question="Is this just for remote workers?"
            answer="Anyone who needs boundaries benefits from qoit. Whether you're a freelancer, founder, creative, or parent—if you've ever felt guilty about needing space, this is for you."
          />
          <FAQItem
            question="What about actual emergencies?"
            answer="You define what counts as urgent. Set up an emergency contact option that bypasses your qoit status—only for what truly can't wait. You stay in control."
          />
          <FAQItem
            question="Can I schedule my qoit time?"
            answer="Yes! Plan your offline time in advance. Set recurring qoit periods, vacation modes, or deep work blocks. Your status updates automatically."
          />
          <FAQItem
            question="What does qoit even mean?"
            answer="It's quiet, reimagined. Not a hard stop—just a soft pause. A gentle signal that you're present in the world, just not here right now."
          />
        </div>
      </div>
    </section>
  );
}

