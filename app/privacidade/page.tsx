import { SiteHeader } from "@/components/SiteHeader";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white px-5 py-12 md:py-20">
        <section className="mx-auto max-w-3xl">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            privacidade
          </p>
          <h1 className="mb-5 text-4xl text-primary md:text-5xl">Seus dados, sua reserva.</h1>
          <div className="space-y-5 leading-relaxed text-muted-foreground">
            <p>
              Usamos os dados enviados no formulário para responder pedidos de orçamento, organizar contratos e enviar comunicações sobre a reserva.
            </p>
            <p>
              O aceite de marketing é opcional. A conexão definitiva com Supabase terá políticas de acesso para que clientes vejam apenas seus próprios dados.
            </p>
            <p>
              Solicitações de correção ou remoção podem ser feitas pelo WhatsApp informado na página de contato.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
