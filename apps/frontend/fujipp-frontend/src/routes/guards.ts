import { FEATURED_PROJECTS, PROJECTS } from '../data/projects';

const STATIC_PAGE_PATHS = new Set([
  '/',
  '/about',
  '/projects',
  '/performance',
  '/changelog',
  '/privacy',
  '/terms',
  '/404',
]);

const PROJECT_DETAIL_IDS = new Set([
  ...Object.keys(FEATURED_PROJECTS),
  ...PROJECTS.map((project) => project.id),
]);

export function normalizePathname(pathname: string) {
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '');
}

export function isStaticPagePath(pathname: string) {
  return STATIC_PAGE_PATHS.has(normalizePathname(pathname));
}

export function isKnownProjectDetailId(id: string | undefined) {
  return Boolean(id && PROJECT_DETAIL_IDS.has(id));
}

export function getRouteTitleLabel(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === '/') return 'HOME';
  if (normalizedPathname === '/projects') return 'PROJECTS';
  if (normalizedPathname === '/about') return 'ABOUT';
  if (normalizedPathname === '/performance') return 'PERFORMANCE';
  if (normalizedPathname === '/changelog') return 'CHANGELOG';
  if (normalizedPathname === '/privacy') return 'PRIVACY';
  if (normalizedPathname === '/terms') return 'TERMS';

  const projectMatch = normalizedPathname.match(/^\/projects\/([^/]+)$/);
  if (projectMatch && isKnownProjectDetailId(projectMatch[1])) return 'PROJECT DETAIL';

  return 'NOT FOUND';
}
