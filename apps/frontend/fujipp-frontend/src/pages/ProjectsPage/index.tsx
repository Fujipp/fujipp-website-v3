import { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue, memo } from 'react';
import { Link } from 'react-router-dom';
import { CertificateModal } from '../../components/ui/CertificateModal/index';
import { Button } from '../../components/ui/button';
import { useScrollLock } from '../../hooks/useScrollLock';
import { FolderOpen, Github, ExternalLink, Star, Briefcase, Bot, Package, Layers, Award, Building2, FileCheck2, X, ZoomIn, ChevronLeft, ChevronRight, FileText, FlaskConical, BookOpen, Heart, Gamepad2, Fish,
  Shield, ShoppingBag, ArrowRightLeft, Users, Tag, UserCircle, MessageSquare, Code2, Ticket, Banknote,
  ChevronDown, TrendingDown, LayoutList, LayoutGrid, Check, ArrowRight, Search, SearchX, Sparkles, Palette, Monitor, Server, Database } from 'lucide-react';
import { useProjectFilter } from '../../stores/use-project-filter';
import styles from './ProjectsPage.module.css';

// ── Types ────────────────────────────────────────────────────────────────────
export type Category = 'all' | 'ui-design' | 'frontend' | 'backend' | 'fullstack' | 'database' | 'library' | 'internship' | 'discord';
export type Status = 'active' | 'archived' | 'wip';
type SortBy = 'priority' | 'status' | 'category';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'all'>;
  status: Status;
  tech: string[];
  icon: React.ElementType;
  priority: number;
  featured?: boolean;
  github?: string;
  live?: string;
  certificate?: { image: string; pdf?: string; label: string };
  images?: string[];
  commissioned?: boolean;
}

// ── Category metadata ─────────────────────────────────────────────────────────
export const CATEGORIES: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: 'all',        label: 'All Projects',        icon: Layers },
  { id: 'ui-design',  label: 'UI Designer',         icon: Palette },
  { id: 'frontend',   label: 'Frontend Only',       icon: Monitor },
  { id: 'backend',    label: 'Backend Only',        icon: Server },
  { id: 'fullstack',  label: 'Full Stack',          icon: Code2 },
  { id: 'database',   label: 'Database',            icon: Database },
  { id: 'library',    label: 'Library',             icon: Package },
  { id: 'internship', label: 'Internship',          icon: Briefcase },
  { id: 'discord',    label: 'Discord Bot Project', icon: Bot },
];

const CATEGORY_CLASS: Record<Exclude<Category, 'all'>, string> = {
  'ui-design': styles.cat_ui_design,
  frontend:   styles.cat_frontend,
  backend:    styles.cat_backend,
  fullstack:  styles.cat_fullstack,
  database:   styles.cat_database,
  internship: styles.cat_internship,
  discord:    styles.cat_discord,
  library:    styles.cat_library,
};

const STATUS_CLASS: Record<Status, string> = {
  active:   styles.status_active,
  archived: styles.status_archived,
  wip:      styles.status_wip,
};

export const STATUS_LABEL: Record<Status, string> = {
  active:   '● Active',
  archived: '○ Archived',
  wip:      '◐ In Progress',
};

const AI_WORKFLOW_TOOLS: {
  name: string;
  plan: string;
  role: string;
  icon: React.ElementType;
}[] = [
  {
    name: 'Claude Code',
    plan: 'Claude Pro Plan',
    role: 'ใช้ช่วยวางแผน อ่านภาพรวม และเขียนโค้ดส่วนหลัก โดยเน้น reasoning กับ structure ก่อนลงมือจริง',
    icon: Layers,
  },
  {
    name: 'Codex',
    plan: 'GPT Plus Plan',
    role: 'ใช้ช่วยตรวจสอบโค้ด ทบทวนความเสี่ยง และเขียนโค้ดเพิ่มในจุดที่ต้องการความละเอียด',
    icon: Code2,
  },
  {
    name: 'Gemini CLI',
    plan: 'Google Gemini Pro Plan',
    role: 'ใช้คุมโครงสร้าง หาข้อมูล ตรวจมุมกว้าง และช่วยงานโค้ดเล็กน้อยเมื่อต้องการอีกมุมมอง',
    icon: Search,
  },
];

const AI_WORKFLOW_PRINCIPLES = [
  'วางแผนก่อนเขียน',
  'ตรวจซ้ำจากหลายมุม',
  'ไม่ปล่อยให้ AI ตัวเดียวสุดโต่ง',
  'รวมจุดแข็งของแต่ละตัวให้เหมาะกับงาน',
];

