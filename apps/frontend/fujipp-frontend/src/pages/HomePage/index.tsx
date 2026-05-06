import { useEffect } from 'react';
import styles from './HomePage.module.css';

const heroStats = [
  {
    value: '4',
    unit: 'YRS',
    label: 'Education',
    detail: 'Information Technology',
  },
  {
    value: '6',
    unit: 'MO',
    label: 'Internship',
    detail: 'Production Team',
  },
  {
    value: '2',
    unit: 'YRS',
    label: 'Freelance',
    detail: 'Client Projects',
  },
];

export function HomePage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section className={styles.hero}>
      {/* Top band — flat top, slanted bottom (right side lower) */}
      <div className={`${styles.band} ${styles.bandTop}`} />

      {/* Bottom band — slanted top (mirror), flat bottom */}
      <div className={`${styles.band} ${styles.bandBottom}`} />

      {/* Mascot avatar — left side, bottom-anchored */}
      <div className={styles.avatarWrap}>
        <picture style={{ display: 'contents' }}>
          <source
            srcSet="/images/users/fujipp/mascot_home.webp"
            type="image/webp"
          />
          <img
            src="/images/users/fujipp/mascot_home.PNG"
            alt="Fujipp mascot"
            className={styles.avatar}
            draggable={false}
            fetchPriority="high"
            loading="eager"
          />
        </picture>
      </div>

      {/* Text block — positioned in the center gap, right side */}
      <div className={styles.textBlock}>
        <div className={styles.heroCopy}>
          <p className={styles.greeting}>
            <span>HI GUYS, I AM</span>
            <span className={styles.name}>ANAWAT</span>
          </p>
          <div className={styles.roleGroup}>
            <span className={styles.roleMark} aria-hidden="true" />
            <h1 className={styles.roleText}>FULLSTACK DEVELOPER</h1>
          </div>
        </div>

        <div className={styles.statsRow}>
          {heroStats.map((stat) => (
            <div className={styles.statItem} key={stat.label}>
              <div className={styles.statValueRow}>
                <span className={styles.statNumber}>{stat.value}</span>
                <span className={styles.statUnit}>{stat.unit}</span>
              </div>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statDetail}>{stat.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
