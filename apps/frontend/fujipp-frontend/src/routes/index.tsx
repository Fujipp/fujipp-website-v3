import { lazy } from 'react'
import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Home, User, FolderOpen, BarChart2, ScrollText } from 'lucide-react'
import { HomePage } from '../pages/HomePage/index'

// Lazy-load non-landing pages — these won't be in the initial JS bundle
const AboutPage = lazy(() =>
  import('../pages/AboutPage/index').then((m) => ({ default: m.AboutPage }))
)
const ProjectsPage = lazy(() =>
  import('../pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
)
const PerformancePage = lazy(() =>
  import('../pages/PerformancePage/index').then((m) => ({ default: m.PerformancePage }))
)
const ChangelogPage = lazy(() =>
  import('../pages/ChangelogPage/index').then((m) => ({ default: m.ChangelogPage }))
)

export interface PageDefinition {
  id: string
  label: string
  path: string
  component: ComponentType
  icon: LucideIcon
  /** If true, the item is hidden from the desktop nav bar but still shown in the mobile sidebar */
  mobileOnly?: boolean
}

export const PAGES: PageDefinition[] = [
  {
    id: 'home',
    label: 'HOME',
    path: '/',
    component: HomePage,
    icon: Home,
  },
  {
    id: 'about',
    label: 'ABOUT',
    path: '/about',
    component: AboutPage,
    icon: User,
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    path: '/projects',
    component: ProjectsPage,
    icon: FolderOpen,
  },
  {
    id: 'performance',
    label: 'PERFORMANCE',
    path: '/performance',
    component: PerformancePage,
    icon: BarChart2,
    mobileOnly: true,
  },
  {
    id: 'changelog',
    label: 'CHANGELOG',
    path: '/changelog',
    component: ChangelogPage,
    icon: ScrollText,
    mobileOnly: true,
  },
]
