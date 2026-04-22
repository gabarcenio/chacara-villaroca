import { SiteHeader } from "@/components/SiteHeader";
import { PropertyStory } from "@/components/PropertyStory";
import { VENUE } from "@/lib/constants";

const PAPER = "#faf8f4";
const INK   = "#0c0a08";
const LINE  = "rgba(250,248,244,0.12)";

export default function SpacePage() {
  return (
    <div style={{ background: INK, minHeight: "100vh", fontFamily: "var(--font-inter)", color: PAPER }}>
      <SiteHeader dark />

      {/* ── Hero image ── */}
      <section className="relative overflow-hidden h-[260px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
        <img
          src="/photos/varanda.jpg"
          alt="Vista da área externa da Chácara VillaRoça"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,10,8,0.75) 0%, rgba(12,10,8,0.1) 55%)" }} />
        <div className="absolute left-5 bottom-6 right-5 md:left-10 md:bottom-10 md:right-10">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.7)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 18 }}>
            O Espaço · Barretos-SP
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px, 6vw, 56px)", fontWeight: 280, lineHeight: 1.04, letterSpacing: "-0.9px", margin: 0, color: PAPER, maxWidth: 620, fontVariationSettings: '"opsz" 144' }}>
            Um endereço rural<br />para encontros especiais.
          </h1>
        </div>
      </section>

      {/* ── Two-column intro ── */}
      <section className="px-5 py-8 md:px-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: PAPER, fontWeight: 300, letterSpacing: "-0.1px" }}>
          A VillaRoça recebe aniversários, casamentos, confraternizações e eventos
          familiares em Barretos-SP, com atendimento direto e orçamento personalizado
          para cada data.
        </p>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "rgba(250,248,244,0.6)", fontWeight: 300 }}>
          Uma sede de campo pensada para dias longos, reuniões sem pressa e memórias
          compartilhadas. Atendemos grupos de até {VENUE.capacity.total} pessoas com
          hospedagem para {VENUE.capacity.beds}.
        </p>
      </section>

      {/* ── Photo grid + lightbox gallery ── */}
      <PropertyStory />

      {/* ── Address bar ── */}
      <section
        className="mx-5 py-5 pb-10 md:mx-10 md:pb-12 flex items-center gap-2.5 text-sm"
        style={{ borderTop: `1px solid ${LINE}`, color: "rgba(250,248,244,0.6)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" />
        </svg>
        {VENUE.address}
      </section>
    </div>
  );
}
