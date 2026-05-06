import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor, Server, Wrench, Code2,
  Gamepad2, Music, Utensils, Send, ExternalLink,
  Volume2, VolumeX,
  Database, Terminal, GitBranch, Package, Globe, Zap, Bug, Paintbrush, Users, Video, FileText, Layers,
  FileSpreadsheet, Presentation,
} from 'lucide-react';
import {
  SiVuedotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiHtml5,
  SiSpring, SiNodedotjs, SiMysql,
  SiDocker, SiDiscord,
  SiFacebook, SiInstagram, SiGithub,
  SiLua, SiBootstrap, SiPostgresql, SiMongodb, SiFirebase, SiRedis,
  SiGithubactions, SiPostman, SiCypress,
  SiVscodium, SiIntellijidea,
  SiFigma, SiCanva,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import styles from './AboutPage.module.css';

type ThreeObject3D = import('three').Object3D;
type ThreeMesh = import('three').Mesh;
type ThreeMaterial = import('three').Material;
type ThreeAnimationMixer = import('three').AnimationMixer;

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

const MASCOT_MODEL_SRC = '/models/StylishWalkAnimation.glb';
const ABOUT_MUSIC_SRC = '/music/ToTheNight.mp3';
const ABOUT_MUSIC_VOLUME = 0.42;
const MASCOT_SPEECHES: Record<Lang, string[]> = {
  en: [
    'Hello, my name is Fujipp.',
    'I am 22 years old.',
    'I am preparing to become a first jobber.',
    'I hope I get the opportunity to work with you.',
  ],
  th: [
    'สวัสดีครับ ผมชื่อ Fujipp',
    'ผมอายุ 22 ปี',
    'กำลังจะเป็น First Jobber',
    'ผมหวังว่าผมจะได้มีโอกาสร่วมงานกับคุณนะครับ',
  ],
};

function MascotModel({ lang }: { lang: Lang }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isRotating, setIsRotating] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return undefined;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    setModelStatus('loading');
    setIsRotating(false);

    void (async () => {
      let modules: [
        typeof import('three'),
        typeof import('three/examples/jsm/loaders/GLTFLoader.js'),
      ];

      try {
        modules = await Promise.all([
          import('three'),
          import('three/examples/jsm/loaders/GLTFLoader.js'),
        ]);
      } catch {
        if (!disposed) setModelStatus('error');
        return;
      }

      const [THREE, { GLTFLoader }] = modules;
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.52, 6.25);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x7987ac, 1.75);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.45);
      keyLight.position.set(4, 5, 6);
      const rimLight = new THREE.DirectionalLight(0x9fd9d3, 1.15);
      rimLight.position.set(-4, 2, -3);
      scene.add(ambientLight, keyLight, rimLight);

      const modelRoot = new THREE.Group();
      modelRoot.rotation.set(0.04, -0.36, 0);
      scene.add(modelRoot);

      let animationFrame = 0;
      let loadedModel: ThreeObject3D | null = null;
      let animationMixer: ThreeAnimationMixer | null = null;
      let isDragging = false;
      let modelReady = false;
      let lastPointerX = 0;
      let userRotationY = 0;
      const clock = new THREE.Clock();

      const resize = () => {
        const { width, height } = viewport.getBoundingClientRect();
        const nextWidth = Math.max(1, width);
        const nextHeight = Math.max(1, height);
        renderer.setSize(nextWidth, nextHeight, false);
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewport);
      resize();

      const loader = new GLTFLoader();
      loader.load(MASCOT_MODEL_SRC, (gltf) => {
        if (disposed) return;

        const model = gltf.scene;
        model.traverse((child) => {
          const mesh = child as ThreeMesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.72 / maxDimension;

        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale + 0.35, -center.z * scale);
        modelRoot.add(model);
        loadedModel = model;

        if (gltf.animations.length > 0) {
          animationMixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            animationMixer
              ?.clipAction(clip)
              .setLoop(THREE.LoopPingPong, Infinity)
              .reset()
              .fadeIn(0.2)
              .play();
          });
        }

        modelReady = true;
        setModelStatus('ready');
      }, undefined, () => {
        if (!disposed) setModelStatus('error');
      });

      const handlePointerDown = (event: PointerEvent) => {
        if (!modelReady) return;
        isDragging = true;
        lastPointerX = event.clientX;
        setIsRotating(true);
        viewport.setPointerCapture(event.pointerId);
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = event.clientX - lastPointerX;
        lastPointerX = event.clientX;
        userRotationY += deltaX * 0.01;
      };

      const handlePointerUp = (event: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        setIsRotating(false);
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId);
        }
      };

      viewport.addEventListener('pointerdown', handlePointerDown);
      viewport.addEventListener('pointermove', handlePointerMove);
      viewport.addEventListener('pointerup', handlePointerUp);
      viewport.addEventListener('pointercancel', handlePointerUp);

      const animate = () => {
        const time = performance.now() * 0.001;
        animationMixer?.update(clock.getDelta());
        modelRoot.rotation.y = -0.2 + userRotationY + Math.sin(time * 0.75) * 0.05;
        modelRoot.rotation.x = 0.04 + Math.sin(time * 0.55) * 0.025;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        viewport.removeEventListener('pointerdown', handlePointerDown);
        viewport.removeEventListener('pointermove', handlePointerMove);
        viewport.removeEventListener('pointerup', handlePointerUp);
        viewport.removeEventListener('pointercancel', handlePointerUp);
        animationMixer?.stopAllAction();
        if (loadedModel) animationMixer?.uncacheRoot(loadedModel);
        if (loadedModel) {
          loadedModel.traverse((child) => {
            const mesh = child as ThreeMesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material: ThreeMaterial) => material.dispose());
          });
        }
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    setSpeechIndex(0);
  }, [lang]);

  useEffect(() => {
    if (modelStatus !== 'ready' || isRotating) return undefined;

    const speechTimer = window.setInterval(() => {
      setSpeechIndex((currentIndex) => (currentIndex + 1) % MASCOT_SPEECHES[lang].length);
    }, 3400);

    return () => window.clearInterval(speechTimer);
  }, [isRotating, lang, modelStatus]);

  const loadingText = lang === 'en' ? 'Loading model' : 'กำลังโหลดโมเดล';
  const errorText = lang === 'en' ? 'Model unavailable' : 'โหลดโมเดลไม่ได้';
  const statusText = modelStatus === 'error' ? errorText : loadingText;
  const mascotSpeech = MASCOT_SPEECHES[lang][speechIndex];

  return (
    <div
      ref={viewportRef}
      className={`${styles.mascotViewport} ${modelStatus === 'ready' ? styles.mascotViewportReady : ''}`}
    >
      <canvas
        ref={canvasRef}
        className={`${styles.mascotCanvas} ${modelStatus === 'ready' ? styles.mascotCanvasReady : ''}`}
        aria-label="Fujipp 3D mascot model"
      />
      {modelStatus !== 'ready' && (
        <div className={styles.modelLoading} role="status" aria-live="polite">
          <span className={styles.modelSpinner} aria-hidden />
          <span>{statusText}</span>
        </div>
      )}
      {modelStatus === 'ready' && (
        <div
          key={mascotSpeech}
          className={`${styles.mascotSpeech} ${isRotating ? styles.mascotSpeechActive : ''}`}
          aria-live="polite"
        >
          {mascotSpeech}
        </div>
      )}
    </div>
  );
}

