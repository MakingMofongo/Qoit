"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

// Next.js 15+ page props - params and searchParams are now Promises
type PageProps = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Animated gradient orb
function GradientOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Floating elements
function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Sound wave visualization component
function SoundWave({ muted = false, size = "default" }: { muted?: boolean; size?: "small" | "default" }) {
  const bars = size === "small" ? 16 : 24;
  const height = size === "small" ? "h-5" : "h-8";
  const gap = size === "small" ? "gap-[2px]" : "gap-[3px]";
  const width = size === "small" ? "w-[1.5px]" : "w-[2px]";
  
  return (
    <div className={`flex items-end ${gap} ${height}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`${width} bg-current rounded-full`}
          style={{ height: muted ? "4px" : "100%" }}
          animate={
            muted
              ? { scaleY: 0.15 }
              : { scaleY: [0.3, 1, 0.5, 0.8, 0.3] }
          }
          transition={
            muted
              ? { duration: 0.5 }
              : {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}

// Status indicator
function StatusDot({ status, pulse = true }: { status: "qoit" | "available" | "busy"; pulse?: boolean }) {
  const colors = {
    qoit: "bg-[#4a5d4a]",
    available: "bg-[#4a5d4a]",
    busy: "bg-[#c9a962]",
  };

  return (
    <span className="relative flex h-3 w-3">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-40 animate-ping`}
          style={{ animationDuration: "2s" }}
        />
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status]}`} />
    </span>
  );
}

// Interactive status mode selector
function StatusModes() {
  const [activeMode, setActiveMode] = useState<"qoit" | "focused" | "away">("qoit");
  
  const modes = [
    { id: "qoit" as const, label: "Qoit", desc: "Taking a breather", time: "Back in 2 days" },
    { id: "focused" as const, label: "Deep Work", desc: "In the zone", time: "Available at 5pm" },
    { id: "away" as const, label: "Away", desc: "On vacation", time: "Returns Dec 20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[#f5f4f0] rounded-3xl p-8 md:p-12"
    >
      <div className="flex flex-wrap gap-3 mb-8">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            style={{
              backgroundColor: activeMode === mode.id ? "#4a5d4a" : "transparent",
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeMode === mode.id
                ? "text-[#faf9f7]"
                : "text-[#8a8780] hover:text-[#4a5d4a]"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {modes.map(
          (mode) =>
            activeMode === mode.id && (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#e8e6e1] flex items-center justify-center">
                    <StatusDot status="qoit" pulse={false} />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{mode.desc}</p>
                    <p className="text-[#8a8780]">{mode.time}</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-[#8a8780] uppercase tracking-wider">Response time</p>
                  <p className="font-mono text-lg">~24-48h</p>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Compact hero preview card with Apple-style glass effect
function HeroPreviewCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Glow behind card */}
      <div className="absolute -inset-8 bg-gradient-to-br from-[#4a5d4a]/20 via-[#c9a962]/10 to-[#4a5d4a]/20 rounded-[40px] blur-2xl" />
      
      {/* Glass card */}
      <div className="relative glass-card rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#1a1915]/5 max-w-sm">
        {/* Status header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8e6e1] to-[#d8d6d1] flex items-center justify-center">
              <span className="text-lg font-medium text-[#8a8780]">M</span>
            </div>
            <div>
              <p className="font-semibold text-[#1a1915]">Maya Chen</p>
              <div className="flex items-center gap-2">
                <StatusDot status="qoit" pulse />
                <span className="text-xs text-[#4a5d4a] font-medium">Qoit Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-[#f5f4f0] rounded-2xl p-4 mb-5">
          <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-2">Back in</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold font-mono text-[#1a1915]">2</span>
            <span className="text-[#8a8780] text-sm">d</span>
            <span className="text-3xl font-semibold font-mono text-[#1a1915] ml-2">4</span>
            <span className="text-[#8a8780] text-sm">h</span>
          </div>
        </div>

        {/* Sound wave - muted state */}
        <div className="flex items-center gap-3 text-[#8a8780] mb-5">
          <SoundWave muted size="small" />
          <span className="text-sm italic">Taking a creative break</span>
        </div>

        {/* Quick note */}
        <div className="border-l-2 border-[#c9a962] pl-4">
          <p className="text-[#1a1915] handwritten text-lg">
            "Recharging creativity ✨"
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Preview card component
function PreviewCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-[#4a5d4a]/10 via-[#c9a962]/10 to-[#4a5d4a]/10 rounded-3xl blur-xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Browser chrome */}
      <div className="relative bg-[#f5f4f0] rounded-t-2xl border border-[#e8e6e1] border-b-0 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#e8e6e1]" />
          <div className="w-3 h-3 rounded-full bg-[#e8e6e1]" />
          <div className="w-3 h-3 rounded-full bg-[#e8e6e1]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#faf9f7] rounded-lg px-4 py-1.5 text-sm text-[#8a8780] font-mono flex items-center gap-2">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            qoit.page/maya
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="relative bg-[#faf9f7] rounded-b-2xl border border-[#e8e6e1] p-8 md:p-12 overflow-hidden">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#f5f4f0]/50" />

        <div className="relative space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <StatusDot status="qoit" />
                <span className="text-sm font-medium text-[#4a5d4a]">Qoit Mode</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Maya Chen</h3>
              <p className="text-[#8a8780]">Product Designer</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider">Back in</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold font-mono">2</span>
                <span className="text-[#8a8780] text-sm">d</span>
                <span className="text-3xl font-semibold font-mono ml-1">4</span>
                <span className="text-[#8a8780] text-sm">h</span>
              </div>
            </div>
          </div>

          {/* Sound wave - muted */}
          <div className="flex items-center gap-4 text-[#8a8780]">
            <SoundWave muted />
            <span className="text-sm italic">Taking a creative break</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#e8e6e1] to-transparent" />

          {/* Response times */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#f5f4f0] rounded-xl p-4">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">Email</p>
              <p className="font-medium">~48h</p>
            </div>
            <div className="bg-[#f5f4f0] rounded-xl p-4">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">DMs</p>
              <p className="font-medium">When back</p>
            </div>
            <div className="bg-[#f5f4f0] rounded-xl p-4">
              <p className="text-xs text-[#8a8780] uppercase tracking-wider mb-1">Urgent</p>
              <p className="font-medium text-[#a85d5d]">Call</p>
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#f5f4f0] rounded-xl p-5 border-l-2 border-[#c9a962]">
            <p className="text-[#1a1915] handwritten text-xl leading-relaxed">
              "Stepping away to recharge. Leave a note and I'll get back with fresh eyes ✨"
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-transparent text-[#8a8780] rounded-xl px-6 py-3 font-medium hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 transition-colors border border-[#e8e6e1]/50">
              Leave a message
            </button>
            <button className="flex-1 border border-[#e8e6e1] rounded-xl px-6 py-3 font-medium hover:bg-[#f5f4f0] transition-colors flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a85d5d]" />
              Emergency contact
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Feature item with icon
function Feature({
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
      className="group"
    >
      <div className="flex gap-5">
        <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center text-[#8a8780] group-hover:bg-[#1a1915] group-hover:text-[#faf9f7] transition-colors shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
          <p className="text-[#8a8780] leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// FAQ Item component with accordion
function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border border-[#e8e6e1] rounded-2xl overflow-hidden hover:border-[#c9a962]/30 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left bg-[#faf9f7] hover:bg-[#f5f4f0] transition-colors"
      >
        <span className="font-medium text-lg pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full bg-[#f5f4f0] flex items-center justify-center shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-[#8a8780]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-5 pt-0 text-[#8a8780] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Testimonial component
function Testimonial({
  quote,
  author,
  role,
  delay = 0,
}: {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="bg-[#faf9f7] rounded-2xl p-6 md:p-8 relative border border-[#e8e6e1] hover:border-[#c9a962]/30 transition-colors"
    >
      <div className="absolute top-6 right-6 text-5xl text-[#e8e6e1] font-serif leading-none select-none">
        "
      </div>
      <p className="text-lg mb-6 relative z-10 leading-relaxed pr-8">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8e6e1] to-[#d8d6d1] flex items-center justify-center text-sm font-medium text-[#8a8780]">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{author}</p>
          <p className="text-xs text-[#8a8780]">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Email input with animation
function EmailSignup({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${dark ? "bg-[#faf9f7] text-[#1a1915]" : "bg-[#4a5d4a] text-[#faf9f7]"} rounded-2xl p-8 text-center`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className={`w-16 h-16 rounded-full ${dark ? "bg-[#1a1915]/10" : "bg-[#faf9f7]/20"} flex items-center justify-center mx-auto mb-4`}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">You're on the list</h3>
        <p className={dark ? "text-[#8a8780]" : "text-[#faf9f7]/70"}>
          We'll reach out when it's your turn. Until then... go qoit.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        animate={{
          boxShadow: focused
            ? dark ? "0 0 0 2px #faf9f7" : "0 0 0 2px #1a1915"
            : dark ? "0 0 0 1px #2a2925" : "0 0 0 1px #e8e6e1",
        }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl overflow-hidden ${dark ? "bg-[#2a2925]" : "bg-[#f5f4f0]"}`}
      >
        <div className="flex flex-col sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="you@example.com"
            className={`flex-1 bg-transparent px-6 py-4 outline-none text-lg ${
              dark ? "text-[#faf9f7] placeholder:text-[#faf9f7]/40" : "placeholder:text-[#8a8780]"
            }`}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`${
              dark ? "bg-[#faf9f7] text-[#8a8780] hover:bg-[#e8e6e1] hover:text-[#1a1915]" : "bg-transparent text-[#8a8780] hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 border border-[#e8e6e1]/50"
            } px-8 py-4 font-medium transition-colors sm:rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </span>
            ) : (
              "Join Waitlist"
            )}
          </button>
        </div>
      </motion.div>
      {error && (
        <p className={`text-xs mt-3 text-center sm:text-left text-red-500`}>
          {error}
        </p>
      )}
      {!error && (
      <p className={`text-xs mt-3 text-center sm:text-left ${dark ? "text-[#faf9f7]/40" : "text-[#8a8780]"}`}>
        No spam. Just one email when we launch.
      </p>
      )}
    </form>
  );
}

