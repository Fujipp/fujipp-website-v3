import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Github, ExternalLink, Award, ChevronLeft, ChevronRight,
  Banknote, ZoomIn, ImageIcon, CalendarDays, Gamepad2, HeartHandshake,
  MapPin, Radar, ShieldCheck, Sparkles, Target, UsersRound,
} from 'lucide-react';
import { SiFigma } from 'react-icons/si';
import { Youtube } from 'lucide-react';
import { CertificateModal } from '../../components/ui/CertificateModal/index';
import { PROJECTS, CATEGORIES, STATUS_LABEL, FEATURED_PROJECTS, type Status, type FeaturedProjectData, type InfraLayer } from '../../data/projects';
import { getProjectCmsState } from '../../utils/project-cms';
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

/* ── Featured project layout ─────────────────── */

type DetailLang = 'th' | 'en';
type LocalizedFeaturedContent = Pick<
  FeaturedProjectData,
  | 'subtitle'
  | 'overview'
  | 'problemStatement'
  | 'objectives'
  | 'process'
  | 'highlights'
  | 'challenges'
  | 'feasibility'
  | 'targetAudience'
  | 'systemOverview'
  | 'workflow'
  | 'features'
>;

const FEATURE_ICON_POOL = [ShieldCheck, Radar, HeartHandshake, CalendarDays, Gamepad2, MapPin, Sparkles];

const CHAT2DATE_EN: LocalizedFeaturedContent = {
  subtitle: 'Dating application for chatting, getting to know each other, and meeting safely offline',
  overview:
    'Chat2Date is a dating platform designed to move beyond matching and messaging. It helps users progress from online conversation to real-world dates through preference-based matching, real-time chat, relationship scoring, date-place recommendations, scheduling, and safety support during meetups.',
  problemStatement: [
    'Online dating is widely used, but many users still face long-distance relationships, limited ideas for shared activities, and difficulty building meaningful connections through chat alone.',
    'This project proposes a system that filters compatible matches and encourages real shared experiences through date planning, location recommendations, and post-date feedback.',
  ],
  objectives: [
    'Develop a mobile application that matches users by preferred age range, interested gender, travel style, lifestyle, interests, and distance.',
    'Build communication features that strengthen relationships through chat and in-app activities.',
    'Design a date-place recommendation and appointment system that unlocks when relationship criteria are met.',
    'Develop post-date satisfaction reviews for both users.',
    'Add safety features that help users feel confident when meeting offline.',
  ],
  process:
    'The team began by discussing topics each member was interested in, then analyzed shared strengths and motivation. Chat2Date was selected because it aligned with the team’s interests and could be expanded into a complete multi-module system.',
  highlights: [
    'Real-time face verification with liveness checks and ID-card comparison to reduce fake profiles.',
    'Matching based on interests, lifestyle, travel style, and adjustable GPS distance.',
    'Relationship scoring used to unlock date features and encourage shared experiences.',
    'Date-place recommendations, appointment scheduling, and reminders before the date.',
    'Chat, guessing games, relationship bars, and heart levels up to the rainbow heart.',
    'Real-time navigation to the meeting point with SOS and report features for safety.',
    'Post-date satisfaction reviews to help manage the relationship status.',
  ],
  challenges: [
    { title: 'Face Verification', description: 'The team needed to study real-time face checks, ID-card comparison, and anti-fake-profile verification flows.' },
    { title: 'Game AI', description: 'The system needed a careful approach for analyzing conversations and generating questions or games without exposing private data.' },
    { title: 'GPS-based Filtering', description: 'Distance filtering had to be accurate, safe, and responsive to real-time GPS updates.' },
    { title: 'AI Context & Privacy', description: 'System logs and private conversations needed to be separated, with personal data masked before AI processing.' },
    { title: 'WebSocket Stability', description: 'Critical real-time actions had to be ordered safely to prevent conflicting chat or game states under concurrent usage.' },
    { title: 'Relationship & Decay Scoring', description: 'The scoring formula needed to support relationship decay, notifications, and automatic relationship handling.' },
    { title: 'Workload Integration', description: 'Multiple subsystems had to be integrated within limited time without harming stability or user experience.' },
    { title: 'External API Constraints', description: 'The system needed to manage third-party API limits and budget while keeping recommendations reliable.' },
  ],
  feasibility:
    'Feasibility will be validated through mini projects focusing on Face Verification, AI Matching, and GPS-based Filtering before integrating them into the main system.',
  targetAudience:
    'Thai singles living in Thailand, aged 18 or above, who want to chat, get to know someone, and potentially meet or go on dates safely.',
  systemOverview: [
    'The system filters matches using profile preferences, interests, lifestyle, travel style, and real distance settings.',
    'Relationship value is tracked from chat and in-app activities, then used to unlock dating features at the right level.',
    'Date-day support includes place recommendations, scheduling, calendar reminders, navigation, location sharing, and SOS.',
    'Post-date reviews help reflect the quality of the experience and guide the relationship status afterward.',
  ],
  workflow: [
    'Users register, complete their profile, verify their face, and set dating preferences.',
    'The system searches matches by age range, gender interest, interests, travel style, lifestyle, and GPS distance.',
    'Users choose a match and start building the relationship through chat or guessing games.',
    'When relationship bars reach 1, 2, and 3 hearts, date frequency and features unlock progressively.',
    'Users agree on a place, schedule a date, save it to the calendar, and receive a reminder one day before.',
    'On date day, users can share location, navigate, use SOS, and report inappropriate behavior.',
  ],
  features: {
    users: [
      'Register and sign in',
      'Discover and match users',
      'Chat and play guessing games',
      'Get date-place recommendations, schedule dates, and review after dating',
      'Use safety features such as report, block, location sharing, and SOS',
    ],
    admin: [
      'Manage users and reported content',
      'Monitor unusual activities and safety functions',
      'Analyze feedback to improve the system',
    ],
  },
};

