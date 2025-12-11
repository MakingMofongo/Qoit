"use client";

import { motion } from "framer-motion";
import { Testimonial } from "@/components/testimonial";

export function TestimonialsSection() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">Early voices</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
            People who get it
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <Testimonial
            quote="I used to feel guilty every time I needed to unplug. Now I just share my qoit page and it says everything I couldn't."
            author="Sarah Kim"
            role="Freelance Writer"
            delay={0}
            featured
          />
          <Testimonial
            quote="My clients actually respect my boundaries more now. Something about seeing it on a beautiful page makes it feel... legitimate."
            author="Marcus Chen"
            role="UX Designer"
            delay={0.1}
          />
          <Testimonial
            quote="The emergency contact feature is genius. Real emergencies get through. Everything else can wait. As it should be."
            author="Priya Sharma"
            role="Startup Founder"
            delay={0.2}
          />
          <Testimonial
            quote="I put my qoit page in my email auto-responder during vacation. Zero anxiety about missing something important."
            author="James O'Brien"
            role="Engineering Lead"
            delay={0.3}
            featured
          />
        </div>
      </div>
    </section>
  );
}

