import { ChevronDown, ChevronUp, Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '../../../lib/utils'
import type { ThemeOption } from '../../../types/theme'
import type { PageDefinition } from '../../../routes'
import styles from './AppNavbar.module.css'

interface AppNavbarProps {
  pages: PageDefinition[]
  theme: ThemeOption
  onThemeChange: (theme: ThemeOption) => void
}

const THEME_OPTIONS: { label: string; value: ThemeOption; icon: typeof Sun }[] = [
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
  { label: 'System', value: 'system', icon: Monitor },
]

export function AppNavbar({ pages, theme, onThemeChange }: AppNavbarProps) {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  const selectedThemeOption = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[2]
  const SelectedThemeIcon = selectedThemeOption.icon

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!themeMenuRef.current?.contains(event.target as Node)) {
        setIsThemeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isSidebarOpen])

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.container}>

          {/* Left: Burger (mobile) + Brand */}
          <div className={styles.leftGroup}>
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className={styles.mobileMenuBtn}
              aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isSidebarOpen}
            >
              <span className={cn(styles.burgerIcon, isSidebarOpen && styles.burgerIconActive)}>
                <Menu className={cn(styles.iconMenu, isSidebarOpen && styles.iconHidden)} />
                <X className={cn(styles.iconX, isSidebarOpen && styles.iconVisible)} />
              </span>
            </button>

            <NavLink to="/" className={styles.brand}>
              FUJIPP
            </NavLink>
          </div>

          {/* Center: Desktop nav links (mobileOnly pages are excluded) */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {pages.filter((p) => !p.mobileOnly).map((page) => (
              <NavLink
                key={page.id}
                to={page.path}
                end={page.path === '/'}
                className={styles.tabButton}
              >
                {({ isActive }) => (
                  <>
                    <div className={styles.tabTitleWrap}>
                      <span className={cn(styles.tabTitle, isActive && styles.tabTitleActive)}>
                        {page.label}
                      </span>
                    </div>
                    <span
                      className={cn(styles.indicator, isActive && styles.indicatorActive)}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Theme switcher */}
          <div className={styles.rightGroup}>
            <div ref={themeMenuRef} className={styles.themeMenuWrap}>
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen((prev) => !prev)}
                className={styles.themeTrigger}
                aria-haspopup="menu"
                aria-expanded={isThemeMenuOpen}
                aria-label="Theme selector"
              >
                <SelectedThemeIcon className="size-6" strokeWidth={1.75} />
                {isThemeMenuOpen ? (
                  <ChevronUp className="size-3" strokeWidth={2} />
                ) : (
                  <ChevronDown className="size-3" strokeWidth={2} />
                )}
              </button>

              {isThemeMenuOpen && (
                <div className={styles.themeDropdown} role="menu">
                  {THEME_OPTIONS.map((option) => {
                    const Icon = option.icon
                    const isActive = theme === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onThemeChange(option.value)
                          setIsThemeMenuOpen(false)
                          if (option.value === 'system') {
                            toast.warning('Theme: System', {
                              description: 'This feature may only be fully supported on Safari.',
                              icon: <Icon className="size-4" strokeWidth={1.75} />,
                            })
                          } else {
                            toast(`Theme: ${option.label}`, {
                              icon: <Icon className="size-4" strokeWidth={1.75} />,
                            })
                          }
                        }}
                        className={cn(styles.themeItem, isActive && styles.themeItemActive)}
                        role="menuitemradio"
                        aria-checked={isActive}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                        <span className={styles.themeItemLabel}>{option.label}</span>
                        <span
                          className={cn(
                            styles.themeItemIndicator,
                            isActive && styles.themeItemIndicatorActive,
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* ── Mobile Sidebar ────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={cn(styles.sidebarOverlay, isSidebarOpen && styles.sidebarOverlayVisible)}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}
        aria-label="Mobile navigation"
      >

        <nav className={styles.sidebarNav} aria-label="Mobile navigation links">
          <p className={styles.sidebarMenuLabel}>MENU</p>
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <NavLink
                key={page.id}
                to={page.path}
                end={page.path === '/'}
                className={({ isActive }) =>
                  cn(styles.sidebarLink, isActive && styles.sidebarLinkActive)
                }
                onClick={closeSidebar}
              >
                <Icon className="size-5" strokeWidth={1.75} />
                <span>{page.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
