import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Monitor, Server, Wrench, Bot, Cpu, Code2,
  Gamepad2, Music, Tv2, Utensils, Mic, Dumbbell, X, Send, ExternalLink,
} from 'lucide-react';
import {
  SiVuedotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiHtml5,
  SiSpring, SiNodedotjs, SiMysql,
  SiGit, SiDocker, SiDiscord, SiLinux,
  SiAnthropic, SiOpenai, SiGoogle,
  SiFacebook, SiInstagram, SiGithub,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import styles from './AboutPage.module.css';

const BG_IMAGES = [
  '/images/background/Macro Photography Maple Trees.jpg',
  '/images/background/Pexels Photo 3408353.jpeg',
];

type Lang = 'th' | 'en';

const BIO: Record<Lang, { paragraphs: string[] }> = {
  en: {
    paragraphs: [
      'Hello, my name is Anawat Grudtoop. I am a student at the School of Information Technology with a strong interest in becoming a Full Stack Developer, especially in System Architecture. I enjoy seeing the bigger picture, designing clear system structures, and planning before building.',
      'I value organized work, whether in project structure, naming conventions, or handling complex systems. I always try to make everything clear, maintainable, and easy to continue developing.',
      'My main skills are Vue.js, React, TypeScript, and Tailwind CSS. I also have experience using Spring Boot and MySQL in real projects. In addition, I am interested in Discord Bots and Automation because they allow me to turn ideas into practical systems.',
      'Another area I am actively developing is the use of AI in my workflow. I use AI to speed up development tasks, which gives me more time to focus on solution design, architecture, and security.',
      'My goal is to grow into a Software Engineer who can turn ideas into reality and build systems that are not only well-designed, but also practical, structured, and truly useful.',
    ],
  },
  th: {
    paragraphs: [
      'สวัสดีครับ ผมชื่อ อนวัตร กรุดธูป เป็นนักศึกษาจาก School of Information Technology ที่สนใจสายงาน Full Stack Developer และชอบด้าน System Architecture เป็นพิเศษ เพราะผมชอบคิดภาพรวมของระบบ วางโครงสร้างให้ชัดเจน และวางแผนก่อนลงมือทำเสมอ',
      'ผมให้ความสำคัญกับการทำงานอย่างเป็นระเบียบ ไม่ว่าจะเป็นโครงสร้างโปรเจกต์ การตั้งชื่อตัวแปร หรือการจัดการระบบที่ซับซ้อน ผมชอบทำให้ทุกอย่างออกมาชัดเจน อ่านง่าย และพัฒนาต่อได้สะดวก',
      'ทักษะหลักของผมคือ Vue.js, React, TypeScript และ Tailwind CSS รวมถึงมีประสบการณ์ใช้งาน Spring Boot และ MySQL ในการพัฒนาระบบจริง นอกจากนี้ผมยังสนใจงานด้าน Discord Bot และ Automation เพราะเป็นงานที่ทำให้ผมได้เปลี่ยนไอเดียให้กลายเป็นระบบที่ใช้งานได้จริง',
      'อีกเรื่องที่ผมกำลังพัฒนาอย่างจริงจังคือการใช้ AI ในการทำงาน ผมใช้ AI เพื่อช่วยเร่งขั้นตอนการพัฒนา ทำให้มีเวลาโฟกัสกับการคิด solution การออกแบบ architecture และเรื่อง security ได้มากขึ้น',
      'เป้าหมายของผมคือการเติบโตเป็น Software Engineer ที่สามารถเปลี่ยนไอเดียให้เป็นของจริง และสร้างระบบที่ไม่ใช่แค่ดูดี แต่ต้องใช้งานได้จริง มีโครงสร้างที่ดี และตอบโจทย์ผู้ใช้ครับ',
    ],
  },
};

// ── Skills data with brand icons ─────────────────────────────────────────
const SKILL_GROUPS = [
  {
    label: 'Frontend',
    color: 'blue',
    groupIcon: Monitor,
    skills: [
      { name: 'Vue.js', icon: SiVuedotjs },
      { name: 'React', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'HTML / CSS', icon: SiHtml5 },
    ],
  },
  {
    label: 'Backend',
    color: 'blue',
    groupIcon: Server,
    skills: [
      { name: 'Spring Boot', icon: SiSpring },
      { name: 'Java', icon: FaJava },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'REST API', icon: Code2 },
      { name: 'MySQL', icon: SiMysql },
    ],
  },
  {
    label: 'Tools & Other',
    color: 'blue',
    groupIcon: Wrench,
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'Docker', icon: SiDocker },
      { name: 'Discord Bot', icon: SiDiscord },
      { name: 'Automation', icon: Cpu },
      { name: 'Linux', icon: SiLinux },
    ],
  },
];

