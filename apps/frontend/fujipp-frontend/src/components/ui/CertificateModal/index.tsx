import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../../../hooks/useScrollLock';
import styles from './CertificateModal.module.css';

interface CertificateModalProps {
  open: boolean;
  imageUrl: string;
  pdfUrl?: string;
  title: string;
  onClose: () => void;
  images?: string[];
  currentIndex?: number;
  onNavigate?: (idx: number) => void;
}

export function CertificateModal({ open, imageUrl, pdfUrl, title, onClose, images, currentIndex = 0, onNavigate }: CertificateModalProps) {
  const hasMultiple = images && images.length > 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (!hasMultiple || !onNavigate) return;
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images!.length) % images!.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images!.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, hasMultiple, currentIndex, images, onNavigate]);

  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <Award size={16} strokeWidth={2} className={styles.headerIcon} />
                <span className={styles.headerTitle}>{title}</span>
              </div>
              <div className={styles.headerActions}>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download
                    className={styles.downloadBtn}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={14} strokeWidth={2} />
                    Download PDF
                  </a>
                )}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Certificate image */}
            <div className={styles.imageWrapper}>
              {hasMultiple && onNavigate && (
                <button
                  className={`${styles.imageNav} ${styles.imageNavPrev}`}
                  onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex - 1 + images!.length) % images!.length); }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
              )}
              <img
                src={imageUrl}
                alt={title}
                className={hasMultiple ? styles.imageGallery : styles.image}
                draggable={false}
              />
              {hasMultiple && onNavigate && (
                <button
                  className={`${styles.imageNav} ${styles.imageNavNext}`}
                  onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex + 1) % images!.length); }}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} strokeWidth={2.5} />
                </button>
              )}
              {hasMultiple && (
                <div className={styles.imageCounter}>
                  {currentIndex + 1} / {images!.length}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
