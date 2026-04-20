import { SiteHeader } from "@/components/SiteHeader";

export default function AdminCalendarPage() {
  return <AdminPlaceholder title="Calendário" />;
}

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-4xl rounded-lg bg-white p-6">
          <h1 className="mb-3 text-3xl text-primary">{title}</h1>
          <p className="text-muted-foreground">Gestão administrativa será conectada ao Supabase na próxima fatia.</p>
        </section>
      </main>
    </>
  );
}
