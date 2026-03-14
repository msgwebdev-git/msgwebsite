import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ALLOWED_ORIGINS = [
  "https://mediashowgrup.com",
  "https://www.mediashowgrup.com",
];

// --- Rate limiting (in-memory, per IP) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// --- Validation ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT = 5000;
const MAX_NAME = 200;

function validateSimple(body: Record<string, unknown>): string | null {
  const { name, email, message } = body;
  if (!name || typeof name !== "string" || name.length > MAX_NAME) return "Invalid name";
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) return "Invalid email";
  if (!message || typeof message !== "string" || message.length > MAX_TEXT) return "Invalid message";
  return null;
}

function validateBrief(body: Record<string, unknown>): string | null {
  const { name, email } = body;
  if (!name || typeof name !== "string" || name.length > MAX_NAME) return "Invalid name";
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) return "Invalid email";
  if (body.details && (typeof body.details !== "string" || (body.details as string).length > MAX_TEXT))
    return "Invalid details";
  if (body.phone && (typeof body.phone !== "string" || (body.phone as string).length > 30))
    return "Invalid phone";
  if (body.company && (typeof body.company !== "string" || (body.company as string).length > MAX_NAME))
    return "Invalid company";
  return null;
}

// --- Labels ---
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

// --- Telegram ---
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

// --- Handler ---
export async function POST(request: Request) {
  try {
    // Origin check (skip in development)
    const origin = request.headers.get("origin");
    if (
      process.env.NODE_ENV === "production" &&
      origin &&
      !ALLOWED_ORIGINS.includes(origin)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body.type === "brief") {
      const error = validateBrief(body);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
      await sendTelegram(formatBrief(body));
    } else {
      const error = validateSimple(body);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
      await sendTelegram(formatSimple(body));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
