import { Resend } from "resend";
import { formatVenueDateLong, parseVenueDateKey } from "@/lib/date";
import { VENUE } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "VillaRoça <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL!;

// ─── Brand tokens ───────────────────────────────────────────────────────────
const C = {
  charcoal: "#1C1C1C",
  yellow: "#FFDC00",
  white: "#ffffff",
  offwhite: "#f7f7f6",
  border: "#e8e8e6",
  muted: "#666666",
  lightText: "#999999",
  green: "#16a34a",
  red: "#dc2626",
} as const;

// ─── Shared types ────────────────────────────────────────────────────────────
type BookingInfo = {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number;
  dateKeys: string[];
  services: string[];
  message: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDates(dateKeys: string[]) {
  return dateKeys.map((k) => formatVenueDateLong(parseVenueDateKey(k))).join(" · ");
}

function firstName(name: string) {
  return name.split(" ")[0];
}

// ─── Base shell ──────────────────────────────────────────────────────────────
function shell(preheader: string, body: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <!--<![endif]-->
  <title>VillaRoça</title>
</head>
<body style="margin:0;padding:0;background-color:#f0efec;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efec;">
    <tr><td align="center" style="padding:40px 16px;">

      <!-- Card -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <!-- Yellow top stripe -->
        <tr>
          <td style="background-color:${C.yellow};height:4px;border-radius:8px 8px 0 0;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Logo header -->
        <tr>
          <td style="background-color:${C.charcoal};padding:28px 40px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:${C.white};letter-spacing:0.5px;">VillaRoça</p>
                  <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#ffffff80;letter-spacing:2.5px;text-transform:uppercase;">Chácara para Eventos</p>
                </td>
                <td align="right" valign="middle">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#ffffff40;letter-spacing:1px;">Barretos · SP</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background-color:${C.white};padding:40px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:${C.offwhite};padding:24px 40px;border-top:1px solid ${C.border};border-radius:0 0 8px 8px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${C.lightText};text-align:center;line-height:1.6;">
              ${VENUE.address}<br/>
              <a href="https://wa.me/${VENUE.whatsapp[0]}" style="color:${C.muted};text-decoration:none;">WhatsApp</a>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="https://instagram.com/${VENUE.instagram}" style="color:${C.muted};text-decoration:none;">@${VENUE.instagram}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ─── Reusable pieces ─────────────────────────────────────────────────────────

function dataRow(label: string, value: string, last = false) {
  return `
  <tr>
    <td style="padding:12px 0;${last ? "" : `border-bottom:1px solid ${C.border};`}vertical-align:top;">
      <p style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${C.lightText};">${label}</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.charcoal};line-height:1.5;">${value}</p>
    </td>
  </tr>`;
}

function ctaButton(href: string, label: string, bg: string = C.charcoal, fg: string = C.yellow) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="border-radius:8px;background-color:${bg};">
        <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${fg};text-decoration:none;letter-spacing:0.3px;border-radius:8px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function divider() {
  return `<tr><td style="padding:24px 0;"><div style="border-top:1px solid ${C.border};font-size:0;line-height:0;">&nbsp;</div></td></tr>`;
}

function highlightBox(content: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
    <tr>
      <td width="3" style="background-color:${C.yellow};border-radius:3px;font-size:0;">&nbsp;</td>
      <td style="padding:16px 18px;background-color:${C.offwhite};border-radius:0 8px 8px 0;">
        ${content}
      </td>
    </tr>
  </table>`;
}

// ─── 1. Owner — new booking notification ─────────────────────────────────────

export async function sendNewBookingNotification(booking: BookingInfo) {
  const dates = formatDates(booking.dateKeys);
  const services = booking.services.length > 0 ? booking.services.join(", ") : "—";

  const body = `
    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.yellow};">Nova solicitação</p>
    <h1 style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;color:${C.charcoal};line-height:1.2;">${booking.name}</h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
      ${dataRow("Data(s) solicitada(s)", `<strong>${dates}</strong>`)}
      ${dataRow("Evento · Convidados", `${booking.eventType} &nbsp;·&nbsp; ${booking.guestCount} pessoas`)}
      ${dataRow("Telefone", `<a href="https://wa.me/55${booking.phone.replace(/\D/g,"")}" style="color:${C.charcoal};text-decoration:none;">${booking.phone}</a>`)}
      ${dataRow("E-mail", `<a href="mailto:${booking.email}" style="color:${C.charcoal};text-decoration:none;">${booking.email}</a>`)}
      ${dataRow("Serviços adicionais", services)}
      ${booking.message
        ? dataRow("Mensagem", `<em style="color:${C.muted};">"${booking.message}"</em>`, true)
        : dataRow("Mensagem", `<span style="color:${C.lightText};">—</span>`, true)}
    </table>

    ${ctaButton("https://chacaravillaroca.com.br/admin", "Abrir painel admin →")}
  `;

  return resend.emails.send({
    from: FROM,
    to: [OWNER_EMAIL],
    subject: `Nova solicitação — ${booking.eventType} · ${firstName(booking.name)}`,
    html: shell(`${firstName(booking.name)} solicitou ${dates}.`, body),
  });
}

// ─── 2. Client — booking declined ────────────────────────────────────────────

export async function sendBookingDeclined(booking: BookingInfo) {
  const dates = formatDates(booking.dateKeys);

  const body = `
    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Retorno da sua solicitação</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:${C.charcoal};line-height:1.3;">Olá, ${firstName(booking.name)}.</h1>

    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${C.muted};line-height:1.7;">
      Agradecemos o interesse na <strong style="color:${C.charcoal};">Chácara VillaRoça</strong>. Infelizmente, a data solicitada não está disponível no momento.
    </p>

    ${highlightBox(`
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${C.lightText};">Data solicitada</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${C.charcoal};font-weight:bold;">${dates}</p>
    `)}

    <p style="margin:0 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${C.muted};line-height:1.7;">
      Se tiver flexibilidade de datas ou quiser explorar outras opções, entre em contato diretamente pelo WhatsApp — estamos à disposição.
    </p>

    ${ctaButton(`https://wa.me/${VENUE.whatsapp[0]}`, "Falar no WhatsApp", "#25D366", C.white)}

    <p style="margin:32px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.lightText};line-height:1.6;">
      Esperamos poder recebê-los em breve na VillaRoça.
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: [booking.email],
    subject: "Sua solicitação na Chácara VillaRoça",
    html: shell("Temos um retorno sobre a sua solicitação de orçamento.", body),
  });
}

