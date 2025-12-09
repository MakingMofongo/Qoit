import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qoit — The most beautiful way to go offline",
  description: "Not 'out of office.' Not 'be right back.' Just... qoit. A personal status page for when you need the world to wait.",
  keywords: ["offline", "status page", "boundaries", "mental health", "work-life balance", "async", "remote work", "digital wellness"],
  authors: [{ name: "Qoit" }],
  openGraph: {
    title: "Qoit — The most beautiful way to go offline",
    description: "Not 'out of office.' Not 'be right back.' Just... qoit.",
    type: "website",
    siteName: "Qoit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qoit — The most beautiful way to go offline",
    description: "Not 'out of office.' Not 'be right back.' Just... qoit.",
    creator: "@qoit_page",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
