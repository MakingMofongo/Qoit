"use client";

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-[#e8e6e1] bg-[#faf9f7] relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#4a5d4a]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a1915] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#faf9f7]" />
            </div>
            <span className="font-display text-2xl font-medium">qoit</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a 
              href="https://x.com/qoit_page" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-[#8a8780] hover:text-[#1a1915] transition-colors px-3 py-2 rounded-lg hover:bg-[#f5f4f0]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@qoit_page</span>
            </a>
            <a href="#" className="text-[#8a8780] hover:text-[#1a1915] transition-colors px-3 py-2 rounded-lg hover:bg-[#f5f4f0]">About</a>
            <a href="#" className="text-[#8a8780] hover:text-[#1a1915] transition-colors px-3 py-2 rounded-lg hover:bg-[#f5f4f0]">Privacy</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#e8e6e1]/50">
          <p className="text-sm text-[#8a8780]">© 2025 Qoit. All rights reserved.</p>
          <p className="text-sm text-[#8a8780] italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4a5d4a] animate-pulse" />
            Building in quiet
          </p>
        </div>
      </div>
    </footer>
  );
}