const AI_TOOLS = [
  { name: 'Claude Sonnet', desc: 'Coding & reasoning', icon: SiAnthropic },
  { name: 'Claude Opus', desc: 'Deep analysis', icon: SiAnthropic },
  { name: 'GPT-Codex', desc: 'Code generation', icon: SiOpenai },
  { name: 'Gemini 2.5 Pro', desc: 'Multimodal tasks', icon: SiGoogle },
];


// ── Education data ────────────────────────────────────────────────────────
const EDUCATION = [
  {
    id: 1,
    period: '2007 – 2018',
    school: 'Kajornroaj Wittaya School',
    level: 'Kindergarten – Grade 9 (M.3)',
    logo: 'http://fth0.com/uppic/10240001/news/10240001_0_20230126-104320.png',
    banner: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibGwC1WS4ltiUnG8HcuoPXhSWYOyVeUZHunEw7XEeB76d3agxl0IRFus7NdM4VvTLqd8Ldr-6imD0iO_jwBxPLe54RzIxll-qn89qjUgEiTsBw_y8aB7sjUdTBKM-d2hgcVfi7980zmHw-/s1600/20160426_183130.jpg',
    description: 'Primary and junior high school education',
    color: 'blue',
  },
  {
    id: 2,
    period: '2019 – 2021',
    school: 'Bangpakok Wittayakom School',
    level: 'Grade 10 – 12 (M.4 – M.6)',
    logo: 'https://lh3.googleusercontent.com/proxy/vnHTxP5gyd6U_JGXQ2Jx69IqLy38Q2rrAIU_SuNVDBrRQwAUhZiTa1SnS_eOM7p-Wzb41KRgAS4clfMK1OL7Y5J9167xbNGiiTlJ',
    banner: 'https://www.print3dd.com/wp-content/uploads/2017/04/%E0%B8%A3%E0%B8%A3-%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%81%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A2%E0%B8%B2%E0%B8%84%E0%B8%A1_8745-1024x576.jpg',
    description: 'Senior high school education',
    color: 'green',
  },
  {
    id: 3,
    period: '2022 – Present',
    school: "King Mongkut's University of Technology Thonburi",
    level: "Bachelor's Degree",
    logo: 'https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png',
    banner: 'https://media.licdn.com/dms/image/v2/D4D1BAQFgmrYvlG-aaQ/company-background_10000/company-background_10000/0/1655321602795/kmutt_cover?e=2147483647&v=beta&t=-oBC43DFebWSfi26PzBXVd2M-mrynn-vsAZREoFTFBw',
    description: 'School of Information Technology / B.Sc. in Information Technology',
    color: 'purple',
  },
];

