import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Monitor, Server, Wrench, Bot, Cpu, Code2 } from 'lucide-react';
import {
  SiVuedotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiHtml5,
  SiSpring, SiNodedotjs, SiMysql,
  SiGit, SiDocker, SiDiscord, SiLinux,
  SiAnthropic, SiOpenai, SiGoogle,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
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
      'สวัสดีครับ ผมชื่อ Anawat Grudtoop เป็นนักศึกษาจาก School of Information Technology ที่สนใจสายงาน Full Stack Developer และชอบด้าน System Architecture เป็นพิเศษ เพราะผมชอบคิดภาพรวมของระบบ วางโครงสร้างให้ชัดเจน และวางแผนก่อนลงมือทำเสมอ',
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
      { name: 'Vue.js',       icon: SiVuedotjs },
      { name: 'React',        icon: SiReact },
      { name: 'TypeScript',   icon: SiTypescript },
      { name: 'JavaScript',   icon: SiJavascript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'HTML / CSS',   icon: SiHtml5 },
    ],
  },
  {
    label: 'Backend',
    color: 'green',
    groupIcon: Server,
    skills: [
      { name: 'Spring Boot', icon: SiSpring },
      { name: 'Java',        icon: FaJava },
      { name: 'Node.js',     icon: SiNodedotjs },
      { name: 'REST API',    icon: Code2 },
      { name: 'MySQL',       icon: SiMysql },
    ],
  },
  {
    label: 'Tools & Other',
    color: 'purple',
    groupIcon: Wrench,
    skills: [
      { name: 'Git',          icon: SiGit },
      { name: 'Docker',       icon: SiDocker },
      { name: 'Discord Bot',  icon: SiDiscord },
      { name: 'Automation',   icon: Cpu },
      { name: 'Linux',        icon: SiLinux },
    ],
  },
];

const AI_TOOLS = [
  { name: 'Claude Sonnet',  desc: 'Coding & reasoning', icon: SiAnthropic },
  { name: 'Claude Opus',    desc: 'Deep analysis',      icon: SiAnthropic },
  { name: 'GPT-Codex',     desc: 'Code generation',    icon: SiOpenai },
  { name: 'Gemini 2.5 Pro', desc: 'Multimodal tasks',  icon: SiGoogle },
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

export function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState<Lang>('en');

  // ── Education horizontal scroll (Framer Motion) ──
  const eduTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: eduScrollYProgress } = useScroll({
    target: eduTrackRef,
    offset: ['start start', 'end end'],
  });

  const CARD_WIDTH = 560;
  const CARD_GAP   = 32;
  const totalDistance = (EDUCATION.length - 1) * (CARD_WIDTH + CARD_GAP);
  const eduX = useTransform(eduScrollYProgress, [0, 1], [0, -totalDistance]);

  // Progress for the dots (0‒1)
  const [eduProgress, setEduProgress] = useState(0);
  useEffect(() => {
    return eduScrollYProgress.on('change', (v) => setEduProgress(v));
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
        <div className={styles.skillsHeader}>
          <p className={styles.skillsEyebrow}>WHAT I WORK WITH</p>
          <h2 className={styles.skillsTitle}>Skills & Tools</h2>
          <div className={styles.skillsTitleDivider} />
        </div>

        {/* Tech groups */}
        <div className={styles.skillsGrid}>
          {SKILL_GROUPS.map((group) => {
            const GroupIcon = group.groupIcon;
            return (
              <div
                key={group.label}
                className={`${styles.skillGroup} ${styles[`skillGroup_${group.color}` as keyof typeof styles]}`}
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
              </div>
            );
          })}
        </div>

        {/* AI Tools */}
        <div className={styles.aiSection}>
          <h3 className={styles.aiTitle}>
            <Bot size={18} strokeWidth={2} className={styles.aiIconEl} /> AI Tools I Use
          </h3>
          <div className={styles.aiGrid}>
            {AI_TOOLS.map((tool) => {
              const AiIcon = tool.icon;
              return (
                <div key={tool.name} className={styles.aiCard}>
                  <AiIcon size={22} className={styles.aiCardIcon} />
                  <span className={styles.aiName}>{tool.name}</span>
                  <span className={styles.aiDesc}>{tool.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

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

    </main>
  );
}
