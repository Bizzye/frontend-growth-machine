import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

import { Providers } from "./providers";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Userz Growth",
    template: "%s | Userz Growth",
  },
  description: "User management app with sign up, sign in and users listing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable)}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