const YIP_INVOICE_TH: LocalizedFeaturedContent = {
  subtitle: 'ระบบบริการ e-Tax invoice จากประสบการณ์ Internship 6 เดือน',
  overview:
    'YIP-Invoice-Service เป็นระบบบริการ e-Tax invoice ที่ทำในช่วง Internship 6 เดือน โครงสร้างระบบแยกเป็นหลายบริการสำหรับจัดการคำขอใบกำกับภาษี สร้างเอกสาร PDF สร้างข้อมูล XML ลงลายเซ็นเอกสาร ประมวลผลผ่าน queue ส่งอีเมล จัดเก็บไฟล์ และรองรับการติดตามสถานะบริการ',
  problemStatement: [
    'กระบวนการ e-Tax invoice มีหลายขั้นตอนที่ต้องทำงานต่อเนื่องและน่าเชื่อถือ เช่น การ render template, สร้าง XML, ลงลายเซ็น, จัดเก็บไฟล์, ประมวลผลแบบ async และส่งอีเมล',
    'การแยกความรับผิดชอบออกเป็น service ย่อยช่วยให้ระบบดูแลรักษาง่ายขึ้น ทดสอบง่ายขึ้น และลดความเสี่ยงจาก backend ขนาดใหญ่ที่รวมทุกอย่างไว้ในจุดเดียว',
  ],
  objectives: [
    'พัฒนาและดูแล backend services สำหรับกระบวนการ e-Tax invoice ในช่วง internship',
    'แยกหน้าที่ของ PDF, XML, signature, email, file storage, queue listener และ orchestration ให้ชัดเจน',
    'รองรับ upload, download, storage และ delivery flow ของเอกสารภาษีที่ถูกสร้างขึ้น',
    'ปรับโครงสร้าง service เช่น remove Tomcat และ refactor logic ที่เกี่ยวข้องกับ shared infrastructure',
    'ใช้ Docker Compose และ monitoring support เพื่อช่วยให้การรันและดูแล service สะดวกขึ้น',
  ],
  process:
    'งานนี้เป็นส่วนหนึ่งของ Internship 6 เดือน โดยเริ่มจากการทำความเข้าใจโครงสร้างบริการเดิม ปรับปรุง service รายตัว เพิ่ม upload/download behavior, sign PDF document, refactor file storage จาก MinIO ไปสู่ local storage และทำให้บริการหลายตัวทำงานร่วมกันผ่าน shared libraries และ compose configuration',
  highlights: [
    'โครงสร้าง backend แบบหลายบริการ ประกอบด้วย orchestrator, PDF, XML, signature, queue listener, email และ file storage services',
    'PDF template service สำหรับ render เอกสารจากหลาย template',
    'Signature service รองรับ upload และ download ของเอกสารที่ผ่านการลงลายเซ็น',
    'Queue listener service สำหรับประมวลผล async ระหว่างบริการที่เกี่ยวข้องกับ invoice',
    'File server service สำหรับจัดเก็บและเรียกดูเอกสาร e-Tax',
    'มีส่วน Prometheus สำหรับเตรียมติดตามพฤติกรรมของบริการ',
    'ใช้ shared libraries และ Docker Compose เพื่อให้ service ทำงานใน local environment ได้สอดคล้องกัน',
  ],
  challenges: [
    { title: 'Service Boundaries', description: 'ต้องแยกขอบเขตของแต่ละบริการให้ชัดเจน เพื่อไม่ให้ logic ของ PDF, XML, signing, email, queue และ storage ปนกัน' },
    { title: 'Template Reliability', description: 'การ render PDF template ต้องรองรับหลาย template และยังรักษาความถูกต้องของเอกสาร' },
    { title: 'Digital Signature Flow', description: 'การลงลายเซ็น PDF ต้องจัดการ upload, download และสถานะของเอกสารอย่างรอบคอบ' },
    { title: 'Queue Processing', description: 'งานแบบ asynchronous ต้องส่งต่อ context ระหว่าง service ได้โดยไม่ทำให้ขั้นตอน invoice ขาดหาย' },
    { title: 'Storage Refactor', description: 'ต้อง refactor file storage จาก MinIO ไปสู่ local storage โดยไม่กระทบ behavior หลักของบริการ' },
    { title: 'Deployment Consistency', description: 'หลายบริการต้องใช้ config, environment, shared libraries และ Docker Compose ให้สอดคล้องกัน' },
  ],
  feasibility:
    'ขอบเขตงานเหมาะสมกับ internship เพราะแบ่งงานออกเป็น service ย่อย ทำให้สามารถปรับปรุงและส่งมอบได้ทีละส่วน โดยไม่ต้อง rewrite ระบบทั้งหมดในครั้งเดียว',
  targetAudience:
    'ผู้ใช้งานภายในและทีม backend/operator ที่ต้องการกระบวนการสร้าง ลงลายเซ็น จัดเก็บ และส่งมอบเอกสาร e-Tax invoice ที่น่าเชื่อถือ',
  systemOverview: [
    'Orchestrator service ทำหน้าที่ประสานคำขอ invoice และกระจายงานไปยัง service เฉพาะทาง',
    'PDF และ PDF template services สร้างเอกสารจาก template ใบกำกับภาษีที่กำหนด',
    'XML และ signature services เตรียมข้อมูลภาษีในรูปแบบ XML และเอกสารที่ผ่านการลงลายเซ็น',
    'Queue listener, email service และ file server ดูแลงาน async, การส่งมอบเอกสาร, การจัดเก็บไฟล์ และการเรียกดูเอกสาร',
  ],
  workflow: [
    'Invoice data ถูกส่งเข้าสู่ orchestrator service',
    'PDF template service เตรียม template เอกสารที่ถูกต้อง',
    'PDF และ XML services สร้าง output สำหรับเอกสารภาษี',
    'Signature service ลงลายเซ็นให้เอกสารที่สร้างขึ้น',
    'Queue listener ประสานงานต่อแบบ asynchronous',
    'File server และ email service จัดเก็บและส่งมอบเอกสารปลายทาง',
  ],
  features: {
    users: [
      'สร้างเอกสาร e-Tax invoice',
      'Render PDF จาก template',
      'สร้าง XML data สำหรับกระบวนการใบกำกับภาษี',
      'ลงลายเซ็นเอกสาร PDF',
      'จัดเก็บ upload download และส่งมอบไฟล์',
    ],
    admin: [
      'ติดตามพฤติกรรมของ service',
      'ดูแล environment และ compose configuration',
      'ดูแล shared libraries ที่ใช้ร่วมกันระหว่างบริการ',
    ],
  },
};

