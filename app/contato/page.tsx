import { Instagram, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { VENUE } from "@/lib/constants";

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${VENUE.whatsapp[0]}`;
  const instagramUrl = `https://instagram.com/${VENUE.instagram}`;

  return (
    <>
      <SiteHeader />
      <main className="bg-white px-5 py-12 md:py-20">
        <section className="mx-auto max-w-4xl">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            contato
          </p>
          <h1 className="mb-5 text-4xl text-primary md:text-5xl">Vamos conversar sobre a sua data.</h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            Envie uma mensagem para tirar dúvidas, visitar o espaço ou acompanhar sua solicitação de orçamento.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#25D366] p-6 text-white transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="mb-5" size={28} aria-hidden="true" />
              <h2 className="mb-2 text-2xl">WhatsApp</h2>
              <p>Fale com a VillaRoça agora.</p>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary p-6 text-white transition-transform hover:-translate-y-0.5"
            >
              <Instagram className="mb-5" size={28} aria-hidden="true" />
              <h2 className="mb-2 text-2xl">Instagram</h2>
              <p>@{VENUE.instagram}</p>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