// ── Hobby data (semantic color tokens only) ──────────────────────────
const HOBBIES = [
  {
    id: 1,
    Icon: Gamepad2,
    label: 'Gaming',
    tagline: 'Mobile & Casual',
    token: 'primary',
    games: [
      { name: 'Roblox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Roblox_Corporation_2025_logo.svg/960px-Roblox_Corporation_2025_logo.svg.png' },
      { name: 'RoV', logo: 'https://play-lh.googleusercontent.com/fWAs7pgAaEwNk5gGF0sOsdO-dKUmxm94wEeGbXEF7fsmcnEOTqqkJtqvFEDwk3w_F3wiFDlr9-eX5DtLK1GJCw' },
      { name: 'Pokémon GO', logo: 'https://play-lh.googleusercontent.com/Qf2SJGpLxd9eu4CLWRrh2tfmmkncg7TQ2RNr44tWO07EBfhfMs4CHlizioym11Vb6RmfIWCNz6FNsOgHj_5dMA=w240-h480-rw' },
      { name: 'Block Blast', logo: 'https://media.xp-pen.co/web/2025/06/12/2025061211235340587185.png' },
      { name: 'Candy Crush', logo: 'https://logodix.com/logo/1029738.png' },
      { name: 'Mobile Legends: Bang Bang', logo: 'https://img.tapimg.net/market/images/3f57a40c644dc33a6467176f91c707d6.png/appicon?t=1' },
    ],
  },
  {
    id: 2,
    Icon: Music,
    label: 'Artists',
    tagline: 'K-Pop & Thai Pop',
    token: 'primary',
    artists: [
      { name: 'Pun', photo: 'https://media.readthecloud.co/wp-content/uploads/2025/04/22125104/punisalwayshappy-22-1.webp' },
      { name: 'Winter', photo: 'https://pbs.twimg.com/media/GFsjHGwa0AA97zM.jpg' },
      { name: 'Karina', photo: 'https://xonomax.com/cdn/shop/files/753317.jpg?v=1742271499' },
      { name: 'NingNing', photo: 'https://preview.redd.it/aespa-ningning-w-korea-x-bvlgari-may-2025-issue-pictorial-v0-0z542u6pw3we1.jpg?width=640&crop=smart&auto=webp&s=8a1ec7a0aad57095fa6cef082a26a68381ea87e5' },
      { name: 'Giselle', photo: 'https://pbs.twimg.com/media/HCaFZJwbMAAKUT_.jpg' },
      { name: 'Percy', photo: 'https://i.scdn.co/image/ab67616100005174cbd0b4097d0b6f42a706a8b2' },
    ],
  },
  {
    id: 3,
    Icon: Dumbbell,
    label: 'Sports',
    tagline: 'Active & Spectator',
    token: 'primary',
    sports: [
      { name: 'Badminton', photo: 'https://corporate.bwfbadminton.com/wp-content/uploads/2025/02/20241212_2212_WorldTourFinals2024_BPYL0773.jpg' },
      { name: 'F1', photo: 'https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/fom-website/2025/Miscellaneous/2025-start-barcelona.webp' },
      { name: 'Running', photo: 'https://www.healthywomen.org/media-library/fitness-woman-running-training-for-marathon-on-sunny-coast-trail.jpg?id=34353001&width=1200&height=800&quality=70&coordinates=110%2C0%2C110%2C0' },
      { name: 'Football', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Football_in_Bloomington%2C_Indiana%2C_1995.jpg/1280px-Football_in_Bloomington%2C_Indiana%2C_1995.jpg' },
      { name: 'Basketball', photo: 'https://www.rockstaracademy.com/lib/images/news/basketball.jpeg' },
      { name: 'Tennis', photo: 'https://i.natgeofe.com/n/e626ca85-71f1-4485-90ea-4828d5884965/GettyImages-1272468011.jpg' },
    ],
  },
  {
    id: 4,
    Icon: Tv2,
    label: 'Anime',
    tagline: 'Seinen & Thriller',
    token: 'primary',
    animes: [
      { name: 'Pokémon Journey', poster: 'https://cms.dmpcdn.com/moviearticle/2022/12/02/af9b6a10-7233-11ed-80b2-f5c55ac792e7_webp_original.jpg' },
      { name: 'Naruto', poster: 'https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
      { name: 'One Piece', poster: 'https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtYmVjMy00YjRiLTkxMWUtNzZkMDNiYjZhNmViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
      { name: 'Demon Slayer', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWRaIUYW6W8mWGutUKJkRbKn2rOkYq9HN4Dg&s' },
      { name: 'Attack on Titan', poster: 'https://aot-portal.com/wp/wp-content/uploads/2025/11/re_aotLA_kokuchi_1107-1-712x1006.jpg' },
      { name: 'Slime Datta Ken', poster: 'https://i.ebayimg.com/images/g/-LUAAOSwfyVcwunZ/s-l1200.jpg' },
    ],
  },
  {
    id: 5,
    Icon: Utensils,
    label: 'Restaurants',
    tagline: 'Japanese & Hot Pot',
    token: 'primary',
    restaurants: [
      { name: 'Fuji', photo: 'https://d2kihw5e8drjh5.cloudfront.net/eyJidWNrZXQiOiJ1dGEtaW1hZ2VzIiwia2V5IjoicGxhY2VfaW1nL3kyVlJ1TlFoU0RhdkRYUlhiTkNRbVEiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjY0MCwiaGVpZ2h0Ijo2NDAsImZpdCI6Imluc2lkZSJ9LCJyb3RhdGUiOm51bGwsInRvRm9ybWF0IjogIndlYnAifX0=' },
      { name: 'Yakiniku Like', photo: 'https://www.lemon8-app.com/seo/image?item_id=7444072419444326919&index=2&sign=4f25b199053bdd7b481de39c264a1fb2' },
      { name: 'Sushiro', photo: 'https://pacificplace.b-cdn.net/directory_image/JxKMM/PP-Web-Sushiro-1%20(1).jpg' },
      { name: 'Hot Pot Man', photo: 'https://img.wongnai.com/p/400x0/2024/11/12/51d54f995d9d4b159cc2151935dedea8.jpg' },
      { name: 'Haidilao', photo: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/35/31/15/1haidilao-hot-pot-2-outdoor.jpg?w=1200&h=1200&s=1' },
      { name: 'Momo Paradise', photo: 'https://img.wongnai.com/p/1920x0/2023/01/12/cebfb1e5fa08410d8b4a886942769b4a.jpg' },
    ],
  },
  {
    id: 6,
    Icon: Mic,
    label: 'Speakers',
    tagline: 'Ideas & Insights',
    token: 'primary',
    speakers: [
      { name: '9arm', photo: 'https://shop.9arm.co/cdn/shop/files/chat1.jpg?v=1686500424' },
      { name: 'CK', photo: 'https://yt3.googleusercontent.com/CMqKWgqvz1amDcZaIa7KksykIeM1TjNpyg5mxNrdoRl3UbLVbyX7mGg7CV-hPiQ3Dfp7N2jr6g=s900-c-k-c0x00ffffff-no-rj' },
      { name: '9aimmuno', photo: 'https://media.readthecloud.co/wp-content/uploads/2022/02/29124731/aimmuno-feature.webp' },
      { name: 'ธนาธร', photo: 'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6rY3s3rvbZ4CsfC96lSDb9cxXqC1UaKJybBTprBvMDPDQ3EPNJQ.jpg' },
      { name: 'พิธา', photo: 'https://f.ptcdn.info/946/088/000/meiljq6miTV1q7cNKr5-o.jpg' },
      { name: 'ณัฐพงษ์', photo: 'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6rMjN2oy8tvr5maS39MZLcsw9DJKHW2qgryg7v4IogQJmBO1sjt.jpg' },
    ],
  },
];

// ── Lanyard (Discord live status) ─────────────────────────────────────────
const DISCORD_USER_ID = '1108816021915176962';

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    display_name?: string;
    avatar: string;
    avatar_decoration_data?: { asset: string };
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{ name: string; type: number; state?: string }>;
  listening_to_spotify: boolean;
  spotify?: { song: string; artist: string };
}

// ── Static social card definitions ────────────────────────────────────────
const SOCIAL_CARDS = [
  {
    id: 'discord',
    platform: 'Discord',
    handle: 'fujipp.',
    avatar: '', // filled from Lanyard
    decoration: '', // filled from Lanyard
    bio: 'Live status via Lanyard',
    href: `https://discord.com/users/${DISCORD_USER_ID}`,
    color: 'discord',
    stagger: 0,
    Icon: SiDiscord,
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@f.janw',
    displayName: 'f.janw',
    avatar: '/images/users/fujipp/profile-fujipp.png',
    decoration: '',
    bio: 'Capturing moments and memories',
    href: 'https://www.instagram.com/f.janw/',
    color: 'instagram',
    stagger: 1,
    Icon: SiInstagram,
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    handle: '@fujipp',
    displayName: 'Anawat Grudtoop',
    avatar: '/images/users/fujipp/profile-fujipp.png',
    decoration: '',
    bio: 'Follow for news and updates',
    href: 'https://www.facebook.com/fujipp',
    color: 'facebook',
    stagger: 2,
    Icon: SiFacebook,
  },
  {
    id: 'email',
    platform: 'Gmail',
    handle: 'anawat.grudtoop',
    displayName: 'Anawat Grudtoop',
    avatar: '/images/users/fujipp/profile-fujipp.png',
    decoration: '',
    bio: 'Feel free to drop me an email',
    href: 'mailto:anawat.grudtoop@gmail.com',
    color: 'email',
    stagger: 3,
    Icon: MdEmail,
  },
  {
    id: 'github',
    platform: 'GitHub',
    handle: '@Fujipp',
    displayName: 'Fujipp',
    avatar: '/avatars/github.jpg',
    decoration: '',
    bio: 'Open source projects and code',
    href: 'https://github.com/Fujipp',
    color: 'github',
    stagger: 4,
    Icon: SiGithub,
  },
];

export function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [selectedHobby, setSelectedHobby] = useState<number | null>(null);

  // ── Discord Lanyard live status ──────────────────────────────────────────
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (json.success && json.data) setLanyardData(json.data);
      } catch { /* silent */ }
    };
    fetchLanyard();
    timer = setInterval(fetchLanyard, 5000);
    return () => clearInterval(timer);
  }, []);

  const discordAvatarUrl = lanyardData?.discord_user?.avatar
    ? (() => {
      const av = lanyardData.discord_user.avatar;
      const ext = av.startsWith('a_') ? 'gif' : 'png';
      return `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${av}.${ext}?size=128`;
    })()
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  const discordDecorationUrl = lanyardData?.discord_user?.avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyardData.discord_user.avatar_decoration_data.asset}.png?size=128&passthrough=true`
    : null;

  const discordStatus = lanyardData?.discord_status ?? 'offline';
  const discordDisplayName = lanyardData?.discord_user?.display_name ?? lanyardData?.discord_user?.username ?? 'Fuji';
  const discordCustomStatus = lanyardData?.activities?.find(a => a.type === 4)?.state ?? null;
  const discordActivity = lanyardData?.activities?.find(a => a.type === 0) ?? null;

  // ── GitHub live handle (public API — no token needed) ────────────────────
  const [githubHandle, setGithubHandle] = useState('@Fujipp');
  useEffect(() => {
    fetch('https://api.github.com/users/Fujipp')
      .then(r => r.json())
      .then(data => { if (data.login) setGithubHandle(`@${data.login}`); })
      .catch(() => { /* keep fallback */ });
  }, []);

  const STATUS_COLOR: Record<string, string> = {
    online: '#43a25a',
    idle: '#ca9654',
    dnd: '#d83a42',
    offline: '#747f8d',
  };
  const STATUS_LABEL: Record<string, string> = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline',
  };

  // Lock body scroll when hobby modal is open
  useEffect(() => {
    if (selectedHobby !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedHobby]);

  // ── Education horizontal scroll (Framer Motion) ──
  const eduTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: eduScrollYProgress } = useScroll({
    target: eduTrackRef,
    offset: ['start start', 'end end'],
  });

  const CARD_WIDTH = 560;
  const CARD_GAP = 32;
  const totalDistance = (EDUCATION.length - 1) * (CARD_WIDTH + CARD_GAP);
  const eduX = useTransform(eduScrollYProgress, [0, 1], [0, -totalDistance]);

  // Progress for the dots — subscribe to keep the value reactive (value is read via motion transform)
  useEffect(() => {
    return eduScrollYProgress.on('change', () => {});
  }, [eduScrollYProgress]);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className={styles.page}>

      {/* ══ SECTION 1 — About Me ══ */}
      <section className={styles.section}>

        {/* Background slideshow */}
        <div className={styles.bgWrapper}>
          {BG_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden
              className={`${styles.bgImage} ${i === currentIndex ? styles.bgImageActive : ''}`}
            />
          ))}
          <div className={styles.bgOverlay} />
          <div className={styles.bgGradientTop} />
          <div className={styles.bgGradientBottom} />
        </div>

        {/* Centered content */}
        <div className={styles.content}>
          <div className={styles.card}>

            {/* Card top row */}
            <div className={styles.cardTop}>
              <div className={styles.avatarWrap}>
                <img
                  src="/images/users/fujipp/profile-fujipp.png"
                  alt="Anawat Grudtoop"
                  className={styles.avatarImg}
                  draggable={false}
                />
              </div>
              <div className={styles.identity}>
                <h1 className={styles.name}>Anawat Grudtoop</h1>
                <p className={styles.role}>Fullstack Developer</p>
              </div>
              <div className={styles.langToggle} role="group" aria-label="Language">
                <button
                  className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
                  onClick={() => setLang('en')}
                >EN</button>
                <button
                  className={`${styles.langBtn} ${lang === 'th' ? styles.langBtnActive : ''}`}
                  onClick={() => setLang('th')}
                >TH</button>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Bio */}
            <div className={styles.bioBlock} key={lang}>
              {BIO[lang].paragraphs.map((text, i) => (
                <p key={i} className={styles.bio}>{text}</p>
              ))}
            </div>
          </div>

          {/* Image indicators */}
          <div className={styles.indicators}>
            {BG_IMAGES.map((_, i) => (
              <button
                key={i}
                aria-label={`Background ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`${styles.indicator} ${i === currentIndex ? styles.indicatorActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — Skills ══ */}
      <section className={styles.skillsSection}>

        {/* Header */}
        <motion.div
          className={styles.skillsHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.skillsEyebrow}>WHAT I WORK WITH</p>
          <h2 className={styles.skillsTitle}>Skills & Tools</h2>
          <div className={styles.skillsTitleDivider} />
        </motion.div>

        {/* Tech groups */}
        <div className={styles.skillsGrid}>
          {SKILL_GROUPS.map((group, i) => {
            const GroupIcon = group.groupIcon;
            return (
              <motion.div
                key={group.label}
                className={`${styles.skillGroup} ${styles[`skillGroup_${group.color}` as keyof typeof styles]}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.1 }}
              >
                <h3 className={styles.skillGroupLabel}>
                  <GroupIcon size={14} strokeWidth={2.5} />
                  {group.label}
                </h3>
                <div className={styles.chipRow}>
                  {group.skills.map((skill) => {
                    const SkillIcon = skill.icon;
                    return (
                      <span
                        key={skill.name}
                        className={`${styles.chip} ${styles[`chip_${group.color}` as keyof typeof styles]}`}
                      >
                        <SkillIcon size={13} />
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Tools */}
        <motion.div
          className={styles.aiSection}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.25 }}
        >
          <h3 className={styles.aiTitle}>
            <Bot size={18} strokeWidth={2} className={styles.aiIconEl} /> AI Tools I Use
          </h3>
          <div className={styles.aiGrid}>
            {AI_TOOLS.map((tool, i) => {
              const AiIcon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  className={styles.aiCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 26, delay: 0.3 + i * 0.07 }}
                >
                  <AiIcon size={22} className={styles.aiCardIcon} />
                  <span className={styles.aiName}>{tool.name}</span>
                  <span className={styles.aiDesc}>{tool.desc}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </section>

      {/* ══ SECTION 3 — Education (horizontal scroll) ══ */}
      <div ref={eduTrackRef} className={styles.eduTrack}>
        <div className={styles.eduSticky}>

          {/* Centered label */}
          <div className={styles.eduSectionLabel}>
            <p className={styles.eduEyebrow}>MY JOURNEY</p>
            <h2 className={styles.eduTitle}>Education</h2>
            <div className={styles.eduTitleDivider} />
          </div>

          {/* Centered gallery wrapper (width = card) — overflow visible so cards bleed */}
          <div className={styles.eduGalleryWrapper}>
            <motion.div className={styles.eduGallery} style={{ x: eduX }}>
              {EDUCATION.map((edu, i) => (
                <div
                  key={edu.id}
                  className={`${styles.eduCard} ${styles[`eduCard_${edu.color}` as keyof typeof styles]}`}
                >
                  {/* Banner image */}
                  <div className={styles.eduBannerWrap}>
                    <img
                      src={edu.banner}
                      alt={edu.school}
                      className={styles.eduBanner}
                    />
                    {/* Logo badge over banner */}
                    <div className={styles.eduLogoBadge}>
                      <img
                        src={edu.logo}
                        alt=""
                        className={styles.eduLogo}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className={styles.eduText}>
                    <p className={`${styles.eduPeriod} ${styles[`eduPeriod_${edu.color}` as keyof typeof styles]}`}>
                      {edu.period}
                    </p>
                    <h3 className={styles.eduSchool}>{edu.school}</h3>
                    <p className={styles.eduLevel}>{edu.level}</p>
                    <p className={styles.eduDesc}>{edu.description}</p>
                  </div>

                  {/* Number badge */}
                  <span className={`${styles.eduBadge} ${styles[`eduBadge_${edu.color}` as keyof typeof styles]}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* ══ SECTION 4 — Hobbies ══ */}
      <section className={styles.hobbySection}>
        <motion.div
          className={styles.hobbyHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.hobbyEyebrow}>OUTSIDE THE CODE</p>
          <h2 className={styles.hobbyTitle}>Hobbies & Interests</h2>
          <div className={styles.hobbyDivider} />
        </motion.div>

        {/* Grid of compact clickable cards */}
        <div className={styles.hobbyGrid}>
          {HOBBIES.map((h, i) => (
            <motion.div
              key={h.id}
              layoutId={`hobby-card-${h.id}`}
              className={`${styles.hobbyCard} ${styles[`hobbyCard_${h.token}` as keyof typeof styles]}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: selectedHobby === h.id ? 0 : 1, y: 0 }}
              animate={{ opacity: selectedHobby === h.id ? 0 : 1 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={selectedHobby !== null ? {} : { scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.09 }}
              onClick={() => setSelectedHobby(h.id)}
              style={{ cursor: 'pointer', pointerEvents: selectedHobby === h.id ? 'none' : 'auto' }}
            >
              <div className={`${styles.hobbyIconWrap} ${styles[`hobbyIconWrap_${h.token}` as keyof typeof styles]}`}>
                <h.Icon size={28} strokeWidth={1.6} />
              </div>
              <div className={styles.hobbyCardBody}>
                <p className={`${styles.hobbyCardTagline} ${styles[`hobbyTagline_${h.token}` as keyof typeof styles]}`}>
                  {h.tagline}
                </p>
                <h3 className={styles.hobbyCardName}>{h.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 5 — Contact ══ */}
      <section className={styles.contactSection}>

        <div className={styles.contactInner}>

          {/* Header — same structure as hobbyHeader */}
          <motion.div
            className={styles.contactHeader}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          >
            <p className={styles.contactEyebrow}>GET IN TOUCH</p>
            <h2 className={styles.contactTitle}>Let's Connect</h2>
            <div className={styles.hobbyDivider} />
          </motion.div>

          {/* Parallelogram card row — skewed like the reference image */}
          <div className={styles.contactCardRow}>
            {SOCIAL_CARDS.map((card) => {
              const CardIcon = card.Icon;
              const isDiscord = card.id === 'discord';
              const avatarSrc = isDiscord ? discordAvatarUrl : card.avatar;
              const decorSrc = isDiscord ? discordDecorationUrl : card.decoration;
              const displayName = isDiscord
                ? discordDisplayName
                : (card as { displayName?: string }).displayName ?? card.handle;
              return (
                <motion.div
                  key={card.id}
                  className={`${styles.contactCard} ${styles[`contactCard_${card.color}` as keyof typeof styles]}`}
                  style={{ zIndex: card.stagger + 1 }}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24, delay: card.stagger * 0.08 }}
                  whileHover={{ scale: 1.03, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                >
                  {/* Counter-skewed inner wrapper so text stays upright */}
                  <div className={styles.contactCardInner}>

                    {/* Header row */}
                    <div className={styles.contactCardHeader}>
                      <div className={`${styles.contactPlatformIcon} ${styles[`contactPlatformIcon_${card.color}` as keyof typeof styles]}`}>
                        <CardIcon size={20} />
                      </div>
                      <div className={styles.contactPlatformInfo}>
                        <h3 className={styles.contactPlatformName}>{card.platform}</h3>
                        <span className={styles.contactPlatformHandle}>
                          {isDiscord
                            ? (lanyardData?.discord_user?.username ? `@${lanyardData.discord_user.username}` : card.handle)
                            : card.id === 'github'
                              ? githubHandle
                              : card.handle}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className={styles.contactCardBody}>
                      <div className={styles.contactProfileRow}>
                        <div className={styles.contactAvatarWrap}>
                          <img
                            src={avatarSrc}
                            alt={card.platform}
                            className={styles.contactAvatar}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                          />
                          {decorSrc && (
                            <img src={decorSrc} alt="" className={styles.contactAvatarDecor} aria-hidden />
                          )}
                          {isDiscord && (
                            <svg className={styles.contactStatusDot} viewBox="0 0 16 16" width="16" height="16">
                              <defs>
                                <mask id={`mask-${discordStatus}`}>
                                  <circle cx="8" cy="8" r="8" fill="white" />
                                  {discordStatus === 'idle' && <circle cx="5" cy="5" r="5" fill="black" />}
                                  {discordStatus === 'dnd' && <rect x="3" y="6.5" width="10" height="3" rx="1.5" fill="black" />}
                                  {discordStatus === 'offline' && <circle cx="8" cy="8" r="4" fill="black" />}
                                </mask>
                              </defs>
                              <rect width="16" height="16" fill={STATUS_COLOR[discordStatus]} mask={`url(#mask-${discordStatus})`} />
                            </svg>
                          )}
                        </div>
                        <div className={styles.contactProfileInfo}>
                          <span className={styles.contactDisplayName}>{displayName}</span>
                          {isDiscord && (
                            <span className={`${styles.contactStatusBadge} ${styles[`contactStatusBadge_${discordStatus}` as keyof typeof styles]}`}>
                              {STATUS_LABEL[discordStatus]}
                            </span>
                          )}
                        </div>
                      </div>

                      {isDiscord && discordCustomStatus ? (
                        <p className={styles.contactBioText}>{discordCustomStatus}</p>
                      ) : (
                        !isDiscord && <p className={styles.contactBioText}>{card.bio}</p>
                      )}

                      {isDiscord && (
                        <div className={styles.contactBadgeRow}>
                          {lanyardData?.listening_to_spotify && lanyardData.spotify && (
                            <div className={styles.contactBadgeSpotify}>
                              <span>🎵</span>
                              <span>{lanyardData.spotify.song} – {lanyardData.spotify.artist}</span>
                            </div>
                          )}
                          {discordActivity && (
                            <div className={styles.contactBadgeActivity}>
                              <span>🎮</span>
                              <span>{discordActivity.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <a
                      href={card.href}
                      {...(card.id !== 'email' ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`${styles.contactViewBtn} ${styles[`contactViewBtn_${card.color}` as keyof typeof styles]}`}
                    >
                      {card.id === 'email'
                        ? <><Send size={14} strokeWidth={2} /> Send Email</>
                        : <><ExternalLink size={14} strokeWidth={2} /> View Profile</>}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>






      {/* ══ Hobby modal (shared layoutId expands from grid card) ══ */}
      <AnimatePresence>
        {selectedHobby && (() => {
          const h = HOBBIES.find(x => x.id === selectedHobby)!;
          return (
            <>
              {/* Backdrop — delayed so flying card animation is visible first */}
              <motion.div
                className={styles.hobbyBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', duration: 0.22, delay: 0.2 }}
                onClick={() => setSelectedHobby(null)}
              />

              {/* Expanded card — same layoutId as the grid card */}
              <motion.div
                layoutId={`hobby-card-${h.id}`}
                className={`${styles.hobbyModal} ${styles[`hobbyCard_${h.token}` as keyof typeof styles]}`}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                {/* Close button */}
                <button
                  className={styles.hobbyModalClose}
                  onClick={() => setSelectedHobby(null)}
                  aria-label="Close"
                >
                  <X size={20} strokeWidth={2} />
                </button>

                {/* ―― ZONE 1+2: Icon · tagline · name — single inline row ―― */}
                <motion.div
                  className={`${styles.hobbyModalHeader} ${styles[`hobbyModalHeader_${h.token}` as keyof typeof styles]}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 24, delay: 0.42 }}
                >
                  <div className={`${styles.hobbyModalIconLg} ${styles[`hobbyIconWrap_${h.token}` as keyof typeof styles]}`}>
                    <h.Icon size={36} strokeWidth={1.4} />
                  </div>
                  <div className={styles.hobbyModalHeaderText}>
                    <p className={`${styles.hobbyCardTagline} ${styles[`hobbyTagline_${h.token}` as keyof typeof styles]}`}>
                      {h.tagline}
                    </p>
                    <h2 className={styles.hobbyModalName}>{h.label}</h2>
                  </div>
                </motion.div>

                {/* ―― ZONE 3: Seamless CSS marquee ―― */}
                {(() => {
                  type GameItem = { name: string; logo: string };
                  type AnimeItem = { name: string; poster: string };
                  type RestItem = { name: string; photo: string };

                  type MarqueeEntry = { src: string; name: string; portrait?: boolean };

                  let entries: MarqueeEntry[] = [];

                  if ('games' in h && h.games) {
                    entries = (h.games as GameItem[]).map(g => ({ src: g.logo, name: g.name }));
                  } else if ('animes' in h && h.animes) {
                    entries = (h.animes as AnimeItem[]).map(a => ({ src: a.poster, name: a.name, portrait: true }));
                  } else if ('restaurants' in h && h.restaurants) {
                    entries = (h.restaurants as RestItem[]).map(r => ({ src: r.photo, name: r.name }));
                  } else if ('artists' in h && h.artists) {
                    entries = (h.artists as { name: string; photo: string }[]).map(a => ({ src: a.photo, name: a.name, portrait: true }));
                  } else if ('sports' in h && h.sports) {
                    entries = (h.sports as { name: string; photo: string }[]).map(s => ({ src: s.photo, name: s.name }));
                  } else if ('speakers' in h && h.speakers) {
                    entries = (h.speakers as { name: string; photo: string }[]).map(s => ({ src: s.photo, name: s.name, portrait: true }));
                  }

                  if (entries.length === 0) return null;

                  // Duplicate so translateX(-50%) loops seamlessly
                  const doubled = [...entries, ...entries];

                  return (
                    <motion.div
                      className={styles.hobbyGameSection}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'tween', duration: 0.28, ease: 'easeOut', delay: 0.62 }}
                    >
                      <div className={styles.hobbyMarqueeDivider} />
                      <div className={styles.hobbyMarqueeTrack}>
                        <div className={styles.hobbyMarqueeRail}>
                          {doubled.map((item, i) => (
                            <div key={i} className={styles.hobbyMarqueeCard}>
                              <img
                                src={item.src}
                                alt={item.name}
                                className={`${styles.hobbyMarqueeImg}${item.portrait ? ` ${styles.hobbyMarqueeImgPortrait}` : ''}`}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.15'; }}
                              />
                              <span className={styles.hobbyGameName}>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

    </main>
  );
}
