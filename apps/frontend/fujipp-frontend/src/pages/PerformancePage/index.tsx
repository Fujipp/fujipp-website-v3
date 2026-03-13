import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Globe, Server, Shield, GitBranch,
  Gauge, CheckCircle2, AlertTriangle, Circle, Layers2,
  RefreshCw, Building2,
} from 'lucide-react';
import {
  SiReact, SiTypescript, SiVite, SiTailwindcss,
  SiSpring, SiMysql, SiDocker,
  SiNginx, SiGithub, SiGithubactions,
  SiGodaddy,
} from 'react-icons/si';
import styles from './PerformancePage.module.css';

// ── Tech stack data ───────────────────────────────────────────────────────────
const TECH_STACK = [
  {
    category: 'Frontend',
    icon: Globe,
    color: 'blue',
    items: [
      { name: 'React 19', icon: SiReact, desc: 'UI Component Library' },
      { name: 'TypeScript', icon: SiTypescript, desc: 'Type-safe JavaScript' },
      { name: 'Vite', icon: SiVite, desc: 'Build Tool & Dev Server' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, desc: 'Utility-first CSS' },
      { name: 'shadcn/ui', icon: Layers2, desc: 'UI Component System' },
    ],
  },
  {
    category: 'Backend',
    icon: Server,
    color: 'green',
    items: [
      { name: 'Spring Boot', icon: SiSpring, desc: 'Java REST API Framework' },
      { name: 'Spring Security', icon: Shield, desc: 'Authentication & Authorization' },
      { name: 'MySQL', icon: SiMysql, desc: 'Relational Database' },
      { name: 'NGINX', icon: SiNginx, desc: 'Reverse Proxy & HTTPS' },
    ],
  },
  {
    category: 'Infrastructure',
    icon: GitBranch,
    color: 'purple',
    items: [
      { name: 'GitHub', icon: SiGithub, desc: 'Source Control' },
      { name: 'GitHub Actions', icon: SiGithubactions, desc: 'CI/CD Pipeline' },
      { name: 'Docker', icon: SiDocker, desc: 'Container Runtime (Backend)' },
      { name: 'GoDaddy', icon: SiGodaddy, desc: 'Domain Registrar' },
      { name: 'Rukcom Hosting', icon: Building2, desc: 'Static Frontend Hosting' },
    ],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type VitalStatus = 'good' | 'warning' | 'poor';

interface Vital {
  label: string;
  shortLabel: string;
  value: string;
  unit: string;
  score: number;
  status: VitalStatus;
  desc: string;
}

interface LighthouseScore {
  label: string;
  score: number;
}

// ── PageSpeed Insights API ────────────────────────────────────────────────────
const PSI_API_KEY = import.meta.env.VITE_PSI_API_KEY ?? '';
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
  + '?url=https%3A%2F%2Fwww.fujipp.com'
  + '&strategy=mobile'
  + '&category=performance'
  + '&category=accessibility'
  + '&category=best-practices'
  + '&category=seo'
  + (PSI_API_KEY ? `&key=${PSI_API_KEY}` : '');

// Audit key → display metadata
const AUDIT_META: Record<string, { shortLabel: string; label: string; unit: string; desc: string }> = {
  'largest-contentful-paint': {
    shortLabel: 'LCP', label: 'Largest Contentful Paint',
    unit: '', desc: 'Time for the main content to load.',
  },
  'cumulative-layout-shift': {
    shortLabel: 'CLS', label: 'Cumulative Layout Shift',
    unit: '', desc: 'Visual stability — how much elements shift.',
  },
  'total-blocking-time': {
    shortLabel: 'TBT', label: 'Total Blocking Time',
    unit: '', desc: 'Time the main thread was blocked after FCP.',
  },
  'first-contentful-paint': {
    shortLabel: 'FCP', label: 'First Contentful Paint',
    unit: '', desc: 'Time for any content to first appear.',
  },
  'interactive': {
    shortLabel: 'TTI', label: 'Time to Interactive',
    unit: '', desc: 'Time until the page is fully interactive.',
  },
  'speed-index': {
    shortLabel: 'SI', label: 'Speed Index',
    unit: '', desc: 'How quickly content is visually displayed.',
  },
};

const AUDIT_ORDER = [
  'largest-contentful-paint',
  'cumulative-layout-shift',
  'total-blocking-time',
  'first-contentful-paint',
  'interactive',
  'speed-index',
];

function scoreToStatus(score: number): VitalStatus {
  if (score >= 90) return 'good';
  if (score >= 50) return 'warning';
  return 'poor';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePsiResponse(json: any): { lighthouse: LighthouseScore[]; vitals: Vital[] } {
  const cats = json?.lighthouseResult?.categories ?? {};
  const audits = json?.lighthouseResult?.audits ?? {};

  const lighthouse: LighthouseScore[] = [
    { label: 'Performance', score: Math.round((cats.performance?.score ?? 0) * 100) },
    { label: 'Accessibility', score: Math.round((cats.accessibility?.score ?? 0) * 100) },
    { label: 'Best Practices', score: Math.round((cats['best-practices']?.score ?? 0) * 100) },
    { label: 'SEO', score: Math.round((cats.seo?.score ?? 0) * 100) },
  ];

  const vitals: Vital[] = AUDIT_ORDER
    .filter((key) => audits[key])
    .map((key) => {
      const audit = audits[key];
      const meta = AUDIT_META[key];
      const score = Math.round((audit.score ?? 0) * 100);
      return {
        label: meta.label,
        shortLabel: meta.shortLabel,
        value: audit.displayValue ?? '—',
        unit: meta.unit,
        score,
        status: scoreToStatus(score),
        desc: meta.desc,
      };
    });

  return { lighthouse, vitals };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_ICON: Record<VitalStatus, typeof CheckCircle2> = {
  good: CheckCircle2,
  warning: AlertTriangle,
  poor: Circle,
};

// ── Sub-components ────────────────────────────────────────────────────────────
function TechCard({ name, icon: Icon, desc, delay = 0 }: {
  name: string; icon: React.ElementType; desc: string; delay?: number;
}) {
  return (
    <motion.div
      className={styles.techCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      <div className={styles.techCardIcon}><Icon size={24} /></div>
      <div className={styles.techCardText}>
        <span className={styles.techCardName}>{name}</span>
        <span className={styles.techCardDesc}>{desc}</span>
      </div>
    </motion.div>
  );
}

function VitalCard({ vital, delay = 0 }: { vital: Vital; delay?: number }) {
  const StatusIcon = STATUS_ICON[vital.status];
  const circumference = 2 * Math.PI * 26;

  return (
    <motion.div
      className={`${styles.vitalCard} ${styles[`vitalCard_${vital.status}` as keyof typeof styles]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay }}
    >
      <div className={styles.vitalRing}>
        <svg width="68" height="68" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" className={styles.ringTrack} />
          <motion.circle
            cx="30" cy="30" r="26"
            className={`${styles.ringFill} ${styles[`ringFill_${vital.status}` as keyof typeof styles]}`}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference * (1 - vital.score / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: delay + 0.15 }}
            strokeLinecap="round"
            transform="rotate(-90 30 30)"
          />
        </svg>
        <span className={`${styles.ringScore} ${styles[`ringScore_${vital.status}` as keyof typeof styles]}`}>
          {vital.score}
        </span>
      </div>

      <div className={styles.vitalInfo}>
        <div className={styles.vitalTop}>
          <StatusIcon size={14} className={`${styles.vitalStatusIcon} ${styles[`vitalStatusIcon_${vital.status}` as keyof typeof styles]}`} />
          <span className={`${styles.vitalShort} ${styles[`vitalShort_${vital.status}` as keyof typeof styles]}`}>{vital.shortLabel}</span>
          <span className={`${styles.vitalValue} ${styles[`vitalValue_${vital.status}` as keyof typeof styles]}`}>
            {vital.value}
          </span>
        </div>
        <span className={styles.vitalLabel}>{vital.label}</span>
        <span className={styles.vitalDesc}>{vital.desc}</span>
      </div>
    </motion.div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function RingSkeleton({ size = 96 }: { size?: number }) {
  return (
    <div className={styles.skeleton} style={{ width: size, height: size, borderRadius: '50%' }} />
  );
}

// ── localStorage cache (1-hour TTL, persists across reloads) ─────────────────
const CACHE_KEY    = 'psi_data_v2';
const LAST_FETCH_KEY = 'psi_last_fetch';
const CACHE_TTL      = 60 * 60 * 1000;  // 1 hour — show cached data
const FORCE_COOLDOWN = 60 * 1000;        // 60 s min between forced live fetches

function getCached(): { lighthouse: LighthouseScore[]; vitals: Vital[]; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function setCache(data: { lighthouse: LighthouseScore[]; vitals: Vital[] }) {
  try {
    const payload = { ...data, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    localStorage.setItem(LAST_FETCH_KEY, String(Date.now()));
  } catch { /* ignore */ }
}

function getLastFetchTs(): number {
  return parseInt(localStorage.getItem(LAST_FETCH_KEY) ?? '0', 10);
}

// ── Main component ────────────────────────────────────────────────────────────
export function PerformancePage() {
  const circumference = 2 * Math.PI * 38;

  const [lighthouseScores, setLighthouseScores] = useState<LighthouseScore[]>([]);
  const [webVitals, setWebVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [cooldownSec, setCooldownSec] = useState(0);

  // Countdown tick for cooldown display
  useEffect(() => {
    if (cooldownSec <= 0) return;
    const id = setTimeout(() => setCooldownSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [cooldownSec]);

  const applyData = (d: { lighthouse: LighthouseScore[]; vitals: Vital[] }) => {
    setLighthouseScores(d.lighthouse);
    setWebVitals(d.vitals);
    setFetchedAt(new Date());
  };

  const fetchScores = async (force = false) => {
    const cached = getCached();

    // Non-forced load: serve cache if still fresh (< 1 h)
    if (!force && cached && Date.now() - cached.ts < CACHE_TTL) {
      applyData(cached);
      setLoading(false);
      return;
    }

    // Forced refresh: enforce minimum 60-second gap between live calls
    if (force) {
      const wait = Math.ceil((FORCE_COOLDOWN - (Date.now() - getLastFetchTs())) / 1000);
      if (wait > 0) {
        setCooldownSec(wait);
        // Still show cached data if available
        if (cached) { applyData(cached); setLoading(false); }
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(PSI_URL);
      if (res.status === 429) {
        // Rate limited — surface stale cache + message
        if (cached) {
          applyData(cached);
          setError('Google PSI rate limit reached. Showing previous results — try again in a minute.');
        } else {
          setError('Google PSI rate limit reached. Please wait a minute then retry.');
        }
        setCooldownSec(60);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const parsed = parsePsiResponse(json);
      applyData(parsed);
      setCache(parsed);
    } catch (e) {
      if (cached) {
        applyData(cached);
        setError('Live fetch failed — showing cached data.');
      } else {
        setError('Unable to fetch PageSpeed data. Please try again later.');
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
            <Gauge size={14} strokeWidth={2.5} />
            WEBSITE PERFORMANCE
          </p>
          <h1 className={styles.heroTitle}>Performance</h1>
          <p className={styles.heroSub}>
            Real Lighthouse scores fetched live from Google PageSpeed Insights for fujipp.com.
          </p>
        </motion.div>
      </section>

      {/* ══ SECTION 1 — Lighthouse Scores ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.eyebrow}>LIGHTHOUSE AUDIT</p>
          <h2 className={styles.sectionTitle}>Scores</h2>
          <div className={styles.titleDivider} />
        </motion.div>

        {error ? (
          <div className={styles.errorBox}>
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => fetchScores(true)} className={styles.retryBtn}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : (
          <div className={styles.lighthouseRow}>
            {loading
              ? [0, 1, 2, 3].map((i) => (
                <div key={i} className={styles.lighthouseCard}>
                  <RingSkeleton size={96} />
                  <div className={styles.skeleton} style={{ width: 80, height: 14, borderRadius: 4 }} />
                </div>
              ))
              : lighthouseScores.map((ls, i) => {
                const scoreColor = ls.score >= 90 ? 'good' : ls.score >= 50 ? 'warning' : 'poor';
                return (
                  <motion.div
                    key={ls.label}
                    className={styles.lighthouseCard}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.08 }}
                  >
                    <div className={styles.lighthouseRingWrap}>
                      <svg width="96" height="96" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="38" className={styles.lighthouseTrack} />
                        <motion.circle
                          cx="48" cy="48" r="38"
                          className={`${styles.lighthouseRingFill} ${styles[`lighthouseRingFill_${scoreColor}` as keyof typeof styles]}`}
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          whileInView={{ strokeDashoffset: circumference * (1 - ls.score / 100) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
                          strokeLinecap="round"
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <span className={`${styles.lighthouseScore} ${styles[`lighthouseScore_${scoreColor}` as keyof typeof styles]}`}>
                        {ls.score}
                      </span>
                    </div>
                    <span className={`${styles.lighthouseLabel} ${styles[`lighthouseLabel_${scoreColor}` as keyof typeof styles]}`}>
                      {ls.label}
                    </span>
                  </motion.div>
                );
              })
            }
          </div>
        )}

        <motion.div
          className={styles.auditMeta}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={styles.auditNote}>
            Fetched live via Google PageSpeed Insights · Mobile preset · fujipp.com
          </span>
          {fetchedAt && (
            <span className={styles.auditTime}>
              Updated {fetchedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchScores(true)}
            className={styles.refreshBtn}
            disabled={loading || cooldownSec > 0}
            aria-label="Refresh scores"
          >
            <RefreshCw size={13} className={loading ? styles.spinning : ''} />
            {loading ? 'Fetching…' : cooldownSec > 0 ? `Wait ${cooldownSec}s` : 'Refresh'}
          </button>
        </motion.div>
      </section>

      {/* ══ SECTION 2 — Web Vitals ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.eyebrow}>CORE WEB VITALS</p>
          <h2 className={styles.sectionTitle}>Metrics</h2>
          <div className={styles.titleDivider} />
        </motion.div>

        <div className={styles.vitalsGrid}>
          {loading
            ? [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`${styles.vitalCard} ${styles.vitalCard_loading}`}>
                <RingSkeleton size={68} />
                <div className={styles.vitalInfo}>
                  <div className={styles.skeleton} style={{ width: 80, height: 14, borderRadius: 4 }} />
                  <div className={styles.skeleton} style={{ width: 120, height: 10, borderRadius: 4, marginTop: 6 }} />
                </div>
              </div>
            ))
            : webVitals.map((v, i) => (
              <VitalCard key={v.shortLabel} vital={v} delay={i * 0.07} />
            ))
          }
        </div>
      </section>

      {/* ══ SECTION 3 — Tech Stack ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.eyebrow}>BUILT WITH</p>
          <h2 className={styles.sectionTitle}>Tech Stack</h2>
          <div className={styles.titleDivider} />
        </motion.div>

        <div className={styles.stackWrapper}>
          {TECH_STACK.map((group, gi) => {
            const GroupIcon = group.icon;
            return (
              <motion.div
                key={group.category}
                className={styles.stackGroup}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 26, delay: gi * 0.1 }}
              >
                <div className={`${styles.stackGroupHeader} ${styles[`stackGroupHeader_${group.color}` as keyof typeof styles]}`}>
                  <GroupIcon size={16} strokeWidth={2} />
                  <span>{group.category}</span>
                </div>
                <div className={styles.techCardGrid}>
                  {group.items.map((item, ii) => (
                    <TechCard
                      key={item.name}
                      name={item.name}
                      icon={item.icon}
                      desc={item.desc}
                      delay={gi * 0.1 + ii * 0.06}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </main>
  );
}
