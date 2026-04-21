import { OWNER, RENTAL, VENUE } from "@/lib/constants";
import { formatBRL, calcInstallments } from "@/lib/pricing";
import { formatVenueDateLong, parseVenueDateKey } from "@/lib/date";

export type ContractData = {
  bookingId: string;
  // Client
  clientName: string;
  clientCpf: string;
  clientRg: string;
  clientBirthDate: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientCep: string;
  clientPhone: string;
  clientEmail: string;
  // Event
  eventType: string;
  guestCount: number;
  dateKeys: string[];
  startTime: string;
  endTime: string;
  // Financial
  priceBrl: number;
  installments: number;
};

export function generateContractHtml(data: ContractData): string {
  const dates = data.dateKeys.map((k) => formatVenueDateLong(parseVenueDateKey(k))).join(", ");
  const installmentRows = calcInstallments(data.priceBrl, data.installments);
  const today = new Date().toLocaleDateString("pt-BR");

  const installmentTable = installmentRows
    .map(
      (row) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e6;">${row.label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e6;font-weight:bold;">${formatBRL(row.amount)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e8e6;color:#666;">
            ${row.dueDaysBeforeEvent != null ? `Até ${row.dueDaysBeforeEvent} dias antes do evento` : "Na assinatura deste contrato"}
          </td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Contrato de Locação — ${VENUE.name}</title>
<style>
  body { font-family: Georgia, serif; font-size: 12pt; color: #1C1C1C; line-height: 1.7; margin: 0; padding: 40px; }
  h1 { font-size: 16pt; text-align: center; margin-bottom: 4px; }
  h2 { font-size: 12pt; margin-top: 28px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  .center { text-align: center; }
  .meta { text-align: center; color: #666; font-size: 10pt; margin-bottom: 32px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  td { vertical-align: top; }
  .sign-block { display: inline-block; width: 45%; margin: 0 2.5%; }
  .sign-line { border-top: 1px solid #333; margin-top: 48px; padding-top: 6px; font-size: 10pt; }
  .clause { margin-bottom: 12px; }
  .highlight { background: #fffbe6; border-left: 3px solid #FFDC00; padding: 8px 16px; margin: 16px 0; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>

<h1>CONTRATO DE LOCAÇÃO DE ESPAÇO PARA EVENTOS</h1>
<p class="meta">Chácara VillaRoça — Barretos/SP &nbsp;|&nbsp; Código: ${data.bookingId.slice(0, 8).toUpperCase()}</p>

<h2>CLÁUSULA 1ª — DAS PARTES</h2>
<p><strong>LOCADOR:</strong> ${OWNER.name}, ${OWNER.nationality}, ${OWNER.maritalStatus}, portador de CPF/CNPJ, residente e domiciliado na ${OWNER.address}, CEP ${OWNER.cep}, doravante denominado simplesmente <strong>LOCADOR</strong>.</p>
<p><strong>LOCATÁRIO:</strong> ${data.clientName}, portador do CPF nº ${data.clientCpf}, RG nº ${data.clientRg}, nascido em ${data.clientBirthDate}, residente e domiciliado na ${data.clientAddress}, ${data.clientCity}/${data.clientState}, CEP ${data.clientCep}, doravante denominado simplesmente <strong>LOCATÁRIO</strong>.</p>

<h2>CLÁUSULA 2ª — DO OBJETO</h2>
<p class="clause">O LOCADOR cede ao LOCATÁRIO, em regime de locação temporária, o espaço denominado <strong>${VENUE.name}</strong>, situado na ${VENUE.address}, CEP ${VENUE.cep}, para a realização de <strong>${data.eventType}</strong>.</p>

<h2>CLÁUSULA 3ª — DO PERÍODO E HORÁRIO</h2>
<p class="clause">
  A locação compreende a(s) data(s): <strong>${dates}</strong>.<br/>
  Horário de entrada: <strong>${data.startTime}</strong> &nbsp;|&nbsp; Horário de saída: <strong>${data.endTime}</strong>.
</p>
<p class="clause">Capacidade máxima contratada: <strong>${data.guestCount} convidados</strong> (limite absoluto: ${VENUE.capacity.total} pessoas).</p>

<h2>CLÁUSULA 4ª — DO VALOR E FORMA DE PAGAMENTO</h2>
<div class="highlight">
  <strong>Valor total da locação: ${formatBRL(data.priceBrl)}</strong>
</div>
<p>O valor será quitado conforme o seguinte cronograma:</p>
<table>
  <thead>
    <tr style="background:#f7f7f6;">
      <th style="padding:8px 12px;text-align:left;">Parcela</th>
      <th style="padding:8px 12px;text-align:left;">Valor</th>
      <th style="padding:8px 12px;text-align:left;">Vencimento</th>
    </tr>
  </thead>
  <tbody>${installmentTable}</tbody>
</table>
<p>O pagamento será realizado via Pix para a chave informada pelo LOCADOR. O não pagamento da entrada na data de assinatura deste contrato implica na automática rescisão do mesmo.</p>

<h2>CLÁUSULA 5ª — DA RESCISÃO</h2>
<p class="clause">Em caso de cancelamento pelo LOCATÁRIO, será retido <strong>${RENTAL.cancellationForfeitPercent}%</strong> do valor pago a título de multa rescisória. Cancelamentos com menos de 30 dias de antecedência não darão direito a qualquer reembolso.</p>
<p class="clause">O LOCADOR poderá rescindir o contrato sem ônus mediante comprovação de caso fortuito ou força maior, restituindo integralmente os valores pagos.</p>

<h2>CLÁUSULA 6ª — DAS OBRIGAÇÕES DO LOCATÁRIO</h2>
<p class="clause">O LOCATÁRIO se compromete a:</p>
<ul>
  <li>Utilizar o espaço exclusivamente para o evento contratado (${data.eventType}), sendo vedada qualquer alteração sem prévia autorização do LOCADOR;</li>
  <li>Respeitar rigorosamente o horário de saída;</li>
  <li>Entregar o imóvel nas mesmas condições em que o recebeu, sendo responsável pelos danos causados por si ou por seus convidados;</li>
  <li>Zelar pelo patrimônio, sendo vedado o uso de fogos de artifício, fixação de objetos nas paredes e excesso de capacidade;</li>
  <li>São itens não incluídos na locação e de responsabilidade do LOCATÁRIO: ${RENTAL.notIncluded.join("; ")}.</li>
</ul>

<h2>CLÁUSULA 7ª — DAS PROIBIÇÕES</h2>
<p class="clause">É expressamente proibido: ${RENTAL.forbidden.join("; ")}.</p>

<h2>CLÁUSULA 8ª — DO FORO</h2>
<p class="clause">As partes elegem o foro da <strong>${RENTAL.jurisdiction}</strong>, com renúncia expressa a qualquer outro, por mais privilegiado que seja, para dirimir quaisquer controvérsias oriundas deste contrato.</p>

<p>Por estarem assim justos e contratados, as partes assinam o presente instrumento em duas vias de igual teor.</p>
<p class="meta">Barretos/SP, ${today}</p>

<br/><br/>
<div style="text-align:center;">
  <div class="sign-block">
    <div class="sign-line">
      ${OWNER.name}<br/>
      LOCADOR
    </div>
  </div>
  <div class="sign-block">
    <div class="sign-line">
      ${data.clientName}<br/>
      LOCATÁRIO
    </div>
  </div>
</div>

</body>
</html>`;
}
