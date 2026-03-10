import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PAGES } from './routes'
import { BackgroundEffect } from './components/layout/BackgroundEffect'
import { AppNavbar } from './components/layout/AppNavbar'
import { useAppTheme } from './hooks/useAppTheme'

function App() {
  const { theme, setTheme } = useAppTheme()

  return (
    <BrowserRouter>
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
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
