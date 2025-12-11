"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { IntegrationsFlow } from "../integrations/integrations-flow";

export function IntegrationsSection() {
  const [username, setUsername] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single<{ username: string | null }>();
        if (profile?.username) {
          setUsername(profile.username);
        }
      }
    };
    
    getUserProfile();
  }, [supabase]);

  const handleSectionClick = () => {
    if (isPreviewOpen) {
      setIsPreviewOpen(false);
    }
  };

  return (
    <section 
      className="py-32 px-6 text-[#faf9f7] overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isPreviewOpen ? "#010101" : "#0d0d0b" }}
      onClick={handleSectionClick}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm text-[#4a5d4a] uppercase tracking-[0.2em] mb-4 font-medium">
            Integrations
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-4">
            Watch it sync in real-time
          </h2>
          <p className="text-lg text-[#6a6a65] max-w-lg mx-auto">
            One toggle. Every platform updates instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="hidden lg:block w-full h-[700px]"
        >
          <IntegrationsFlow 
            username={username} 
            previewOpen={isPreviewOpen}
            onPreviewOpenChange={setIsPreviewOpen} 
          />
        </motion.div>

        {/* Mobile fallback */}
        <div className="lg:hidden text-center text-[#5a5a55] py-12">
          <p>View on desktop to see the interactive demo</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[#1a1a18] border border-[#2a2a28]">
            <span className="text-xl font-display font-bold text-[#4a5d4a]">3</span>
            <span className="text-[#5a5a55] text-sm">platforms live</span>
            <div className="w-px h-4 bg-[#2a2a28]" />
            <span className="text-[#5a5a55] text-sm">6+ coming soon</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
