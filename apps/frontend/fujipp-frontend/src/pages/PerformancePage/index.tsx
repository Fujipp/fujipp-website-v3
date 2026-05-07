import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Clock3, Cloud, Gauge, LockKeyhole, RefreshCw, Server } from 'lucide-react';
import styles from './PerformancePage.module.css';

type ServiceState = 'operational' | 'monitoring' | 'maintenance';

interface StatusItem {
  id: string;
  label: string;
  detail: string;
  score: number;
  state: ServiceState;
  icon: typeof Activity;
}

const STATUS_ITEMS: StatusItem[] = [
  {
    id: 'frontend',
    label: 'Frontend Availability',
    detail: 'Static site, routing, and main pages are ready.',
    score: 99,
    state: 'operational',
    icon: Cloud,
  },
  {
    id: 'response',
    label: 'Page Response',
    detail: 'Core pages are built as static assets for quick loading.',
    score: 96,
    state: 'operational',
    icon: Gauge,
  },
  {
    id: 'assets',
    label: 'Assets Delivery',
    detail: 'Images, GLB models, CSS, and JS bundles are served from the frontend host.',
    score: 94,
    state: 'operational',
    icon: Server,
  },
  {
    id: 'security',
    label: 'Security Baseline',
    detail: 'HTTPS, static hosting, and API keys are kept outside the browser.',
    score: 98,
    state: 'operational',
    icon: LockKeyhole,
  },
  {
    id: 'ai-chat',
    label: 'Fujipp AI Chat',
    detail: 'Worker proxy is active, but the assistant is still in beta.',
    score: 88,
    state: 'monitoring',
    icon: Activity,
  },
];

const INCIDENT_NOTES = [
  'No active website-wide outage.',
  'Fujipp AI is beta and may occasionally retry or return a fallback answer.',
  'Large 3D assets are monitored because they affect first-load weight.',
];

const STATE_LABEL: Record<ServiceState, string> = {
  operational: 'Operational',
  monitoring: 'Monitoring',
  maintenance: 'Maintenance',
};

function getStateTone(state: ServiceState) {
  if (state === 'operational') return styles.statusBadgeOperational;
  if (state === 'monitoring') return styles.statusBadgeMonitoring;
  return styles.statusBadgeMaintenance;
}

export function PerformancePage() {
  const [checkedAt, setCheckedAt] = useState(() => new Date());
  const overallScore = useMemo(
    () => Math.round(STATUS_ITEMS.reduce((sum, item) => sum + item.score, 0) / STATUS_ITEMS.length),
    [],
  );
  const activeMonitoringCount = STATUS_ITEMS.filter((item) => item.state !== 'operational').length;

  useEffect(() => {
    const intervalId = window.setInterval(() => setCheckedAt(new Date()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>
            <Activity size={14} strokeWidth={2.5} />
            WEBSITE STATUS
          </p>
          <h1 className={styles.heroTitle}>Performance</h1>
          <p className={styles.heroSub}>
            หน้านี้สรุปสถานะความเสถียรของ fujipp.com แบบอ่านเร็ว เน้นดูว่าเว็บพร้อมใช้งานหรือมีจุดไหนที่กำลัง monitor อยู่
          </p>
        </div>
      </section>

      <section className={styles.statusShell} aria-label="Website status overview">
        <div className={styles.overviewPanel}>
          <div className={styles.overviewHeader}>
            <div>
              <p className={styles.panelEyebrow}>CURRENT HEALTH</p>
              <h2 className={styles.overviewTitle}>All Core Systems Running</h2>
            </div>
            <span className={styles.liveBadge}>
              <CheckCircle2 size={15} />
              Live
            </span>
          </div>

          <div className={styles.scoreRow}>
            <div className={styles.scoreBlock}>
              <span className={styles.scoreValue}>{overallScore}</span>
              <span className={styles.scoreUnit}>%</span>
            </div>
            <div className={styles.scoreText}>
              <p className={styles.scoreLabel}>Estimated Stability</p>
              <p className={styles.scoreDescription}>
                คำนวณจากสถานะ frontend, assets, security baseline และ AI chat ที่ยังเป็น beta อยู่
              </p>
            </div>
          </div>

          <div className={styles.overallMeter} aria-label={`Website stability ${overallScore}%`}>
            <span style={{ width: `${overallScore}%` }} />
          </div>

          <div className={styles.metaGrid}>
            <div>
              <Clock3 size={16} />
              <span>Last checked</span>
              <strong>{checkedAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div>
              <RefreshCw size={16} />
              <span>Refresh rate</span>
              <strong>60 sec</strong>
            </div>
            <div>
              <Activity size={16} />
              <span>Watching</span>
              <strong>{activeMonitoringCount} service</strong>
            </div>
          </div>
        </div>

        <div className={styles.statusList}>
          {STATUS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <article className={styles.statusCard} key={item.id}>
                <div className={styles.statusIcon}>
                  <Icon size={21} />
                </div>

                <div className={styles.statusMain}>
                  <div className={styles.statusTopLine}>
                    <h3>{item.label}</h3>
                    <span className={`${styles.statusBadge} ${getStateTone(item.state)}`}>
                      {STATE_LABEL[item.state]}
                    </span>
                  </div>
                  <p>{item.detail}</p>
                  <div className={styles.statusMeter} aria-label={`${item.label} ${item.score}%`}>
                    <span style={{ width: `${item.score}%` }} />
                  </div>
                </div>

                <span className={styles.statusScore}>{item.score}%</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.notesSection} aria-label="Status notes">
        <div className={styles.notesHeader}>
          <p className={styles.panelEyebrow}>NOTES</p>
          <h2>Monitoring Notes</h2>
        </div>
        <div className={styles.noteList}>
          {INCIDENT_NOTES.map((note) => (
            <p key={note}>
              <CheckCircle2 size={16} />
              {note}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
