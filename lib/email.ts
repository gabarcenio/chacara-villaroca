import { Resend } from "resend";
import { parseVenueDateKey, formatVenueDateLong } from "@/lib/date";
import { formatBRL } from "@/lib/pricing";

const getResend = () => new Resend(process.env.RESEND_API_KEY);
const FROM = "VillaRoça <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "";
const LOGO_URL =
  "https://raw.githubusercontent.com/gabarcenio/chacara-villaroca/main/public/logo.png";

// ─── Design tokens (from design handoff) ────────────────────────────────────
const INK       = "#141413";
const INK_SOFT  = "rgba(20,20,19,0.62)";
const INK_MUTED = "rgba(20,20,19,0.45)";
const HAIRLINE  = "rgba(20,20,19,0.08)";
const SURFACE   = "#ffffff";
const PAPER     = "#f5f2ec";
const CARD_SOFT = "#faf8f4";
const YELLOW    = "#f5c518";
const FOOTER_BG = "#fbfaf7";

const SANS  = "Arial,Helvetica,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";
const MONO  = "Consolas,'Courier New',monospace";

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
  priceBrl?: number | null;
  installments?: number;
};

type ContractEmailInfo = {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  dateKeys: string[];
  priceBrl: number;
  installments: number;
  contractHtml: string;
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
function firstName(name: string) {
  return name.split(" ")[0];
}

function shortDate(dateKey: string): string {
  const d = parseVenueDateKey(dateKey);
  const months = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDates(dateKeys: string[]) {
  return dateKeys.map((k) => formatVenueDateLong(parseVenueDateKey(k))).join(" · ");
}

// ─── HTML primitives ──────────────────────────────────────────────────────────
function chip(text: string): string {
  return `<span style="display:inline-block;font-family:${MONO};font-size:12px;padding:5px 9px;background-color:${SURFACE};border:1px solid ${HAIRLINE};border-radius:5px;color:${INK};letter-spacing:0.01em;white-space:nowrap;margin-right:5px;margin-bottom:4px;">${text}</span>`;
}

function chipMuted(text: string): string {
  return `<span style="display:inline-block;font-family:${MONO};font-size:12px;padding:5px 9px;background-color:transparent;border:1px dashed rgba(20,20,19,0.18);border-radius:5px;color:${INK_SOFT};letter-spacing:0.01em;text-decoration:line-through;white-space:nowrap;margin-right:5px;margin-bottom:4px;">${text}</span>`;
}

function serviceTag(text: string): string {
  return `<span style="display:inline-block;font-family:${SANS};font-size:12px;font-weight:500;padding:4px 9px;border-radius:999px;background-color:${SURFACE};border:1px solid ${HAIRLINE};color:${INK};margin-right:5px;margin-bottom:4px;">${text}</span>`;
}

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="border-radius:999px;background-color:${INK};box-shadow:0 1px 2px rgba(20,20,19,0.1),0 4px 12px rgba(20,20,19,0.12);">
      <a href="${href}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:14px;font-weight:bold;color:${YELLOW};text-decoration:none;border-radius:999px;letter-spacing:-0.005em;">${label} &#8594;</a>
    </td>
  </tr>
</table>`;
}

function eyebrow(text: string, dotColor: string, textColor: string): string {
  return `<p style="margin:0 0 18px;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;">
  <span style="color:${dotColor};">&#9679;&nbsp;</span><span style="color:${textColor};">${text}</span>
</p>`;
}

function h1(html: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${SERIF};font-size:38px;font-weight:500;line-height:1.05;letter-spacing:-0.02em;color:${INK};">${html}</h1>`;
}

function lede(html: string): string {
  return `<p style="margin:0 0 28px;font-family:${SANS};font-size:15px;line-height:1.55;color:${INK_SOFT};">${html}</p>`;
}

function signoff(text: string): string {
  return `<p style="margin:22px 0 0;font-family:${SERIF};font-size:13px;font-style:italic;color:${INK_MUTED};line-height:1.55;letter-spacing:0.005em;">${text}</p>`;
}

function rowLabel(text: string): string {
  return `<p style="margin:0 0 8px;font-family:${SANS};font-size:10px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${INK_MUTED};">${text}</p>`;
}

// ─── Shell (header + footer wrapper) ─────────────────────────────────────────
function shell(preheader: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>VillaRo&#231;a</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,400&display=swap" rel="stylesheet"/>
  <style>@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,400&display=swap');</style>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};">
    <tr><td align="center" style="padding:28px 24px;">

      <!-- Email card -->
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="background-color:${SURFACE};border-radius:14px;border:1px solid ${HAIRLINE};box-shadow:0 1px 2px rgba(20,20,19,0.04),0 12px 32px rgba(20,20,19,0.06);">

        <!-- ── HEADER ── -->
        <tr>
          <td style="background-color:#010101;border-radius:14px 14px 0 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <!-- Yellow top stripe -->
              <tr><td style="height:3px;background-color:${YELLOW};font-size:0;line-height:0;">&nbsp;</td></tr>
              <!-- Logo row -->
              <tr>
                <td style="padding:22px 28px 20px;background-color:#010101;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="top">
                        <img src="${LOGO_URL}" height="38" alt="VillaRo&#231;a" style="display:block;border:0;outline:none;margin-left:-4px;"/>
                        <p style="margin:4px 0 0;font-family:${SANS};font-size:9px;font-weight:bold;letter-spacing:0.2em;color:rgba(255,255,255,0.72);text-transform:uppercase;">CH&#193;CARA PARA EVENTOS</p>
                      </td>
                      <td align="right" valign="middle">
                        <p style="margin:0;font-family:${SANS};font-size:11px;color:rgba(255,255,255,0.88);letter-spacing:0.04em;"><span style="color:${YELLOW};">&#9679;</span> Barretos&nbsp;&#183;&nbsp;SP</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="background-color:${SURFACE};padding:36px 32px 32px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background-color:${FOOTER_BG};border-top:1px solid ${HAIRLINE};border-radius:0 0 14px 14px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <!-- Address + contact columns -->
              <tr>
                <td style="padding:22px 28px 16px;border-bottom:1px solid ${HAIRLINE};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="top" width="50%">
                        <p style="margin:0 0 6px;font-family:${SANS};font-size:9px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:${INK_MUTED};">Endere&#231;o</p>
                        <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.5;color:${INK_SOFT};">Vicinal Pedro Vicentini, Km 5<br/>Zona Rural &middot; Barretos, SP</p>
                      </td>
                      <td valign="top" align="right" width="50%">
                        <p style="margin:0 0 6px;font-family:${SANS};font-size:9px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:${INK_MUTED};">Contato</p>
                        <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.5;color:${INK_SOFT};">WhatsApp<br/>@chacaravilaroca</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Copyright -->
              <tr>
                <td style="padding:14px 28px 18px;">
                  <p style="margin:0;font-family:${SANS};font-size:10px;color:${INK_MUTED};letter-spacing:0.02em;">&#169; 2026 Ch&#225;cara VillaRo&#231;a &nbsp;&middot;&nbsp; Voc&#234; recebeu este e-mail por ter solicitado uma reserva.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ─── 1. Owner — new booking notification ─────────────────────────────────────
export async function sendNewBookingNotification(booking: BookingInfo) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://villaroca.com.br";
  const adminUrl = `${siteUrl}/admin`;

  const dateChips = booking.dateKeys.map((k) => chip(shortDate(k))).join("");
  const serviceTags =
    booking.services.length > 0
      ? booking.services.map((s) => serviceTag(s)).join("")
      : `<span style="font-family:${SANS};font-size:14px;color:${INK_MUTED};">&#8212;</span>`;

  const dataCard = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CARD_SOFT};border-radius:10px;border:1px solid ${HAIRLINE};margin:0 0 28px;">
  <tr>
    <td style="padding:16px 20px;border-bottom:1px solid rgba(20,20,19,0.06);">
      ${rowLabel("Datas solicitadas")}
      <div>${dateChips}</div>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 20px;border-bottom:1px solid rgba(20,20,19,0.06);">
      ${rowLabel("Evento &middot; convidados")}
      <p style="margin:0;font-family:${SANS};font-size:15px;font-weight:500;color:${INK};">${booking.eventType}&nbsp;<span style="color:${INK_MUTED};">&middot;</span>&nbsp;${booking.guestCount} pessoas</p>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 20px;border-bottom:1px solid rgba(20,20,19,0.06);">
      ${rowLabel("Contato")}
      <a href="mailto:${booking.email}" style="display:block;font-family:${SANS};font-size:15px;font-weight:500;color:${INK};text-decoration:none;border-bottom:1px solid rgba(20,20,19,0.2);padding-bottom:3px;margin-bottom:5px;">${booking.email}</a>
      <p style="margin:0;font-family:${MONO};font-size:13px;color:${INK_SOFT};">${booking.phone}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 20px;border-bottom:1px solid rgba(20,20,19,0.06);">
      ${rowLabel("Servi&#231;os adicionais")}
      <div>${serviceTags}</div>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 20px;">
      ${rowLabel("Mensagem")}
      ${booking.message
        ? `<p style="margin:0;font-family:${SERIF};font-size:17px;font-style:italic;color:${INK_SOFT};line-height:1.4;">&ldquo;${booking.message}&rdquo;</p>`
        : `<p style="margin:0;font-family:${SANS};font-size:14px;color:${INK_MUTED};">&#8212;</p>`
      }
    </td>
  </tr>
</table>`;

  const body = `
${eyebrow("Nova solicita&#231;&#227;o", "#f5c518", "#8a6d05")}
${h1(booking.name)}
${lede("Uma nova solicita&#231;&#227;o de reserva chegou. Confira abaixo e responda pelo painel admin.")}
${dataCard}
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right:16px;" valign="middle">${ctaButton(adminUrl, "Abrir painel admin")}</td>
    <td valign="middle"><a href="mailto:${booking.email}" style="font-family:${SANS};font-size:13px;font-weight:500;color:${INK_SOFT};text-decoration:none;">Responder por e-mail</a></td>
  </tr>
</table>`;

  return getResend().emails.send({
    from: FROM,
    to: [OWNER_EMAIL],
    subject: `Nova solicitação — ${booking.eventType} · ${firstName(booking.name)}`,
    html: shell(`${firstName(booking.name)} solicitou uma reserva.`, body),
  });
}

// ─── 2. Client — booking declined ────────────────────────────────────────────
export async function sendBookingDeclined(booking: BookingInfo) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://villaroca.com.br";
  const mutedChips = booking.dateKeys.map((k) => chipMuted(shortDate(k))).join("");

  const detailBlock = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CARD_SOFT};border-radius:10px;border:1px solid ${HAIRLINE};margin:0 0 28px;">
  <tr>
    <td style="padding:18px 22px;">
      ${rowLabel("Datas solicitadas")}
      <div>${mutedChips}</div>
      <p style="margin:8px 0 0;font-family:${SANS};font-size:12px;color:${INK_MUTED};">N&#227;o dispon&#237;veis para nova reserva</p>
    </td>
  </tr>
</table>`;

  const body = `
${eyebrow("Datas indispon&#237;veis", "#b85c2e", "#b85c2e")}
${h1(`Obrigado pelo contato, ${firstName(booking.name)}.`)}
${lede("Infelizmente as datas solicitadas j&#225; est&#227;o reservadas para outro evento. Gostar&#237;amos muito de receber voc&#234; em outra ocasi&#227;o.")}
${detailBlock}
<p style="margin:0 0 6px;font-family:${SANS};font-size:10px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${INK_MUTED};">Se quiser remarcar</p>
<p style="margin:0 0 8px;font-family:${SANS};font-size:17px;font-weight:600;color:${INK};letter-spacing:-0.01em;">Estamos &#224; sua disposi&#231;&#227;o</p>
<p style="margin:0 0 20px;font-family:${SANS};font-size:14px;line-height:1.55;color:${INK_SOFT};">Responda este e-mail ou fale com a gente diretamente pelo WhatsApp. Podemos ajudar a encontrar a data ideal.</p>
${ctaButton(siteUrl, "Ver datas dispon&#237;veis")}
${signoff("Agradecemos o seu interesse.")}`;

  return getResend().emails.send({
    from: FROM,
    to: [booking.email],
    subject: "Sua solicitação na Chácara VillaRoça",
    html: shell("Temos um retorno sobre a sua solicitação de reserva.", body),
  });
}

