"use client";

import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section className="py-28 px-6 bg-[#1a1915] text-[#faf9f7]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-sm text-[#faf9f7]/50 uppercase tracking-wider mb-4">How it works</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
            Three steps to peace
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              step: "01",
              title: "Create your page",
              description: "Set up your personal qoit.page in minutes. Choose your style, set your defaults.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              step: "02", 
              title: "Share once",
              description: "Add your link to email signatures, bios, auto-responders. One link for everything.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              step: "03",
              title: "Go qoit",
              description: "Toggle your status when you need space. Your page tells the world you're present—just elsewhere.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-[#faf9f7]/20 to-transparent" />
              )}
              
              <div className="bg-[#faf9f7]/5 rounded-3xl p-8 border border-[#faf9f7]/10 hover:border-[#c9a962]/30 transition-colors h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf9f7]/10 flex items-center justify-center text-[#c9a962]">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-[#faf9f7]/40">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-[#faf9f7]/60 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

