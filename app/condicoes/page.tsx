import { SiteHeader } from "@/components/SiteHeader";
import { RENTAL, VENUE } from "@/lib/constants";

const included = [
  "Uso do espaço contratado para o evento informado",
  `Capacidade máxima de ${VENUE.capacity.total} convidados`,
  `${VENUE.capacity.beds} camas para hospedagem`,
  "Horário padrão das 08:00 às 18:00",
];

export default function ConditionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-secondary px-5 py-12 md:py-20">
        <section className="mx-auto max-w-4xl">
          <p className="mb-2 text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            condições
          </p>
          <h1 className="mb-5 text-4xl text-primary md:text-5xl">Tudo claro antes da reserva.</h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            O orçamento é personalizado para cada evento. A reserva é confirmada após aceite, contrato e pagamento da entrada de {RENTAL.depositPercent}%.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <RuleList title="Incluído" items={included} />
            <RuleList title="Não incluído" items={RENTAL.notIncluded} />
            <RuleList title="Não permitido" items={RENTAL.forbidden} />
          </div>

          <div className="mt-8 rounded-lg bg-white p-6">
            <h2 className="mb-3 text-xl text-primary">Pagamentos e cancelamento</h2>
            <p className="leading-relaxed text-muted-foreground">
              O sinal corresponde a {RENTAL.depositPercent}% do valor aprovado. O saldo vence {RENTAL.balanceDueDaysBeforeEvent} dias antes do evento.
              Em caso de cancelamento, o percentual previsto de retenção é de {RENTAL.cancellationForfeitPercent}%.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

function RuleList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="rounded-lg bg-white p-6">
      <h2 className="mb-4 text-xl text-primary">{title}</h2>
      <ul className="space-y-3 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}
