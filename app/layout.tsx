import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OPERATION AEGIS RETROGRADE",
  description:
    "Deep-cover terminal puzzle: defeat Arnim Zola's 3-stage encryption, generate the Final Launch Key and retarget the missile.",
};

export const viewport: Viewport = {
  themeColor: "#04070c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="crt-grid" aria-hidden="true" />
        {children}
        <div className="crt-overlay" aria-hidden="true" />
        <div className="crt-flicker" aria-hidden="true" />
      </body>
    </html>
  );
}
