"use client";

import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const INK   = "#0c0a08";
const PAPER = "#faf8f4";
const LINE  = "rgba(250,248,244,0.12)";

const galleryPhotos = [
  { src: "/photos/varanda.jpg",              alt: "Varanda e área externa" },
  { src: "/photos/piscina.jpeg",             alt: "Piscina" },
  { src: "/photos/piscina-angulo-dia.jpeg",  alt: "Piscina vista de cima" },
  { src: "/photos/piscina-angulo-noite.jpeg",alt: "Piscina à noite" },
  { src: "/photos/piscina-pergolado.jpeg",   alt: "Piscina e pergolado" },
  { src: "/photos/pergolado-dia.jpeg",       alt: "Pergolado" },
  { src: "/photos/pergolado-dia-angulo.jpeg",alt: "Pergolado — vista ampla" },
  { src: "/photos/churrasqueria.jpeg",       alt: "Churrasqueira" },
  { src: "/photos/quarto-casal.jpeg",        alt: "Quarto de casal" },
  { src: "/photos/quartos.jpeg",             alt: "Quartos" },
  { src: "/photos/quartos2.jpeg",            alt: "Quartos — vista 2" },
  { src: "/photos/sala.jpeg",               alt: "Sala" },
  { src: "/photos/mesa-varanda.jpeg",        alt: "Mesa na varanda" },
  { src: "/photos/visao-inferior.jpeg",      alt: "Vista do espaço" },
  { src: "/photos/visao-parquinho.jpeg",     alt: "Área do parquinho" },
  { src: "/photos/casa-superior.jpeg",       alt: "Casa superior" },
  { src: "/photos/varanda-pergolado.jpeg",   alt: "Varanda e pergolado" },
  { src: "/photos/banheiro.jpeg",            alt: "Banheiro" },
];

const gridPhotos = [
  { src: "/photos/piscina.jpeg",            alt: "Piscina", caption: "01 · Área da piscina" },
  { src: "/photos/quartos.jpeg",            alt: "Quartos · hospedagem", caption: "02 · 22 camas" },
  { src: "/photos/churrasqueria.jpeg",      alt: "Churrasqueira", caption: "03 · Área de churrasco" },
  { src: "/photos/pergolado-dia.jpeg",      alt: "Pergolado", caption: "04 · Pergolado" },
];

export function PropertyStory() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index = 0) => { setCurrentIndex(index); setGalleryOpen(true); };
  const closeGallery = () => setGalleryOpen(false);
  const goNext = useCallback(() => setCurrentIndex((i) => (i + 1) % galleryPhotos.length), []);
  const goPrev = useCallback(() => setCurrentIndex((i) => (i - 1 + galleryPhotos.length) % galleryPhotos.length), []);

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
      {/* ── Photo grid ── */}
      <section
        style={{
          background: INK,
          padding: "0 48px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {gridPhotos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => openGallery(galleryPhotos.findIndex((p) => p.src === photo.src))}
            aria-label={`Abrir foto: ${photo.alt}`}
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ width: "100%", height: 200, overflow: "hidden", position: "relative" }}>
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(250,248,244,0.5)",
                letterSpacing: "1.5px",
                marginTop: 10,
                textTransform: "uppercase",
              }}
            >
              {photo.caption}
            </div>
          </button>
        ))}
      </section>

      {/* ── Ver todas as fotos link ── */}
      <section
        style={{
          background: INK,
          padding: "0 48px 48px",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <button
          onClick={() => openGallery(0)}
          style={{
            background: "transparent",
            border: `1px solid rgba(250,248,244,0.2)`,
            color: "rgba(250,248,244,0.75)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "1px",
            textTransform: "uppercase",
            padding: "11px 20px",
            cursor: "pointer",
            fontFamily: "var(--font-inter)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Ver todas as fotos
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" /></svg>
        </button>
      </section>

      {/* ── Lightbox gallery ── */}
      {galleryOpen ? (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "rgba(12,10,8,0.97)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: "rgba(250,248,244,0.5)", fontFamily: "var(--font-mono)" }}>
              {currentIndex + 1} / {galleryPhotos.length}
            </span>
            <span style={{ fontSize: 13, color: "rgba(250,248,244,0.7)" }}>
              {galleryPhotos[currentIndex].alt}
            </span>
            <button
              onClick={closeGallery}
              style={{ background: "transparent", border: "none", color: "rgba(250,248,244,0.6)", cursor: "pointer", padding: 8 }}
              aria-label="Fechar galeria"
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0 56px" }}>
            <button
              onClick={goPrev}
              style={{ position: "absolute", left: 12, background: "transparent", border: "none", color: "rgba(250,248,244,0.6)", cursor: "pointer", padding: 8 }}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={28} />
            </button>

            <img
              key={currentIndex}
              src={galleryPhotos[currentIndex].src}
              alt={galleryPhotos[currentIndex].alt}
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", animation: "fadeIn 0.2s ease" }}
            />

            <button
              onClick={goNext}
              style={{ position: "absolute", right: 12, background: "transparent", border: "none", color: "rgba(250,248,244,0.6)", cursor: "pointer", padding: 8 }}
              aria-label="Próxima foto"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Thumbnails */}
          <div style={{ flexShrink: 0, overflowX: "auto", padding: "12px 20px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {galleryPhotos.map((photo, index) => (
                <button
                  key={photo.src}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ver foto: ${photo.alt}`}
                  style={{
                    width: 72,
                    height: 52,
                    flexShrink: 0,
                    overflow: "hidden",
                    border: index === currentIndex ? "1px solid rgba(250,248,244,0.8)" : "1px solid transparent",
                    opacity: index === currentIndex ? 1 : 0.4,
                    cursor: "pointer",
                    background: "transparent",
                    padding: 0,
                    transition: "opacity 0.15s",
                  }}
                >
                  <img src={photo.src} alt={photo.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>

          <style>{`@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
        </div>
      ) : null}
    </>
  );
}
