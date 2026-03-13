import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { PAGES } from './routes'
import { BackgroundEffect } from './components/layout/BackgroundEffect'
import { AppNavbar } from './components/layout/AppNavbar'
import { AppFooter } from './components/layout/AppFooter'
import { useAppTheme } from './hooks/useAppTheme'

function AppLayout() {
  const { theme, setTheme } = useAppTheme()
  const location = useLocation()
  const showFooter = location.pathname === '/about'

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <BackgroundEffect />

      <div className="relative z-10">
        <AppNavbar
          pages={PAGES}
          theme={theme}
          onThemeChange={setTheme}
        />

        <main className="mx-auto flex min-h-svh w-full items-start">
          <Routes>
            {PAGES.map((page) => (
              <Route
                key={page.id}
                path={page.path}
                element={<page.component />}
              />
            ))}
          </Routes>
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
    </BrowserRouter>
  )
}

export default App
