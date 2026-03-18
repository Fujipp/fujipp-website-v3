import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CertificateModal } from '../../components/ui/CertificateModal/index';
import { Button } from '../../components/ui/button';
import { useScrollLock } from '../../hooks/useScrollLock';
import { motion, AnimatePresence } from 'motion/react';
import { FolderOpen, Github, ExternalLink, Star, Briefcase, GraduationCap, Bot, Package, Layers, Award, Building2, FileCheck2, X, ZoomIn, ChevronLeft, ChevronRight, FileText, FlaskConical, BookOpen, Heart, Gamepad2, Fish,
  Shield, ShoppingBag, ArrowRightLeft, Users, Tag, UserCircle, MessageSquare, Code2, Ticket, Banknote,
  ChevronDown, TrendingDown, LayoutList, LayoutGrid, Check, ArrowRight } from 'lucide-react';
import { useProjectFilter } from '../../stores/use-project-filter';
import styles from './ProjectsPage.module.css';

// ── Types ────────────────────────────────────────────────────────────────────
export type Category = 'all' | 'internship' | 'discord' | 'university' | 'library' | 'personal';
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
  { id: 'all',        label: 'All Projects', icon: Layers },
  { id: 'internship', label: 'Internship',   icon: Briefcase },
  { id: 'discord',    label: 'Discord Bots', icon: Bot },
  { id: 'university', label: 'University',   icon: GraduationCap },
  { id: 'library',    label: 'Libraries',    icon: Package },
  { id: 'personal',   label: 'Personal',     icon: FolderOpen },
];

