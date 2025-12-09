"use client";

import { useRef } from "react";
import { Navigation } from "@/components/sections/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { PreviewSection } from "@/components/sections/preview-section";
import { ModesSection } from "@/components/sections/modes-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { FAQSection } from "@/components/sections/faq-section";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { StatsSection } from "@/components/sections/stats-section";
import { FinalCTASection } from "@/components/sections/final-cta-section";
import { Footer } from "@/components/sections/footer";
import type { PageProps } from "@/types";

export default function Home(_props: PageProps) {
  // Note: params and searchParams are Promises in Next.js 15+
  // We don't use them in this page, so we simply accept but ignore them
  
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <PreviewSection />
      <ModesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <FAQSection />
      <ManifestoSection />
      <StatsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
