import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { PAGES } from './routes'
import { BackgroundEffect } from './components/layout/BackgroundEffect'
import { AppNavbar } from './components/layout/AppNavbar'
import { AppFooter } from './components/layout/AppFooter'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { Toaster } from './components/ui/sonner'
import { useAppTheme } from './hooks/useAppTheme'

const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage/index').then((m) => ({ default: m.NotFoundPage }))
)

function AppLayout() {
  const { theme, setTheme } = useAppTheme()
  const location = useLocation()
  const showFooter = location.pathname === '/about' || location.pathname === '/performance' || location.pathname === '/changelog'

  // Dynamic page title
  useEffect(() => {
    const currentPage = PAGES.find((p) =>
      p.path === '/' ? location.pathname === '/' : location.pathname.startsWith(p.path)
    )
    document.title = currentPage
      ? `FUJIPP | ${currentPage.label}`
      : 'FUJIPP | NOT FOUND'
  }, [location.pathname])

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <BackgroundEffect />
      <ScrollToTop />

      <div className="relative z-10">
        <AppNavbar
          pages={PAGES}
          theme={theme}
          onThemeChange={setTheme}
        />

        <main className="mx-auto flex min-h-svh w-full items-start">
          <Suspense fallback={null}>
            <Routes>
              {PAGES.map((page) => (
                <Route
                  key={page.id}
                  path={page.path}
                  element={<page.component />}
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        {showFooter && <AppFooter pages={PAGES} />}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
      <Toaster position="bottom-right" duration={2000} />
    </BrowserRouter>
  )
}

export default App
