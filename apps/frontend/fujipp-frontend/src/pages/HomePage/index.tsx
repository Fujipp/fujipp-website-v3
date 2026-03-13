import { useEffect } from 'react';
import styles from './HomePage.module.css';

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
        <p className={styles.greeting}>
          HI GUYS, I AM{' '}
          <span className={styles.name}>ANAWAT</span>
        </p>
        <div className={styles.roleBadge}>
          <span className={styles.roleText}>FULLSTACK DEVELOPER</span>
        </div>
      </div>
    </section>
  );
}