const CATEGORY_CLASS: Record<Exclude<Category, 'all'>, string> = {
  internship: styles.cat_internship,
  discord:    styles.cat_discord,
  university: styles.cat_university,
  library:    styles.cat_library,
  personal:   styles.cat_personal,
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

// ── Projects data (sorted by priority desc within each category) ──────────────
export const PROJECTS: Project[] = [
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
    category: 'university',
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
    category: 'university',
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
    category: 'university',
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
    category: 'university',
    status: 'archived',
    tech: ['JavaScript', 'HTML', 'CSS'],
    icon: Fish,
    priority: 68,
    live: 'https://webgame-fishing.vercel.app/',
  },

  // ── LIBRARIES ──────────────────────────────────────────────────────────────
  {
    id: 'api-truemoney',
    title: 'API-TRUEMONEY (api-tmnwl) — TrueWallet Voucher Redeem API',
    description:
      'Backend API service for redeeming TrueWallet/TrueMoney vouchers. Provides RESTful endpoints for voucher redemption and status checking, secured with API key-based authentication and Argon2 hashing. Includes built-in rate limiting (60 req/min) and CLI tools for API key management (generate/revoke/rotate). Deployed on Railway.',
    category: 'library',
    status: 'active',
    tech: ['NestJS', 'Prisma', 'PostgreSQL', 'Argon2', 'Helmet', 'TypeScript'],
    icon: Ticket,
    priority: 88,

  },
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
function getCategoryCount(cat: Category): number {
  if (cat === 'all') return PROJECTS.length;
  return PROJECTS.filter((p) => p.category === cat).length;
}

const STATUS_ORDER: Record<Status, number> = { active: 0, wip: 1, archived: 2 };
const CATEGORY_ORDER: Record<Exclude<Category, 'all'>, number> = {
  internship: 0, discord: 1, university: 2, library: 3, personal: 4,
};

function filterAndSort(cat: Category, sort: SortBy = 'priority'): Project[] {
  const list = cat === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === cat);
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
  { value: 'category', label: 'Category',  sub: 'Internship · Discord · University …',       icon: LayoutGrid   },
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

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.sortDropdownPanel}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
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
    <AnimatePresence>
      {project && Icon && (
        <motion.div
          className={styles.detailBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.detailModal}
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.detailClose} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            <div className={`${styles.detailBody} ${images.length > 0 ? styles.detailBodyGrid : ''}`}>
              <div className={styles.detailContent}>
                <div className={styles.detailHeader}>
                  <div className={styles.detailIconWrap}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className={styles.detailHeadText}>
                    <h2 className={styles.detailTitle}>{project.title}</h2>
                    <div className={styles.detailBadges}>
                      <span className={`${styles.cardCategory} ${CATEGORY_CLASS[project.category]}`}>
                        {CATEGORIES.find((c) => c.id === project.category)?.label}
                      </span>
                      <span className={`${styles.statusBadge} ${STATUS_CLASS[project.status]}`}>
                        {STATUS_LABEL[project.status]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailDivider} />

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
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github size={14} /> GitHub
                          </a>
                        </Button>
                      )}
                      {project.live && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.live} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} /> Live Demo
                          </a>
                        </Button>
                      )}
                      {project.certificate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[color-mix(in_srgb,var(--success)_35%,transparent)] text-[var(--success)] hover:bg-[color-mix(in_srgb,var(--success)_10%,transparent)]"
                          onClick={() => onCertificateView(project.certificate!)}
                        >
                          <Award size={14} /> Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.detailDivider} />
                <Button asChild className="w-full rounded-lg">
                  <Link to={`/projects/${project.id}`} onClick={onClose}>
                    View Full Page
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </Button>
              </div>

              {images.length > 0 && (
                <div className={styles.detailImageSide}>
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
                      />
                    ))}
                    <div className={styles.zoomHint}>
                      <ZoomIn size={14} strokeWidth={2} />
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          className={`${styles.slideshowNav} ${styles.slideshowNavPrev}`}
                          onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx - 1 + images.length) % images.length); }}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          className={`${styles.slideshowNav} ${styles.slideshowNavNext}`}
                          onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx + 1) % images.length); }}
                          aria-label="Next image"
                        >
                          <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                        <div className={styles.slideshowCounter}>
                          {slideIdx + 1} / {images.length}
                        </div>
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
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectsPage() {
  const { activeCategory: active, setActiveCategory: setActive } = useProjectFilter();
  const [sort, setSort] = useState<SortBy>('priority');
  const [cert, setCert] = useState<{ image: string; pdf?: string; label: string } | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [imgView, setImgView] = useState<{ image: string; label: string; images: string[]; idx: number } | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = filterAndSort(active, sort);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const featuredImages = featured?.images ?? [];
  const FeaturedIcon = featured?.icon ?? null;

  useEffect(() => {
    setSlideIndex(0);
    if (!featuredImages.length) return;
    const id = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % featuredImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [featured?.id]);

  return (
    <main className={styles.page}>

      {/* ══ HERO ══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        >
          <p className={styles.heroEyebrow}>
            <FolderOpen size={14} strokeWidth={2.5} />
            PORTFOLIO
          </p>
          <h1 className={styles.heroTitle}>Projects</h1>
          <p className={styles.heroSub}>
            A curated collection of work across internships, university, Discord bots, libraries, and personal experiments.
          </p>
        </motion.div>
      </section>

      {/* ══ FILTER + GRID ══ */}
      <section className={styles.section}>

        {/* Filter bar */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.1 }}
        >
          <p className={styles.eyebrow}>BROWSE</p>
          <h2 className={styles.sectionTitle}>All Work</h2>
          <div className={styles.titleDivider} />
        </motion.div>

        <motion.div
          className={styles.filterBar}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.15 }}
        >
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
                  <span className={styles.filterCount}>{getCategoryCount(cat.id)}</span>
                </Button>
              );
            })}
          </div>
          <SortDropdown value={sort} onChange={setSort} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          >

            {/* Featured card */}
            {featured && (
              <motion.div
                className={styles.featuredCard}
                style={{ marginBottom: '1.25rem', cursor: 'pointer' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                whileHover={{ scale: 1.005, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                onClick={() => setSelectedProject(featured)}
              >
                <div className={styles.featuredBadge}>
                  <Star size={10} strokeWidth={2.5} />
                  Featured
                </div>

                <div className={styles.featuredBody}>
                  <span className={`${styles.cardCategory} ${CATEGORY_CLASS[featured.category]}`}>
                    {CATEGORIES.find((c) => c.id === featured.category)?.label}
                  </span>
                  <h3 className={styles.cardTitle} style={{ fontSize: '1.35rem' }}>{featured.title}</h3>
                  <p className={styles.cardDesc}>{featured.description}</p>

                  <div className={styles.techRow}>
                    {featured.tech.map((t) => (
                      <span key={t} className={styles.techTag}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`${styles.statusBadge} ${STATUS_CLASS[featured.status]}`}>
                      {STATUS_LABEL[featured.status]}
                    </span>
                    {featured.github && (
                      <a href={featured.github} target="_blank" rel="noopener noreferrer" className={styles.iconLink} onClick={(e) => e.stopPropagation()}>
                        <Github size={14} />
                      </a>
                    )}
                    {featured.live && (
                      <a href={featured.live} target="_blank" rel="noopener noreferrer" className={styles.iconLink} onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {featured.certificate && (
                      <button className={styles.certBtn} onClick={(e) => { e.stopPropagation(); setCert(featured.certificate!); }}>
                        <Award size={13} strokeWidth={2} />
                        View Certificate
                      </button>
                    )}
                  </div>
                </div>

                <div className={`${styles.featuredVisual} ${featuredImages.length ? styles.featuredSlideshow : ''}`} aria-hidden>
                  {featuredImages.length > 0 ? (
                    <>
                      {featuredImages.map((src, i) => (
                        <img
                          key={src}
                          src={src}
                          alt=""
                          className={`${styles.slideshowImg} ${i === slideIndex ? styles.slideshowImgActive : ''}`}
                          draggable={false}
                        />
                      ))}
                      <div className={styles.slideshowDots}>
                        {featuredImages.map((_, i) => (
                          <button
                            key={i}
                            aria-label={`Image ${i + 1}`}
                            onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                            className={`${styles.slideshowDot} ${i === slideIndex ? styles.slideshowDotActive : ''}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    FeaturedIcon ? <FeaturedIcon size={72} strokeWidth={1} className={styles.featuredIcon} /> : null
                  )}
                </div>
              </motion.div>
            )}

            {/* Project grid */}
            {rest.length > 0 ? (
              <div className={styles.grid}>
                {rest.map((project, i) => { const CardIcon = project.icon; return (
                  <motion.div
                    key={project.id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 28, delay: i * 0.05 }}
                    whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    onClick={() => setSelectedProject(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    {project.images && project.images.length > 0 && (
                      <div className={styles.cardThumb} style={{ cursor: 'zoom-in' }} onClick={(e) => { e.stopPropagation(); setImgView({ image: project.images![0], label: project.title, images: project.images!, idx: 0 }); }}>
                        <img src={project.images[0]} alt="" draggable={false} className={styles.cardThumbImg} />
                      </div>
                    )}
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}><CardIcon size={20} strokeWidth={1.5} /></div>
                      <div className={styles.cardLinks}>
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.iconLink} data-tooltip="GitHub" onClick={(e) => e.stopPropagation()}>
                            <Github size={14} />
                          </a>
                        )}
                        {project.live && (
                          <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.iconLink} data-tooltip="Live Site" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {project.certificate && (
                          <button className={styles.iconLink} data-tooltip="Certificate" onClick={(e) => { e.stopPropagation(); setCert(project.certificate!); }}>
                            <Award size={14} />
                          </button>
                        )}
                        <Link
                          to={`/projects/${project.id}`}
                          className={styles.iconLink}
                          data-tooltip="View Page"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText size={14} />
                        </Link>
                      </div>
                    </div>

                    <span className={`${styles.cardCategory} ${CATEGORY_CLASS[project.category]}`}>
                      {CATEGORIES.find((c) => c.id === project.category)?.label}
                    </span>

                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardDesc}>{project.description}</p>

                    <div className={styles.techRow}>
                      {project.tech.map((t) => (
                        <span key={t} className={styles.techTag}>{t}</span>
                      ))}
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={`${styles.statusBadge} ${STATUS_CLASS[project.status]}`}>
                        {STATUS_LABEL[project.status]}
                      </span>
                      {project.commissioned && (
                        <span className={styles.commissionedBadge}>
                          <Banknote size={11} strokeWidth={2.5} />
                          Commissioned
                        </span>
                      )}
                    </div>
                  </motion.div>
                );})}
              </div>
            ) : (
              !featured && (
                <div className={styles.empty}>
                  <FolderOpen size={32} strokeWidth={1.5} />
                  <span>No projects in this category yet.</span>
                </div>
              )
            )}

          </motion.div>
        </AnimatePresence>
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
        onNavigate={(i) => setImgView(prev => prev ? { ...prev, image: prev.images[i], idx: i } : null)}
      />
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onCertificateView={(cert) => { setSelectedProject(null); setCert(cert); }}
        onImageView={(src, title, images, idx) => setImgView({ image: src, label: title, images, idx })}
      />
    </main>
  );
}
