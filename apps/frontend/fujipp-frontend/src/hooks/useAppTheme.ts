import { useEffect, useRef, useState } from 'react'
import type { ThemeOption } from '../types/theme'

const THEME_STORAGE_KEY = 'fujipp-theme'
const THEME_TRANSITION_CLASS = 'theme-fade'
const THEME_TRANSITION_DURATION_MS = 350

const getStoredTheme = (): ThemeOption => {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
    ? storedTheme
    : 'system'
}

const applyThemeToDocument = (theme: ThemeOption) => {
  const root = document.documentElement

  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    root.removeAttribute('data-theme')
    return
  }

  root.setAttribute('data-theme', theme)
  root.classList.add(theme)
}

export function useAppTheme() {
  const [theme, setTheme] = useState<ThemeOption>(getStoredTheme)
  const hasHydratedThemeRef = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    const shouldAnimate = hasHydratedThemeRef.current

    if (shouldAnimate) {
      root.classList.add(THEME_TRANSITION_CLASS)
    }

    applyThemeToDocument(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    hasHydratedThemeRef.current = true

    if (!shouldAnimate) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS)
    }, THEME_TRANSITION_DURATION_MS)

    return () => {
      window.clearTimeout(timeoutId)
      root.classList.remove(THEME_TRANSITION_CLASS)
    }
  }, [theme])

  return { theme, setTheme }
}
