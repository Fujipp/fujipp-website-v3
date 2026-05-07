import {
  DEFAULT_PROJECT_CMS_STATE,
  type ProjectCmsState,
} from '../data/projects';

export const PROJECT_CMS_STORAGE_KEY = 'fujipp.project-cms.v1';

function canUseStorage() {
  return import.meta.env.DEV && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getProjectCmsState(): ProjectCmsState {
  if (!canUseStorage()) return DEFAULT_PROJECT_CMS_STATE;

  const raw = window.localStorage.getItem(PROJECT_CMS_STORAGE_KEY);
  if (!raw) return DEFAULT_PROJECT_CMS_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<ProjectCmsState>;
    return {
      featuredProjects: parsed.featuredProjects ?? DEFAULT_PROJECT_CMS_STATE.featuredProjects,
      topProjects: parsed.topProjects ?? DEFAULT_PROJECT_CMS_STATE.topProjects,
      projectFolders: parsed.projectFolders ?? DEFAULT_PROJECT_CMS_STATE.projectFolders,
      projectFolderFilters: parsed.projectFolderFilters ?? DEFAULT_PROJECT_CMS_STATE.projectFolderFilters,
    };
  } catch {
    return DEFAULT_PROJECT_CMS_STATE;
  }
}

export function saveProjectCmsState(nextState: ProjectCmsState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PROJECT_CMS_STORAGE_KEY, JSON.stringify(nextState, null, 2));
}

export function resetProjectCmsState() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PROJECT_CMS_STORAGE_KEY);
}

export function serializeProjectCmsState(state: ProjectCmsState) {
  return JSON.stringify(state, null, 2);
}
