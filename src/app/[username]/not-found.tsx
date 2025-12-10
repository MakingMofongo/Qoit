import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#f5f4f0] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#8a8780]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-semibold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-[#8a8780] mb-8 max-w-sm mx-auto">
          This qoit page doesn't exist yet. Maybe they haven't signed up, or the username is different.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#1a1915] text-[#faf9f7] px-6 py-3 rounded-xl font-medium hover:bg-[#2a2925] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}

