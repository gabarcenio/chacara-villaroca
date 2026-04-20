"use client";

import { ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import varanda from "@/src/imports/varanda.jpg";
import { VENUE } from "@/lib/constants";

type HeroProps = {
  onScrollToCalendar?: () => void;
};

export function Hero({ onScrollToCalendar }: HeroProps) {
  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden">
      <Image
        src={varanda}
        alt="Vista da área externa da Chácara VillaRoça"
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />

      <nav className="relative z-10 flex items-center justify-between px-5 py-5 md:px-12">
        <Link href="/" className="text-white" style={{ fontFamily: "var(--font-caveat)" }}>
          <span className="text-3xl">VillaRoça</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-white/90 md:flex">
          <Link className="transition-colors hover:text-white" href="/#espaco">
            Espaço
          </Link>
          <button onClick={onScrollToCalendar} className="transition-colors hover:text-white">
            Disponibilidade
          </button>
          <Link className="transition-colors hover:text-white" href="/condicoes">
            Condições
          </Link>
          <Link className="transition-colors hover:text-white" href="/contato">
            Contato
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex min-h-[calc(92svh-96px)] flex-col items-center justify-center px-5 pb-16 text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-sm text-white/85 backdrop-blur">
          <MapPin size={16} aria-hidden="true" />
          Barretos-SP · até {VENUE.capacity.total} convidados
        </p>

        <h1 className="mb-5 max-w-4xl text-3xl leading-tight text-white md:text-6xl">
          Celebrações que ficam.
          <br />
          No coração de Barretos.
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-white/82 md:text-xl">
          Um refúgio para reunir família e amigos com piscina, salão e hospedagem para até {VENUE.capacity.beds} pessoas.
        </p>

        <button
          onClick={onScrollToCalendar}
          className="rounded-lg bg-accent px-8 py-4 text-primary transition-all hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Ver disponibilidade
        </button>
      </div>

      <button
        onClick={onScrollToCalendar}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-lg p-2 text-white/70 transition-colors hover:text-white motion-safe:animate-bounce"
        aria-label="Ir para disponibilidade"
      >
        <ChevronDown size={32} aria-hidden="true" />
      </button>
    </section>
  );
}
