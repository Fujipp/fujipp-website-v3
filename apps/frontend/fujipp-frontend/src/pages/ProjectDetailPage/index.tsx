import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Github, ExternalLink, Award, ChevronLeft, ChevronRight,
  Banknote, ZoomIn, ImageIcon,
} from 'lucide-react';
import { CertificateModal } from '../../components/ui/CertificateModal/index';
import { PROJECTS, CATEGORIES, STATUS_LABEL, type Status } from '../ProjectsPage/index';
import { getTechIcon } from '../../utils/tech-icons';
import styles from './ProjectDetailPage.module.css';

const STATUS_DOT: Record<Status, string> = {
  active:   styles.dotActive,
  wip:      styles.dotWip,
  archived: styles.dotArchived,
};

const CAT_CLASS: Record<string, string> = {
  'ui-design': styles.catUiDesign,
  frontend:    styles.catFrontend,
  backend:     styles.catBackend,
  fullstack:   styles.catFullstack,
  database:    styles.catDatabase,
  library:     styles.catLibrary,
  internship:  styles.catInternship,
  discord:     styles.catDiscord,
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.id === id);
  const backUrl = '/projects';

  const [imgIdx, setImgIdx]   = useState(0);
  const [cert, setCert]       = useState<{ image: string; pdf?: string; label: string } | null>(null);
  const [zoomed, setZoomed]   = useState(false);

  const images = project?.images ?? [];

  useEffect(() => {
    if (!project) return;
    document.title = `FUJIPP | ${project.title}`;
    return () => { document.title = 'FUJIPP | PROJECTS'; };
  }, [project]);

  useEffect(() => { setImgIdx(0); }, [id]);

  if (!project) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <p>Project not found.</p>
          <button className={styles.backBtn} onClick={() => navigate(backUrl)}>
            <ArrowLeft size={15} strokeWidth={2.5} /> Back to Projects
          </button>
        </div>
      </main>
    );
  }

  const Icon = project.icon;
  const categoryLabel = CATEGORIES.find((c) => c.id === project.category)?.label ?? project.category;

  function prevImg() { setImgIdx((i) => (i - 1 + images.length) % images.length); }
  function nextImg() { setImgIdx((i) => (i + 1) % images.length); }

  return (
    <main className={styles.page}>

      {/* ── Hero header ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.05 }}
        >
          <span className={styles.heroIconWrap}>
            <Icon size={28} strokeWidth={1.5} />
          </span>

          <div className={styles.heroText}>
            <div className={styles.badges}>
              <span className={`${styles.catBadge} ${CAT_CLASS[project.category]}`}>{categoryLabel}</span>
              <span className={`${styles.statusBadge} ${STATUS_DOT[project.status]}`}>
                {STATUS_LABEL[project.status]}
              </span>
              {project.commissioned && (
                <span className={styles.commissionedBadge}>
                  <Banknote size={10} strokeWidth={2.5} /> Commissioned
                </span>
              )}
            </div>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.heroDescription}>{project.description}</p>
          </div>
        </motion.div>
      </section>

      {/* ── Main content ── */}
      <div className={styles.layout}>

        {/* ── Left: details ── */}
        <div className={styles.info}>

          {/* Tech stack */}
          <div className={styles.section}>
            <motion.p
              className={styles.sectionLabel}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
            >
              <span className={styles.sectionLabelDot} />
              TECH STACK
            </motion.p>
            <motion.div
              className={styles.techRow}
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
              }}
            >
              {project.tech.map((t) => {
                const TechIcon = getTechIcon(t);
                return (
                  <motion.span
                    key={t}
                    className={styles.techTag}
                    variants={{
                      hidden: { opacity: 0, y: 14, scale: 0.92 },
                      show:   { opacity: 1, y: 0,  scale: 1 },
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.06, y: -2 }}
                  >
                    {TechIcon && <TechIcon className={styles.techIcon} />}
                    {t}
                  </motion.span>
                );
              })}
            </motion.div>
          </div>

          {/* Links */}
          {(project.github || project.live || project.certificate) && (
            <div className={styles.section}>
              <motion.p
                className={styles.sectionLabel}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.3 }}
              >
                <span className={styles.sectionLabelDot} />
                LINKS
              </motion.p>
              <motion.div
                className={styles.linkRow}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } },
                }}
              >
                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                  >
                    <Github size={14} strokeWidth={2} /> GitHub
                  </motion.a>
                )}
                {project.live && (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                  >
                    <ExternalLink size={14} strokeWidth={2} /> Live Site
                  </motion.a>
                )}
                {project.certificate && (
                  <motion.button
                    className={`${styles.linkBtn} ${styles.linkBtnCert}`}
                    onClick={() => setCert(project.certificate!)}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                  >
                    <Award size={14} strokeWidth={2} /> Certificate
                  </motion.button>
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* ── Right: gallery ── */}
        {images.length > 0 && (
          <motion.div
            className={styles.gallery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.15 }}
          >
            <p className={styles.galleryLabel}>
              <ImageIcon size={11} strokeWidth={2.5} />
              SCREENSHOTS
            </p>

            <div className={styles.galleryMain}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={`${project.title} screenshot ${imgIdx + 1}`}
                  className={styles.galleryImg}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{    opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  draggable={false}
                  onClick={() => setZoomed(true)}
                  style={{ cursor: 'zoom-in' }}
                />
              </AnimatePresence>

              <button className={styles.zoomHint} onClick={() => setZoomed(true)}>
                <ZoomIn size={12} strokeWidth={2.5} /> Click to zoom
              </button>

              {images.length > 1 && (
                <>
                  <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={prevImg}>
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={nextImg}>
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                  <span className={styles.counter}>{imgIdx + 1} / {images.length}</span>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <motion.div
                className={styles.thumbRow}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.03, delayChildren: 0.25 } },
                }}
              >
                {images.map((src, i) => (
                  <motion.button
                    key={src}
                    className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
                    onClick={() => setImgIdx(i)}
                    variants={{
                      hidden: { opacity: 0, scale: 0.85 },
                      show:   { opacity: 1, scale: 1 },
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                  >
                    <img src={src} alt="" draggable={false} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <motion.div
        className={styles.backRow}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.3 }}
      >
        <button className={styles.backBtn} onClick={() => navigate(backUrl)}>
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to Projects
        </button>
      </motion.div>

      <CertificateModal
        open={cert !== null}
        imageUrl={cert?.image ?? ''}
        pdfUrl={cert?.pdf}
        title={cert?.label ?? ''}
        onClose={() => setCert(null)}
      />

      <CertificateModal
        open={zoomed}
        imageUrl={images[imgIdx] ?? ''}
        title={project.title}
        onClose={() => setZoomed(false)}
        images={images}
        currentIndex={imgIdx}
        onNavigate={(i) => setImgIdx(i)}
      />
    </main>
  );
}
