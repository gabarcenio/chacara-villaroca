import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-md rounded-lg bg-white p-6">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            entrar
          </p>
          <h1 className="mb-4 text-3xl text-primary">Acesse sua conta</h1>
          <p className="mb-6 text-muted-foreground">
            A autenticação com Supabase será conectada na próxima etapa. Por enquanto, acompanhe a prévia em Minha conta.
          </p>
          <Link className="block rounded-lg bg-primary px-5 py-3 text-center text-white" href="/conta">
            Ver prévia da conta
          </Link>
        </section>
      </main>
    </>
  );
}
