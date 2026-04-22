import { SiteHeader } from "@/components/SiteHeader";
import { RENTAL, VENUE } from "@/lib/constants";

const PAPER  = "#faf8f4";
const INK    = "#0c0a08";
const MUTED  = "#8a8578";
const MUTED2 = "#5e5a50";
const LINE   = "#e7e2d7";

const included = [
  "Uso do espaço contratado para o evento informado",
  `Capacidade máxima de ${VENUE.capacity.total} convidados`,
  `${VENUE.capacity.beds} camas para hospedagem`,
  "Horário padrão das 08:00 às 18:00",
];

const panels = [
  { mark: "+", title: "Incluído",       items: included },
  { mark: "–", title: "Não incluído",   items: RENTAL.notIncluded },
  { mark: "×", title: "Não permitido",  items: RENTAL.forbidden },
];

export default function ConditionsPage() {
  return (
    <div style={{ background: PAPER, minHeight: "100vh", fontFamily: "var(--font-inter)", color: INK }}>
      <SiteHeader dark={false} />

      {/* ── Hero image with text overlay ── */}
      <section className="relative mx-5 md:mx-10 h-[200px] sm:h-[260px] md:h-[340px] overflow-hidden">
        <img
          src="/photos/mesa-varanda.jpeg"
          alt="Mesa posta na varanda"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,10,8,0.65) 0%, rgba(12,10,8,0.1) 60%)" }} />
        <div className="absolute left-5 bottom-5 right-5 md:left-10 md:bottom-8 md:right-10">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.7)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 14 }}>
            Condições
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 300, lineHeight: 1.04, letterSpacing: "-0.9px", margin: 0, color: "#fff", maxWidth: 460, fontVariationSettings: '"opsz" 144' }}>
            Tudo claro antes da reserva.
          </h1>
        </div>
      </section>

      {/* ── Lead paragraph ── */}
      <section className="px-5 pt-10 pb-7 md:px-10 md:pt-14 md:pb-8" style={{ maxWidth: 660 }}>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: MUTED2, fontWeight: 300 }}>
          O orçamento é personalizado para cada evento. A reserva é confirmada após aceite,
          contrato e pagamento da entrada de {RENTAL.depositPercent}%.
        </p>
      </section>

      {/* ── Three panels ── */}
      <section className="px-5 pb-10 md:px-10 md:pb-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {panels.map((panel) => (
          <div key={panel.title}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${LINE}` }}>
              <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 300, color: MUTED }}>
                {panel.mark}
              </span>
              <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 360, letterSpacing: "-0.3px", color: INK }}>
                {panel.title}
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {panel.items.map((item) => (
                <li key={item} style={{ fontSize: 13, lineHeight: 1.55, color: MUTED2, padding: "8px 0" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ── Payment dark band ── */}
      <section
        className="mx-5 mb-14 md:mx-10 md:mb-14 p-7 md:p-11 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        style={{ background: INK, color: PAPER }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.55)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 18 }}>
            Pagamento
          </div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 300, lineHeight: 1.04, letterSpacing: "-0.9px", margin: 0, color: PAPER, fontVariationSettings: '"opsz" 144' }}>
            Sinal de {RENTAL.depositPercent}%.
          </h2>
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(250,248,244,0.7)", fontWeight: 300, margin: 0 }}>
          O sinal corresponde a {RENTAL.depositPercent}% do valor aprovado. O saldo vence{" "}
          {RENTAL.balanceDueDaysBeforeEvent} dias antes do evento.
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(250,248,244,0.7)", fontWeight: 300, margin: 0 }}>
          Em caso de cancelamento, o percentual previsto de retenção é de{" "}
          {RENTAL.cancellationForfeitPercent}%.
        </p>
      </section>
    </div>
  );
}
