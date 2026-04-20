import { useState } from 'react';
import { X } from 'lucide-react';

interface QuoteFormProps {
  selectedDate: Date | null;
  onClose: () => void;
  onSubmit: (data: QuoteData) => void;
}

export interface QuoteData {
  eventType: string;
  guestCount: number;
  date: Date;
  services: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
}

const eventTypes = [
  'Casamento',
  'Aniversário',
  'Confraternização',
  'Corporativo',
  'Outro'
];

const availableServices = [
  'Decoração',
  'Catering',
  'DJ/Música',
  'Fotografia',
  'Bar premium',
  'Churrasqueira'
];

export function QuoteForm({ selectedDate, onClose, onSubmit }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: '',
    guestCount: '',
    services: [] as string[],
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.eventType) newErrors.eventType = 'Selecione o tipo de evento';
      const count = parseInt(formData.guestCount);
      if (!formData.guestCount || isNaN(count) || count <= 0) {
        newErrors.guestCount = 'Informe o número de convidados';
      } else if (count > 60) {
        newErrors.guestCount = 'Capacidade máxima: 60 convidados';
      }
    }

    if (currentStep === 2) {
      if (!formData.name) newErrors.name = 'Nome obrigatório';
      if (!formData.email) {
        newErrors.email = 'E-mail obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
      if (!formData.phone) newErrors.phone = 'Telefone obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep(2) && selectedDate) {
      onSubmit({
        ...formData,
        guestCount: parseInt(formData.guestCount),
        date: selectedDate,
      });
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  if (!selectedDate) return null;

  const formattedDate = selectedDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative w-full md:w-full md:max-w-2xl bg-white rounded-t-3xl md:rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl">
          <div>
            <p className="text-primary" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.25rem' }}>
              solicitar orçamento
            </p>
            <h3 className="text-xl">{formattedDate}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-3">Tipo de evento</label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, eventType: type })}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        formData.eventType === type
                          ? 'bg-primary border-primary text-white'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.eventType && <p className="text-destructive text-sm mt-2">{errors.eventType}</p>}
              </div>

              <div>
                <label className="block mb-2">Número de convidados</label>
                <input
                  type="number"
                  max="60"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-transparent focus:border-primary outline-none transition-colors"
                  placeholder="Máximo 60 pessoas"
                />
                {errors.guestCount && <p className="text-destructive text-sm mt-2">{errors.guestCount}</p>}
              </div>

              <div>
                <label className="block mb-3">Serviços adicionais (opcional)</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        formData.services.includes(service)
                          ? 'bg-primary border-primary text-white'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary/90 transition-all"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2">Nome completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-transparent focus:border-primary outline-none transition-colors"
                  placeholder="Seu nome"
                />
                {errors.name && <p className="text-destructive text-sm mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block mb-2">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-transparent focus:border-primary outline-none transition-colors"
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-destructive text-sm mt-2">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-2">Telefone/WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-transparent focus:border-primary outline-none transition-colors"
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && <p className="text-destructive text-sm mt-2">{errors.phone}</p>}
              </div>

              <div>
                <label className="block mb-2">Mensagem (opcional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border-2 border-transparent focus:border-primary outline-none transition-colors resize-none"
                  placeholder="Conte mais sobre seu evento..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-secondary text-primary py-4 rounded-lg hover:bg-secondary/80 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 transition-all"
                >
                  Solicitar orçamento
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
