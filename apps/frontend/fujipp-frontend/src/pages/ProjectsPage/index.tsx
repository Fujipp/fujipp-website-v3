import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ElementType } from 'react';
import { ChevronLeft, ChevronRight, Crown, ExternalLink, FolderOpen, GitBranch } from 'lucide-react';
import { SiClaude, SiGooglegemini, SiOpenai } from 'react-icons/si';
import {
  STATUS_LABEL,
  type ProjectTag,
} from '../../data/projects';
import { getProjectCmsState } from '../../utils/project-cms';
import styles from './ProjectsPage.module.css';

type ProjectFolderFilter = 'all' | ProjectTag;
type ThreeObject3D = import('three').Object3D;
type ThreeMesh = import('three').Mesh;
type ThreeMaterial = import('three').Material;
type ThreeAnimationMixer = import('three').AnimationMixer;

/* ── AI Tools ────────────────────────────────── */

const AI_TOOLS: {
  name: string;
  plan: string;
  use: string;
  icon: ElementType;
  tone: 'claude' | 'codex' | 'gemini';
}[] = [
  {
    name: 'Claude Code',
    plan: 'Claude Pro Plan',
    use: 'วางแผนระบบ อ่านภาพรวม แยกงาน และช่วยเขียนโค้ดส่วนหลักก่อนลงรายละเอียด',
    icon: SiClaude,
    tone: 'claude',
  },
  {
    name: 'Codex',
    plan: 'GPT Plus Plan',
    use: 'ตรวจสอบโค้ด มองหาความเสี่ยง refactor และช่วยเขียนโค้ดในจุดที่ต้องการความเนี้ยบ',
    icon: SiOpenai,
    tone: 'codex',
  },
  {
    name: 'Gemini CLI',
    plan: 'Google Gemini Pro Plan',
    use: 'คุมโครงสร้าง หาข้อมูล เช็คบริบทกว้าง ๆ และช่วยโค้ดงานย่อยให้เร็วขึ้น',
    icon: SiGooglegemini,
    tone: 'gemini',
  },
];

const AI_PRINCIPLES = [
  'ใช้ร่วมกัน ไม่ยึดตัวเดียว',
  'วางแผนก่อนลงมือ',
  'ให้แต่ละ AI ตรวจคนละมุม',
  'สุดท้ายผมเป็นคนตัดสินใจ',
];

const MARQUEE_ITEMS = [...AI_TOOLS, ...AI_TOOLS, ...AI_TOOLS];
const PROJECTS_PER_PAGE = 5;

/* ── Chat2Date GLB Model ─────────────────────── */

