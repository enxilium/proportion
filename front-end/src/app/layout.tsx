import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";
import { motion } from "framer-motion";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Life in Perspective",
  description: "Visualize how you spend your life",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={caveat.variable}>
      <body>{children}</body>
    </html>
  );
}
