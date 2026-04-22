import type { Metadata } from "next";
import { Caveat, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/CookieConsent";
import { VENUE } from "@/lib/constants";
import "@/src/styles/index.css";

export const metadata: Metadata = {
  title: `${VENUE.name} | ${VENUE.tagline}`,
  description: "Solicite orçamento para eventos e finais de semana na Chácara VillaRoça, em Barretos-SP.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${caveat.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
