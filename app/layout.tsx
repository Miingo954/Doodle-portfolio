import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jamal Ferguson | Full-Stack Software Developer",
  description:
    "Full-stack software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
  metadataBase: new URL("https://jamalferguson.dev"),
  icons: {
    icon: [
      {
        url: "/favicon.ico?v=jf5",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/jf-favicon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/jf-favicon-64.png",
        type: "image/png",
        sizes: "64x64",
      },
    ],
    shortcut: "/favicon.ico?v=jf5",
    apple: [
      {
        url: "/jf-touch-icon.png",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
