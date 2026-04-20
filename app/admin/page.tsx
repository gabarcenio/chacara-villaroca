import { SiteHeader } from "@/components/SiteHeader";

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-5xl">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            admin
          </p>
          <h1 className="mb-5 text-4xl text-primary md:text-5xl">Painel administrativo</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            A próxima fatia conecta Supabase, RLS e fila real de solicitações para liberar aprovação de orçamento.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {["Solicitações", "Calendário", "Financeiro"].map((item) => (
              <div key={item} className="rounded-lg bg-white p-6">
                <h2 className="mb-2 text-xl text-primary">{item}</h2>
                <p className="text-muted-foreground">Em preparação para a integração com Supabase.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
