import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiet — The most beautiful way to go offline",
  description: "Not 'out of office.' Not 'be right back.' Just... quiet. A personal status page for when you need the world to wait.",
  keywords: ["offline", "status page", "boundaries", "mental health", "work-life balance", "async", "remote work", "digital wellness"],
  authors: [{ name: "Quiet" }],
  openGraph: {
    title: "Quiet — The most beautiful way to go offline",
    description: "Not 'out of office.' Not 'be right back.' Just... quiet.",
    type: "website",
    siteName: "Quiet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiet — The most beautiful way to go offline",
    description: "Not 'out of office.' Not 'be right back.' Just... quiet.",
    creator: "@quietpage",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