// ── Projects data (sorted by priority desc within each category) ──────────────
export const PROJECTS: Project[] = [
  // ── UI DESIGN ───────────────────────────────────────────────────────────────
  {
    id: 'portfolio-ui-direction',
    title: 'Fujipp Portfolio — UI Direction & Interaction System',
    description:
      'Personal portfolio design direction focused on a polished dark interface, structured navigation, readable project storytelling, responsive layouts, and small interaction details that make the site feel professional without becoming a marketing page.',
    category: 'ui-design',
    status: 'active',
    tech: ['UI Design', 'Responsive Design', 'Design Tokens', 'Motion', 'Accessibility'],
    icon: Palette,
    priority: 94,
    featured: true,
  },

  // ── FRONTEND ONLY ───────────────────────────────────────────────────────────
  {
    id: 'fujipp-website-frontend',
    title: 'Fujipp Website — React Portfolio Frontend',
    description:
      'Frontend portfolio website built with React, TypeScript, Vite, TailwindCSS, CSS Modules, and shadcn/ui. Focuses on fast page loading, reusable layout structure, theme tokens, responsive pages, project filtering, and interactive profile/detail experiences.',
    category: 'frontend',
    status: 'active',
    tech: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'CSS Modules', 'shadcn/ui'],
    icon: Monitor,
    priority: 96,
    featured: true,
    github: 'https://github.com/Fujipp/website-fujipp-official',
  },

  // ── INTERNSHIP ──────────────────────────────────────────────────────────────
  {
    id: 'yip-rpa-sftp',
    title: 'RPA-001 — SFTP File Processing & Message Queue System',
    description:
      'Enterprise RPA system built at Yip In Tsoi & Co., Ltd. (internship, Jan–Jul 2025). Automated end-to-end file processing pipeline: clients upload files to an SFTP server → Robocorp robot polls every 10 min, validates filenames, decrypts, and routes files across VALIDATE / INPROGRESS / SUCCESS / FAILED / RETRY directories → RabbitMQ broker dispatches messages via Topic Exchange to a Process File Service → Oracle DB stores results. Includes Dead Letter Queue (DLQ) with retry/expiry handling.',
    category: 'internship',
    status: 'archived',
    tech: ['Robocorp', 'RabbitMQ', 'SFTP', 'Oracle DB', 'Spring Boot', 'Java', 'Python'],
    icon: Building2,
    priority: 100,
    featured: true,
    certificate: {
      image: '/images/certificate/yip_certificate.png',
      pdf: '/images/certificate/yip_certificate.pdf',
      label: 'Yip In Tsoi — Internship Certificate',
    },
    images: [
      '/images/education/intern_yip/yip_1.png',
      '/images/education/intern_yip/yip_2.png',
    ],
  },
  {
    id: 'yip-etax',
    title: 'Etax Service — e-Tax Invoice with Digital Signature',
    description:
      'Production microservice platform at Yip In Tsoi & Co., Ltd. for generating legally-compliant e-tax invoices. Pipeline: AQ Listener dequeues from Oracle AQ → Etax Document Service creates XML from JSON, sends to Etax Sign Service for XAdES signing (PKCS#11/HSM), generates PDF/A-3U, embeds signed XML, then sends for PAdES signing → Etax Sender Service (Apache NiFi) delivers the final signed PDF/A-3U to recipients via Email and SMS.',
    category: 'internship',
    status: 'archived',
    tech: ['Spring Boot', 'Oracle AQ', 'PDF/A-3U', 'XAdES', 'PAdES', 'HSM', 'Apache NiFi', 'Java'],
    icon: FileCheck2,
    priority: 92,
    images: ['/images/education/intern_yip/Etax_Service_Diagram.png'],
  },
  {
    id: 'yip-report',
    title: 'Report Generation — Business & Operational Reports',
    description:
      'Internship learning experience at Yip In Tsoi & Co., Ltd. Gained hands-on experience generating structured business and operational reports from enterprise data sources. Learned to query Oracle DB, transform result sets, and format output as PDF documents for management and operational use within the enterprise system.',
    category: 'internship',
    status: 'archived',
    tech: ['JasperReports', 'Oracle DB', 'SQL', 'Java', 'Spring Boot'],
    icon: FileText,
    priority: 85,
  },
  {
    id: 'yip-testing',
    title: 'Software Testing — Unit, Integration & API Testing',
    description:
      'Internship learning experience at Yip In Tsoi & Co., Ltd. Developed software testing skills across multiple levels: writing unit tests with JUnit 5 for Spring Boot service layers, integration testing across microservice boundaries, and manual API testing with Postman. Learned test case documentation and validation workflows in an enterprise Java environment.',
    category: 'internship',
    status: 'archived',
    tech: ['JUnit 5', 'Mockito', 'Postman', 'Spring Boot', 'Java'],
    icon: FlaskConical,
    priority: 80,
  },

  // ── DISCORD BOTS ────────────────────────────────────────────────────────────
  {
    id: 'discord-kanom-roblox',
    title: 'Discord Bot — Kanom Roblox Shop',
    description:
      'Commissioned & deployed Roblox shop bot for a client. Features payment panel, user credit system, top-up history, leaderboard, and automated setup. Integrates PromptPay QR code generation, slip verification via @fujipp/slipok, OTP auth, and a REST API via Express. Actively maintained with a monthly deployment fee.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'Express', 'PostgreSQL', 'axios', 'promptpay-qr', 'otplib'],
    icon: Gamepad2,
    priority: 95,
    commissioned: true,
  },
  {
    id: 'discord-ticket',
    title: 'Discord Bot — Ticket System',
    description:
      'Modular ticket management bot: setup panel, close ticket, transcript generation, and add/remove member commands. Structured with a clean modular bot architecture for easy extension.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'dotenv', 'chalk', 'figlet'],
    icon: Ticket,
    priority: 90,
  },
  {
    id: 'discord-reviewbot',
    title: 'Discord Bot — ReviewBot',
    description:
      'Automated review room management bot: auto-reply on post, reaction handling, message counter, and credit/review count synchronization across channels.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'dotenv', 'chalk', 'figlet'],
    icon: Star,
    priority: 88,
  },
  {
    id: 'discord-snowwhite',
    title: 'Discord Bot — SnowWhite Moderator',
    description:
      'Comprehensive server moderation bot covering manual moderation commands, auto-moderation rules, and structured server activity logging. Built on PostgreSQL for persistent data.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'PostgreSQL', 'dotenv', 'chalk', 'figlet'],
    icon: Shield,
    priority: 85,
  },
  {
    id: 'discord-akshop',
    title: 'Discord Bot — AK Shop',
    description:
      'Commissioned & deployed shop and review bot with credit management. Written and maintained for a client with a monthly deployment fee.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'dotenv', 'chalk', 'figlet'],
    icon: ShoppingBag,
    priority: 82,
    commissioned: true,
  },
  {
    id: 'discord-price-embed',
    title: 'Discord Bot — Price Embed',
    description:
      'Scheduled price embed bot using node-cron: sends embed messages at set times and generates child embeds dynamically via button interactions.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'node-cron', 'dotenv'],
    icon: Tag,
    priority: 80,
  },
  {
    id: 'discord-profile-picker',
    title: 'Discord Bot — Profile Picker',
    description:
      'Slash command bot for fetching high-resolution user avatars, banners, and server icons directly within Discord.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'dotenv'],
    icon: UserCircle,
    priority: 78,
  },
  {
    id: 'discord-move-credit',
    title: 'Discord Utility — Move Credit Messages',
    description:
      'Utility script that migrates messages from a Discord channel to another server via webhook while preserving the original sender name, avatar, and file attachments.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'Discord Webhook', 'dotenv'],
    icon: ArrowRightLeft,
    priority: 70,
  },
  {
    id: 'discord-move-users-roles',
    title: 'Discord Utility — Move Users & Roles',
    description:
      'Cross-server user migration tool that syncs users and their roles via OAuth2. Runs as an HTTP-only service on Cloudflare Workers using itty-router and wrangler.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord-interactions', 'itty-router', 'Cloudflare Workers', 'wrangler'],
    icon: Users,
    priority: 68,
  },
  {
    id: 'discord-idaxdshop',
    title: 'Discord Bot — IDA×D Shop',
    description:
      'Commissioned & deployed shop/top-up/credit/status bot with voice keeper, written for a partner server. Currently migrating data layer from JSON files to PostgreSQL/Neon. Built in TypeScript with tsx.',
    category: 'discord',
    status: 'active',
    tech: ['TypeScript', 'Node.js', 'discord.js', 'Express', 'PostgreSQL', 'tsx'],
    icon: ShoppingBag,
    priority: 65,
  },
  {
    id: 'discord-send-message',
    title: 'Discord Utility — Send & Edit Message',
    description:
      'Commissioned & deployed utility bot for sending and editing public-facing messages via modal input and slash commands. Written for a client and actively maintained with a monthly deployment fee.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'dotenv', 'chalk', 'figlet'],
    icon: MessageSquare,
    priority: 60,
    commissioned: true,
  },
  {
    id: 'discord-template',
    title: 'Discord Bot — Starter Template',
    description:
      'Personal Discord bot boilerplate for quickly starting new projects. Includes a modular command structure, dotenv config, chalk/figlet logging, and nodemon for development.',
    category: 'discord',
    status: 'active',
    tech: ['Node.js', 'discord.js', 'dotenv', 'chalk', 'figlet', 'nodemon'],
    icon: Code2,
    priority: 50,
  },

  // ── UNIVERSITY ──────────────────────────────────────────────────────────────
  {
    id: 'uni-chat2date',
    title: 'Chat2Date — Dating & Matching Application',
    description:
      'Capstone project — a full-stack mobile dating application that connects users through intelligent matching and real-time chat. Built with Flutter for cross-platform iOS/Android UI and Spring Boot for the backend API, covering user profiles, match algorithms, and messaging features. Currently in active development.',
    category: 'fullstack',
    status: 'wip',
    tech: ['Flutter', 'Dart', 'Spring Boot', 'Java', 'MySQL'],
    icon: Heart,
    priority: 95,
  },
  {
    id: 'uni-integrated',
    title: 'Integrated Project — Homework Board Website',
    description:
      'Full-stack homework management board built as an integrated project at university. Allows students to post, manage, and track assignments across subjects. Features role-based access, assignment status tracking, and a responsive UI. Built with Vue.js on the frontend and Spring Boot on the backend.',
    category: 'fullstack',
    status: 'archived',
    tech: ['Vue.js', 'JavaScript', 'Spring Boot', 'Java', 'MySQL'],
    icon: BookOpen,
    priority: 88,
    images: [
      '/images/education/Integrated_project/webpageInt222-1.png',
      '/images/education/Integrated_project/webpageInt222-2.png',
      '/images/education/Integrated_project/webpageInt222-3.png',
      '/images/education/Integrated_project/webpageInt222-4.png',
      '/images/education/Integrated_project/webpageInt222-5.png',
      '/images/education/Integrated_project/webpageInt222-6.png',
      '/images/education/Integrated_project/webpageInt222-7.png',
      '/images/education/Integrated_project/webpageInt222-8.png',
      '/images/education/Integrated_project/webpageInt222-9.png',
      '/images/education/Integrated_project/webpageInt222-10.png',
    ],
  },
  {
    id: 'uni-sit30',
    title: 'SIT 30th Anniversary Festival Minigame',
    description:
      'Interactive browser-based minigame developed for the SIT Faculty 30th anniversary celebration event. Built as a fun, playable activity for festival attendees featuring multiple mini-challenges directly in the browser.',
    category: 'frontend',
    status: 'archived',
    tech: ['Vue.js', 'JavaScript', 'HTML', 'CSS'],
    icon: Gamepad2,
    priority: 73,
    live: 'https://sit-30-festival-minigame.vercel.app/#/',
  },
  {
    id: 'uni-fishing',
    title: 'Fishing Game — Refactored Edition',
    description:
      'Browser-based fishing game originally built as a group project under course INT203. This edition is a personal refactor of the original codebase, applying clean code principles and modern JavaScript patterns using a combination of AI assistance and personal knowledge.',
    category: 'frontend',
    status: 'archived',
    tech: ['JavaScript', 'HTML', 'CSS'],
    icon: Fish,
    priority: 68,
    live: 'https://webgame-fishing.vercel.app/',
  },

  // ── BACKEND ONLY ───────────────────────────────────────────────────────────
  {
    id: 'api-truemoney',
    title: 'API-TRUEMONEY (api-tmnwl) — TrueWallet Voucher Redeem API',
    description:
      'Backend API service for redeeming TrueWallet/TrueMoney vouchers. Provides RESTful endpoints for voucher redemption and status checking, secured with API key-based authentication and Argon2 hashing. Includes built-in rate limiting (60 req/min) and CLI tools for API key management (generate/revoke/rotate). Deployed on Railway.',
    category: 'backend',
    status: 'active',
    tech: ['NestJS', 'Prisma', 'PostgreSQL', 'Argon2', 'Helmet', 'TypeScript'],
    icon: Server,
    priority: 88,

  },

  // ── DATABASE ───────────────────────────────────────────────────────────────
  {
    id: 'discord-shop-data-layer',
    title: 'Discord Shop Data Layer — JSON to PostgreSQL/Neon Migration',
    description:
      'Database-focused migration work for a Discord shop system, moving persistent shop and credit data away from JSON files toward PostgreSQL/Neon. Emphasizes cleaner schemas, safer data access, and easier future reporting.',
    category: 'database',
    status: 'wip',
    tech: ['PostgreSQL', 'Neon', 'Data Migration', 'Schema Design', 'TypeScript'],
    icon: Database,
    priority: 86,
  },

  // ── LIBRARIES ──────────────────────────────────────────────────────────────
  {
    id: 'slipok-library',
    title: '@fujipp/slipok — Bank Slip Verification Library',
    description:
      'Published NPM library providing a TypeScript client for the SlipOK API — a service for verifying Thai bank transfer slips. Compiled to CommonJS with full type definitions. Designed as a utility package that other projects can install via npm to integrate slip verification into their backend services.',
    category: 'library',
    status: 'active',
    tech: ['TypeScript', 'npm', 'tsc', 'SlipOK API'],
    icon: Code2,
    priority: 82,
    github: 'https://github.com/Fujipp/slipok-lib.git',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_LABEL: Record<Category, string> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.label }),
  {} as Record<Category, string>,
);