const PETSTORY_EN: LocalizedFeaturedContent = {
  subtitle: 'Pet care platform with Instagram-style social feed, daily missions, and health tracking',
  overview:
    'PetStory is a platform for pet owners that combines an Instagram-style social feed, daily mission gamification, and health tracking in one application. Users can create pet profiles, log daily care activities such as feeding, walking, mood, and weight, complete missions to earn EXP and level up their pets, share feed and story posts, track vaccines and medication, receive important reminders, and connect with other pet owners through a community-driven experience.',
  problemStatement: [
    'Pet owners often want a reliable way to record pet care activities for future reference, but existing tools are usually just simple diaries or lack long-term motivation.',
    'Pet health management requires tracking multiple factors such as food, weight, vaccines, and medication, while important reminders are often forgotten over time.',
    'Pet owners also want a space to share the joy of raising pets and connect with a like-minded community.',
  ],
  objectives: [
    'Build an application where pet owners can log daily care activities such as feeding, walking, mood, and weight in one unified flow.',
    'Create a daily mission system that motivates users through EXP and a pet leveling mechanic.',
    'Develop a health system that includes weight tracking, vaccine management, medicine reminders, and health alerts.',
    'Develop social features such as feed, story, like, comment, and follow to support community interaction.',
    'Create a moments feature for preserving birthdays, adoption dates, and other meaningful milestones.',
  ],
  process:
    'The team analyzed the needs of real pet owners and observed how people interact with social media and health tracking apps. Based on those insights, we integrated gamification to improve daily engagement and separated the system into clear domains such as Auth, Pet, Mission, Health, and Social for smoother development.',
  highlights: [
    'All-in-one care logging for feeding, walking, mood, and weight in a single workflow',
    'Daily mission system with EXP rewards and pet level-up progression',
    'Complete health tracking with weight history, vaccine CRUD, medicine reminders, and health alerts',
    'Social features including feed and story posts, likes, comments, deletion, follow, and unfollow',
    'Moments for pinning important dates such as birthdays, adoption days, and special memories',
    'User search, followers and following lists, and theme settings',
    'Image upload support for both local storage and Cloudinary unsigned upload',
    'Admin dashboard for user management, post moderation, and activity monitoring',
  ],
  challenges: [
    { title: 'Mission Generation Logic', description: 'The mission system needed an algorithm that could generate realistic and relevant care tasks for different pet types.' },
    { title: 'EXP & Level System', description: 'The EXP formula had to feel rewarding without making progression too fast or too slow.' },
    { title: 'Health Data Integrity', description: 'Weight history, vaccine records, and medicine reminders had to remain chronologically accurate and consistent.' },
    { title: 'Care Log Schema Design', description: 'A single schema had to efficiently support feeding, walking, mood, and weight data together.' },
    { title: 'Social Feed Performance', description: 'Post, like, and comment loading needed pagination and performance tuning as data volume increased.' },
    { title: 'Image Storage Management', description: 'The upload flow needed to support both local storage and Cloudinary reliably.' },
    { title: 'JWT Token Management', description: 'Token expiration, refresh flow, and logout handling had to work correctly across frontend and backend.' },
  ],
  feasibility:
    'The project was highly feasible because each core idea already existed in proven products, whether social platforms, health apps, or gamified systems. The team focused on integrating these parts into one cohesive experience while testing edge cases such as multiple pets, timezone issues, and concurrent updates.',
  targetAudience:
    'The target audience is Thai pet owners aged 15 and above who want to record pet care, track health, share pet profiles, and connect with other pet lovers in a community setting.',
  systemOverview: [
    'Authentication flow with JWT token exchange for identity verification and access control',
    'Pet profile system for storing name, breed, age, birthday, adoption date, weight, biography, level, and EXP',
    'Unified care log system for feeding, walking, mood, and weight tracking',
    'Daily mission system that generates activities and rewards EXP for pet progression',
    'Health management system for weight history, vaccine records, medicine reminders, and alerts',
    'Social system supporting feed and story posts, likes, comments, follow and unfollow, and user search',
    'Moments system for preserving important life events of each pet',
    'Theme settings and user profile customization',
  ],
  workflow: [
    'Users register and sign in with email and password',
    'They create one or more pet profiles with images and basic information',
    'The system generates daily missions such as feeding, walking, mood check, and weight tracking',
    'Users log care activities through missions or manual entries and level up their pets when EXP is full',
    'They track health through weight history, vaccine dates, and medicine reminders',
    'Users create and share feed or story posts, then like and comment on other posts',
    'They follow or unfollow other users, search for friends, and view followers and following lists',
    'They pin important moments such as birthdays, adoption dates, and special events',
    'They customize themes and manage personal profile settings',
  ],
  features: {
    users: [
      'Register, sign in, and edit profile',
      'Create and manage pet profiles',
      'Complete daily missions and earn EXP',
      'Log care activities such as feeding, walking, mood, and weight',
      'Track health through weight, vaccines, medication, and alerts',
      'Create and share feed and story posts',
      'Follow users, like posts, comment, and search for friends',
      'Pin important moments',
      'Upload images',
      'Customize theme settings',
    ],
    admin: [
      'View overall system summaries',
      'Manage user accounts, including blocking, approval, and inspection',
      'Moderate posts with approve and reject actions',
      'Monitor user activity and detect suspicious behavior',
    ],
  },
};

