import { Check } from 'lucide-react';

interface ConfirmationProps {
  onClose: () => void;
}

export function Confirmation({ onClose }: ConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-white" />
        </div>

        <h2
          className="text-4xl md:text-5xl mb-4 text-primary"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Obrigado!
        </h2>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Recebemos seu pedido de orçamento.<br />
          Entraremos em contato em até 24 horas.
        </p>

        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#20BA5A] transition-all mb-4"
        >
          Falar no WhatsApp
        </a>

        <button
          onClick={onClose}
          className="block w-full text-muted-foreground hover:text-primary transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
