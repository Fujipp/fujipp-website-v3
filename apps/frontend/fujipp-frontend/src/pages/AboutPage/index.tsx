import { useState, useEffect } from 'react';
import styles from './AboutPage.module.css';

const BG_IMAGES = [
  '/images/background/Macro Photography Maple Trees.jpg',
  '/images/background/Pexels Photo 3408353.jpeg',
];

type Lang = 'th' | 'en';

const BIO: Record<Lang, { paragraphs: string[] }> = {
  th: {
    paragraphs: [
      'สวัสดีครับ ผมชื่อ Anawat Grudtoop เป็นนักศึกษาจาก School of Information Technology ที่สนใจสายงาน Full Stack Developer และชอบด้าน System Architecture เป็นพิเศษ เพราะผมชอบคิดภาพรวมของระบบ วางโครงสร้างให้ชัดเจน และวางแผนก่อนลงมือทำเสมอ',
      'ผมให้ความสำคัญกับการทำงานอย่างเป็นระเบียบ ไม่ว่าจะเป็นโครงสร้างโปรเจกต์ การตั้งชื่อตัวแปร หรือการจัดการระบบที่ซับซ้อน ผมชอบทำให้ทุกอย่างออกมาชัดเจน อ่านง่าย และพัฒนาต่อได้สะดวก',
      'ทักษะหลักของผมคือ Vue.js, React, TypeScript และ Tailwind CSS รวมถึงมีประสบการณ์ใช้งาน Spring Boot และ MySQL ในการพัฒนาระบบจริง นอกจากนี้ผมยังสนใจงานด้าน Discord Bot และ Automation เพราะเป็นงานที่ทำให้ผมได้เปลี่ยนไอเดียให้กลายเป็นระบบที่ใช้งานได้จริง',
      'อีกเรื่องที่ผมกำลังพัฒนาอย่างจริงจังคือการใช้ AI ในการทำงาน ผมใช้ AI เพื่อช่วยเร่งขั้นตอนการพัฒนา ทำให้มีเวลาโฟกัสกับการคิด solution การออกแบบ architecture และเรื่อง security ได้มากขึ้น',
      'เป้าหมายของผมคือการเติบโตเป็น Software Engineer ที่สามารถเปลี่ยนไอเดียให้เป็นของจริง และสร้างระบบที่ไม่ใช่แค่ดูดี แต่ต้องใช้งานได้จริง มีโครงสร้างที่ดี และตอบโจทย์ผู้ใช้ครับ',
    ],
  },
  en: {
    paragraphs: [
      'Hello, my name is Anawat Grudtoop. I am a student at the School of Information Technology with a strong interest in becoming a Full Stack Developer, especially in System Architecture. I enjoy seeing the bigger picture, designing clear system structures, and planning before building.',
      'I value organized work, whether in project structure, naming conventions, or handling complex systems. I always try to make everything clear, maintainable, and easy to continue developing.',
      'My main skills are Vue.js, React, TypeScript, and Tailwind CSS. I also have experience using Spring Boot and MySQL in real projects. In addition, I am interested in Discord Bots and Automation because they allow me to turn ideas into practical systems.',
      'Another area I am actively developing is the use of AI in my workflow. I use AI to speed up development tasks, which gives me more time to focus on solution design, architecture, and security.',
      'My goal is to grow into a Software Engineer who can turn ideas into reality and build systems that are not only well-designed, but also practical, structured, and truly useful.',
    ],
  },
};

export function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.section}>

        {/* ── Background slideshow ── */}
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

        {/* ── Centered content ── */}
        <div className={styles.content}>

          <div className={styles.card}>

            {/* ── Card top row: avatar + identity + lang toggle ── */}
            <div className={styles.cardTop}>

              {/* Avatar */}
              <div className={styles.avatarWrap}>
                <img
                  src="/images/users/fujipp/profile-fujipp.png"
                  alt="Anawat Grudtoop"
                  className={styles.avatarImg}
                  draggable={false}
                />
              </div>

              {/* Identity */}
              <div className={styles.identity}>
                <h1 className={styles.name}>Anawat Grudtoop</h1>
                <p className={styles.role}>Fullstack Developer</p>
              </div>

              {/* Language toggle */}
              <div className={styles.langToggle} role="group" aria-label="Language">
                <button
                  className={`${styles.langBtn} ${lang === 'th' ? styles.langBtnActive : ''}`}
                  onClick={() => setLang('th')}
                >
                  TH
                </button>
                <button
                  className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
              </div>
            </div>

            <div className={styles.divider} />

            {/* ── Bio paragraphs ── */}
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
    </main>
  );
}