// ─── 3. Client — booking confirmed ───────────────────────────────────────────
export async function sendBookingConfirmed(booking: BookingInfo) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://villaroca.com.br";
  const contractLink = `${siteUrl}/contrato/${booking.id}`;
  const dates = formatDates(booking.dateKeys);

  const firstDate = parseVenueDateKey(booking.dateKeys[0]);
  const dayNames = ["Domingo","Segunda","Ter&#231;a","Quarta","Quinta","Sexta","S&#225;bado"];
  const dayLabel = dayNames[firstDate.getDay()];

  const priceRow = booking.priceBrl
    ? `
  <!-- divider -->
  <tr><td style="height:1px;background-color:${HAIRLINE};font-size:0;line-height:0;">&nbsp;</td></tr>
  <!-- price -->
  <tr>
    <td style="padding:18px 22px;">
      ${rowLabel("Valor total")}
      <p style="margin:0 0 6px;">
        <span style="font-family:${SERIF};font-size:32px;font-weight:500;color:${INK};letter-spacing:-0.02em;line-height:1;">${formatBRL(booking.priceBrl)}</span>
        &nbsp;<span style="font-family:${MONO};font-size:10px;font-weight:500;color:${INK_MUTED};letter-spacing:0.08em;padding:3px 7px;border:1px solid ${HAIRLINE};background-color:${SURFACE};border-radius:4px;">BRL</span>
      </p>
      <p style="margin:0;font-family:${SANS};font-size:12px;color:${INK_MUTED};">em ${booking.installments ?? 2}&#215;&nbsp;&middot;&nbsp;entrada de 30% na assinatura</p>
    </td>
  </tr>`
    : "";

  const detailBlock = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CARD_SOFT};border-radius:10px;border:1px solid ${HAIRLINE};margin:0 0 28px;">
  <!-- date row -->
  <tr>
    <td style="padding:18px 22px;">
      ${rowLabel("Data do evento")}
      <p style="margin:0 0 6px;font-family:${SANS};font-size:17px;font-weight:500;color:${INK};letter-spacing:-0.01em;">${dates}</p>
      <p style="margin:0;font-family:${SANS};font-size:12px;color:${INK_MUTED};">${dayLabel}&nbsp;&middot;&nbsp;${booking.guestCount} convidados</p>
    </td>
  </tr>
  ${priceRow}
