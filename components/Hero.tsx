"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import varanda from "@/src/imports/varanda.jpg";
import { VENUE } from "@/lib/constants";

const INK   = "#0c0a08";
const PAPER = "#faf8f4";
const MUTED = "rgba(250,248,244,0.55)";

const navItems = [
  { href: "/",               label: "Início",          mobileHide: true  },
  { href: "/disponibilidade",label: "Disponibilidade", mobileHide: false },
  { href: "/condicoes",      label: "Condições",       mobileHide: false },
  { href: "/espaco",         label: "O Espaço",        mobileHide: true  },
  { href: "/contato",        label: "Contato",         mobileHide: false },
];

type HeroProps = {
  onScrollToCalendar?: () => void;
};

export function Hero({ onScrollToCalendar }: HeroProps) {
  const pathname = usePathname();

  return (
    <section style={{ background: INK, color: PAPER, fontFamily: "var(--font-inter)" }}>
      {/* ── Nav ── */}
      <header className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: 24,
            fontStyle: "italic",
            fontWeight: 500,
            color: PAPER,
            letterSpacing: -0.3,
            textDecoration: "none",
            lineHeight: 1,
          }}
        >
          VillaRoça
        </Link>

        <nav className="flex items-center gap-3 md:gap-8">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${item.mobileHide ? "hidden md:inline-block" : ""} text-[10px] md:text-[12px] tracking-[0.5px] md:tracking-[1.2px]`}
                style={{
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: isActive ? PAPER : MUTED,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ── Full-bleed hero image ── */}
      <section className="relative overflow-hidden h-[260px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
        <Image
          src={varanda}
          alt="Vista da área externa da Chácara VillaRoça"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(12,10,8,0.78) 0%, rgba(12,10,8,0.15) 55%, transparent 100%)",
          }}
        />
        <div className="absolute left-5 bottom-6 right-5 md:left-10 md:bottom-10 md:right-10">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(250,248,244,0.7)",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            O Espaço · Barretos-SP
          </div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(30px, 7vw, 56px)",
              fontWeight: 280,
              lineHeight: 1.04,
              letterSpacing: "-0.9px",
              margin: 0,
              color: PAPER,
              maxWidth: 620,
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Um endereço rural
            <br />
            para encontros especiais.
          </h1>
        </div>
      </section>

      {/* ── Two-column intro ── */}
      <section className="px-5 py-8 md:px-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.5,
            color: PAPER,
            fontWeight: 300,
            letterSpacing: "-0.1px",
          }}
        >
          A VillaRoça recebe aniversários, casamentos, confraternizações e eventos
          familiares em Barretos-SP, com atendimento direto e orçamento personalizado
          para cada data.
        </p>
        <div>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 13.5,
              lineHeight: 1.65,
              color: "rgba(250,248,244,0.6)",
              fontWeight: 300,
            }}
          >
            Uma sede de campo pensada para dias longos, reuniões sem pressa e memórias
            compartilhadas. Atendemos grupos de até {VENUE.capacity.total} pessoas com
            hospedagem para {VENUE.capacity.beds}.
          </p>
          <button
            onClick={onScrollToCalendar}
            style={{
              background: "transparent",
              border: "1px solid rgba(250,248,244,0.25)",
              color: "rgba(250,248,244,0.85)",
              padding: "11px 20px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            Ver disponibilidade →
          </button>
        </div>
      </section>

      {/* ── Address bar ── */}
      <section
        className="mx-5 md:mx-10 py-5 md:py-6 flex items-center gap-2.5 text-sm"
        style={{
          borderTop: "1px solid rgba(250,248,244,0.12)",
          color: "rgba(250,248,244,0.6)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        {VENUE.address}
      </section>
    </section>
  );
}