// Animated counter
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Home(_props: PageProps) {
  // Note: params and searchParams are Promises in Next.js 15+
  // We don't use them in this page, so we simply accept but ignore them
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -30]);

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#faf9f7]/80 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1a1915] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#faf9f7]" />
            </div>
            <span className="font-semibold text-lg tracking-tight">qoit</span>
          </div>

          <a 
            href="#waitlist"
            className="text-sm font-medium px-5 py-2.5 rounded-full bg-transparent text-[#8a8780] hover:text-[#1a1915] hover:bg-[#f5f4f0]/50 transition-colors border border-[#e8e6e1]/50"
          >
            Get Early Access
          </a>
        </div>
      </motion.nav>

      {/* Hero Section - Apple-style layered design */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Shader background - subtle and ambient */}
        <div className="absolute inset-0 opacity-[0.08]">
          <ShaderAnimation className="w-full h-full" />
        </div>
        
        {/* Background orbs */}
        <GradientOrb className="w-[600px] h-[600px] bg-[#c9a962] -top-48 -right-48" />
        <GradientOrb className="w-[500px] h-[500px] bg-[#4a5d4a] -bottom-32 -left-32" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative">
            {/* Apple-style layered hero */}
            <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Left: Main text content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Pill badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="inline-flex items-center gap-2.5 bg-[#f5f4f0] border border-[#e8e6e1] rounded-full px-4 py-2 mb-8"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#4a5d4a] opacity-75 animate-ping" style={{ animationDuration: "2s" }} />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a5d4a]" />
                  </span>
                  <span className="text-sm text-[#8a8780]">Launching soon</span>
                </motion.div>

                {/* Main headline - Playfair Display for elegance */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(2.5rem,7vw,5.5rem)] font-display font-semibold tracking-tight mb-6 leading-[1.05]"
                >
                  <span className="block">The art of</span>
                  <span className="block relative">
                    going{" "}
                    <span className="relative inline-block">
                      <span className="shimmer">quiet</span>
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#c9a962] origin-left rounded-full"
                      />
                    </span>
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mb-10"
                >
                  <p className="text-lg md:text-xl text-[#8a8780] max-w-xl leading-relaxed">
                    Not "out of office." Not "be right back."
                    <br />
                    <span className="text-[#1a1915] font-medium">Just... qoit.</span>
                  </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="max-w-md mx-auto lg:mx-0"
                >
                  <EmailSignup />
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-5 text-sm text-[#8a8780]"
                >
                  <div className="flex -space-x-2.5">
                    {["S", "M", "P", "J"].map((initial, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e8e6e1] to-[#d8d6d1] border-2 border-[#faf9f7] flex items-center justify-center text-xs font-medium text-[#8a8780]"
                      >
                        {initial}
                      </motion.div>
                    ))}
                  </div>
                  <span>Join <span className="font-medium text-[#1a1915]"><AnimatedNumber value={2847} /></span> on the waitlist</span>
                </motion.div>
              </div>

              {/* Right: Floating preview card with Apple-style layering */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 relative perspective-1000 hidden lg:block"
              >
                {/* Layered "behind" text - Apple style */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.06 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute -top-16 -left-8 font-display text-[12rem] font-bold text-[#1a1915] leading-none select-none pointer-events-none z-0"
                  style={{ transform: 'translateZ(-50px)' }}
                >
                  q
                </motion.div>
                
                {/* The card itself - appears in front */}
                <div className="relative z-10">
                  <HeroPreviewCard />
                </div>
                
                {/* Layered "behind" text - right side */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.04 }}
                  transition={{ delay: 1.7, duration: 1 }}
                  className="absolute -bottom-8 -right-12 font-display text-[10rem] font-bold text-[#1a1915] leading-none select-none pointer-events-none z-20"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  ·
                </motion.div>
              </motion.div>
            </div>

            {/* Sound wave - centered below on mobile, integrated on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex justify-center mt-16 lg:mt-20 text-[#8a8780]"
            >
              <div className="flex items-center gap-6 md:gap-8 bg-[#f5f4f0]/80 backdrop-blur-sm rounded-full px-6 md:px-8 py-4 border border-[#e8e6e1]/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider hidden sm:inline">Always on</span>
                  <SoundWave muted={false} size="small" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-xl text-[#c9a962]"
                >
                  →
                </motion.div>
                <div className="flex items-center gap-3">
                  <SoundWave muted={true} size="small" />
                  <span className="text-xs uppercase tracking-wider font-medium text-[#1a1915]">Qoit</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-[#e8e6e1] flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-[#8a8780] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Preview Section */}
      <section className="py-28 px-6 bg-[#f5f4f0]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">Your qoit page</p>
            <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight leading-tight">
              A personal status page<br />
              <span className="text-[#8a8780]">that respects boundaries</span>
            </h2>
          </motion.div>

          <PreviewCard />

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {["Custom URL", "Response Times", "Countdown", "Emergency Contact", "Personal Note", "Auto-responses"].map((feature, i) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                viewport={{ once: true }}
                className="px-4 py-2 bg-[#faf9f7] rounded-full text-sm border border-[#e8e6e1] hover:border-[#c9a962]/50 transition-colors cursor-default"
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">Modes</p>
            <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
              Your status, your way
            </h2>
          </motion.div>

          <StatusModes />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 bg-[#f5f4f0]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-4">Why Qoit</p>
            <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight mb-6">
              Built for humans who need<br />
              <span className="text-[#8a8780]">to be human sometimes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            <Feature
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              }
              title="One link. Every platform."
              description="Drop your qoit.page link in your bio, email signature, or auto-responder. One source of truth for your availability."
            />
            <Feature
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Set expectations, not excuses"
              description="Response time commitments for each channel. No more guessing, no more guilt. People know what to expect."
            />
            <Feature
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
              title="Emergency escape hatch"
              description="Truly urgent? You decide who gets through. A separate channel for what actually can't wait."
            />
            <Feature
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              title="Schedule your qoit"
              description="Plan your offline time in advance. Automatic status updates when you need to disconnect."
            />
            <Feature
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
              title="Beautiful auto-responses"
              description="Auto-reply with your qoit page link. People land somewhere beautiful, not a boring bounce message."
            />
            <Feature
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              }
              title="Integrations"
              description="Connect with Slack, email, calendar. Sync your status across platforms automatically."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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

      {/* FAQ Section */}
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

      {/* Manifesto Section */}
      <section className="py-28 px-6 bg-[#f5f4f0]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-[#8a8780] uppercase tracking-wider mb-10">Our belief</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.15] mb-10">
              Silence is not absence.
              <br />
              <span className="text-[#8a8780]">It's presence elsewhere.</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#8a8780] leading-relaxed max-w-2xl mx-auto">
              You are not "away." You are exactly where you need to be—just not 
              here. Qoit is for the creators, the thinkers, the humans who know 
              that the best things happen when you're not performing availability 
              for an audience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-[#e8e6e1]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 2847, label: "On waitlist" },
              { value: 94, suffix: "%", label: "Feel less guilty" },
              { value: 3.2, suffix: "x", label: "Faster response when back" },
              { value: 12, suffix: "h", label: "Avg. qoit time per week" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-semibold mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[#8a8780]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
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

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#e8e6e1] bg-[#faf9f7]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1a1915] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#faf9f7]" />
            </div>
            <span className="font-medium">qoit</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-[#8a8780]">
            <a href="https://x.com/qoit_page" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1915] transition-colors">X</a>
            <a href="#" className="hover:text-[#1a1915] transition-colors">About</a>
            <a href="#" className="hover:text-[#1a1915] transition-colors">Privacy</a>
          </div>

          <p className="text-sm text-[#8a8780]">© 2025 Qoit. <span className="italic">Shhh.</span></p>
        </div>
      </footer>
    </div>
  );
}
