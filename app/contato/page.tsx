import { SiteHeader } from "@/components/SiteHeader";
import { VENUE } from "@/lib/constants";

const PAPER  = "#faf8f4";
const INK    = "#0c0a08";
const MUTED  = "#8a8578";
const MUTED2 = "#5e5a50";
const LINE   = "#e7e2d7";
const GREEN  = "#25d366";

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${VENUE.whatsapp[0]}`;
  const instagramUrl = `https://instagram.com/${VENUE.instagram}`;

  return (
    <div style={{ background: PAPER, minHeight: "100vh", fontFamily: "var(--font-inter)", color: INK }}>
      <SiteHeader dark={false} />

      {/* ── Heading section ── */}
      <section className="px-5 pt-12 pb-10 md:px-10 md:pt-20 md:pb-14">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: MUTED, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 18 }}>
          Contato
        </div>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px, 6vw, 56px)", fontWeight: 280, lineHeight: 1.04, letterSpacing: "-0.9px", margin: "0 0 24px", color: INK, fontVariationSettings: '"opsz" 144' }}>
          Vamos conversar<br />sobre a sua data.
        </h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: MUTED2, maxWidth: 560, fontWeight: 300 }}>
          Envie uma mensagem para tirar dúvidas, visitar o espaço ou acompanhar
          sua solicitação de orçamento.
        </p>
      </section>

      {/* ── Contact cards ── */}
      <section className="px-5 pb-10 md:px-10 md:pb-14 grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* WhatsApp card */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 20, padding: "28px 28px 24px", background: PAPER, border: `1px solid ${LINE}`, minHeight: 200 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: GREEN, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: MUTED, letterSpacing: "2px", textTransform: "uppercase" }}>Online agora</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 360, letterSpacing: "-0.5px", color: INK, marginBottom: 6 }}>WhatsApp</div>
            <div style={{ fontSize: 13.5, color: MUTED2, lineHeight: 1.5 }}>Fale com a VillaRoça. Resposta em minutos, seg–sáb.</div>
          </div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: INK, fontWeight: 500 }}>
            <span>Abrir conversa</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
          </div>
        </a>

        {/* Instagram card */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 20, padding: "28px 28px 24px", background: INK, minHeight: 200 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.55)", letterSpacing: "2px", textTransform: "uppercase" }}>Feed</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(250,248,244,0.7)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle fill="rgba(250,248,244,0.7)" cx="17" cy="7" r="0.9" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 360, letterSpacing: "-0.5px", color: PAPER, marginBottom: 6 }}>Instagram</div>
            <div style={{ fontSize: 13.5, color: "rgba(250,248,244,0.6)", lineHeight: 1.5 }}>@{VENUE.instagram} · fotos do espaço e eventos recentes.</div>
          </div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: PAPER, fontWeight: 500 }}>
            <span>Abrir perfil</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
          </div>
        </a>
      </section>

      {/* ── Footer info row ── */}
      <section
        className="mx-5 pt-6 pb-16 md:mx-10 flex flex-wrap gap-8 text-sm"
        style={{ borderTop: `1px solid ${LINE}`, color: MUTED2 }}
      >
        <div>
          <span style={{ color: MUTED, letterSpacing: "1.5px", textTransform: "uppercase", fontSize: 10, fontFamily: "var(--font-mono)", marginRight: 12 }}>E-mail</span>
          reservas@villaroca.com.br
        </div>
        <div>
          <span style={{ color: MUTED, letterSpacing: "1.5px", textTransform: "uppercase", fontSize: 10, fontFamily: "var(--font-mono)", marginRight: 12 }}>Atendimento</span>
          Seg–Sáb · 08:00–19:00
        </div>
      </section>
    </div>
  );
}