// ── Skills data with brand icons ─────────────────────────────────────────
const SKILL_GROUPS = [
  {
    label: 'Languages',
    color: 'blue',
    groupIcon: Code2,
    skills: [
      { name: 'HTML / CSS', icon: SiHtml5, brandColor: '#e34f26' },
      { name: 'JavaScript', icon: SiJavascript, brandColor: '#f7df1e' },
      { name: 'TypeScript', icon: SiTypescript, brandColor: '#3178c6' },
      { name: 'Java', icon: FaJava, brandColor: '#f89820' },
      { name: 'SQL', icon: Database, brandColor: '#4479a1' },
      { name: 'Lua', icon: SiLua, brandColor: '#000080' },
      { name: 'Bash / Shell', icon: Terminal, brandColor: '#4eaa25' },
    ],
  },
  {
    label: 'Frontend',
    color: 'blue',
    groupIcon: Monitor,
    skills: [
      { name: 'Vue.js', icon: SiVuedotjs, brandColor: '#42b883' },
      { name: 'React', icon: SiReact, brandColor: '#61dafb' },
      { name: 'Node.js', icon: SiNodedotjs, brandColor: '#5fa04e' },
    ],
  },
  {
    label: 'Backend',
    color: 'blue',
    groupIcon: Server,
    skills: [
      { name: 'Spring Boot', icon: SiSpring, brandColor: '#6db33f' },
    ],
  },
  {
    label: 'CSS Frameworks',
    color: 'blue',
    groupIcon: Layers,
    skills: [
      { name: 'Tailwind CSS', icon: SiTailwindcss, brandColor: '#06b6d4' },
      { name: 'Bootstrap', icon: SiBootstrap, brandColor: '#7952b3' },
    ],
  },
  {
    label: 'Databases',
    color: 'green',
    groupIcon: Database,
    skills: [
      { name: 'MySQL', icon: SiMysql, brandColor: '#4479a1' },
      { name: 'Oracle', icon: Database, brandColor: '#f80000' },
      { name: 'PostgreSQL', icon: SiPostgresql, brandColor: '#4169e1' },
      { name: 'MongoDB', icon: SiMongodb, brandColor: '#47a248' },
      { name: 'Firebase', icon: SiFirebase, brandColor: '#ffca28' },
      { name: 'Redis', icon: SiRedis, brandColor: '#ff4438' },
    ],
  },
  {
    label: 'Version Control',
    color: 'green',
    groupIcon: GitBranch,
    skills: [
      { name: 'GitHub', icon: SiGithub, brandColor: '#181717' },
    ],
  },
  {
    label: 'DevOps & Containers',
    color: 'green',
    groupIcon: Package,
    skills: [
      { name: 'Docker', icon: SiDocker, brandColor: '#2496ed' },
      { name: 'GitHub Actions', icon: SiGithubactions, brandColor: '#2088ff' },
    ],
  },
  {
    label: 'API & Communication',
    color: 'green',
    groupIcon: Globe,
    skills: [
      { name: 'REST API', icon: Globe, brandColor: '#2f80ed' },
      { name: 'WebSocket', icon: Zap, brandColor: '#f5a524' },
    ],
  },
  {
    label: 'Testing',
    color: 'purple',
    groupIcon: Bug,
    skills: [
      { name: 'Postman', icon: SiPostman, brandColor: '#ff6c37' },
      { name: 'Cypress', icon: SiCypress, brandColor: '#69d3a7' },
    ],
  },
  {
    label: 'Editors & IDEs',
    color: 'purple',
    groupIcon: Wrench,
    skills: [
      { name: 'VS Code', icon: SiVscodium, brandColor: '#007acc' },
      { name: 'IntelliJ IDEA', icon: SiIntellijidea, brandColor: '#fe315d' },
      { name: 'Antigravity', icon: Code2, brandColor: '#7c3aed' },
    ],
  },
  {
    label: 'Database GUI',
    color: 'purple',
    groupIcon: Database,
    skills: [
      { name: 'MySQL Workbench', icon: SiMysql, brandColor: '#4479a1' },
    ],
  },
  {
    label: 'Desktop Dev Tools',
    color: 'purple',
    groupIcon: Package,
    skills: [
      { name: 'GitHub Desktop', icon: SiGithub, brandColor: '#181717' },
      { name: 'Docker Desktop', icon: SiDocker, brandColor: '#2496ed' },
    ],
  },
  {
    label: 'UI/UX & Design',
    color: 'purple',
    groupIcon: Paintbrush,
    skills: [
      { name: 'Figma', icon: SiFigma, brandColor: '#f24e1e' },
      { name: 'Canva', icon: SiCanva, brandColor: '#00c4cc' },
    ],
  },
  {
    label: 'Collaboration',
    color: 'purple',
    groupIcon: Users,
    skills: [
      { name: 'Discord', icon: SiDiscord, brandColor: '#5865f2' },
    ],
  },
  {
    label: 'Media & Assets',
    color: 'purple',
    groupIcon: Video,
    skills: [
      { name: 'Photoshop', icon: Paintbrush, brandColor: '#31a8ff' },
      { name: 'CapCut', icon: Video, brandColor: '#111827' },
    ],
  },
  {
    label: 'Documentation',
    color: 'purple',
    groupIcon: FileText,
    skills: [
      { name: 'Word / Google Docs', icon: FileText, brandColor: '#4285f4' },
      { name: 'Excel / Google Sheets', icon: FileSpreadsheet, brandColor: '#34a853' },
    ],
  },
  {
    label: 'Presentation',
    color: 'purple',
    groupIcon: Layers,
    skills: [
      { name: 'PowerPoint / Google Slides', icon: Presentation, brandColor: '#b7472a' },
    ],
  },
];


