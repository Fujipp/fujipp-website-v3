import { useEffect, useRef, useState } from 'react'
import type { ThemeOption } from '../types/theme'

const THEME_STORAGE_KEY = 'fujipp-theme'
const THEME_TRANSITION_CLASS = 'theme-fade'
const THEME_TRANSITION_DURATION_MS = 350

// ─── Module-level preference ref ────────────────────────────────────────────
// Lives OUTSIDE React — survives StrictMode double-mount / HMR unmount.
// The OS listener reads this to decide whether to act on OS changes.
let _pref: ThemeOption = 'system'

const getStoredTheme = (): ThemeOption => {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system'
    ? stored
    : 'system'
}

// ─── Core apply ──────────────────────────────────────────────────────────────
const BG_DARK = '#272727'
const BG_LIGHT = '#ffffff'

const updateMetaThemeColor = (dark: boolean) => {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.content = dark ? BG_DARK : BG_LIGHT
}

const applyThemeToDocument = (theme: ThemeOption, systemDark?: boolean) => {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.removeAttribute('data-theme')

  if (theme === 'light') {
    root.setAttribute('data-theme', 'light')
    root.classList.add('light')
    updateMetaThemeColor(false)
    return
  }

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
    root.classList.add('dark')
    updateMetaThemeColor(true)
    return
  }

  // system — resolve via JS so Chrome/Arc/Firefox behave like Safari
  const prefersDark =
    systemDark ?? window.matchMedia('(prefers-color-scheme: dark)').matches

  const resolved = prefersDark ? 'dark' : 'light'
  root.setAttribute('data-theme', resolved)   // ← fixes token selectors that use [data-theme]
  root.classList.add(resolved)
  updateMetaThemeColor(prefersDark)            // ← fixes browser chrome theming
}

// ─── Singleton OS listener ───────────────────────────────────────────────────
// Registered ONCE when the module first loads.
// React StrictMode double-effects cannot remove this listener.
// Production build: module loads once, listener lives for the page lifetime.
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')

  const handleOsChange = (e: MediaQueryListEvent) => {
    if (_pref === 'system') {
      applyThemeToDocument('system', e.matches)
    }
  }

  // addEventListener is standard in all modern browsers.
  // addListener is the legacy Safari < 14 fallback.
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handleOsChange)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mq as any).addListener(handleOsChange)
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAppTheme() {
  const [theme, setTheme] = useState<ThemeOption>(() => {
    const t = getStoredTheme()
    _pref = t          // sync module ref on first render
    return t
  })
  const hasHydratedThemeRef = useRef(false)

  useEffect(() => {
    _pref = theme      // keep module ref in sync on every theme change

    const root = document.documentElement
    const shouldAnimate = hasHydratedThemeRef.current

    if (shouldAnimate) root.classList.add(THEME_TRANSITION_CLASS)

    applyThemeToDocument(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    hasHydratedThemeRef.current = true

    if (!shouldAnimate) return

    const tid = window.setTimeout(
      () => root.classList.remove(THEME_TRANSITION_CLASS),
      THEME_TRANSITION_DURATION_MS,
    )

    return () => {
      window.clearTimeout(tid)
      root.classList.remove(THEME_TRANSITION_CLASS)
    }
  }, [theme])

  return { theme, setTheme }
}