// ─── 3. Client — booking confirmed ───────────────────────────────────────────

export async function sendBookingConfirmed(booking: BookingInfo) {
  const dates = formatDates(booking.dateKeys);

  const contractFields = [
    "Nome completo",
    "CPF",
    "RG e órgão expedidor",
    "Data de nascimento",
    "Endereço completo (rua, número, bairro)",
    "CEP · Cidade · Estado",
  ];

  const body = `
    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.green};">Reserva confirmada</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:${C.charcoal};line-height:1.3;">Ótima notícia, ${firstName(booking.name)}!</h1>

    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${C.muted};line-height:1.7;">
      Sua reserva na <strong style="color:${C.charcoal};">Chácara VillaRoça</strong> está confirmada. Aguardamos seu evento com muito prazer.
    </p>

    ${highlightBox(`
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${C.lightText};">Data(s) confirmada(s)</p>
      <p style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${C.charcoal};font-weight:bold;">${dates}</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.muted};">${booking.eventType} &nbsp;·&nbsp; ${booking.guestCount} convidados</p>
    `)}

    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${C.charcoal};">Próximo passo — dados para o contrato</p>
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.muted};line-height:1.7;">
      Para elaborarmos o contrato de locação, responda este e-mail ou envie os dados abaixo pelo WhatsApp:
    </p>

    <!-- Checklist -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.offwhite};border-radius:8px;margin:0 0 32px;">
      <tr><td style="padding:20px 24px;">
        ${contractFields.map((field, i) => `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${i < contractFields.length - 1 ? `border-bottom:1px solid ${C.border};` : ""}">
            <tr>
              <td width="24" valign="middle" style="padding:10px 0;">
                <div style="width:18px;height:18px;border:2px solid ${C.border};border-radius:4px;font-size:0;">&nbsp;</div>
              </td>
              <td valign="middle" style="padding:10px 0 10px 10px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.charcoal};">${field}</p>
              </td>
            </tr>
          </table>`).join("")}
      </td></tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right:12px;">
          ${ctaButton(`https://wa.me/${VENUE.whatsapp[0]}`, "Enviar pelo WhatsApp", C.charcoal, C.yellow)}
        </td>
      </tr>
    </table>

    <p style="margin:32px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.lightText};line-height:1.6;">
      Qualquer dúvida, estamos à disposição. Até o grande dia!
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: [booking.email],
    subject: `Reserva confirmada — ${dates} · VillaRoça`,
    html: shell(`Sua reserva para ${dates} está confirmada.`, body),
  });
}
