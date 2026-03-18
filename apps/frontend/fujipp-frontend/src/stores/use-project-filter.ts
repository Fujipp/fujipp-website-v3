import { create } from 'zustand';

export type Category = 'all' | 'internship' | 'discord' | 'university' | 'library' | 'personal';

interface ProjectFilterState {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
}

export const useProjectFilter = create<ProjectFilterState>((set) => ({
  activeCategory: 'all',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
}));