const RELATIONSHIP_STAGES: Record<DetailLang, { label: string; value: number; note: string }[]> = {
  th: [
    { label: 'Match', value: 100, note: 'เริ่มจับคู่จากโปรไฟล์และระยะทาง' },
    { label: 'Chat', value: 100, note: 'สร้างความสัมพันธ์ผ่านแชตและเกม' },
    { label: 'Date Unlock', value: 100, note: 'ปลดล็อกการนัดหมายเมื่อถึงเกณฑ์' },
    { label: 'Safety Review', value: 100, note: 'แชร์พิกัด SOS และประเมินหลังเดต' },
  ],
  en: [
    { label: 'Match', value: 100, note: 'Start matching from profile data and distance.' },
    { label: 'Chat', value: 100, note: 'Build the relationship through chat and games.' },
    { label: 'Date Unlock', value: 100, note: 'Unlock date features when criteria are reached.' },
    { label: 'Safety Review', value: 100, note: 'Use location sharing, SOS, and post-date reviews.' },
  ],
};

const PROJECT_STAGE_FALLBACKS: Record<string, Record<DetailLang, { label: string; value: number; note: string }[]>> = {
  petstory: {
    th: [
      { label: 'Care Log', value: 100, note: 'บันทึกการดูแลสัตว์เลี้ยงใน workflow เดียว' },
      { label: 'Mission', value: 100, note: 'ทำภารกิจรายวันเพื่อรับ EXP และยกระดับสัตว์เลี้ยง' },
      { label: 'Health', value: 100, note: 'ติดตามน้ำหนัก วัคซีน ยา และการแจ้งเตือน' },
      { label: 'Social Feed', value: 100, note: 'แชร์โพสต์ ติดตามผู้ใช้ และบันทึกช่วงเวลาสำคัญ' },
    ],
    en: [
      { label: 'Care Log', value: 100, note: 'Track pet care activities in one unified workflow.' },
      { label: 'Mission', value: 100, note: 'Complete daily missions to earn EXP and level up pets.' },
      { label: 'Health', value: 100, note: 'Monitor weight, vaccines, medicine, and reminders.' },
      { label: 'Social Feed', value: 100, note: 'Share posts, follow users, and preserve important moments.' },
    ],
  },
  'yip-invoice-service': {
    th: [
      { label: 'Orchestrate', value: 100, note: 'รับคำขอและกระจายงานให้บริการที่เกี่ยวข้อง' },
      { label: 'Generate', value: 100, note: 'สร้าง PDF และ XML จากข้อมูลใบกำกับภาษี' },
      { label: 'Sign', value: 100, note: 'ลงลายเซ็นเอกสารและจัดการไฟล์ที่เกี่ยวข้อง' },
      { label: 'Deliver', value: 100, note: 'จัดเก็บ ส่งอีเมล และรองรับการติดตามสถานะบริการ' },
    ],
    en: [
      { label: 'Orchestrate', value: 100, note: 'Receive requests and coordinate work across services.' },
      { label: 'Generate', value: 100, note: 'Generate PDF and XML outputs from invoice data.' },
      { label: 'Sign', value: 100, note: 'Sign documents and manage related files.' },
      { label: 'Deliver', value: 100, note: 'Store, email, and monitor generated documents.' },
    ],
  },
};

const PROJECT_HERO_TAGS: Record<string, string[]> = {
  chat2date: ['Matching', 'Real-time Chat', 'Date Unlock', 'SOS Safety'],
  petstory: ['Care Log', 'Daily Mission', 'Health Tracker', 'Social Feed'],
  'yip-invoice-service': ['Orchestrator', 'PDF/XML', 'Signature', 'Email Queue'],
};

