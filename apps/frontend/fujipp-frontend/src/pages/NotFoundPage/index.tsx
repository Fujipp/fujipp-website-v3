import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <span className={styles.code}>404</span>

      <h1 className={styles.title}>Page Not Found</h1>

      <hr className={styles.divider} />

      <p className={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Button
        size="lg"
        onClick={() => navigate('/')}
        className="mt-4"
      >
        <ArrowLeft size={16} />
        Go Home
      </Button>
    </section>
  );
}
