import { useState } from 'react';

type DayStatus = 'disponivel' | 'em-analise' | 'indisponivel' | null;

interface CalendarDay {
  date: number;
  status: DayStatus;
  isWeekend: boolean;
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarDay[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ date: 0, status: null, isWeekend: false });
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = new Date(year, month, date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let status: DayStatus = null;
    if (isWeekend) {
      if (Math.random() > 0.7) {
        status = 'indisponivel';
      } else if (Math.random() > 0.8) {
        status = 'em-analise';
      } else {
        status = 'disponivel';
      }
    }

    days.push({ date, status, isWeekend });
  }

  return days;
}

export function Calendar({ onSelectDate }: { onSelectDate: (date: Date) => void }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = generateCalendarDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.date === 0 || !day.isWeekend || day.status === 'indisponivel') return;
    onSelectDate(new Date(currentYear, currentMonth, day.date));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-8 text-center">
        <p className="text-accent mb-2" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>
          escolha sua data
        </p>
        <h2 className="text-3xl md:text-4xl mb-4 text-white">Disponibilidade</h2>
        <p className="text-white/70">
          Aceitamos reservas apenas para finais de semana · 60 convidados · 22 camas
        </p>
      </div>

      <div className="bg-primary rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xl text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm text-white/60 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isClickable = day.date !== 0 && day.isWeekend && day.status !== 'indisponivel';

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={!isClickable}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm relative
                  transition-all text-white
                  ${day.date === 0 ? 'invisible' : ''}
                  ${!day.isWeekend ? 'text-white/30' : ''}
                  ${day.status === 'indisponivel' ? 'line-through text-white/30' : ''}
                  ${isClickable ? 'hover:bg-accent/20 hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {day.date !== 0 && day.date}
                {day.status === 'disponivel' && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
                {day.status === 'em-analise' && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full border-2 border-accent" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border-2 border-accent" />
            <span>Em análise</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg line-through">15</span>
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}
