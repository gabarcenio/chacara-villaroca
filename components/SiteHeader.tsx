import Link from "next/link";
import { VENUE } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/disponibilidade", label: "Disponibilidade" },
  { href: "/condicoes", label: "Condições" },
  { href: "/contato", label: "Contato" },
  { href: "/entrar", label: "Entrar" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-primary" style={{ fontFamily: "var(--font-caveat)" }}>
          <span className="text-3xl">{VENUE.name.replace("Chácara ", "")}</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
