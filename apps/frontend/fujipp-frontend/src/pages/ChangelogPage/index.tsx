import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { marked } from 'marked';
import { ScrollText, AlertTriangle } from 'lucide-react';
import styles from './ChangelogPage.module.css';

// ── Parse stats from raw markdown text ───────────────────────────────────────
function parseStats(md: string) {
  const versions = (md.match(/^## \[\d/gm) ?? []).length;
  const features = (md.match(/^- .+/gm) ?? []).length;
  const fixes = (md.match(/### (Bug )?Fix/gim) ?? []).length;
  return { versions, features, fixes };
}

// ── Main component ───────────────────────────────────────────────────────────
export function ChangelogPage() {
  const [html, setHtml] = useState<string>('');
  const [stats, setStats] = useState({ versions: 0, features: 0, fixes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/CHANGELOG.md')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((md) => {
        setStats(parseStats(md));
        const renderer = new marked.Renderer();

        // h2 → version block header (## [0.4.0] - 2026-03-16)
        renderer.heading = ({ text, depth }) => {
          if (depth === 1) return '';
          if (depth === 2) {
            const isUnreleased = text.toLowerCase().includes('unreleased');
            if (isUnreleased) return '';
            // parse "[0.4.0] - 2026-03-16" or "0.4.0"
            const vMatch = text.match(/\[?([\d.]+)\]?(?:\s*-\s*([\d-]+))?/);
            const ver = vMatch ? `v${vMatch[1]}` : text;
            const date = vMatch?.[2] ?? '';
            return [
              `<div class="${styles.versionEntry}">`,
              `  <div class="${styles.versionDot}" aria-hidden></div>`,
              `  <div class="${styles.versionHeader}">`,
              `    <span class="${styles.versionTag}">${ver}</span>`,
              date ? `<span class="${styles.versionDate}">${date}</span>` : '',
              `  </div>`,
            ].join('');
          }
          if (depth === 3) {
            const typeMap: Record<string, string> = {
              features: 'feat', feature: 'feat',
              'bug fixes': 'fix', fixes: 'fix', fix: 'fix',
              refactor: 'refactor',
              styles: 'style', style: 'style',
              performance: 'perf', perf: 'perf',
              chores: 'chore', chore: 'chore',
              documentation: 'docs', docs: 'docs',
              build: 'build',
              'ci/cd': 'ci', ci: 'ci',
            };
            const key = text.toLowerCase();
            const type = typeMap[key] ?? 'chore';
            const labelClass = styles[`changeGroupLabel_${type}` as keyof typeof styles] ?? '';
            return [
              `<div class="${styles.changeGroup}">`,
              `  <div class="${styles.changeGroupLabel} ${labelClass}">${text}</div>`,
            ].join('');
          }
          return `<h${depth}>${text}</h${depth}>`;
        };

        // ul close → close changeGroup + versionEntry
        renderer.list = ({ items, ordered }) => {
          const tag = ordered ? 'ol' : 'ul';
          const inner = items.map((item) => {
            const body = item.tokens
              ? item.tokens
                  .map((t) => ('text' in t ? t.text : ''))
                  .join('')
              : item.text;
            // pull out leading `scope` tag: "`frontend` some text"
            const scopeMatch = body.match(/^`([^`]+)`\s*(.*)/);
            const scopeHtml = scopeMatch
              ? `<span class="${styles.changeItemScope}">${scopeMatch[1]}</span>${scopeMatch[2]}`
              : body;
            return [
              `<li class="${styles.changeItem}">`,
              `  <svg class="${styles.changeItemIcon}" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
              `  <span class="${styles.changeItemText}">${scopeHtml}</span>`,
              `</li>`,
            ].join('');
          }).join('');
          return [
            `<${tag} class="${styles.changeList}">${inner}</${tag}>`,
            `</div>`, // close changeGroup
            `</div>`, // close versionEntry
          ].join('');
        };

        // suppress <hr> separators
        renderer.hr = () => '';

        marked.setOptions({ renderer });
        const result = marked.parse(md) as string;
        setHtml(result);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

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
            <ScrollText size={14} strokeWidth={2.5} />
            RELEASE HISTORY
          </p>
          <h1 className={styles.heroTitle}>Changelog</h1>
          <p className={styles.heroSub}>
            A timeline of every update, feature, and fix shipped to fujipp.com.
          </p>
        </motion.div>
      </section>

      {/* ══ SECTION 1 — Stats ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.eyebrow}>OVERVIEW</p>
          <h2 className={styles.sectionTitle}>Project Stats</h2>
          <div className={styles.titleDivider} />
        </motion.div>

        <div className={styles.statsRow}>
          {[
            { value: stats.versions, label: 'Releases' },
            { value: stats.features, label: 'Total Changes' },
            { value: stats.fixes, label: 'Bug Fixes' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 2 — Timeline ══ */}
      <section className={styles.section}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.eyebrow}>RELEASES</p>
          <h2 className={styles.sectionTitle}>Version History</h2>
          <div className={styles.titleDivider} />
        </motion.div>

        {loading && (
          <div className={styles.loadingRow}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.skeleton}
                style={{ width: '100%', height: 120, borderRadius: 'var(--radius)', marginBottom: '1rem' }}
              />
            ))}
          </div>
        )}

        {error && (
          <div className={styles.errorBox}>
            <AlertTriangle size={18} />
            <span>Failed to load changelog: {error}</span>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className={styles.timeline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.timelineLine} aria-hidden />
            <div
              className={styles.timelineContent}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </motion.div>
        )}
      </section>
    </main>
  );
}
