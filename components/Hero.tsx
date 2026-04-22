"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import varanda from "@/src/imports/varanda.jpg";
import { VENUE } from "@/lib/constants";

const INK    = "#0c0a08";
const PAPER  = "#faf8f4";
const MUTED  = "rgba(250,248,244,0.55)";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/disponibilidade", label: "Disponibilidade" },
  { href: "/condicoes", label: "Condições" },
  { href: "/contato", label: "Contato" },
];

type HeroProps = {
  onScrollToCalendar?: () => void;
};

export function Hero({ onScrollToCalendar }: HeroProps) {
  const pathname = usePathname();

  return (
    <section style={{ background: INK, color: PAPER, fontFamily: "var(--font-inter)" }}>
      {/* ── Nav ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 48px",
        }}
      >
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
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "1.2px",
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
      <section style={{ position: "relative", height: 520, overflow: "hidden" }}>
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
        <div style={{ position: "absolute", left: 48, bottom: 40, right: 48 }}>
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
              fontSize: 56,
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
      <section
        style={{
          padding: "48px 48px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
        }}
      >
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
        style={{
          margin: "0 48px 0",
          padding: "20px 0 32px",
          borderTop: "1px solid rgba(250,248,244,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
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
