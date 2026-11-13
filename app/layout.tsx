import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import FaviconUpdater from "./components/FaviconUpdater";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const faviconDataUrl = "data:image/png;base64,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";

export const metadata: Metadata = {
  title: "Jamal Ferguson | Full-Stack Software Developer",
  description:
    "Full-stack software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
  metadataBase: new URL("https://jamalferguson.dev"),
  icons: {
    icon: [{ url: faviconDataUrl, type: "image/png", sizes: "32x32" }],
    shortcut: faviconDataUrl,
    apple: [
      {
        url: "/portfolio-logo-touch-v2.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://jamalferguson.dev",
    title: "Jamal Ferguson | Full-Stack Software Developer",
    description:
      "Full-stack software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
    siteName: "Jamal Ferguson",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Jamal Ferguson — Full-Stack Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamal Ferguson | Full-Stack Software Developer",
    description:
      "Full-stack software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <FaviconUpdater />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
