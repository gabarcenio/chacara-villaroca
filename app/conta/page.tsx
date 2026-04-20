import { LocalQuotesList } from "@/components/LocalQuotesList";
import { SiteHeader } from "@/components/SiteHeader";

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-4xl">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            minha conta
          </p>
          <h1 className="mb-5 text-4xl text-primary md:text-5xl">Suas solicitações</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Esta prévia usa armazenamento local até a conexão com Supabase Auth e banco de dados.
          </p>
          <LocalQuotesList />
        </section>
      </main>
    </>
  );
}
