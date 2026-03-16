import { motion } from 'motion/react';
import {
  ShieldCheck, Eye, Database, Cookie, Lock,
  UserCheck, Mail, RefreshCw, Info,
} from 'lucide-react';
import styles from './PrivacyPage.module.css';

// ── Policy sections data ─────────────────────────────────────────────────────
const LAST_UPDATED = 'March 16, 2026';

interface PolicyBlock {
  id: string;
  icon: React.ElementType;
  title: string;
  body: React.ReactNode;
}

const POLICY_BLOCKS: PolicyBlock[] = [
  {
    id: 'overview',
    icon: ShieldCheck,
    title: 'Overview',
    body: (
      <>
        <p>
          This Privacy Policy explains how fujipp.com ("we", "us", or "our") collects, uses, and
          protects information when you visit this website. We are committed to keeping your data
          minimal, transparent, and secure.
        </p>
        <p>
          This is a personal portfolio website. We do not sell, trade, or share your personal
          information with third parties for marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    icon: Eye,
    title: 'Information We Collect',
    body: (
      <>
        <p>We collect only what is necessary to operate and improve the site:</p>
        <ul className={styles.itemList}>
          <li>Usage data such as pages visited, time on page, and browser type — collected anonymously via analytics.</li>
          <li>Performance metrics fetched from Google PageSpeed Insights API (no personal data involved).</li>
          <li>Contact form submissions including your name, email address, and message content.</li>
        </ul>
        <div className={styles.note}>
          <Info size={14} className={styles.noteIcon} />
          <span>
            We do not collect sensitive personal data such as payment information, government IDs,
            or biometric data.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'usage',
    icon: Database,
    title: 'How We Use Your Information',
    body: (
      <>
        <p>Information collected is used solely for:</p>
        <ul className={styles.itemList}>
          <li>Responding to contact form inquiries.</li>
          <li>Understanding how visitors interact with the site to improve user experience.</li>
          <li>Diagnosing technical issues and monitoring site performance.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: 'Cookies & Local Storage',
    body: (
      <>
        <p>This site uses browser local storage (not tracking cookies) to remember your preferences:</p>
        <ul className={styles.itemList}>
          <li><strong>Theme preference</strong> — light, dark, or system (stored in <code>localStorage</code>).</li>
          <li><strong>Performance cache</strong> — Lighthouse scores cached for 1 hour to reduce API calls.</li>
        </ul>
        <p>
          No third-party advertising cookies are used. You can clear local storage at any time
          through your browser's developer tools or settings.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Data Security',
    body: (
      <>
        <p>
          We implement industry-standard security measures to protect your data:
        </p>
        <ul className={styles.itemList}>
          <li>All traffic is encrypted via HTTPS (TLS).</li>
          <li>The backend API enforces JWT-based authentication and CORS restrictions.</li>
          <li>The database is accessible only via localhost — never exposed to the public internet.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'rights',
    icon: UserCheck,
    title: 'Your Rights',
    body: (
      <>
        <p>You have the right to:</p>
        <ul className={styles.itemList}>
          <li>Request access to any personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Withdraw consent for data processing at any time.</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the information below.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    icon: RefreshCw,
    title: 'Changes to This Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be reflected on
        this page with an updated "Last Updated" date. We encourage you to review this policy
        periodically.
      </p>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact',
    body: (
      <div className={styles.contactRow}>
        <span>Questions about this policy? Reach out at</span>
        <a href="mailto:fujipp.official@gmail.com" className={styles.contactLink}>
          fujipp.official@gmail.com
        </a>
      </div>
    ),
  },
];

// ── Main component ───────────────────────────────────────────────────────────
export function PrivacyPage() {
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
            <ShieldCheck size={14} strokeWidth={2.5} />
            LEGAL
          </p>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <div className={styles.heroMeta}>
            <span>fujipp.com</span>
            <span className={styles.heroDot} />
            <span>Effective {LAST_UPDATED}</span>
          </div>
        </motion.div>
      </section>

      {/* ══ POLICY CARD ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.policyCard}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.1 }}
        >
          {POLICY_BLOCKS.map((block, i) => {
            const BlockIcon = block.icon;
            return (
              <motion.div
                key={block.id}
                className={styles.block}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 220, damping: 28, delay: i * 0.04 }}
              >
                <div className={styles.blockHeader}>
                  <div className={styles.blockIcon}>
                    <BlockIcon size={16} strokeWidth={2} />
                  </div>
                  <span className={styles.blockTitle}>{block.title}</span>
                </div>
                <div className={styles.blockBody}>{block.body}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ══ LAST UPDATED ══ */}
      <div className={styles.updatedBanner}>
        <motion.div
          className={styles.updatedInner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RefreshCw size={12} />
          <span>Last updated: {LAST_UPDATED}</span>
        </motion.div>
      </div>

    </main>
  );
}
