import { ChevronDown, ChevronUp, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type ThemeOption = 'light' | 'dark' | 'system'

export interface PageItem {
  id: string
  label: string
}

interface AppNavbarProps {
  activePage: string
  onPageChange: (pageId: string) => void
  pages: PageItem[]
  theme: ThemeOption
  onThemeChange: (theme: ThemeOption) => void
}

const THEME_OPTIONS: { label: string; value: ThemeOption; icon: typeof Sun }[] = [
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
  { label: 'System', value: 'system', icon: Monitor },
]

export function AppNavbar({
  activePage,
  onPageChange,
  pages,
  theme,
  onThemeChange,
}: AppNavbarProps) {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const selectedThemeOption = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[2]
  const SelectedThemeIcon = selectedThemeOption.icon

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!themeMenuRef.current?.contains(event.target as Node)) {
        setIsThemeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navbar-bg px-4 md:px-8">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between">
        <h1 className="text-[32px] leading-none font-semibold">FUJIPP</h1>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-start gap-6 md:flex"
          aria-label="Main navigation"
        >
          {pages.map((page) => {
            const isActive = page.id === activePage

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onPageChange(page.id)}
                className="group inline-flex h-11 flex-col items-center rounded-xl"
              >
                <div className="inline-flex h-9 items-center justify-center px-4 py-2">
                  <span
                    className={`text-center text-base leading-none font-light transition-colors ${
                      isActive
                        ? 'text-navbar-active-foreground'
                        : 'text-navbar-foreground group-hover:text-navbar-active-foreground'
                    }`}
                  >
                    {page.label}
                  </span>
                </div>
                <span
                  className={`block h-1 w-6 rounded-[2px] transition-colors ${
                    isActive ? 'bg-primary' : 'bg-transparent group-hover:bg-navbar-foreground'
                  }`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <label htmlFor="mobile-page-select" className="sr-only">
            Select page
          </label>
          <select
            id="mobile-page-select"
            value={activePage}
            onChange={(event) => onPageChange(event.target.value)}
            className="h-9 rounded-md border border-border bg-muted px-2 text-xs text-foreground md:hidden"
          >
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.label}
              </option>
            ))}
          </select>

          <div ref={themeMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsThemeMenuOpen((prev) => !prev)}
              className="flex h-6 items-center gap-[5px] rounded-md text-navbar-active-foreground"
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
              <div
                className="absolute top-[49px] right-0 flex w-[113px] flex-col gap-[10px] rounded-lg border border-[color:var(--text-primary-light)] bg-navbar-bg p-2"
                role="menu"
              >
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const isSelected = theme === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onThemeChange(option.value)
                        setIsThemeMenuOpen(false)
                      }}
                      className={`flex h-6 w-full items-center gap-2 rounded px-0.5 text-left ${
                        isSelected
                          ? 'text-navbar-active-foreground'
                          : 'text-navbar-foreground/90'
                      }`}
                      role="menuitemradio"
                      aria-checked={isSelected}
                    >
                      <Icon className="size-4" strokeWidth={1.75} />
                      <span className="text-sm leading-none font-light">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
