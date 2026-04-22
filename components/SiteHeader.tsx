"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/",              label: "Início",          mobileHide: true },
  { href: "/disponibilidade", label: "Disponibilidade", mobileHide: false },
  { href: "/condicoes",    label: "Condições",        mobileHide: true },
  { href: "/espaco",       label: "O Espaço",         mobileHide: true },
  { href: "/contato",      label: "Contato",          mobileHide: false },
];

type SiteHeaderProps = {
  dark?: boolean;
};

export function SiteHeader({ dark = false }: SiteHeaderProps) {
  const pathname = usePathname();

  const inkColor   = dark ? "#faf8f4" : "#0c0a08";
  const mutedColor = dark ? "rgba(250,248,244,0.5)" : "#8a8578";
  const bgColor    = dark ? "#0c0a08" : "#faf8f4";

  return (
    <header
      className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7"
      style={{ background: bgColor }}
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

      <nav className="flex items-center gap-5 md:gap-8">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={item.mobileHide ? "hidden md:inline-block" : ""}
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