// Pre-computed once — counts never change at runtime
const CATEGORY_COUNTS: Record<Category, number> = (() => {
  const counts: Record<Category, number> = { all: PROJECTS.length } as Record<Category, number>;
  for (const c of CATEGORIES) {
    if (c.id !== 'all') counts[c.id] = PROJECTS.filter((p) => p.category === c.id).length;
  }
  return counts;
})();

const STATUS_ORDER: Record<Status, number> = { active: 0, wip: 1, archived: 2 };
const CATEGORY_ORDER: Record<Exclude<Category, 'all'>, number> = {
  'ui-design': 0,
  frontend: 1,
  backend: 2,
  fullstack: 3,
  database: 4,
  library: 5,
  internship: 6,
  discord: 7,
};

function filterAndSort(cat: Category, sort: SortBy = 'priority', query = ''): Project[] {
  const q = query.trim().toLowerCase();
  let list = cat === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === cat);
  if (q) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return [...list].sort((a, b) => {
    if (sort === 'status')   return STATUS_ORDER[a.status]   - STATUS_ORDER[b.status]   || b.priority - a.priority;
    if (sort === 'category') return CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category] || b.priority - a.priority;
    return b.priority - a.priority;
  });
}

// ── Sort dropdown ─────────────────────────────────────────────────────────────
const SORT_OPTIONS: { value: SortBy; label: string; sub: string; icon: React.ElementType }[] = [
  { value: 'priority', label: 'Priority',  sub: 'High → Low',                               icon: TrendingDown },
  { value: 'status',   label: 'Status',    sub: 'Active · WIP · Archived  →  then priority', icon: LayoutList   },
  { value: 'category', label: 'Category',  sub: 'UI · Frontend · Backend · Full Stack …',    icon: LayoutGrid   },
];

