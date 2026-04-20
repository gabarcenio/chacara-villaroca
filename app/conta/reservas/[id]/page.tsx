import { SiteHeader } from "@/components/SiteHeader";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-3xl rounded-lg bg-white p-6">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            reserva
          </p>
          <h1 className="mb-4 text-3xl text-primary">Detalhes da solicitação</h1>
          <p className="text-muted-foreground">
            Solicitação {id}. Contrato, pagamento e assinatura serão conectados depois da etapa de Supabase.
          </p>
        </section>
      </main>
    </>
  );
}
