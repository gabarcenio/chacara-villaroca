"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/disponibilidade", label: "Disponibilidade" },
  { href: "/condicoes", label: "Condições" },
  { href: "/contato", label: "Contato" },
];

type SiteHeaderProps = {
  dark?: boolean;
};

export function SiteHeader({ dark = false }: SiteHeaderProps) {
  const pathname = usePathname();

  const inkColor = dark ? "#faf8f4" : "#0c0a08";
  const mutedColor = dark ? "rgba(250,248,244,0.5)" : "#8a8578";
  const bgColor = dark ? "#0c0a08" : "#faf8f4";

  return (
    <header
      style={{
        background: bgColor,
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
          color: inkColor,
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
                color: isActive ? inkColor : mutedColor,
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
  );
}
