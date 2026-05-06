import { create } from 'zustand';

export type Category = 'all' | 'ui-design' | 'frontend' | 'backend' | 'fullstack' | 'database' | 'library' | 'internship' | 'discord';

interface ProjectFilterState {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
}

export const useProjectFilter = create<ProjectFilterState>((set) => ({
  activeCategory: 'all',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
}));
