interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL?: string;
  ALLOWED_ORIGIN?: string;
  ALLOWED_ORIGINS?: string;
}

interface ClientMessage {
  role: 'assistant' | 'user';
  content: string;
}

interface ChatRequestBody {
  messages?: ClientMessage[];
}

const OPENROUTER_CHAT_COMPLETIONS_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openrouter/free';
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 900;

const FUJIPP_KNOWLEDGE = `
Profile:
- Name: Anawat Grudtoop.
- Nickname/brand: Fujipp.
- Role goal: Full Stack Developer / Software Engineer, with strong interest in System Architecture.
- Education: School of Information Technology.
- Current stage: preparing to become a first jobber.
- Core mindset: organized project structure, clear naming, maintainable systems, planning before implementation.

Skills:
- Frontend: React, Vue.js, TypeScript, JavaScript, Tailwind CSS, HTML, Bootstrap, shadcn/ui.
- Backend: Spring Boot, Java, Node.js.
- Database: MySQL, PostgreSQL, MongoDB, Firebase, Redis.
- Tools and workflow: GitHub Actions, Docker, Postman, Cypress, Figma, Canva, VS Code, IntelliJ IDEA.
- Interests: Discord bots, automation, AI-assisted development, solution design, architecture, security.

Featured projects:
- Chat2Date: senior project dating/mobile app. It includes profile matching, chat, relationship scoring, AI game/question flow, GPS-based filtering, date planning, place recommendation, notifications, location sharing, SOS, reporting, blocking, face verification, and admin moderation.
- eTax Internship work: production-team internship work involving integrated project pages and service diagrams.

Contact:
- Discord: fujipp. (profile URL uses Discord user id on the About page).
- Instagram: @f.janw, https://www.instagram.com/f.janw/
- Facebook: @fujipp, https://www.facebook.com/fujipp
- Gmail: anawat.grudtoop@gmail.com
- GitHub: @Fujipp, https://github.com/Fujipp
- The main About page has contact cards for these channels. Do not say there is a contact form.
- For policy or terms questions only, the site also lists fujipp.official@gmail.com on the Privacy/Terms pages.

Personal notes:
- Fujipp likes building practical systems from ideas, not only visual demos.
- Fujipp values clear structure, usability, security, and systems that are easy to extend.
- Website domain: https://www.fujipp.com.
`;

const EMPTY_REPLY_FALLBACK =
  'ตอนนี้ Fujipp AI ยังอยู่ในช่วงพัฒนา และระบบ AI ส่งคำตอบกลับมาไม่สมบูรณ์ครับ ลองถามใหม่อีกครั้ง หรือถามเกี่ยวกับประวัติ ทักษะ โปรเจกต์ และช่องทางติดต่อของ Fujipp ได้เลยครับ';

const CONTACT_REPLY =
  'ติดต่อ Fujipp ได้ผ่านช่องทางเหล่านี้ครับ:\n\n' +
  '- Gmail: anawat.grudtoop@gmail.com\n' +
  '- GitHub: https://github.com/Fujipp\n' +
  '- Instagram: https://www.instagram.com/f.janw/\n' +
  '- Facebook: https://www.facebook.com/fujipp\n' +
  '- Discord: fujipp.\n\n' +
  'ตอนนี้หน้าเว็บหลักใช้ contact cards สำหรับช่องทางเหล่านี้ ยังไม่มีฟอร์มติดต่อครับ';

function getAllowedOrigins(env: Env) {
  const origins = env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || '';
  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function createCorsHeaders(origin: string | null, env: Env) {
  const allowedOrigins = getAllowedOrigins(env);
  const responseOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': responseOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(body: unknown, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function sanitizeMessages(messages: ClientMessage[]) {
  return messages
    .filter((message) => message.role === 'assistant' || message.role === 'user')
    .map((message) => ({
      role: message.role,
      content: String(message.content || '').trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES);
}

async function parseRequestBody(request: Request) {
  try {
    return (await request.json()) as ChatRequestBody;
  } catch {
    return {};
  }
}

function isContactQuestion(message: string) {
  const normalizedMessage = message.toLowerCase();
  return [
    'ติดต่อ',
    'ช่องทาง',
    'contact',
    'email',
    'gmail',
    'github',
    'instagram',
    'facebook',
    'discord',
  ].some((keyword) => normalizedMessage.includes(keyword));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsHeaders = createCorsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
    }

    if (!env.OPENROUTER_API_KEY) {
      return jsonResponse({ error: 'OPENROUTER_API_KEY is not configured' }, 500, corsHeaders);
    }

    const body = await parseRequestBody(request);
    const clientMessages = sanitizeMessages(body.messages || []);

    if (clientMessages.length === 0) {
      return jsonResponse({ error: 'messages is required' }, 400, corsHeaders);
    }

    const latestUserMessage = [...clientMessages].reverse().find((message) => message.role === 'user');

    if (latestUserMessage && isContactQuestion(latestUserMessage.content)) {
      return jsonResponse({ reply: CONTACT_REPLY }, 200, corsHeaders);
    }

    const openRouterResponse = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.fujipp.com',
        'X-Title': 'Fujipp Website',
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || DEFAULT_MODEL,
        temperature: 0.35,
        max_tokens: 420,
        messages: [
          {
            role: 'system',
            content: [
              'You are Fujipp AI, a helpful portfolio assistant for Anawat Grudtoop, also known as Fujipp.',
              'Answer in the same language as the user when possible. Thai is preferred for Thai questions.',
              'Only answer about Fujipp, his skills, projects, experience, website, and contact guidance.',
              'When the user asks how to contact Fujipp, answer with the exact contact channels listed in Contact. Prefer Gmail, GitHub, Instagram, Facebook, and Discord.',
              'If the answer is not in the knowledge base, say politely that the information is not available on the website.',
              'Do not invent personal details, private contact info, employment history, grades, contact forms, phone numbers, LINE IDs, or claims not listed here.',
              FUJIPP_KNOWLEDGE,
            ].join('\n'),
          },
          ...clientMessages,
        ],
      }),
    });

    const openRouterData = await openRouterResponse.json().catch(() => null) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    } | null;

    if (!openRouterResponse.ok) {
      return jsonResponse(
        { error: openRouterData?.error?.message || 'OpenRouter request failed' },
        openRouterResponse.status,
        corsHeaders,
      );
    }

    const reply = openRouterData?.choices
      ?.map((choice) => choice.message?.content?.trim())
      .find((content) => content && content.length > 0);

    if (!reply) {
      return jsonResponse({ reply: EMPTY_REPLY_FALLBACK }, 200, corsHeaders);
    }

    return jsonResponse({ reply }, 200, corsHeaders);
  },
};
