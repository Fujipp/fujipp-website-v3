import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Home, User, FolderOpen } from 'lucide-react'
import { AboutPage } from '../pages/AboutPage/index'
import { HomePage } from '../pages/HomePage/index'
import { ProjectsPage } from '../pages/ProjectsPage'

export interface PageDefinition {
  id: string
  label: string
  path: string
  component: ComponentType
  icon: LucideIcon
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
]
