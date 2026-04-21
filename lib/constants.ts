export const VENUE = {
  name: "Chácara VillaRoça",
  tagline: "Locação para Eventos",
  address: "Vicinal Pedro Vicentini, Km 5, Zona Rural - Barretos-SP",
  cep: "14785-000",
  capacity: { total: 60, beds: 22 },
  whatsapp: ["5517991392626", "5517981040870"],
  instagram: "chacaravilaroca",
  timezone: "America/Sao_Paulo",
} as const;

export const OWNER = {
  name: "Gabriel Arcenio Borges",
  nationality: "brasileiro",
  maritalStatus: "solteiro",
  address: "Rua SD 2 João de Faria nº 306, San Diego - Barretos-SP",
  cep: "14786-502",
} as const;

export const RENTAL = {
  bookableDays: [5, 6, 0] as const,
  defaultCheckIn: "08:00",
  defaultCheckOut: "18:00",
  depositPercent: 30,
  balanceDueDaysBeforeEvent: 3,
  cancellationForfeitPercent: 30,
  notIncluded: ["Gás de cozinha", "Limpeza durante a estadia", "Limpeza da piscina"],
  forbidden: ["Eventos com venda de ingressos ou pulseiras", "Eventos diferentes do contratado"],
  jurisdiction: "Comarca de Barretos-SP",
} as const;

export const BRAND = {
  colors: {
    charcoal: "#1C1C1C",
    yellow: "#FFDC00",
    red: "#C8102E",
  },
} as const;

// Indicative price ranges per event type (in BRL, per booking — not per day)
export const PRICING: Record<string, { min: number; max: number; suggested: number }> = {
  "Casamento":          { min: 4000, max: 7000, suggested: 5500 },
  "Aniversário":        { min: 2500, max: 4500, suggested: 3200 },
  "Confraternização":   { min: 2000, max: 4000, suggested: 2800 },
  "Corporativo":        { min: 3000, max: 5500, suggested: 4000 },
  "Retiro familiar":    { min: 2000, max: 3500, suggested: 2500 },
  "Outro":              { min: 2000, max: 5000, suggested: 3000 },
};

// Auto-approval is skipped for now — all bookings go through manual admin review
export const AUTO_APPROVE_EVENT_TYPES: string[] = [];
