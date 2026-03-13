import { NavLink, Link } from 'react-router-dom'
import type { PageDefinition } from '../../../routes'
import styles from './AppFooter.module.css'

interface AppFooterProps {
  pages?: PageDefinition[]
}

const FOOTER_LINKS = [
  { label: 'Performance', path: '/performance' },
  { label: 'Changelog', path: '/changelog' },
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
]

export function AppFooter(_props: AppFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* ── Top section: brand left, links right ── */}
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <NavLink to="/" className={styles.brand}>FUJIPP</NavLink>
            <p className={styles.tagline}>Building ideas, one commit at a time.</p>
          </div>

          <nav className={styles.linkGrid} aria-label="Footer links">
            {FOOTER_LINKS.map(({ label, path }) => (
              <Link key={path} to={path} className={styles.footerLink}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Divider ── */}
        <hr className={styles.divider} />

        {/* ── Bottom: copyright ── */}
        <p className={styles.copyright}>© 2026 Fujipp. All rights reserved.</p>

      </div>
    </footer>
  )
}
