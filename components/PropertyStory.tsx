"use client";

import { useEffect, useCallback, useState } from "react";
import { BedDouble, CalendarCheck, MapPin, Waves, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Image from "next/image";
import varanda from "@/src/imports/varanda.jpg";
import { VENUE } from "@/lib/constants";

const highlights = [
  {
    icon: Waves,
    title: "Piscina e área aberta",
    text: "Ambiente para dias inteiros de descanso, almoço e celebração.",
  },
  {
    icon: BedDouble,
    title: "Hospedagem",
    text: `${VENUE.capacity.beds} camas para quem quer aproveitar sem pressa.`,
  },
  {
    icon: CalendarCheck,
    title: "Disponível qualquer dia",
    text: "Reservas sob orçamento para qualquer dia da semana.",
  },
];

const galleryPhotos = [
  { src: "/photos/varanda.jpg", alt: "Varanda e área externa" },
  { src: "/photos/piscina.jpeg", alt: "Piscina" },
  { src: "/photos/piscina-angulo-dia.jpeg", alt: "Piscina vista de cima" },
  { src: "/photos/piscina-angulo-noite.jpeg", alt: "Piscina à noite" },
  { src: "/photos/piscina-pergolado.jpeg", alt: "Piscina e pergolado" },
  { src: "/photos/pergolado-dia.jpeg", alt: "Pergolado" },
  { src: "/photos/pergolado-dia-angulo.jpeg", alt: "Pergolado — vista ampla" },
  { src: "/photos/churrasqueria.jpeg", alt: "Churrasqueira" },
  { src: "/photos/quarto-casal.jpeg", alt: "Quarto de casal" },
  { src: "/photos/quartos.jpeg", alt: "Quartos" },
  { src: "/photos/quartos2.jpeg", alt: "Quartos — vista 2" },
  { src: "/photos/sala.jpeg", alt: "Sala" },
  { src: "/photos/mesa-varanda.jpeg", alt: "Mesa na varanda" },
  { src: "/photos/visao-inferior.jpeg", alt: "Vista do espaço" },
  { src: "/photos/visao-parquinho.jpeg", alt: "Área do parquinho" },
  { src: "/photos/casa-superior.jpeg", alt: "Casa superior" },
  { src: "/photos/varanda-pergolado.jpeg", alt: "Varanda e pergolado" },
  { src: "/photos/banheiro.jpeg", alt: "Banheiro" },
];

export function PropertyStory() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % galleryPhotos.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + galleryPhotos.length) % galleryPhotos.length);
  }, []);

  useEffect(() => {
    if (!galleryOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [galleryOpen, goNext, goPrev]);

  return (
    <>
      <section id="espaco" className="bg-white px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div>
            <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
              o espaço
            </p>
            <h2 className="mb-5 text-3xl leading-tight text-primary md:text-5xl">
              Um endereço rural para encontros especiais.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              A VillaRoça recebe aniversários, casamentos, confraternizações e eventos familiares em Barretos-SP,
              com atendimento direto e orçamento personalizado para cada data.
            </p>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <item.icon size={21} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg text-primary">{item.title}</h3>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => openGallery(0)}
            className="group relative overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Ver galeria de fotos"
          >
            <Image
              src={varanda}
              alt="Varanda e área externa da Chácara VillaRoça"
              className="h-full min-h-[360px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <Images size={16} aria-hidden="true" />
              Ver todas as fotos
            </div>
          </button>
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl items-start gap-3 border-t border-border pt-8 text-muted-foreground">
          <MapPin className="mt-1 shrink-0 text-primary" size={20} aria-hidden="true" />
          <p>{VENUE.address}</p>
        </div>
      </section>

      {galleryOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-5 py-4">
            <span className="text-sm text-white/60">
              {currentIndex + 1} / {galleryPhotos.length}
            </span>
            <p className="text-sm text-white/80">{galleryPhotos[currentIndex].alt}</p>
            <button
              onClick={closeGallery}
              className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar galeria"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-14">
            <button
              onClick={goPrev}
              className="absolute left-3 z-10 rounded-full p-2.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:left-5"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>

            <img
              key={currentIndex}
              src={galleryPhotos[currentIndex].src}
              alt={galleryPhotos[currentIndex].alt}
              className="max-h-full max-w-full rounded-lg object-contain"
              style={{ animation: "fadeIn 0.2s ease" }}
            />

            <button
              onClick={goNext}
              className="absolute right-3 z-10 rounded-full p-2.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:right-5"
              aria-label="Próxima foto"
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="shrink-0 overflow-x-auto px-5 py-4">
            <div className="flex gap-2">
              {galleryPhotos.map((photo, index) => (
                <button
                  key={photo.src}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ver foto: ${photo.alt}`}
                  className={[
                    "h-14 w-20 shrink-0 overflow-hidden rounded transition-all",
                    index === currentIndex
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-40 hover:opacity-70",
                  ].join(" ")}
                >
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
      ) : null}
    </>
  );
}
