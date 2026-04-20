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