function SortDropdown({ value, onChange }: { value: SortBy; onChange: (v: SortBy) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = SORT_OPTIONS.find((o) => o.value === value)!;
  const CurrentIcon = current.icon;

  return (
    <div className={styles.sortDropdownWrap} ref={ref}>
      <Button variant="outline" size="sm" className="rounded-full" onClick={() => setOpen((p) => !p)}>
        <CurrentIcon size={12} strokeWidth={2.5} />
        {current.label}
        <ChevronDown
          size={11}
          strokeWidth={2.5}
          className={`${styles.sortChevron} ${open ? styles.sortChevronOpen : ''}`}
        />
      </Button>

      {open && (
        <div className={styles.sortDropdownPanel}>
          {SORT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = value === opt.value;
            return (
              <button
                key={opt.value}
                className={`${styles.sortOption} ${isActive ? styles.sortOptionActive : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <span className={styles.sortOptionIcon}><Icon size={15} strokeWidth={1.75} /></span>
                <span className={styles.sortOptionText}>
                  <span className={styles.sortOptionLabel}>{opt.label}</span>
                  <span className={styles.sortOptionSub}>{opt.sub}</span>
                </span>
                {isActive && <Check size={13} strokeWidth={2.5} className={styles.sortOptionCheck} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Project Detail Modal ──────────────────────────────────────────────────────
function ProjectDetailModal({
  project,
  onClose,
  onCertificateView,
  onImageView,
}: {
  project: Project | null;
  onClose: () => void;
  onCertificateView: (cert: NonNullable<Project['certificate']>) => void;
  onImageView: (src: string, title: string, images: string[], idx: number) => void;
}) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    setSlideIdx(0);
    if (!project?.images?.length) return;
    const id = setInterval(
      () => setSlideIdx((p) => (p + 1) % (project.images?.length ?? 1)),
      4000,
    );
    return () => clearInterval(id);
  }, [project?.id]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  useScrollLock(!!project);

  const Icon = project?.icon ?? null;
  const images = project?.images ?? [];

  return (
    <>
      {project && Icon && (
        <div className={styles.detailBackdrop} onClick={onClose}>
          <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>

            {/* ── Header ── */}
            <div className={styles.detailTop}>
              <div className={styles.detailTopIcon} data-category={project.category}>
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div className={styles.detailTopMeta}>
                <div className={styles.detailBadges}>
                  <span className={`${styles.cardCategory} ${CATEGORY_CLASS[project.category]}`}>
                    {CATEGORIES.find((c) => c.id === project.category)?.label}
                  </span>
                  <span className={`${styles.statusBadge} ${STATUS_CLASS[project.status]}`}>
                    {STATUS_LABEL[project.status]}
                  </span>
                  {project.featured && (
                    <span className={styles.rowFeatured}>
                      <Star size={9} strokeWidth={2.5} /> Featured
                    </span>
                  )}
                  {project.commissioned && (
                    <span className={styles.rowCommissioned}>
                      <Banknote size={10} strokeWidth={2.5} /> Commissioned
                    </span>
                  )}
                </div>
                <h2 className={styles.detailTitle}>{project.title}</h2>
              </div>
              <button className={styles.detailClose} onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* ── Slideshow (if images) ── */}
            {images.length > 0 && (
              <div
                className={styles.detailSlideshow}
                style={{ cursor: 'zoom-in' }}
                onClick={() => onImageView(images[slideIdx], project.title, images, slideIdx)}
              >
                {images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={`${styles.detailSlideshowImg} ${i === slideIdx ? styles.detailSlideshowImgActive : ''}`}
                    draggable={false}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ))}
                <div className={styles.zoomHint}><ZoomIn size={13} strokeWidth={2} /></div>
                {images.length > 1 && (
                  <>
                    <button
                      className={`${styles.slideshowNav} ${styles.slideshowNavPrev}`}
                      onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx - 1 + images.length) % images.length); }}
                      aria-label="Previous image"
                    ><ChevronLeft size={16} strokeWidth={2.5} /></button>
                    <button
                      className={`${styles.slideshowNav} ${styles.slideshowNavNext}`}
                      onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx + 1) % images.length); }}
                      aria-label="Next image"
                    ><ChevronRight size={16} strokeWidth={2.5} /></button>
                    <div className={styles.slideshowCounter}>{slideIdx + 1} / {images.length}</div>
                    <div className={styles.slideshowDots}>
                      {images.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.slideshowDot} ${i === slideIdx ? styles.slideshowDotActive : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSlideIdx(i); }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Body ── */}
            <div className={styles.detailBody}>
              <p className={styles.detailDesc}>{project.description}</p>

              <div className={styles.detailSection}>
                <p className={styles.detailSectionLabel}>Tech Stack</p>
                <div className={styles.techRow}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.techTag}>{t}</span>
                  ))}
                </div>
              </div>

              {(project.github || project.live || project.certificate) && (
                <div className={styles.detailSection}>
                  <p className={styles.detailSectionLabel}>Links</p>
                  <div className={styles.detailLinks}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.detailLinkBtn}>
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.detailLinkBtn}>
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.certificate && (
                      <button
                        type="button"
                        className={`${styles.detailLinkBtn} ${styles.detailLinkBtnCert}`}
                        onClick={() => onCertificateView(project.certificate!)}
                      >
                        <Award size={14} /> Certificate
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer CTA ── */}
            <div className={styles.detailFooter}>
              <Link to={`/projects/${project.id}`} onClick={onClose} className={styles.detailCta}>
                View Full Page
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// ── Memoised project row (editorial layout) ──────────────────────────────────
interface ProjectRowProps {
  project: Project;
  onSelect: (p: Project) => void;
  onSetCert: (c: NonNullable<Project['certificate']>) => void;
}

const ProjectRow = memo(function ProjectRow({
  project,
  onSelect,
  onSetCert,
}: ProjectRowProps) {
  const Icon = project.icon;
  const handleClick = useCallback(() => onSelect(project), [onSelect, project]);
  const handleCert = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (project.certificate) onSetCert(project.certificate);
    },
    [onSetCert, project.certificate],
  );
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(project);
      }
    },
    [onSelect, project],
  );

  const techPreview =
    project.tech.length > 6
      ? `${project.tech.slice(0, 6).join(' · ')}  +${project.tech.length - 6} more`
      : project.tech.join(' · ');

  return (
    <article
      className={styles.row}
      data-category={project.category}
      onClick={handleClick}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
    >
      <span className={styles.rowAccent} aria-hidden />

      <header className={styles.rowMeta}>
        <span className={styles.rowIcon}><Icon size={14} strokeWidth={2.25} /></span>
        <span className={styles.rowCategory}>{CATEGORY_LABEL[project.category]}</span>
        <span className={styles.rowDot} aria-hidden>·</span>
        <span className={`${styles.rowStatus} ${STATUS_CLASS[project.status]}`}>
          {STATUS_LABEL[project.status]}
        </span>
        {project.featured && (
          <>
            <span className={styles.rowDot} aria-hidden>·</span>
            <span className={styles.rowFeatured}>
              <Star size={10} strokeWidth={2.5} />
              Featured
            </span>
          </>
        )}
        {project.commissioned && (
          <>
            <span className={styles.rowDot} aria-hidden>·</span>
            <span className={styles.rowCommissioned}>
              <Banknote size={11} strokeWidth={2.5} />
              Commissioned
            </span>
          </>
        )}
      </header>

      <h3 className={styles.rowTitle}>{project.title}</h3>
      <p className={styles.rowDesc}>{project.description}</p>

      {project.tech.length > 0 && (
        <p className={styles.rowTech}>{techPreview}</p>
      )}

      <footer className={styles.rowFooter}>
        <div className={styles.rowLinks}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.rowLink}
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={13} strokeWidth={2} />
              GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.rowLink}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={13} strokeWidth={2} />
              Live
            </a>
          )}
          {project.certificate && (
            <button type="button" className={styles.rowLink} onClick={handleCert}>
              <Award size={13} strokeWidth={2} />
              Certificate
            </button>
          )}
        </div>
        <Link
          to={`/projects/${project.id}`}
          className={styles.rowReadMore}
          onClick={(e) => e.stopPropagation()}
        >
          Read details
          <ArrowRight size={13} strokeWidth={2.25} />
        </Link>
      </footer>
    </article>
  );
});

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectsPage() {
  const { activeCategory: active, setActiveCategory: setActive } = useProjectFilter();
  const [sort, setSort] = useState<SortBy>('priority');
  const [query, setQuery] = useState('');
  const [cert, setCert] = useState<{ image: string; pdf?: string; label: string } | null>(null);
  const [imgView, setImgView] = useState<{ image: string; label: string; images: string[]; idx: number } | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Deferred query keeps typing snappy — filtering runs at lower priority
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () => filterAndSort(active, sort, deferredQuery),
    [active, sort, deferredQuery],
  );

  // Group rows by category when viewing the default unfiltered list
  const groups = useMemo(() => {
    if (active !== 'all' || deferredQuery.trim() !== '') return null;
    type Cat = Exclude<Category, 'all'>;
    const map = new Map<Cat, Project[]>();
    for (const c of CATEGORIES) {
      if (c.id !== 'all') map.set(c.id as Cat, []);
    }
    for (const p of filtered) map.get(p.category)?.push(p);
    return CATEGORIES
      .filter((c) => c.id !== 'all')
      .map((c) => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        projects: map.get(c.id as Cat) ?? [],
      }))
      .filter((g) => g.projects.length > 0);
  }, [filtered, active, deferredQuery]);

  const totalProjects = PROJECTS.length;
  const totalActive = useMemo(() => PROJECTS.filter((p) => p.status === 'active').length, []);
  const totalCategories = CATEGORIES.length - 1; // exclude 'all'

  const isFiltering = active !== 'all' || query.trim() !== '';
  const activeLabel = CATEGORY_LABEL[active] ?? 'All Projects';

  const handleSelectProject = useCallback((p: Project) => setSelectedProject(p), []);
  const handleSetCert = useCallback(
    (c: NonNullable<Project['certificate']>) => setCert(c),
    [],
  );
  const resetFilters = useCallback(() => { setActive('all'); setQuery(''); }, [setActive]);

  return (
    <main className={styles.page}>

      {/* ══ HERO ══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>
            <FolderOpen size={14} strokeWidth={2.5} />
            PORTFOLIO
          </p>
          <h1 className={styles.heroTitle}>Projects</h1>
          <p className={styles.heroSub}>
            A curated collection of UI design, frontend, backend, full stack, database, library, internship, and Discord bot work.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{totalProjects}</span>
              <span className={styles.heroStatLabel}>Projects</span>
            </div>
            <span className={styles.heroStatDivider} aria-hidden />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{totalCategories}</span>
              <span className={styles.heroStatLabel}>Categories</span>
            </div>
            <span className={styles.heroStatDivider} aria-hidden />
            <div className={styles.heroStat}>
              <span className={`${styles.heroStatNum} ${styles.heroStatNumActive}`}>{totalActive}</span>
              <span className={styles.heroStatLabel}>Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AI WORKFLOW ══ */}
      <section className={`${styles.section} ${styles.aiSection}`}>
        <div className={styles.aiShell}>
          <div className={styles.aiIntro}>
            <p className={styles.eyebrow}>
              <Sparkles size={14} strokeWidth={2.5} />
              AI WORKFLOW
            </p>
            <h2 className={styles.aiTitle}>AI ที่ใช้ทำงานร่วมกัน</h2>
            <p className={styles.aiLead}>
              ผมใช้ Claude Code, Codex และ Gemini CLI ร่วมกันแบบมีบทบาทชัดเจน ให้แต่ละตัวช่วยเสริมกันแทนที่จะเชื่อผลลัพธ์จากตัวเดียวทั้งหมด
            </p>
          </div>

          <div className={styles.aiCards}>
            {AI_WORKFLOW_TOOLS.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <article key={tool.name} className={styles.aiCard}>
                  <div className={styles.aiCardHeader}>
                    <span className={styles.aiIcon}>
                      <ToolIcon size={18} strokeWidth={2.25} />
                    </span>
                    <div>
                      <h3 className={styles.aiName}>{tool.name}</h3>
                      <p className={styles.aiPlan}>{tool.plan}</p>
                    </div>
                  </div>
                  <p className={styles.aiRole}>{tool.role}</p>
                </article>
              );
            })}
          </div>

          <div className={styles.aiPrinciples} aria-label="AI workflow principles">
            {AI_WORKFLOW_PRINCIPLES.map((principle) => (
              <span key={principle} className={styles.aiPrinciple}>
                <Check size={12} strokeWidth={2.75} />
                {principle}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTROLS + LIST ══ */}
      <section className={styles.section}>

        <div className={styles.filterBar}>
          <div className={styles.filterCategories}>
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              const isActive = active === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActive(cat.id)}
                >
                  <CatIcon size={12} strokeWidth={2.5} />
                  {cat.label}
                  <span className={styles.filterCount}>{CATEGORY_COUNTS[cat.id]}</span>
                </Button>
              );
            })}
          </div>

          <div className={styles.filterTools}>
            <div className={styles.searchWrap}>
              <Search size={14} strokeWidth={2.25} className={styles.searchIcon} aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, tech, or keyword…"
                className={styles.searchInput}
                aria-label="Search projects"
              />
              {query && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        <div className={styles.resultsMeta}>
          <span className={styles.resultsCount}>
            <Sparkles size={12} strokeWidth={2.25} />
            <strong>{filtered.length}</strong>
            {filtered.length === 1 ? ' project' : ' projects'}
            {isFiltering && (
              <span className={styles.resultsContext}>
                {active !== 'all' && <> in <em>{activeLabel}</em></>}
                {query.trim() && <> matching “<em>{query.trim()}</em>”</>}
              </span>
            )}
          </span>
          {isFiltering && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={resetFilters}
            >
              Reset filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {groups ? (
              groups.map((g) => {
                const GroupIcon = g.icon;
                return (
                  <section key={g.id} className={styles.group} data-category={g.id}>
                    <header className={styles.groupHeader}>
                      <span className={styles.groupIcon}><GroupIcon size={14} strokeWidth={2.25} /></span>
                      <h3 className={styles.groupTitle}>{g.label}</h3>
                      <span className={styles.groupCount}>{g.projects.length}</span>
                      <span className={styles.groupLine} aria-hidden />
                    </header>
                    <div className={styles.groupRows}>
                      {g.projects.map((project) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          onSelect={handleSelectProject}
                          onSetCert={handleSetCert}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <div className={styles.groupRows}>
                {filtered.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onSelect={handleSelectProject}
                    onSetCert={handleSetCert}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.empty}>
            {query.trim() ? (
              <>
                <SearchX size={36} strokeWidth={1.5} />
                <div className={styles.emptyTitle}>No projects match “{query.trim()}”</div>
                <div className={styles.emptySub}>Try a different keyword, or reset the filters.</div>
                <button
                  type="button"
                  className={styles.emptyAction}
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
              </>
            ) : (
              <>
                <FolderOpen size={32} strokeWidth={1.5} />
                <span>No projects in this category yet.</span>
              </>
            )}
          </div>
        )}
      </section>

      <CertificateModal
        open={cert !== null}
        imageUrl={cert?.image ?? ''}
        pdfUrl={cert?.pdf}
        title={cert?.label ?? ''}
        onClose={() => setCert(null)}
      />
      <CertificateModal
        open={imgView !== null}
        imageUrl={imgView?.image ?? ''}
        title={imgView?.label ?? ''}
        onClose={() => setImgView(null)}
        images={imgView?.images}
        currentIndex={imgView?.idx ?? 0}
        onNavigate={(i) => setImgView((prev) => (prev ? { ...prev, image: prev.images[i], idx: i } : null))}
      />
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onCertificateView={(c) => { setSelectedProject(null); setCert(c); }}
        onImageView={(src, title, images, idx) => setImgView({ image: src, label: title, images, idx })}
      />
    </main>
  );
}
