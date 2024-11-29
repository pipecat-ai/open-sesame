import type { Metadata } from "next";
import "./globals.css";

import NavigationState from "@/app/NavigationState";
import { Toaster } from "@/components/ui/toaster";
import { DM_Mono, DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "Open Sesame",
  description: "An Open Source multi-modal LLM environment",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased overflow-hidden relative h-svh`}
      >
        {children}
        <Toaster />
        <NavigationState />
      </body>
    </html>
  );
}