const YIP_SIMULATION: Record<DetailLang, {
  intro: string;
  inputLabel: string;
  outputLabel: string;
  services: {
    id: string;
    name: string;
    role: string;
    input: string;
    output: string;
    status: string;
  }[];
}> = {
  en: {
    intro: 'A safe portfolio simulation of the e-Tax invoice service flow, using generalized service names and no internal company screenshots.',
    inputLabel: 'Sample invoice payload',
    outputLabel: 'Generated signed e-Tax document package',
    services: [
      { id: 'orchestrator', name: 'Orchestrator', role: 'Receives invoice requests and decides which service should process the next step.', input: 'Invoice request + customer/tax metadata', output: 'Routed processing job', status: 'Routing request' },
      { id: 'template', name: 'PDF Template', role: 'Selects and renders the correct invoice template before PDF generation.', input: 'Template id + invoice data', output: 'Renderable document layout', status: 'Preparing template' },
      { id: 'pdfxml', name: 'PDF / XML', role: 'Generates human-readable PDF and machine-readable XML outputs for the invoice.', input: 'Prepared layout + tax fields', output: 'PDF file + XML file', status: 'Generating files' },
      { id: 'signature', name: 'Signature', role: 'Applies document signing flow and prepares the signed output for storage.', input: 'PDF/XML document package', output: 'Signed document package', status: 'Signing document' },
      { id: 'queue', name: 'Queue Listener', role: 'Handles asynchronous follow-up work so the request does not block the main flow.', input: 'Signed package event', output: 'Delivery/storage task', status: 'Processing queue' },
      { id: 'delivery', name: 'Email & Storage', role: 'Stores the final documents and sends delivery notifications when required.', input: 'Delivery/storage task', output: 'Stored file + email notification', status: 'Delivering output' },
    ],
  },
  th: {
    intro: 'ระบบจำลอง flow ของ e-Tax invoice สำหรับ portfolio โดยใช้ชื่อ service แบบทั่วไปและไม่ใช้ screenshot ภายในบริษัท',
    inputLabel: 'ตัวอย่างข้อมูลใบกำกับภาษี',
    outputLabel: 'ชุดเอกสาร e-Tax ที่สร้างและลงลายเซ็นแล้ว',
    services: [
      { id: 'orchestrator', name: 'Orchestrator', role: 'รับคำขอ invoice และตัดสินใจว่าจะส่งต่อให้ service ไหนทำงานขั้นถัดไป', input: 'Invoice request + customer/tax metadata', output: 'Routed processing job', status: 'Routing request' },
      { id: 'template', name: 'PDF Template', role: 'เลือกและ render template ใบกำกับภาษีก่อนเข้าสู่ขั้นตอนสร้าง PDF', input: 'Template id + invoice data', output: 'Renderable document layout', status: 'Preparing template' },
      { id: 'pdfxml', name: 'PDF / XML', role: 'สร้างเอกสาร PDF สำหรับอ่านและ XML สำหรับข้อมูลภาษีในระบบ', input: 'Prepared layout + tax fields', output: 'PDF file + XML file', status: 'Generating files' },
      { id: 'signature', name: 'Signature', role: 'ลงลายเซ็นเอกสารและเตรียม output ที่ผ่านการลงลายเซ็นแล้ว', input: 'PDF/XML document package', output: 'Signed document package', status: 'Signing document' },
      { id: 'queue', name: 'Queue Listener', role: 'จัดการงานต่อแบบ asynchronous เพื่อลดการ block main flow', input: 'Signed package event', output: 'Delivery/storage task', status: 'Processing queue' },
      { id: 'delivery', name: 'Email & Storage', role: 'จัดเก็บเอกสารปลายทางและส่ง notification/email เมื่อจำเป็น', input: 'Delivery/storage task', output: 'Stored file + email notification', status: 'Delivering output' },
    ],
  },
};

function getLocalizedFeaturedData(data: FeaturedProjectData, lang: DetailLang): FeaturedProjectData {
  if (lang === 'en' && data.id === 'chat2date') return { ...data, ...CHAT2DATE_EN };
  if (lang === 'en' && data.id === 'petstory') return { ...data, ...PETSTORY_EN };
  if (lang === 'th' && data.id === 'yip-invoice-service') return { ...data, ...YIP_INVOICE_TH };
  return data;
}

function getYoutubeEmbedUrl(url?: string) {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.replace('/', '')
      : parsed.searchParams.get('v');
    if (!id) return undefined;

    const startRaw = parsed.searchParams.get('t');
    const start = startRaw?.endsWith('s') ? startRaw.slice(0, -1) : startRaw;
    const startQuery = start && Number.isFinite(Number(start)) ? `?start=${start}` : '';
    return `https://www.youtube.com/embed/${id}${startQuery}`;
  } catch {
    return undefined;
  }
}

