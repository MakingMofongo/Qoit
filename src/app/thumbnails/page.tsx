const thumbnails = [
  { id: "logo", name: "Logo Mark", src: "/api/thumbnails/logo" },
  { id: "wordmark", name: "Wordmark", src: "/api/thumbnails/wordmark" },
  { id: "wordmark-vertical", name: "Wordmark Vertical", src: "/api/thumbnails/wordmark-vertical" },
  { id: "waveform", name: "Waveform", src: "/api/thumbnails/waveform" },
  { id: "minimal", name: "Minimal", src: "/api/thumbnails/minimal" },
  { id: "gradient", name: "Gradient", src: "/api/thumbnails/gradient" },
  { id: "tagline", name: "With Tagline", src: "/api/thumbnails/tagline" },
];

export default function ThumbnailsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[var(--foreground)] tracking-tight mb-3">
            Thumbnails
          </h1>
          <p className="text-[var(--muted)]">
            High quality thumbnail images
          </p>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {thumbnails.map((thumb) => (
            <div key={thumb.id} className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.src}
                  alt={thumb.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {thumb.name}
                </span>
                <a
                  href={thumb.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Open full size →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-16 text-center">
          <a
            href="/"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
