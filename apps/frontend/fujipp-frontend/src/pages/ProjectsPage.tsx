import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
  const navigate = useNavigate();
  const lottieRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!lottieRef.current) return;

    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/images/svg/Cat.json',
    });

    anim.addEventListener('DOMLoaded', () => setLoaded(true));

    return () => anim.destroy();
  }, []);

  return (
    <section className={styles.container}>
      {/* Lottie cat animation */}
      <div className={styles.lottieWrap}>
        <div
          ref={lottieRef}
          className={styles.lottie}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>

      {/* Message */}
      <h1 className={styles.title}>We'll be back soon!</h1>

      <hr className={styles.divider} />

      <p className={styles.description}>
        This page is currently under construction. We're working hard to bring you something awesome. Stay tuned!
      </p>

      <Button
        size="lg"
        onClick={() => navigate('/')}
        className="mt-4"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Button>
    </section>
  );
}