// ── Education data ────────────────────────────────────────────────────────
const EDUCATION = [
  {
    id: 1,
    period: '2007 – 2018',
    school: 'Kajornroaj Wittaya School',
    level: 'Kindergarten – Grade 9 (M.3)',
    phase: 'Foundation',
    logoFallback: 'KW',
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
    phase: 'Senior High',
    logoFallback: 'BW',
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
    phase: 'University',
    logoFallback: '',
    logo: 'https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png',
    banner: 'https://media.licdn.com/dms/image/v2/D4D1BAQFgmrYvlG-aaQ/company-background_10000/company-background_10000/0/1655321602795/kmutt_cover?e=2147483647&v=beta&t=-oBC43DFebWSfi26PzBXVd2M-mrynn-vsAZREoFTFBw',
    description: 'School of Information Technology / B.Sc. in Information Technology',
    color: 'purple',
  },
];
const DEFAULT_EDUCATION_INDEX = EDUCATION.findIndex((edu) => edu.phase === 'University');

// ── Hobby data (semantic color tokens only) ──────────────────────────
const HOBBIES = [
  {
    id: 1,
    Icon: Gamepad2,
    label: 'Gaming',
    tagline: 'Mobile & Casual',
    token: 'primary',
    games: [
      { name: 'Roblox', logo: '/images/games/Roblox.png' },
      { name: 'RoV', logo: '/images/games/Rov.png' },
      { name: 'Pokemon GO', logo: '/images/games/PokemonGO.png' },
      { name: 'Block Blast', logo: '/images/games/Block_Blast.png' },
    ],
  },
  {
    id: 2,
    Icon: Music,
    label: 'Artists',
    tagline: 'K-Pop',
    token: 'pastel-7',
    artists: [
      { name: 'Winter', photo: '/images/artists/Aespa_Winter.png' },
      { name: 'Ningning', photo: '/images/artists/Aespa_Ningning.png' },
      { name: 'Karina', photo: '/images/artists/Aespa_Karina.jpg' },
      { name: 'Giselle', photo: '/images/artists/Aespa_Giselle.jpg' },
    ],
  },
  {
    id: 3,
    Icon: Utensils,
    label: 'Restaurants',
    tagline: 'Japanese & Hot Pot',
    token: 'pastel-5',
    restaurants: [
      { name: 'Fuji', photo: '/images/restaurants/Fuji.png' },
      { name: 'Sushiro', photo: '/images/restaurants/Sushiro.png' },
      { name: 'Hot Pot Man', photo: '/images/restaurants/HotPotMan.png' },
      { name: 'Momo Paradise', photo: '/images/restaurants/MomoParadise.png' },
    ],
  },
];

