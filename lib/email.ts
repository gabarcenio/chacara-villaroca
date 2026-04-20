import { Resend } from "resend";
import { formatVenueDateLong, parseVenueDateKey } from "@/lib/date";
import { VENUE } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "VillaRoça <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL!;

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

function formatDates(dateKeys: string[]) {
  return dateKeys.map((k) => formatVenueDateLong(parseVenueDateKey(k))).join(", ");
}

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1C1C1C;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#FFDC00;font-size:28px;font-family:'Georgia',serif;letter-spacing:1px;">VillaRoça</p>
            <p style="margin:6px 0 0;color:#ffffff80;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Chácara para Eventos · Barretos-SP</p>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f4f0;padding:24px 40px;text-align:center;border-top:1px solid #e8e7e3;">
            <p style="margin:0;color:#888;font-size:12px;">${VENUE.address}</p>
            <p style="margin:6px 0 0;font-size:12px;">
              <a href="https://wa.me/${VENUE.whatsapp[0]}" style="color:#1C1C1C;">WhatsApp</a>
              &nbsp;·&nbsp;
              <a href="https://instagram.com/${VENUE.instagram}" style="color:#1C1C1C;">@${VENUE.instagram}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── 1. Owner notification ──────────────────────────────────────────────────

export async function sendNewBookingNotification(booking: BookingInfo) {
  const dates = formatDates(booking.dateKeys);
  const services = booking.services.length > 0 ? booking.services.join(", ") : "Nenhum";

  const content = `
    <h2 style="margin:0 0 4px;color:#1C1C1C;font-size:22px;">Nova solicitação de orçamento</h2>
    <p style="margin:0 0 28px;color:#888;font-size:14px;">Recebida agora mesmo pelo site</p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:12px 0;border-bottom:1px solid #f0eeea;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Cliente</p>
        <p style="margin:4px 0 0;color:#1C1C1C;font-size:16px;font-weight:bold;">${booking.name}</p>
      </td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f0eeea;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Data(s) solicitada(s)</p>
        <p style="margin:4px 0 0;color:#1C1C1C;font-size:15px;">${dates}</p>
      </td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f0eeea;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Evento · Convidados</p>
        <p style="margin:4px 0 0;color:#1C1C1C;font-size:15px;">${booking.eventType} · ${booking.guestCount} pessoas</p>
      </td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f0eeea;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Telefone</p>
        <p style="margin:4px 0 0;font-size:15px;"><a href="https://wa.me/55${booking.phone.replace(/\D/g,"")}" style="color:#1C1C1C;">${booking.phone}</a></p>
      </td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f0eeea;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">E-mail</p>
        <p style="margin:4px 0 0;font-size:15px;"><a href="mailto:${booking.email}" style="color:#1C1C1C;">${booking.email}</a></p>
      </td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f0eeea;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Serviços adicionais</p>
        <p style="margin:4px 0 0;color:#1C1C1C;font-size:15px;">${services}</p>
      </td></tr>
      ${booking.message ? `<tr><td style="padding:12px 0;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Mensagem</p>
        <p style="margin:4px 0 0;color:#555;font-size:15px;font-style:italic;">"${booking.message}"</p>
      </td></tr>` : ""}
    </table>

    <div style="margin-top:32px;text-align:center;">
      <a href="https://chacaravillaroca.com.br/admin" style="display:inline-block;background:#1C1C1C;color:#FFDC00;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;letter-spacing:0.5px;">
        Abrir painel admin →
      </a>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to: [OWNER_EMAIL],
    subject: `Nova solicitação: ${booking.eventType} — ${booking.name}`,
    html: baseTemplate(content),
  });
}

// ── 2. Booking declined ────────────────────────────────────────────────────

export async function sendBookingDeclined(booking: BookingInfo) {
  const dates = formatDates(booking.dateKeys);

  const content = `
    <h2 style="margin:0 0 16px;color:#1C1C1C;font-size:22px;">Olá, ${booking.name.split(" ")[0]}.</h2>
    <p style="margin:0 0 16px;color:#555;font-size:16px;line-height:1.7;">
      Agradecemos o seu interesse na <strong>Chácara VillaRoça</strong>.
      Infelizmente, a(s) data(s) solicitada(s) não estão disponíveis no momento:
    </p>
    <div style="background:#f5f4f0;border-left:3px solid #FFDC00;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="margin:0;color:#1C1C1C;font-size:15px;">${dates}</p>
    </div>
    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">
      Se tiver flexibilidade de datas, entre em contato pelo WhatsApp — teremos prazer em verificar outras opções para o seu evento.
    </p>
    <div style="text-align:center;margin-top:32px;">
      <a href="https://wa.me/${VENUE.whatsapp[0]}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;">
        Falar no WhatsApp
      </a>
    </div>
    <p style="margin:32px 0 0;color:#aaa;font-size:13px;text-align:center;">
      Esperamos poder recebê-los em breve na VillaRoça.
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: [booking.email],
    subject: "Sua solicitação na Chácara VillaRoça",
    html: baseTemplate(content),
  });
}

// ── 3. Booking confirmed ───────────────────────────────────────────────────

export async function sendBookingConfirmed(booking: BookingInfo) {
  const dates = formatDates(booking.dateKeys);

  const content = `
    <h2 style="margin:0 0 8px;color:#1C1C1C;font-size:22px;">Reserva confirmada! 🎉</h2>
    <p style="margin:0 0 20px;color:#888;font-size:14px;">Olá, ${booking.name.split(" ")[0]} — mal podemos esperar pelo seu evento.</p>

    <div style="background:#f5f4f0;border-left:3px solid #FFDC00;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 28px;">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#aaa;">Data(s) confirmada(s)</p>
      <p style="margin:0;color:#1C1C1C;font-size:15px;font-weight:bold;">${dates}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#555;">${booking.eventType} · ${booking.guestCount} convidados</p>
    </div>

    <p style="margin:0 0 16px;color:#1C1C1C;font-size:16px;font-weight:bold;">Próximo passo: dados para o contrato</p>
    <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
      Para elaborarmos o contrato de locação, precisamos dos seus dados pessoais. Por favor, responda este e-mail ou envie pelo WhatsApp com as informações abaixo:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f8f6;border-radius:8px;padding:20px;margin:0 0 28px;">
      ${[
        "Nome completo",
        "CPF",
        "RG",
        "Data de nascimento",
        "Endereço completo (rua, número, bairro)",
        "CEP",
        "Cidade / Estado",
      ].map(item => `<tr><td style="padding:6px 0;">
        <span style="color:#aaa;font-size:13px;">▸</span>
        <span style="color:#1C1C1C;font-size:14px;margin-left:8px;">${item}</span>
      </td></tr>`).join("")}
    </table>

    <p style="margin:0 0 28px;color:#555;font-size:14px;line-height:1.7;">
      Assim que recebermos, enviaremos o contrato para assinatura e as instruções para o pagamento do sinal de reserva.
    </p>

    <div style="text-align:center;">
      <a href="https://wa.me/${VENUE.whatsapp[0]}" style="display:inline-block;background:#1C1C1C;color:#FFDC00;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;margin-right:8px;">
        Enviar pelo WhatsApp
      </a>
    </div>

    <p style="margin:32px 0 0;color:#aaa;font-size:13px;text-align:center;">
      Qualquer dúvida, estamos à disposição. Até breve!
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: [booking.email],
    subject: `Reserva confirmada na VillaRoça — ${dates}`,
    html: baseTemplate(content),
  });
}