function FeaturedDetail({ data, onBack }: { data: FeaturedProjectData; onBack: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lang, setLang] = useState<DetailLang>('en');
  const [activeSimStep, setActiveSimStep] = useState(0);
  const images = data.images ?? [];
  const content = getLocalizedFeaturedData(data, lang);
  const isEnglish = lang === 'en';
  const simulation = data.id === 'yip-invoice-service' ? YIP_SIMULATION[lang] : undefined;

  useEffect(() => {
    document.title = `FUJIPP | ${data.title}`;
    return () => { document.title = 'FUJIPP | PROJECTS'; };
  }, [data.title]);

  const hasLinks = content.links.figma || content.links.live;
  const youtubeEmbedUrl = getYoutubeEmbedUrl(data.links.youtube);
  const stageItems = PROJECT_STAGE_FALLBACKS[data.id]?.[lang] ?? RELATIONSHIP_STAGES[lang];
  const heroTags = PROJECT_HERO_TAGS[data.id] ?? ['Core System', 'Workflow', 'Architecture', 'Delivery'];
  const projectNote = data.id === 'yip-invoice-service'
    ? (isEnglish ? 'Completed during a 6-month internship' : 'พัฒนาระหว่างฝึกงาน 6 เดือน')
    : (isEnglish ? 'Completed unpaid Senior Project' : 'Senior Project ที่จบแล้วและไม่ได้รับค่าตอบแทน');
  const projectStats = [
    { label: isEnglish ? 'Core Roles' : 'บทบาทหลัก', value: content.features ? '2' : '1' },
    { label: isEnglish ? 'Main Modules' : 'โมดูลหลัก', value: String(content.highlights?.length ?? content.infrastructure.length) },
    { label: isEnglish ? 'Challenge Areas' : 'ความท้าทาย', value: String(content.challenges?.length ?? 0) },
    { label: isEnglish ? 'Stack Groups' : 'กลุ่มเทคโนโลยี', value: String(content.techStack.length) },
  ];
  const activeService = simulation?.services[activeSimStep] ?? simulation?.services[0];

  function prevImg() { setImgIdx((i) => (i - 1 + images.length) % images.length); }
  function nextImg() { setImgIdx((i) => (i + 1) % images.length); }

  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.05 }}
        >
          <div className={styles.heroText}>
            <div className={styles.badges}>
              <span className={`${styles.catBadge} ${styles.catFullstack}`}>Full Stack</span>
              <span className={`${styles.statusBadge} ${styles.dotActive}`}>● Active</span>
            </div>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.heroDescription}>{content.subtitle} · {content.year}</p>
            <p className={styles.heroLead}>{content.overview}</p>
            <div className={styles.heroControls}>
              <div className={styles.langToggle} aria-label="Project detail language">
                <button
                  type="button"
                  className={`${styles.langBtn} ${lang === 'th' ? styles.langBtnActive : ''}`}
                  onClick={() => setLang('th')}
                >
                  TH
                </button>
                <button
                  type="button"
                  className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
              </div>
              <span className={styles.heroNote}>
                {projectNote}
              </span>
            </div>
            {hasLinks && (
              <div className={styles.heroActions}>
                {content.links.figma && (
                  <a href={content.links.figma} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.linkBtnFigma}`}>
                    <SiFigma size={13} /> Figma Design <ExternalLink size={11} />
                  </a>
                )}
              </div>
            )}
          </div>
          <aside className={styles.heroVisual} aria-label={`${data.title} brand preview`}>
            <div className={styles.brandStage}>
              {data.logo && (
                <img src={data.logo} alt={`${data.title} logo`} className={styles.projectLogo} />
              )}
              {!data.logo && (data.certificateImage || data.architectureImage) && (
                <img
                  src={data.certificateImage ?? data.architectureImage}
                  alt={data.certificateImage ? `${data.title} internship certificate` : `${data.title} architecture`}
                  className={data.certificateImage ? styles.heroCertificateImage : styles.heroArchitectureImage}
                />
              )}
            </div>
            <div className={styles.heroMiniGrid} aria-hidden>
              {heroTags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </aside>
        </motion.div>
      </section>

      {/* ── Body ── */}
      <motion.div
        className={styles.backRow}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.25 }}
      >
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to Projects
        </button>
      </motion.div>

      <div className={styles.featuredLayout}>

        {/* ── Overview ── */}
        <motion.section
          className={`${styles.featuredSection} ${styles.overviewSection}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
        >
          <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'OVERVIEW' : 'ภาพรวม'}</p>
          <div className={`${styles.showcaseGrid} ${!youtubeEmbedUrl ? styles.showcaseGridSolo : ''}`}>
            <div className={styles.showcaseInfo}>
              <div className={styles.statsStrip}>
                {projectStats.map((stat) => (
                  <div key={stat.label} className={styles.statTile}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryGrid}>
                {content.targetAudience && (
                  <article className={styles.summaryCard}>
                    <UsersRound size={18} strokeWidth={2} />
                    <p className={styles.summaryLabel}>{isEnglish ? 'Target Users' : 'กลุ่มเป้าหมาย'}</p>
                    <p className={styles.summaryText}>{content.targetAudience}</p>
                  </article>
                )}
                {content.feasibility && (
                  <article className={styles.summaryCard}>
                    <Target size={18} strokeWidth={2} />
                    <p className={styles.summaryLabel}>{isEnglish ? 'Feasibility' : 'ความเป็นไปได้'}</p>
                    <p className={styles.summaryText}>{content.feasibility}</p>
                  </article>
                )}
              </div>
              <p className={styles.noSourceNote}>
                {projectNote}
              </p>
            </div>

            {youtubeEmbedUrl && (
              <article className={styles.videoPreview}>
                <div className={styles.videoHeader}>
                  <span className={styles.videoIcon}>
                    {data.appIcon ? (
                      <img src={data.appIcon} alt="" className={styles.videoIconImage} />
                    ) : (
                      <Youtube size={15} strokeWidth={2.4} />
                    )}
                  </span>
                  <div>
                    <p className={styles.videoTitle}>{isEnglish ? 'Project Demo Preview' : 'พรีวิวเดโมโปรเจกต์'}</p>
                    <p className={styles.videoMeta}>{isEnglish ? 'Play the demo directly on this page.' : 'กดเล่นเพื่อดู demo ได้ในหน้านี้'}</p>
                  </div>
                </div>
                <div className={styles.videoFrame}>
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`${data.title} YouTube demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </article>
            )}
          </div>
        </motion.section>

        {content.problemStatement && (
          <motion.section
            className={`${styles.featuredSection} ${styles.halfSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.12 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'BACKGROUND & PROBLEM' : 'ที่มาและปัญหา'}</p>
            <div className={styles.proseBlock}>
              {content.problemStatement.map((paragraph) => (
                <p key={paragraph} className={styles.featuredOverview}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        )}

        {content.objectives && (
          <motion.section
            className={`${styles.featuredSection} ${styles.halfSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.14 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'OBJECTIVES' : 'วัตถุประสงค์'}</p>
            <ul className={styles.cleanList}>
              {content.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </motion.section>
        )}

        {content.highlights && (
          <motion.section
            className={`${styles.featuredSection} ${styles.wideSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.16 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'SYSTEM HIGHLIGHTS' : 'จุดเด่นของระบบ'}</p>
            <div className={styles.featureGrid}>
              {content.highlights.map((highlight, index) => {
                const Icon = FEATURE_ICON_POOL[index % FEATURE_ICON_POOL.length];
                return (
                  <article key={highlight} className={styles.featureCard}>
                    <span className={styles.featureIcon}><Icon size={17} strokeWidth={2.3} /></span>
                    <p>{highlight}</p>
                  </article>
                );
              })}
            </div>
          </motion.section>
        )}

        {(content.systemOverview || content.workflow) && (
          <motion.section
            className={`${styles.featuredSection} ${styles.proposedSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.18 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'PROPOSED SYSTEM' : 'ระบบที่นำเสนอ'}</p>
            {content.systemOverview && (
              <div className={styles.proseBlock}>
                {content.systemOverview.map((paragraph) => (
                  <p key={paragraph} className={styles.featuredOverview}>{paragraph}</p>
                ))}
              </div>
            )}
            {content.workflow && (
              <ol className={styles.timelineList}>
                {content.workflow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
            <div className={styles.relationshipGraph} aria-label="Relationship unlock flow">
              {stageItems.map((stage) => (
                <article key={stage.label} className={styles.graphStep}>
                  <div className={styles.graphTop}>
                    <span className={styles.graphLabel}>{stage.label}</span>
                    <span className={styles.graphValue}>{stage.value}%</span>
                  </div>
                  <span className={styles.graphTrack}>
                    <span style={{ width: `${stage.value}%` }} />
                  </span>
                  <p>{stage.note}</p>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {simulation && activeService && (
          <motion.section
            className={`${styles.featuredSection} ${styles.wideSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.19 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'SERVICE FLOW SIMULATION' : 'ระบบจำลอง SERVICE FLOW'}</p>
            <div className={styles.simulatorShell}>
              <div className={styles.simulatorCanvas}>
                <div className={styles.simulatorEndpoint}>
                  <span className={styles.simulatorEndpointLabel}>{isEnglish ? 'Input' : 'ข้อมูลเข้า'}</span>
                  <strong>{simulation.inputLabel}</strong>
                </div>
                <div className={styles.simulatorNodes}>
                  {simulation.services.map((service, index) => (
                    <button
                      key={service.id}
                      type="button"
                      className={`${styles.simulatorNode} ${index === activeSimStep ? styles.simulatorNodeActive : ''}`}
                      onClick={() => setActiveSimStep(index)}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {service.name}
                    </button>
                  ))}
                </div>
                <div className={styles.simulatorEndpoint}>
                  <span className={styles.simulatorEndpointLabel}>{isEnglish ? 'Output' : 'ผลลัพธ์'}</span>
                  <strong>{simulation.outputLabel}</strong>
                </div>
              </div>
              <article className={styles.simulatorDetail}>
                <p className={styles.simulatorIntro}>{simulation.intro}</p>
                <div className={styles.simulatorStatus}>
                  <span>{activeService.status}</span>
                </div>
                <h3>{activeService.name}</h3>
                <p>{activeService.role}</p>
                <div className={styles.simulatorIoGrid}>
                  <div>
                    <span>{isEnglish ? 'Receives' : 'รับข้อมูล'}</span>
                    <strong>{activeService.input}</strong>
                  </div>
                  <div>
                    <span>{isEnglish ? 'Produces' : 'ส่งออก'}</span>
                    <strong>{activeService.output}</strong>
                  </div>
                </div>
              </article>
            </div>
          </motion.section>
        )}

        {content.features && (
          <motion.section
            className={`${styles.featuredSection} ${styles.halfSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.2 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'FEATURE REQUIREMENTS' : 'ฟีเจอร์หลัก'}</p>
            <div className={styles.roleGrid}>
              <article className={styles.roleCard}>
                <p className={styles.roleTitle}>General Users</p>
                <ul className={styles.compactList}>
                  {content.features.users.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </article>
              <article className={styles.roleCard}>
                <p className={styles.roleTitle}>Admin</p>
                <ul className={styles.compactList}>
                  {content.features.admin.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </article>
            </div>
          </motion.section>
        )}

        {content.process && (
          <motion.section
            className={`${styles.featuredSection} ${styles.halfSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.22 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'PROJECT TOPIC PROCESS' : 'กระบวนการได้มาซึ่งหัวข้อ'}</p>
            <p className={styles.featuredOverview}>{content.process}</p>
          </motion.section>
        )}

        {/* ── Infrastructure ── */}
        <motion.section
          className={`${styles.featuredSection} ${styles.infraSection}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.15 }}
        >
          <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />INFRASTRUCTURE</p>
          <div className={styles.infraFlow}>
            {content.infrastructure.map((layer: InfraLayer) => (
              <Fragment key={layer.label}>
                <div className={styles.infraLayer}>
                  <p className={styles.infraLayerLabel}>{layer.label}</p>
                  <div className={styles.infraItems}>
                    {layer.items.map((item) => (
                      <span key={item} className={styles.infraItem}>{item}</span>
                    ))}
                  </div>
                </div>
                {layer.connector && (
                  <div className={styles.infraConnector} aria-hidden>
                    <span className={styles.infraConnectorLine} />
                    <span className={styles.infraConnectorLabel}>{layer.connector}</span>
                    <span className={styles.infraConnectorLine} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </motion.section>

        {content.architectureImage && (
          <motion.section
            className={`${styles.featuredSection} ${styles.archSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.18 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} /><ImageIcon size={11} strokeWidth={2.5} />SYSTEM ARCHITECTURE</p>
            <figure className={styles.architectureFigure}>
              <img src={content.architectureImage} alt={`${content.title} system architecture`} className={styles.architectureImage} />
              <figcaption>
                {isEnglish
                  ? 'Chat2Date system architecture overview across client, backend, database, third-party services, and infrastructure.'
                  : 'ภาพรวมสถาปัตยกรรมระบบ Chat2Date ตั้งแต่ client, backend, database, third-party services และ infrastructure'}
              </figcaption>
            </figure>
          </motion.section>
        )}

        {content.challenges && (
          <motion.section
            className={`${styles.featuredSection} ${styles.wideSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.19 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />{isEnglish ? 'CHALLENGES' : 'ความท้าทาย'}</p>
            <div className={styles.challengeGrid}>
              {content.challenges.map((challenge) => (
                <article key={challenge.title} className={styles.challengeCard}>
                  <p className={styles.challengeTitle}>{challenge.title}</p>
                  <p className={styles.challengeDescription}>{challenge.description}</p>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Tech Stack ── */}
        <motion.section
          className={`${styles.featuredSection} ${styles.wideSection}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.2 }}
        >
          <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />TECH STACK</p>
          <div className={styles.techStackGrid}>
            {content.techStack.map((cat) => (
              <div key={cat.category} className={styles.techStackCat}>
                <p className={styles.techStackCatLabel}>{cat.category}</p>
                <div className={styles.techStackItems}>
                  {cat.items.map((item) => {
                    const TechIcon = getTechIcon(item);
                    return (
                      <span key={item} className={styles.techTag}>
                        {TechIcon && <TechIcon className={styles.techIcon} />}
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Screenshots ── */}
        {images.length > 0 && (
          <motion.section
            className={`${styles.featuredSection} ${styles.wideSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.25 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} /><ImageIcon size={11} strokeWidth={2.5} />SCREENSHOTS</p>
            <div className={styles.gallery}>
              <div className={styles.galleryMain}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={images[imgIdx]}
                    alt={`${data.title} screenshot ${imgIdx + 1}`}
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
                    <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={prevImg}><ChevronLeft size={18} strokeWidth={2.5} /></button>
                    <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={nextImg}><ChevronRight size={18} strokeWidth={2.5} /></button>
                    <span className={styles.counter}>{imgIdx + 1} / {images.length}</span>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className={styles.thumbRow}>
                  {images.map((src, i) => (
                    <button
                      key={src}
                      className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
                      onClick={() => setImgIdx(i)}
                    >
                      <img src={src} alt="" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* ── Links ── */}
        {hasLinks && (
          <motion.section
            className={`${styles.featuredSection} ${styles.wideSection}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.3 }}
          >
            <p className={styles.sectionLabel}><span className={styles.sectionLabelDot} />LINKS</p>
            <div className={styles.linkRow}>
              {content.links.figma && (
                <a href={content.links.figma} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.linkBtnFigma}`}>
                  <SiFigma size={13} /> Figma Design <ExternalLink size={11} />
                </a>
              )}
              {content.links.live && (
                <a href={content.links.live} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                  <ExternalLink size={14} strokeWidth={2} /> Live Site
                </a>
              )}
            </div>
          </motion.section>
        )}
      </div>

      <CertificateModal
        open={zoomed}
        imageUrl={images[imgIdx] ?? ''}
        title={data.title}
        onClose={() => setZoomed(false)}
        images={images}
        currentIndex={imgIdx}
        onNavigate={(i) => setImgIdx(i)}
      />
    </main>
  );
}

/* ── Standard project detail layout ─────────── */

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const backUrl = '/projects';

  const cmsState = getProjectCmsState();
  const featuredData = id ? (cmsState.featuredProjects[id] ?? FEATURED_PROJECTS[id]) : undefined;
  const project = PROJECTS.find((p) => p.id === id);

  const [imgIdx, setImgIdx]   = useState(0);
  const [cert, setCert]       = useState<{ image: string; pdf?: string; label: string } | null>(null);
  const [zoomed, setZoomed]   = useState(false);

  const images = project?.images ?? [];

  useEffect(() => {
    if (!project) return;
    document.title = `FUJIPP | ${project.title}`;
    return () => { document.title = 'FUJIPP | PROJECTS'; };
  }, [project]);

  if (featuredData) {
    return <FeaturedDetail data={featuredData} onBack={() => navigate(backUrl)} />;
  }

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
