import type { Metadata, ResolvingViewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RouteTracker } from "@/components/shared/RouteTracker";
import { Toaster } from "react-hot-toast";
import GoogleTranslateWrapper from "@/components/shared/GoogleTranslateWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MANIFEX - AI-Powered English Learning Platform",
  description:
    "MANIFEX is a personalized, AI-powered language learning platform that helps users improve their English skills through guided, fun, and rewarding practice.",
  keywords:
    "AI language learning, English tutor, dyslexia support, interactive reading, phoneme recognition, pronunciation coaching, learn English with AI, progress tracking, personalized English tutor",
  openGraph: {
    title: "MANIFEX - AI-Powered English Learning Platform",
    description:
      "Learn English in a personalized and fun way with MANIFEX. AI-based lessons and activities tailored to your learning needs.",
    url: "https://manifex.com",
    siteName: "MANIFEX",
    images: [
      {
        url: "https://manifex.com/avatar.png",
        width: 1200,
        height: 630,
        alt: "MANIFEX Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@manifex",
    title: "MANIFEX - Learn English with AI",
    description:
      "MANIFEX is an AI-powered language learning platform that helps learners improve English skills with personalized lessons and interactive rewards.",
    images: [
      {
        url: "https://manifex.com/avatar.png",
        width: 1200,
        height: 630,
        alt: "MANIFEX Logo",
      },
    ],
  },
};

export const generateViewport = () => {
  return {
    width: "device-width",
    initialScale: 1.0,
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <GoogleTranslateWrapper> */}
        <RouteTracker />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#ffffff",
              color: "#111827",
              border: "1px solid rgba(0,0,0,0.05)",
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#ffffff",
              },
              style: {
                border: "1px solid #10B981",
                background: "#ffffff",
                color: "#065f46",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#ffffff",
              },
              style: {
                border: "1px solid #EF4444",
                background: "#ffffff",
                color: "#7f1d1d",
              },
            },
          }}
        />
        {/* </GoogleTranslateWrapper> */}
      </body>
    </html>
  );
}
