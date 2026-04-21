import { PRICING, RENTAL } from "@/lib/constants";

export function getPriceRange(eventType: string, dateCount: number) {
  const base = PRICING[eventType];
  if (!base) return null;
  // Multi-day events: each additional day adds ~40% of the base
  const multiplier = 1 + (dateCount - 1) * 0.4;
  return {
    min: Math.round(base.min * multiplier / 100) * 100,
    max: Math.round(base.max * multiplier / 100) * 100,
    suggested: Math.round(base.suggested * multiplier / 100) * 100,
  };
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function calcInstallments(totalPrice: number, installments: number) {
  const depositPercent = RENTAL.depositPercent / 100;
  const deposit = Math.round(totalPrice * depositPercent);
  const balance = totalPrice - deposit;

  if (installments === 1) {
    return [{ label: "Pagamento único", amount: totalPrice, dueDaysBeforeEvent: null }];
  }

  if (installments === 2) {
    return [
      { label: "Entrada (sinal)", amount: deposit, dueDaysBeforeEvent: null },
      { label: "Saldo", amount: balance, dueDaysBeforeEvent: RENTAL.balanceDueDaysBeforeEvent },
    ];
  }

  // 3 installments: 30% deposit + two equal halves of the balance
  const half = Math.round(balance / 2);
  return [
    { label: "Entrada (sinal)", amount: deposit, dueDaysBeforeEvent: null },
    { label: "2ª parcela", amount: half, dueDaysBeforeEvent: 30 },
    { label: "3ª parcela (saldo)", amount: balance - half, dueDaysBeforeEvent: RENTAL.balanceDueDaysBeforeEvent },
  ];
}