function Chat2DateModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return undefined;

    let disposed = false;
    let cleanup: (() => void) | undefined;

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
        if (!disposed) setStatus('error');
        return;
      }

      const [THREE, { GLTFLoader }] = modules;
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.5, 5.8);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x7987ac, 1.7);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
      keyLight.position.set(3, 6, 5);
      const rimLight = new THREE.DirectionalLight(0x9fd9d3, 1.0);
      rimLight.position.set(-4, 2, -3);
      scene.add(ambientLight, keyLight, rimLight);

      const modelRoot = new THREE.Group();
      scene.add(modelRoot);

      let animationFrame = 0;
      let loadedModel: ThreeObject3D | null = null;
      let animationMixer: ThreeAnimationMixer | null = null;
      let lastTime = performance.now();

      const resize = () => {
        const { width, height } = viewport.getBoundingClientRect();
        const w = Math.max(1, width);
        const h = Math.max(1, height);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewport);
      resize();

      const loader = new GLTFLoader();
      loader.load(
        '/models/Chat2Date.glb',
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.08 });
          model.traverse((child) => {
            const mesh = child as ThreeMesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = true;
            mesh.material = whiteMat;
          });
          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = 2.6 / (Math.max(size.x, size.y, size.z) || 1);
          model.scale.setScalar(scale);
          model.position.set(-center.x * scale, -center.y * scale + 0.25, -center.z * scale);
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
          setStatus('ready');
        },
        undefined,
        () => { if (!disposed) setStatus('error'); },
      );

      const animate = () => {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        const t = now * 0.001;
        animationMixer?.update(delta);
        modelRoot.rotation.y = Math.sin(t * 0.45) * 0.28;
        modelRoot.rotation.x = 0.03 + Math.sin(t * 0.32) * 0.022;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        animationMixer?.stopAllAction();
        if (loadedModel) {
          animationMixer?.uncacheRoot(loadedModel);
          loadedModel.traverse((child) => {
            const mesh = child as ThreeMesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m: ThreeMaterial) => m.dispose());
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

  return (
    <div ref={viewportRef} className={styles.modelViewport}>
      <canvas
        ref={canvasRef}
        className={`${styles.modelCanvas} ${status === 'ready' ? styles.modelCanvasReady : ''}`}
      />
      {status !== 'ready' && (
        <div className={styles.modelLoading} aria-live="polite">
          {status === 'loading' && <span className={styles.modelSpinner} aria-hidden />}
        </div>
      )}
    </div>
  );
}

function YipModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return undefined;

    let disposed = false;
    let cleanup: (() => void) | undefined;

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
        if (!disposed) setStatus('error');
        return;
      }

      const [THREE, { GLTFLoader }] = modules;
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(0, 0.45, 6.2);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x7987ac, 1.85);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(3.5, 5.5, 5);
      const fillLight = new THREE.DirectionalLight(0xc6b4e8, 1.05);
      fillLight.position.set(-4, 2, 3);
      const rimLight = new THREE.DirectionalLight(0x9fd9d3, 0.95);
      rimLight.position.set(-3, 3, -4);
      scene.add(ambientLight, keyLight, fillLight, rimLight);

      const modelRoot = new THREE.Group();
      scene.add(modelRoot);

      let animationFrame = 0;
      let loadedModel: ThreeObject3D | null = null;
      let animationMixer: ThreeAnimationMixer | null = null;
      let lastTime = performance.now();

      const resize = () => {
        const { width, height } = viewport.getBoundingClientRect();
        const w = Math.max(1, width);
        const h = Math.max(1, height);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewport);
      resize();

      const loader = new GLTFLoader();
      loader.load(
        '/models/Yip.glb',
        (gltf) => {
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
          const scale = 2.75 / (Math.max(size.x, size.y, size.z) || 1);
          model.scale.setScalar(scale);
          model.position.set(-center.x * scale, -center.y * scale + 0.15, -center.z * scale);
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
          setStatus('ready');
        },
        undefined,
        () => { if (!disposed) setStatus('error'); },
      );

      const animate = () => {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        const t = now * 0.001;
        animationMixer?.update(delta);
        modelRoot.rotation.y = -0.16 + Math.sin(t * 0.42) * 0.24;
        modelRoot.rotation.x = 0.02 + Math.sin(t * 0.28) * 0.018;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        animationMixer?.stopAllAction();
        if (loadedModel) {
          animationMixer?.uncacheRoot(loadedModel);
          loadedModel.traverse((child) => {
            const mesh = child as ThreeMesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m: ThreeMaterial) => m.dispose());
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

  return (
    <div ref={viewportRef} className={styles.modelViewport}>
      <canvas
        ref={canvasRef}
        className={`${styles.modelCanvas} ${status === 'ready' ? styles.modelCanvasReady : ''}`}
      />
      {status !== 'ready' && (
        <div className={styles.modelLoading} aria-live="polite">
          {status === 'loading' && <span className={styles.modelSpinner} aria-hidden />}
        </div>
      )}
    </div>
  );
}

function PetStoryModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return undefined;

    let disposed = false;
    let cleanup: (() => void) | undefined;

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
        if (!disposed) setStatus('error');
        return;
      }

      const [THREE, { GLTFLoader }] = modules;
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(0, 0.45, 6);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x8fa4a0, 1.9);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
      keyLight.position.set(3.5, 5.5, 5);
      const fillLight = new THREE.DirectionalLight(0xf5b6a0, 0.9);
      fillLight.position.set(-4.5, 2.2, 2.8);
      const rimLight = new THREE.DirectionalLight(0xc9f0d2, 1.0);
      rimLight.position.set(-3.2, 3, -4);
      scene.add(ambientLight, keyLight, fillLight, rimLight);

      const modelRoot = new THREE.Group();
      scene.add(modelRoot);

      let animationFrame = 0;
      let loadedModel: ThreeObject3D | null = null;
      let animationMixer: ThreeAnimationMixer | null = null;
      let lastTime = performance.now();

      const resize = () => {
        const { width, height } = viewport.getBoundingClientRect();
        const w = Math.max(1, width);
        const h = Math.max(1, height);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewport);
      resize();

      const loader = new GLTFLoader();
      loader.load(
        '/models/PetStory.glb',
        (gltf) => {
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
          const scale = 2.7 / (Math.max(size.x, size.y, size.z) || 1);
          model.scale.setScalar(scale);
          model.position.set(-center.x * scale, -center.y * scale + 0.12, -center.z * scale);
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
          setStatus('ready');
        },
        undefined,
        () => { if (!disposed) setStatus('error'); },
      );

      const animate = () => {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        const t = now * 0.001;
        animationMixer?.update(delta);
        modelRoot.rotation.y = 0.14 + Math.sin(t * 0.4) * 0.22;
        modelRoot.rotation.x = 0.02 + Math.sin(t * 0.3) * 0.016;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        animationMixer?.stopAllAction();
        if (loadedModel) {
          animationMixer?.uncacheRoot(loadedModel);
          loadedModel.traverse((child) => {
            const mesh = child as ThreeMesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m: ThreeMaterial) => m.dispose());
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

  return (
    <div ref={viewportRef} className={styles.modelViewport}>
      <canvas
        ref={canvasRef}
        className={`${styles.modelCanvas} ${status === 'ready' ? styles.modelCanvasReady : ''}`}
      />
      {status !== 'ready' && (
        <div className={styles.modelLoading} aria-live="polite">
          {status === 'loading' && <span className={styles.modelSpinner} aria-hidden />}
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────── */

export function ProjectsPage() {
  const navigate = useNavigate();
  const [cmsState] = useState(() => getProjectCmsState());
  const [selectedFolderCategory, setSelectedFolderCategory] = useState<ProjectFolderFilter>('all');
  const [currentFolderPage, setCurrentFolderPage] = useState(1);
  const { projectFolderFilters, projectFolders, topProjects } = cmsState;
  const visibleProjectFolders = selectedFolderCategory === 'all'
    ? projectFolders
    : projectFolders.filter((project) => project.tags.includes(selectedFolderCategory));
  const totalFolderPages = Math.max(1, Math.ceil(visibleProjectFolders.length / PROJECTS_PER_PAGE));
  const folderPageStartIndex = (currentFolderPage - 1) * PROJECTS_PER_PAGE;
  const currentPageProjectFolders = visibleProjectFolders.slice(
    folderPageStartIndex,
    folderPageStartIndex + PROJECTS_PER_PAGE,
  );
  const skeletonFolderSlots = Array.from({
    length: Math.max(0, PROJECTS_PER_PAGE - currentPageProjectFolders.length),
  });

  useEffect(() => {
    setCurrentFolderPage(1);
  }, [selectedFolderCategory]);

  useEffect(() => {
    setCurrentFolderPage((page) => Math.min(page, totalFolderPages));
  }, [totalFolderPages]);

  return (
    <main className={styles.page}>
      <section className={styles.featuredSection} aria-labelledby="featured-title">
        <div className={styles.featuredHeader}>
          <p className={styles.eyebrow}>FEATURED WORK</p>
          <h2 id="featured-title" className={styles.featuredTitle}>Top Projects</h2>
          <div className={styles.featuredTitleDivider} aria-hidden />
        </div>

        <div className={styles.featuredGrid}>
          {topProjects.map((proj) => (
            <article
              key={proj.id}
              className={`${styles.featuredCard} ${styles[`featuredCard_${proj.accent}`]} ${proj.detailId ? styles.featuredCardClickable : ''}`}
              onClick={() => proj.detailId && navigate(`/projects/${proj.detailId}`)}
              role={proj.detailId ? 'button' : undefined}
              tabIndex={proj.detailId ? 0 : undefined}
              onKeyDown={proj.detailId ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/projects/${proj.detailId}`);
                }
              } : undefined}
            >
              <span className={styles.spotDot} aria-hidden />

              {proj.number === '01' && <Chat2DateModel />}
              {proj.number === '02' && <YipModel />}
              {proj.number === '03' && <PetStoryModel />}

              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardCat}>{proj.categoryLabel}</span>
                  <span className={styles.cardStat}>{STATUS_LABEL[proj.status]}</span>
                </div>
                <h3 className={styles.cardTitle}>{proj.title}</h3>
                <p className={styles.cardDesc}>{proj.description}</p>

                <div className={styles.cardFoot}>
                  <div className={styles.techRow}>
                    {proj.tech.map((t) => (
                      <span key={t} className={styles.techPill}>{t}</span>
                    ))}
                  </div>
                  <div className={styles.cardLinks}>
                    {proj.github && (
                      <a href={proj.github} className={styles.cardLinkBtn} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <GitBranch size={12} />
                        Code
                      </a>
                    )}
                    {proj.live && (
                      <a href={proj.live} className={styles.cardLinkBtn} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={12} />
                        Live
                      </a>
                    )}
                    {proj.detailId && (
                      <span className={styles.cardDetailHint}>View Details →</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.podiumBase}>
                {proj.number === '01' && <Crown size={13} className={styles.crownIcon} aria-hidden />}
                <span className={styles.podiumNum}>{proj.number}</span>
                <span className={styles.podiumLabel}>RANK</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.folderSection} aria-labelledby="folder-projects-title">
        <div className={styles.folderHeader}>
          <div>
            <p className={styles.eyebrow}>PROJECT DIRECTORY</p>
            <h2 id="folder-projects-title" className={styles.folderTitle}>Projects Folder</h2>
          </div>
          <p className={styles.folderLead}>
            เลือกหมวดแล้วเปิดดูโปรเจกต์แบบเป็น folder list รายการไหนมี detail แล้วสามารถกดเข้าไปอ่านต่อได้ทันที
          </p>
        </div>

        <div className={styles.folderFilters} aria-label="Project category filters">
          {projectFolderFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`${styles.folderFilterBtn} ${selectedFolderCategory === filter.id ? styles.folderFilterBtnActive : ''}`}
              onClick={() => setSelectedFolderCategory(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.folderPagerBar}>
          <p className={styles.folderPageMeta}>
            Page {currentFolderPage} / {totalFolderPages} · {visibleProjectFolders.length} folders
          </p>
          <div className={styles.folderPagerControls} aria-label="Project folder pages">
            <button
              type="button"
              className={styles.folderPagerBtn}
              disabled={currentFolderPage === 1}
              aria-label="Previous folder page"
              onClick={() => setCurrentFolderPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalFolderPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`${styles.folderPageBtn} ${currentFolderPage === page ? styles.folderPageBtnActive : ''}`}
                aria-label={`Go to folder page ${page}`}
                aria-current={currentFolderPage === page ? 'page' : undefined}
                onClick={() => setCurrentFolderPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className={styles.folderPagerBtn}
              disabled={currentFolderPage === totalFolderPages}
              aria-label="Next folder page"
              onClick={() => setCurrentFolderPage((page) => Math.min(totalFolderPages, page + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles.folderList}>
          {currentPageProjectFolders.map((project, index) => {
            const canOpen = Boolean(project.detailId);
            const folderNumber = folderPageStartIndex + index + 1;
            return (
              <article
                key={project.id}
                className={`${styles.folderItem} ${canOpen ? styles.folderItemClickable : styles.folderItemUpcoming}`}
                onClick={() => project.detailId && navigate(`/projects/${project.detailId}`)}
                role={canOpen ? 'button' : undefined}
                tabIndex={canOpen ? 0 : undefined}
                onKeyDown={canOpen ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/projects/${project.detailId}`);
                  }
                } : undefined}
              >
                <div className={styles.folderIconWrap}>
                  <FolderOpen size={22} strokeWidth={2.2} />
                </div>

                <div className={styles.folderMain}>
                  <div className={styles.folderMetaLine}>
                    <span className={styles.folderIndex}>{String(folderNumber).padStart(2, '0')}</span>
                    <span className={styles.folderCategory}>{project.categoryLabel}</span>
                    <span className={styles.folderStatus}>{STATUS_LABEL[project.status]}</span>
                    <span className={styles.folderYear}>{project.year}</span>
                  </div>
                  <h3 className={styles.folderItemTitle}>{project.title}</h3>
                  <p className={styles.folderItemDesc}>
                    {canOpen ? project.description : 'Reserved slot for an upcoming project detail page.'}
                  </p>
                </div>

                <div className={styles.folderTech}>
                  {project.tech.slice(0, 5).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <span className={styles.folderOpenHint} aria-hidden>
                  {canOpen ? <ChevronRight size={18} strokeWidth={2.4} /> : 'Soon'}
                </span>
              </article>
            );
          })}

          {skeletonFolderSlots.map((_, index) => (
            <article
              key={`folder-skeleton-${currentFolderPage}-${index}`}
              className={`${styles.folderItem} ${styles.folderItemSkeleton}`}
              aria-hidden="true"
            >
              <div className={styles.folderSkeletonIcon} />

              <div className={styles.folderSkeletonMain}>
                <div className={styles.folderSkeletonMeta}>
                  <span />
                  <span />
                </div>
                <div className={styles.folderSkeletonTitle} />
                <div className={styles.folderSkeletonText} />
              </div>

              <div className={styles.folderSkeletonTech}>
                <span />
                <span />
                <span />
              </div>

              <div className={styles.folderSkeletonHint} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.aiSection} aria-labelledby="ai-workflow-title">
        <div className={styles.aiSectionHeader}>
          <p className={styles.eyebrow}>HOW I WORK WITH AI</p>
          <h2 id="ai-workflow-title" className={styles.aiTitle}>
            AI ที่ผมใช้ช่วยทำงาน
          </h2>
          <div className={styles.aiTitleDivider} aria-hidden />
          <p className={styles.aiLead}>
            ผมใช้ Claude Code, Codex และ Gemini CLI ร่วมกันให้บาลานซ์ที่สุด ตัวหนึ่งช่วยคิด ตัวหนึ่งช่วยตรวจ อีกตัวช่วยคุมภาพรวมและหาข้อมูล
          </p>
        </div>

        <div className={styles.principlesBlock}>
          {AI_PRINCIPLES.map((principle, i) => (
            <div key={principle} className={styles.principleItem}>
              <span className={styles.principleNum}>0{i + 1}</span>
              <p className={styles.principleText}>{principle}</p>
            </div>
          ))}
        </div>

        <div className={styles.marquee} aria-label="AI tools marquee">
          <div className={styles.marqueeFadeLeft} aria-hidden />
          <div className={styles.marqueeFadeRight} aria-hidden />
          <div className={styles.marqueeTrack}>
            {MARQUEE_ITEMS.map((tool, index) => {
              const ToolIcon = tool.icon;
              return (
                <article
                  key={`${tool.name}-${index}`}
                  className={`${styles.aiCard} ${styles[`aiCard_${tool.tone}`]}`}
                  aria-hidden={index >= AI_TOOLS.length}
                >
                  <span className={styles.aiIcon}>
                    <ToolIcon size={30} />
                  </span>
                  <div className={styles.aiText}>
                    <h3 className={styles.aiName}>{tool.name}</h3>
                    <p className={styles.aiPlan}>{tool.plan}</p>
                    <p className={styles.aiUse}>{tool.use}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