type Hobby = (typeof HOBBIES)[number];
type HobbyEntry = { src: string; name: string };

function getHobbyEntries(hobby: Hobby): HobbyEntry[] {
  if ('games' in hobby && hobby.games) {
    return hobby.games.map((game) => ({ src: game.logo, name: game.name }));
  }
  if ('restaurants' in hobby && hobby.restaurants) {
    return hobby.restaurants.map((restaurant) => ({ src: restaurant.photo, name: restaurant.name }));
  }
  if ('artists' in hobby && hobby.artists) {
    return hobby.artists.map((artist) => ({ src: artist.photo, name: artist.name }));
  }
  return [];
}

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
  const [lang, setLang] = useState<Lang>('en');
  const [currentEducationIndex, setCurrentEducationIndex] = useState(DEFAULT_EDUCATION_INDEX);
  const [educationSlideDirection, setEducationSlideDirection] = useState(1);
  const [isAboutMusicMuted, setIsAboutMusicMuted] = useState(false);
  const isAboutMusicMutedRef = useRef(false);
  const isInSectionRef = useRef(false);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutMusicRef = useRef<HTMLAudioElement | null>(null);
  const aboutMusicFadeFrameRef = useRef<number | null>(null);
  const aboutMusicFadeToRef = useRef<((volume: number) => void) | null>(null);
  const lanyardSnapshotRef = useRef<string>('');

  useEffect(() => {
    const aboutSection = aboutSectionRef.current;
    if (!aboutSection) return undefined;

    const audio = new Audio(ABOUT_MUSIC_SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    aboutMusicRef.current = audio;

    let disposed = false;
    let wantToPlay = false;

    const cancelFade = () => {
      if (aboutMusicFadeFrameRef.current !== null) {
        cancelAnimationFrame(aboutMusicFadeFrameRef.current);
        aboutMusicFadeFrameRef.current = null;
      }
    };

    const fadeTo = (target: number) => {
      const nextVolume = Math.max(0, Math.min(target, 1));
      cancelFade();
      if (nextVolume > 0) void audio.play().catch(() => {});
      const startVolume = audio.volume;
      const duration = nextVolume > startVolume ? 1500 : 850;
      const startTime = performance.now();
      const tick = (now: number) => {
        if (disposed) return;
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = startVolume + (nextVolume - startVolume) * eased;
        if (progress < 1) {
          aboutMusicFadeFrameRef.current = requestAnimationFrame(tick);
          return;
        }
        audio.volume = nextVolume;
        aboutMusicFadeFrameRef.current = null;
        if (nextVolume === 0) audio.pause();
      };
      aboutMusicFadeFrameRef.current = requestAnimationFrame(tick);
    };
    aboutMusicFadeToRef.current = fadeTo;

    const retryOnGesture = () => {
      if (wantToPlay && audio.paused) void audio.play().catch(() => {});
    };

    const updateAudio = (inSection: boolean) => {
      isInSectionRef.current = inSection;
      wantToPlay = inSection && !isAboutMusicMutedRef.current;
      fadeTo(wantToPlay ? ABOUT_MUSIC_VOLUME : 0);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateAudio(entry.isIntersecting && entry.intersectionRatio >= 0.22);
      },
      {
        rootMargin: '18% 0px 18% 0px',
        threshold: [0, 0.1, 0.22, 0.35, 0.5, 0.75, 1],
      },
    );
    observer.observe(aboutSection);
    document.addEventListener('pointerdown', retryOnGesture, { passive: true });
    document.addEventListener('keydown', retryOnGesture);

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('pointerdown', retryOnGesture);
      document.removeEventListener('keydown', retryOnGesture);
      cancelFade();
      audio.pause();
      audio.src = '';
      aboutMusicRef.current = null;
      aboutMusicFadeToRef.current = null;
    };
  }, []);

  // ── Discord Lanyard live status ──────────────────────────────────────────
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);

  useEffect(() => {
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (!json.success || !json.data) return;

        const data = json.data as LanyardData;
        const snapshot = JSON.stringify({
          user: data.discord_user,
          status: data.discord_status,
          activities: data.activities,
          spotify: data.spotify,
          listening: data.listening_to_spotify,
        });

        if (snapshot !== lanyardSnapshotRef.current) {
          lanyardSnapshotRef.current = snapshot;
          setLanyardData(data);
        }
      } catch { /* silent */ }
    };
    fetchLanyard();
    const timer = setInterval(fetchLanyard, 15000);
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

  const musicLabel = isAboutMusicMuted
    ? (lang === 'en' ? 'Unmute music' : 'เปิดเสียงเพลง')
    : (lang === 'en' ? 'Mute music' : 'ปิดเสียงเพลง');

  const currentEducation = EDUCATION[currentEducationIndex];

  const handleEducationSelect = (nextIndex: number) => {
    if (nextIndex === currentEducationIndex) return;
    setEducationSlideDirection(nextIndex > currentEducationIndex ? 1 : -1);
    setCurrentEducationIndex(nextIndex);
  };

  const handleToggleMute = () => {
    const nextMuted = !isAboutMusicMuted;
    isAboutMusicMutedRef.current = nextMuted;
    setIsAboutMusicMuted(nextMuted);
    if (isInSectionRef.current) {
      if (!nextMuted) {
        void aboutMusicRef.current?.play().catch(() => {});
        aboutMusicFadeToRef.current?.(ABOUT_MUSIC_VOLUME);
      } else {
        aboutMusicFadeToRef.current?.(0);
      }
    }
  };

  return (
    <main className={styles.page}>

      {/* ══ SECTION 1 — About Me ══ */}
      <section ref={aboutSectionRef} className={styles.section}>
        <div className={styles.aboutShell}>
          <div className={styles.introPanel}>
            <div className={styles.introTop}>
              <p className={styles.profileKicker}>ABOUT ME</p>

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

            <div className={styles.identity}>
              <h1 className={styles.name}>Anawat Grudtoop</h1>
              <p className={styles.role}>Fullstack Developer</p>
            </div>

            <div className={styles.aboutTextBlock} key={lang}>
              {BIO[lang].paragraphs.map((text, i) => (
                <p key={i} className={styles.bio}>{text}</p>
              ))}
            </div>

          </div>

          <div className={styles.mascotPanel}>
            <div className={styles.modelHeader}>
              <span>3D Mascot</span>
              <span>{lang === 'en' ? 'Drag to rotate' : 'ลากเพื่อหมุน'}</span>
            </div>
            <MascotModel lang={lang} />
            <div className={styles.musicControls}>
              <button
                type="button"
                className={styles.musicIconBtn}
                onClick={handleToggleMute}
                aria-label={musicLabel}
                title={musicLabel}
              >
                {isAboutMusicMuted ? <VolumeX size={17} strokeWidth={2.4} /> : <Volume2 size={17} strokeWidth={2.4} />}
              </button>
            </div>
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
                transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.035 }}
              >
                <h3 className={styles.skillGroupLabel}>
                  <span className={styles.skillGroupIcon}>
                    <GroupIcon size={15} strokeWidth={2.5} />
                  </span>
                  {group.label}
                </h3>
                <div className={styles.chipRow}>
                  {group.skills.map((skill) => {
                    const SkillIcon = skill.icon;
                    return (
                      <span
                        key={skill.name}
                        className={styles.chip}
                        style={{ '--skill-brand': skill.brandColor } as CSSProperties}
                      >
                        <span className={styles.skillIconWrap}>
                          <SkillIcon size={18} />
                        </span>
                        <span className={styles.skillName}>{skill.name}</span>
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ══ SECTION 3 — Education ══ */}
      <section className={styles.eduSection}>
        <motion.div
          className={styles.eduSectionLabel}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <p className={styles.eduEyebrow}>MY JOURNEY</p>
          <h2 className={styles.eduTitle}>Education</h2>
          <div className={styles.eduTitleDivider} />
        </motion.div>

        <div className={styles.eduCarousel}>
          <div className={styles.eduStage}>
            <AnimatePresence mode="wait">
              <motion.article
                key={currentEducation.id}
                className={`${styles.eduCard} ${styles[`eduCard_${currentEducation.color}` as keyof typeof styles]}`}
                initial={{ opacity: 0, x: educationSlideDirection > 0 ? 88 : -88, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: educationSlideDirection > 0 ? -88 : 88, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              >
                <div className={styles.eduMedia}>
                  <img
                    src={currentEducation.banner}
                    alt={currentEducation.school}
                    className={styles.eduBanner}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className={styles.eduMediaOverlay} />
                  <div className={styles.eduLogoBadge}>
                    <span className={styles.eduLogoFallback} aria-hidden>
                      {currentEducation.logoFallback}
                    </span>
                    <img
                      src={currentEducation.logo}
                      alt=""
                      className={styles.eduLogo}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                </div>

                <div className={styles.eduText}>
                  <div className={styles.eduMetaRow}>
                    <span className={`${styles.eduPhase} ${styles[`eduPhase_${currentEducation.color}` as keyof typeof styles]}`}>
                      {currentEducation.phase}
                    </span>
                    <p className={styles.eduPeriod}>{currentEducation.period}</p>
                  </div>
                  <h3 className={styles.eduSchool}>{currentEducation.school}</h3>
                  <p className={styles.eduLevel}>{currentEducation.level}</p>
                  <p className={styles.eduDesc}>{currentEducation.description}</p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className={styles.eduDots} role="tablist" aria-label="Education timeline">
            {EDUCATION.map((edu, i) => (
              <button
                key={edu.id}
                type="button"
                className={`${styles.eduDot} ${i === currentEducationIndex ? styles.eduDotActive : ''}`}
                onClick={() => handleEducationSelect(i)}
                aria-label={`Show ${edu.school}`}
                aria-selected={i === currentEducationIndex}
                role="tab"
              >
                <span>{edu.phase}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

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

        {/* Grid of compact cards */}
        <div className={styles.hobbyGrid}>
          {HOBBIES.map((h, i) => {
            const entries = getHobbyEntries(h);
            return (
              <motion.article
                key={h.id}
                className={`${styles.hobbyCard} ${styles[`hobbyCard_${h.token}` as keyof typeof styles]}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ scale: 1.025, y: -6 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.07 }}
              >
                <div className={styles.hobbyCardTop}>
                  <div className={`${styles.hobbyIconWrap} ${styles[`hobbyIconWrap_${h.token}` as keyof typeof styles]}`}>
                    <h.Icon size={24} strokeWidth={1.8} />
                  </div>
                  <span className={styles.hobbyCount}>{entries.length} picks</span>
                </div>

                <div className={styles.hobbyCardBody}>
                  <p className={`${styles.hobbyCardTagline} ${styles[`hobbyTagline_${h.token}` as keyof typeof styles]}`}>
                    {h.tagline}
                  </p>
                  <h3 className={styles.hobbyCardName}>{h.label}</h3>
                </div>

                <div className={styles.hobbyPreviewStrip} aria-hidden>
                  {entries.slice(0, 4).map((entry) => (
                    <img
                      key={`${h.id}-${entry.name}`}
                      src={entry.src}
                      alt=""
                      className={styles.hobbyPreviewImg}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.12'; }}
                    />
                  ))}
                </div>
              </motion.article>
            );
          })}
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

          {/* Contact cards */}
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24, delay: card.stagger * 0.08 }}
                  whileHover={{ y: -6, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                >
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

    </main>
  );
}
