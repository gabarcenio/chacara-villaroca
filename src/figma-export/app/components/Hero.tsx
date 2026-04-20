import { ChevronDown } from 'lucide-react';

export function Hero({ onScrollToCalendar }: { onScrollToCalendar: () => void }) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/src/imports/varanda.jpg"
          alt="Vista aérea da Chácara VillaRoça"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-white" style={{ fontFamily: 'Caveat, cursive' }}>
          <span className="text-3xl">VillaRoça</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white/90 text-sm">
          <button className="hover:text-white transition-colors">Espaço</button>
          <button onClick={onScrollToCalendar} className="hover:text-white transition-colors">
            Disponibilidade
          </button>
          <button className="hover:text-white transition-colors">Contato</button>
          <button className="hover:text-white transition-colors">Entrar</button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-100px)] px-6 text-center">
        <h1 className="text-white text-4xl md:text-6xl max-w-4xl leading-tight mb-6">
          Celebrações que ficam.<br />
          No coração de Barretos.
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-12">
          Um refúgio para os seus momentos mais especiais
        </p>
        <button
          onClick={onScrollToCalendar}
          className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-all"
        >
          Ver disponibilidade
        </button>
      </div>

      <button
        onClick={onScrollToCalendar}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </div>
  );
}
