import { create } from 'zustand';

const PRELOAD_IMAGES = [
  // ── HomePage ──────────────────────────────────────────────────────────────
  '/images/users/fujipp/mascot_home.webp',
  '/images/users/fujipp/mascot_home.PNG',

  // ── AboutPage — Contact ───────────────────────────────────────────────────
  '/images/users/fujipp/profile-fujipp.png',
  '/avatars/github.jpg',

  // ── AboutPage — Hobbies: Games ────────────────────────────────────────────
  '/images/games/Roblox.png',
  '/images/games/Rov.png',
  '/images/games/PokemonGO.png',
  '/images/games/Block_Blast.png',

  // ── AboutPage — Hobbies: Artists ──────────────────────────────────────────
  '/images/artists/Aespa_Winter.png',
  '/images/artists/Aespa_Ningning.png',
  '/images/artists/Aespa_Karina.jpg',
  '/images/artists/Aespa_Giselle.jpg',

  // ── AboutPage — Hobbies: Restaurants ──────────────────────────────────────
  '/images/restaurants/Fuji.png',
  '/images/restaurants/Sushiro.png',
  '/images/restaurants/HotPotMan.png',
  '/images/restaurants/MomoParadise.png',

  // ── AboutPage — Education: Logos & Banners ────────────────────────────────
  'http://fth0.com/uppic/10240001/news/10240001_0_20230126-104320.png',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibGwC1WS4ltiUnG8HcuoPXhSWYOyVeUZHunEw7XEeB76d3agxl0IRFus7NdM4VvTLqd8Ldr-6imD0iO_jwBxPLe54RzIxll-qn89qjUgEiTsBw_y8aB7sjUdTBKM-d2hgcVfi7980zmHw-/s1600/20160426_183130.jpg',
  'https://lh3.googleusercontent.com/proxy/vnHTxP5gyd6U_JGXQ2Jx69IqLy38Q2rrAIU_SuNVDBrRQwAUhZiTa1SnS_eOM7p-Wzb41KRgAS4clfMK1OL7Y5J9167xbNGiiTlJ',
  'https://www.print3dd.com/wp-content/uploads/2017/04/%E0%B8%A3%E0%B8%A3-%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%81%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A2%E0%B8%B2%E0%B8%84%E0%B8%A1_8745-1024x576.jpg',
  'https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png',
  'https://media.licdn.com/dms/image/v2/D4D1BAQFgmrYvlG-aaQ/company-background_10000/company-background_10000/0/1655321602795/kmutt_cover?e=2147483647&v=beta&t=-oBC43DFebWSfi26PzBXVd2M-mrynn-vsAZREoFTFBw',
] as const;

interface ImagePreloadState {
  preloaded: Set<string>;
  preloadAll: () => void;
}

export const useImagePreload = create<ImagePreloadState>((set) => ({
  preloaded: new Set(),

  preloadAll: () => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = () =>
        set((state) => ({ preloaded: new Set([...state.preloaded, src]) }));
      img.src = src;
    });
  },
}));
