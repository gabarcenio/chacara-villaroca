import { SiteHeader } from "@/components/SiteHeader";

export default function AdminGalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-4xl rounded-lg bg-white p-6">
          <h1 className="mb-3 text-3xl text-primary">Galeria</h1>
          <p className="text-muted-foreground">Fotos serão gerenciadas com Supabase Storage ou Cloudinary.</p>
        </section>
      </main>
    </>
  );
}