</table>`;

  const body = `
${eyebrow("Reserva confirmada", "#0b8a4a", "#0b8a4a")}
${h1(`&#211;tima not&#237;cia,<br/>${firstName(booking.name)}.`)}
${lede("Sua reserva na Ch&#225;cara VillaRo&#231;a est&#225; confirmada. Aguardamos seu evento com muito prazer.")}
${detailBlock}
<p style="margin:0 0 6px;font-family:${SANS};font-size:10px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${INK_MUTED};">Pr&#243;ximo passo</p>
<p style="margin:0 0 8px;font-family:${SANS};font-size:17px;font-weight:600;color:${INK};letter-spacing:-0.01em;">Dados para o contrato</p>
<p style="margin:0 0 20px;font-family:${SANS};font-size:14px;line-height:1.55;color:${INK_SOFT};">Clique no bot&#227;o abaixo e preencha seus dados pessoais. O contrato ser&#225; enviado automaticamente para assinatura digital.</p>
${ctaButton(contractLink, "Preencher dados do contrato")}
${signoff("Qualquer d&#250;vida, estamos &#224; disposi&#231;&#227;o pelo WhatsApp.")}`;

  return getResend().emails.send({
    from: FROM,
    to: [booking.email],
    subject: `Reserva confirmada — ${dates} · VillaRoça`,
    html: shell(`Sua reserva para ${dates} está confirmada.`, body),
  });
}

// ─── 4. Client — contract for signing (fallback when Autentique not configured)
export async function sendContractForSigning(info: ContractEmailInfo) {
  const dates = formatDates(info.dateKeys);

  const body = `
${eyebrow("Contrato de loca&#231;&#227;o", INK, INK)}
${h1(`Ol&#225;, ${firstName(info.clientName)}.`)}
${lede(`Segue em anexo o contrato de loca&#231;&#227;o da Ch&#225;cara VillaRo&#231;a para o evento em <strong style="color:${INK};">${dates}</strong>. Assine, digitalize e responda este e-mail.`)}
<p style="margin:0;font-family:${SANS};font-size:13px;color:${INK_MUTED};line-height:1.6;">Em caso de d&#250;vidas, entre em contato pelo WhatsApp.</p>`;

  return getResend().emails.send({
    from: FROM,
    to: [info.clientEmail, OWNER_EMAIL],
    subject: `Contrato de locação — ${dates} · VillaRoça`,
    html: shell(`Contrato de locação para ${dates}.`, body),
    attachments: [
      {
        filename: `contrato-villaroca-${info.bookingId.slice(0, 8)}.html`,
        content: Buffer.from(info.contractHtml).toString("base64"),
      },
    ],
  });
}
