"use client";

import { Check } from "lucide-react";
import { VENUE } from "@/lib/constants";

type ConfirmationProps = {
  onClose: () => void;
};

export function Confirmation({ onClose }: ConfirmationProps) {
  const whatsappUrl = `https://wa.me/${VENUE.whatsapp[0]}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default bg-black/55" onClick={onClose} aria-label="Fechar confirmação" />

      <div className="relative w-full max-w-md rounded-lg bg-white p-8 text-center shadow-2xl md:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <Check size={40} className="text-white" aria-hidden="true" />
        </div>

        <h2 className="mb-4 text-4xl text-primary md:text-5xl" style={{ fontFamily: "var(--font-caveat)" }}>
          Obrigado!
        </h2>

        <p className="mb-6 leading-relaxed text-muted-foreground">
          Recebemos seu pedido de orçamento. A data foi marcada como em análise neste navegador.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-block rounded-lg bg-[#25D366] px-6 py-3 text-white transition-all hover:bg-[#20BA5A]"
        >
          Falar no WhatsApp
        </a>

        <button onClick={onClose} className="block w-full text-muted-foreground transition-colors hover:text-primary">
          Fechar
        </button>
      </div>
    </div>
  );
}
