import { useState, useRef } from 'react';
import { Hero } from './components/Hero';
import { Calendar } from './components/Calendar';
import { QuoteForm, QuoteData } from './components/QuoteForm';
import { Confirmation } from './components/Confirmation';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleScrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseForm = () => {
    setSelectedDate(null);
  };

  const handleSubmitQuote = (data: QuoteData) => {
    console.log('Quote submitted:', data);
    setSelectedDate(null);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onScrollToCalendar={handleScrollToCalendar} />

      <div ref={calendarRef} className="bg-primary">
        <Calendar onSelectDate={handleSelectDate} />
      </div>

      {selectedDate && (
        <QuoteForm
          selectedDate={selectedDate}
          onClose={handleCloseForm}
          onSubmit={handleSubmitQuote}
        />
      )}

      {showConfirmation && (
        <Confirmation onClose={handleCloseConfirmation} />
      )}
    </div>
  );
}