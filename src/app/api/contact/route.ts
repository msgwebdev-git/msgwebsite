import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const EVENT_TYPE_LABELS: Record<string, string> = {
  festival: "Фестиваль",
  concert: "Концерт",
  conference: "Конференция / Форум",
  corporate: "Корпоратив",
  brandLaunch: "Презентация бренда",
  sports: "Спортивное событие",
  custom: "Другое",
};

const SERVICE_LABELS: Record<string, string> = {
  turnkey: "Под ключ",
  technical: "Техническое обеспечение",
  video: "Видеопроизводство",
  logistics: "Организация и логистика",
  digital: "Цифровые решения",
  advertising: "Рекламное производство",
  security: "Охрана и безопасность",
};

const GUEST_LABELS: Record<string, string> = {
  upTo100: "до 100",
  "100to500": "100 – 500",
  "500to1000": "500 – 1 000",
  "1000to5000": "1 000 – 5 000",
  "5000plus": "5 000+",
};

const BUDGET_LABELS: Record<string, string> = {
  undecided: "Не определён",
  small: "до €5 000",
  medium: "€5 000 – €20 000",
  large: "€20 000 – €50 000",
  enterprise: "€50 000+",
};

async function sendTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram credentials not configured");
    return;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Telegram send error:", err);
  }
}

function esc(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatSimple(body: Record<string, string>) {
  const { name, email, phone, message } = body;
  return [
    `<b>📩 Новая заявка</b>`,
    ``,
    `👤 ${esc(name)}`,
    `📧 ${esc(email)}`,
    phone ? `📱 ${esc(phone)}` : null,
    ``,
    `💬 <i>${esc(message)}</i>`,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatBrief(body: Record<string, unknown>) {
  const lines = [
    `<b>📋 Новый бриф</b>`,
    ``,
    `👤 ${esc(String(body.name || ""))}`,
    body.company ? `🏢 ${esc(String(body.company))}` : null,
    `📧 ${esc(String(body.email || ""))}`,
    body.phone ? `📱 ${esc(String(body.phone))}` : null,
  ];

  const eventTypes = body.eventTypes as string[] | undefined;
  if (eventTypes?.length) {
    const labels = eventTypes.map((k) => EVENT_TYPE_LABELS[k] || k);
    lines.push(``, `🎪 <b>Тип:</b> ${labels.map(esc).join(", ")}`);
  }

  const services = body.services as string[] | undefined;
  if (services?.length) {
    const labels = services.map((k) => SERVICE_LABELS[k] || k);
    lines.push(`🛠 <b>Услуги:</b> ${labels.map(esc).join(", ")}`);
  }

  if (body.eventDate) {
    lines.push(`📅 <b>Дата:</b> ${esc(formatDate(String(body.eventDate)))}`);
  }
  if (body.guestCount) {
    const label = GUEST_LABELS[String(body.guestCount)] || String(body.guestCount);
    lines.push(`👥 <b>Гостей:</b> ${esc(label)}`);
  }
  if (body.budget) {
    const label = BUDGET_LABELS[String(body.budget)] || String(body.budget);
    lines.push(`💰 <b>Бюджет:</b> ${esc(label)}`);
  }

  if (body.details) {
    lines.push(``, `💬 <i>${esc(String(body.details))}</i>`);
  }

  if (body.fileName) {
    lines.push(`📎 ${esc(String(body.fileName))}`);
  }

  return lines.filter((l) => l !== null).join("\n");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "brief") {
      if (!body.name || !body.email) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      await sendTelegram(formatBrief(body));
    } else {
      const { name, email, message } = body;
      if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      await sendTelegram(formatSimple(body));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
