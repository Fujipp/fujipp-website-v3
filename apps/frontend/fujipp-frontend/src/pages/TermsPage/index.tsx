import { motion } from 'motion/react';
import {
  FileText, CheckCircle, Ban, AlertTriangle, Link2,
  Scale, RefreshCw, Mail, Info,
} from 'lucide-react';
import styles from './TermsPage.module.css';

const LAST_UPDATED = 'March 16, 2026';

interface TermsBlock {
  id: string;
  icon: React.ElementType;
  title: string;
  body: React.ReactNode;
}

const TERMS_BLOCKS: TermsBlock[] = [
  {
    id: 'acceptance',
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    body: (
      <p>
        By accessing or using fujipp.com ("the Site"), you agree to be bound by these Terms of
        Service. If you do not agree to any part of these terms, you may not access the Site.
        These terms apply to all visitors and users of the Site.
      </p>
    ),
  },
  {
    id: 'use',
    icon: Info,
    title: 'Use of the Site',
    body: (
      <>
        <p>This Site is a personal portfolio website. You may use it for the following purposes:</p>
        <ul className={styles.itemList}>
          <li>Viewing publicly available content such as projects, blog posts, and personal information.</li>
          <li>Contacting the owner through the provided contact form.</li>
          <li>Referencing or linking to the Site with appropriate attribution.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'prohibited',
    icon: Ban,
    title: 'Prohibited Activities',
    body: (
      <>
        <p>You agree not to engage in any of the following:</p>
        <ul className={styles.itemList}>
          <li>Attempting to gain unauthorized access to any part of the Site or its backend infrastructure.</li>
          <li>Scraping, crawling, or harvesting data from the Site in a manner that disrupts service.</li>
          <li>Submitting false, misleading, or malicious content through the contact form.</li>
          <li>Using the Site for any unlawful purpose or in violation of applicable regulations.</li>
          <li>Reproducing or distributing Site content without explicit written permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    icon: Scale,
    title: 'Intellectual Property',
    body: (
      <>
        <p>
          All content on this Site — including but not limited to text, design, graphics, code
          snippets, and the overall layout — is the intellectual property of Fujipp unless otherwise
          stated.
        </p>
        <p>
          Open-source code published on linked GitHub repositories is subject to the respective
          license stated in each repository.
        </p>
        <div className={styles.note}>
          <AlertTriangle size={14} className={styles.noteIcon} />
          <span>
            You may not reproduce, distribute, or create derivative works from the Site's original
            content without prior written consent.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'thirdparty',
    icon: Link2,
    title: 'Third-Party Services & Links',
    body: (
      <>
        <p>
          The Site may contain links to third-party websites or integrate third-party services
          (e.g., Google PageSpeed Insights API). These are provided for convenience only.
        </p>
        <ul className={styles.itemList}>
          <li>We have no control over the content or practices of third-party sites.</li>
          <li>Linking to a third-party site does not imply endorsement.</li>
          <li>Your use of third-party services is governed by their own terms and privacy policies.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'disclaimer',
    icon: AlertTriangle,
    title: 'Disclaimer of Warranties',
    body: (
      <>
        <p>
          The Site is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis
          without warranties of any kind, either express or implied.
        </p>
        <p>
          We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or
          other harmful components. We reserve the right to modify or discontinue the Site at any
          time without notice.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    icon: FileText,
    title: 'Limitation of Liability',
    body: (
      <p>
        To the fullest extent permitted by law, Fujipp shall not be liable for any indirect,
        incidental, special, or consequential damages arising from your use of, or inability to
        use, the Site — including loss of data, loss of profits, or any other intangible losses.
      </p>
    ),
  },
  {
    id: 'changes',
    icon: RefreshCw,
    title: 'Changes to These Terms',
    body: (
      <p>
        We reserve the right to modify these Terms of Service at any time. Changes will be
        effective immediately upon posting to this page with an updated date. Continued use of
        the Site after any changes constitutes your acceptance of the new terms.
      </p>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact',
    body: (
      <div className={styles.contactRow}>
        <span>Questions about these terms? Contact us at</span>
        <a href="mailto:fujipp.official@gmail.com" className={styles.contactLink}>
          fujipp.official@gmail.com
        </a>
      </div>
    ),
  },
];

export function TermsPage() {
  return (
    <main className={styles.page}>

      {/* ══ HERO ══ */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        >
          <p className={styles.heroEyebrow}>
            <FileText size={14} strokeWidth={2.5} />
            LEGAL
          </p>
          <h1 className={styles.heroTitle}>Terms of Service</h1>
          <div className={styles.heroMeta}>
            <span>fujipp.com</span>
            <span className={styles.heroDot} />
            <span>Effective {LAST_UPDATED}</span>
          </div>
        </motion.div>
      </section>

      {/* ══ TERMS CARD ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.policyCard}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.1 }}
        >
          {TERMS_BLOCKS.map((block, i) => {
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
