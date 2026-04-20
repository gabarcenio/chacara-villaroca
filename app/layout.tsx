import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${caveat.variable}`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
