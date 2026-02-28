import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { AppNavbar, type ThemeOption } from './components/layout/AppNavbar'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'

interface PageDefinition {
  id: string
  label: string
  render: () => ReactNode
}

const PAGES: PageDefinition[] = [
  {
    id: 'home',
    label: 'HOME',
    render: () => <HomePage />,
  },
  {
    id: 'about',
    label: 'ABOUT',
    render: () => <AboutPage />,
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    render: () => <ProjectsPage />,
  },
]

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

function App() {
  const [activePage, setActivePage] = useState(PAGES[0].id)
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

  const currentPage = useMemo(
    () => PAGES.find((page) => page.id === activePage) ?? PAGES[0],
    [activePage],
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppNavbar
        activePage={activePage}
        onPageChange={setActivePage}
        pages={PAGES}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main className="mx-auto flex min-h-svh w-full max-w-7xl items-start px-4 pt-24 pb-8 md:px-8">
        {currentPage.render()}
      </main>
    </div>
  )
}

export default App
