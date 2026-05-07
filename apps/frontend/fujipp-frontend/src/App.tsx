import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { PAGES } from './routes'
import { getRouteTitleLabel, isKnownProjectDetailId, normalizePathname } from './routes/guards'
import { BackgroundEffect } from './components/layout/BackgroundEffect'
import { AppNavbar } from './components/layout/AppNavbar'
import { AppFooter } from './components/layout/AppFooter'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { FujippChat } from './components/features/FujippChat'
import { Toaster } from './components/ui/sonner'
import { useAppTheme } from './hooks/useAppTheme'
import { useImagePreload } from './stores/use-image-preload'

const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage/index').then((m) => ({ default: m.NotFoundPage }))
)
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage/index').then((m) => ({ default: m.ProjectDetailPage }))
)

const isLocalProjectEditorEnabled = import.meta.env.DEV
const ProjectEditorPage = isLocalProjectEditorEnabled
  ? lazy(() => import('./pages/ProjectEditorPage/index').then((m) => ({ default: m.ProjectEditorPage })))
  : null

function ProjectDetailGuard() {
  const { id } = useParams<{ id: string }>()

  if (!isKnownProjectDetailId(id)) {
    return <NotFoundPage />
  }

  return <ProjectDetailPage />
}

function TrailingSlashGuard() {
  const location = useLocation()
  const normalizedPathname = normalizePathname(location.pathname)

  if (normalizedPathname !== location.pathname) {
    return (
      <Navigate
        to={`${normalizedPathname}${location.search}${location.hash}`}
        replace
      />
    )
  }

  return null
}

function AppLayout() {
  const { theme, setTheme } = useAppTheme()
  const location = useLocation()
  const preloadAll = useImagePreload((s) => s.preloadAll)
  useEffect(() => { preloadAll() }, [preloadAll])
  const showFooter = ['/about', '/performance', '/changelog', '/privacy', '/terms', '/projects'].includes(location.pathname)
    || location.pathname.startsWith('/projects/')

  // Dynamic page title
  useEffect(() => {
    document.title = `FUJIPP | ${getRouteTitleLabel(location.pathname)}`
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
            <TrailingSlashGuard />
            <Routes>
              {PAGES.map((page) => (
                <Route
                  key={page.id}
                  path={page.path}
                  element={<page.component />}
                />
              ))}
              {ProjectEditorPage && (
                <Route path="/projects/editor" element={<ProjectEditorPage />} />
              )}
              <Route path="/projects/:id" element={<ProjectDetailGuard />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        {showFooter && <AppFooter pages={PAGES} />}
      </div>
      <FujippChat />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
      <Toaster
        position="bottom-right"
        duration={4000}
        expand
        gap={12}
        visibleToasts={5}
      />
    </BrowserRouter>
  )
}

export default App
