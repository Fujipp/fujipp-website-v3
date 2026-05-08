import type { ElementType } from 'react';
import { Code2, FolderOpen, Layers, Search, Sparkles } from 'lucide-react';

export type Category =
  | 'all'
  | 'ui-design'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'database'
  | 'library'
  | 'internship'
  | 'discord';

export type ProjectTag =
  | 'featured'
  | 'ui-design'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'database'
  | 'library'
  | 'internship'
  | 'discord'
  | 'microservice'
  | 'mobile'
  | 'ai'
  | 'security'
  | 'docker'
  | 'social'
  | 'health-tracking'
  | 'wip';

export type Status = 'active' | 'archived' | 'wip';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'all'>;
  tags?: ProjectTag[];
  status: Status;
  tech: string[];
  icon: ElementType;
  priority: number;
  featured?: boolean;
  github?: string;
  live?: string;
  certificate?: { image: string; pdf?: string; label: string };
  images?: string[];
  commissioned?: boolean;
}

export interface InfraLayer {
  label: string;
  items: string[];
  connector?: string;
}

export interface FeaturedProjectData {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  template?: 'case-study' | 'internship' | 'backend-service' | 'placeholder';
  tags?: ProjectTag[];
  commissioned?: boolean;
  logo?: string;
  appIcon?: string;
  certificateImage?: string;
  overview: string;
  problemStatement?: string[];
  objectives?: string[];
  process?: string;
  highlights?: string[];
  challenges?: { title: string; description: string }[];
  feasibility?: string;
  targetAudience?: string;
  systemOverview?: string[];
  workflow?: string[];
  features?: {
    users: string[];
    admin: string[];
  };
  infrastructure: InfraLayer[];
  techStack: { category: string; items: string[] }[];
  architectureImage?: string;
  images?: string[];
  links: {
    figma?: string;
    youtube?: string;
    live?: string;
  };
}

export interface TopProject {
  id: string;
  number: string;
  title: string;
  description: string;
  categoryLabel: string;
  status: Status;
  tech: string[];
  accent: 'primary' | 'purple' | 'orange';
  github?: string;
  live?: string;
  detailId?: string;
}

export interface ProjectFolder {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'all'>;
  categoryLabel: string;
  tags: ProjectTag[];
  status: Status;
  year: string;
  tech: string[];
  detailId?: string;
}

export interface ProjectCmsState {
  featuredProjects: Record<string, FeaturedProjectData>;
  topProjects: TopProject[];
  projectFolders: ProjectFolder[];
  projectFolderFilters: { id: 'all' | ProjectTag; label: string }[];
}

export const CATEGORIES: { id: Category; label: string; icon: ElementType }[] = [
  { id: 'all', label: 'All Projects', icon: Layers },
  { id: 'ui-design', label: 'UI Designer', icon: Sparkles },
  { id: 'frontend', label: 'Frontend Only', icon: Code2 },
  { id: 'backend', label: 'Backend Only', icon: Code2 },
  { id: 'fullstack', label: 'Full Stack', icon: Layers },
  { id: 'database', label: 'Database', icon: Search },
  { id: 'library', label: 'Library', icon: FolderOpen },
  { id: 'internship', label: 'Internship', icon: FolderOpen },
  { id: 'discord', label: 'Discord Bot Project', icon: Code2 },
];

export const STATUS_LABEL: Record<Status, string> = {
  active: '● Active',
  archived: '○ Archived',
  wip: '◐ In Progress',
};

export const PROJECTS: Project[] = [];

export const FEATURED_PROJECTS: Record<string, FeaturedProjectData> = {
  'chat2date': {
    id: 'chat2date',
    title: 'Chat2Date',
    subtitle: 'แอปพลิเคชันหาคู่ พูดคุยทำความรู้จัก ก่อนการพบปะนอกสถานที่',
    year: 'Senior Project',
    template: 'case-study',
    tags: ['featured', 'fullstack', 'mobile', 'ai', 'security'],
    commissioned: false,
    logo: '/images/projects/chat2date/v2-logo_chat2date.png',
    appIcon: '/images/projects/chat2date/Chat 2 Date Icon.png',
    overview:
      'Chat2Date คือแพลตฟอร์มหาคู่ที่ไม่ได้หยุดแค่การจับคู่และแชต แต่พาผู้ใช้ไปสู่การนัดพบจริงอย่างมีขั้นตอน ระบบใช้ข้อมูลช่วงอายุ เพศที่สนใจ ไลฟ์สไตล์ ความสนใจ สไตล์การท่องเที่ยว และระยะทาง GPS เพื่อค้นหาคู่ที่เหมาะสม พร้อมระบบแชต เกมทายใจ คะแนนความสัมพันธ์ การแนะนำสถานที่เดต และฟังก์ชันความปลอดภัยระหว่างการนัดพบ',
    problemStatement: [
      'การหาคู่ผ่านช่องทางออนไลน์ได้รับความนิยมมากขึ้น แต่ผู้ใช้จำนวนไม่น้อยยังเจอปัญหาความสัมพันธ์ระยะไกล การขาดไอเดียในการวางแผนกิจกรรมร่วมกัน และการสร้างความผูกพันผ่านแชตเพียงอย่างเดียว',
      'โครงงานนี้จึงออกแบบให้ระบบช่วยคัดกรองคู่ที่มีความเข้ากันได้จริง พร้อมผลักดันความสัมพันธ์ให้เกิดกิจกรรมร่วมกันผ่านการนัดหมาย สถานที่เดต และระบบประเมินหลังออกเดต',
    ],
    objectives: [
      'พัฒนาแอปบนอุปกรณ์พกพาที่ค้นหาคู่จากช่วงอายุ เพศที่สนใจ สไตล์การท่องเที่ยว ไลฟ์สไตล์ ความสนใจ และระยะทาง',
      'พัฒนาระบบแชตและกิจกรรมในแอปเพื่อส่งเสริมความสัมพันธ์ระหว่างผู้ใช้',
      'ออกแบบระบบแนะนำสถานที่เดตและสนับสนุนการนัดหมายเมื่อความสัมพันธ์ถึงเกณฑ์',
      'พัฒนาระบบประเมินความพึงพอใจของคู่เดตหลังออกเดต',
      'เพิ่มฟังก์ชันความปลอดภัยเพื่อให้ผู้ใช้มั่นใจในการนัดพบจริง',
    ],
    process:
      'ทีมเริ่มจากการประชุมเพื่อให้สมาชิกเสนอประเด็นที่สนใจ จากนั้นร่วมกันวิเคราะห์แนวคิดที่ทุกคนมีแรงจูงใจร่วมกัน จนสรุปเป็นหัวข้อ Chat2Date ซึ่งสอดคล้องกับความสนใจของทีมและสามารถต่อยอดเป็นระบบหลายส่วนได้ชัดเจน',
    highlights: [
      'สแกนใบหน้าแบบเรียลไทม์พร้อม liveness และเทียบกับบัตรประชาชนเพื่อลดโปรไฟล์ปลอม',
      'ค้นหาคู่จากความสนใจ ไลฟ์สไตล์ สไตล์การท่องเที่ยว และระยะทาง GPS ที่ปรับได้',
      'ใช้ค่าความสัมพันธ์เป็นตัวปลดล็อกการออกเดตและกระตุ้นให้ผู้ใช้สร้างประสบการณ์ร่วม',
      'แนะนำสถานที่เดต จัดการตารางนัดหมาย และแจ้งเตือนก่อนวันออกเดต',
      'มีแชต เกมทายใจ หลอดสถานะ และระดับหัวใจสูงสุดเป็นหัวใจรุ้ง',
      'นำทางไปจุดนัดพบแบบเรียลไทม์ พร้อมปุ่ม SOS และระบบรายงานเพื่อความปลอดภัย',
      'ประเมินความพึงพอใจหลังเดตเพื่อช่วยจัดการสถานะความสัมพันธ์',
    ],
    challenges: [
      { title: 'Face Verification', description: 'ต้องศึกษาและทดสอบการตรวจสอบใบหน้า เปรียบเทียบกับข้อมูลบัตรประชาชน และลดโอกาสการสร้างโปรไฟล์ปลอม' },
      { title: 'Game AI', description: 'ต้องออกแบบแนวทางให้ AI วิเคราะห์บทสนทนาและสร้างคำถามหรือเกมได้อย่างเหมาะสมโดยไม่ละเมิดความเป็นส่วนตัว' },
      { title: 'GPS-based Filtering', description: 'ต้องคำนวณระยะทางจากตำแหน่งจริงให้แม่นยำ ปลอดภัย และรองรับการปรับระยะทางแบบเรียลไทม์' },
      { title: 'AI Context & Privacy', description: 'ต้องแยกข้อมูลระบบออกจากบทสนทนา และปกปิดข้อมูลส่วนบุคคลก่อนนำไปประมวลผล' },
      { title: 'WebSocket Stability', description: 'ต้องควบคุมลำดับการทำงานในจุดสำคัญเพื่อป้องกันสถานะเกมหรือแชตขัดแย้งเมื่อมีผู้ใช้พร้อมกันจำนวนมาก' },
      { title: 'Relationship & Decay Scoring', description: 'ต้องออกแบบสูตรคะแนนที่รองรับแนวคิดความสัมพันธ์จืดจาง การแจ้งเตือน และการตัดความสัมพันธ์อัตโนมัติ' },
      { title: 'Workload Integration', description: 'ต้องบูรณาการหลายระบบให้เข้ากันภายใต้เวลาจำกัดโดยไม่กระทบเสถียรภาพและประสบการณ์ผู้ใช้' },
      { title: 'External API Constraints', description: 'ต้องบริหารข้อจำกัดด้าน API ภายนอกและงบประมาณให้ระบบแนะนำสถานที่ยังแม่นยำและน่าเชื่อถือ' },
    ],
    feasibility:
      'การศึกษาความเป็นไปได้จะทำในรูปแบบ Mini Project โดยโฟกัส Face Verification, AI Matching และ GPS-based Filtering เพื่อทดสอบแนวทาง ประเมินเทคโนโลยี และรับคำแนะนำจากอาจารย์ผู้สอนก่อนพัฒนาเป็นระบบหลัก',
    targetAudience:
      'กลุ่มเป้าหมายคือคนไทยที่อาศัยอยู่ในประเทศไทย สถานะโสด อายุ 18 ปีขึ้นไป และต้องการหาคู่เพื่อพูดคุย ทำความรู้จัก นัดพบ หรือออกเดตร่วมกัน',
    systemOverview: [
      'ระบบคัดกรองคู่จากข้อมูลโปรไฟล์ ความสนใจ ไลฟ์สไตล์ สไตล์การท่องเที่ยว และระยะทางจริงตามที่ผู้ใช้กำหนด',
      'ระบบติดตามค่าความสัมพันธ์จากการแชตและกิจกรรมในแอป เพื่อปลดล็อกการออกเดตเมื่อความสัมพันธ์ถึงระดับที่เหมาะสม',
      'ระบบสนับสนุนวันออกเดตด้วยสถานที่แนะนำ การนัดหมาย ปฏิทิน แจ้งเตือน แผนที่นำทาง แชร์พิกัด และ SOS',
      'ระบบประเมินหลังการออกเดตช่วยสะท้อนคุณภาพประสบการณ์และช่วยจัดการทิศทางความสัมพันธ์ต่อไป',
    ],
    workflow: [
      'สมัครบัญชี กรอกโปรไฟล์ ยืนยันตัวตนด้วยใบหน้า และระบุความต้องการในการค้นหาคู่',
      'ระบบค้นหาคู่จากช่วงอายุ เพศ ความสนใจ สไตล์การท่องเที่ยว ไลฟ์สไตล์ และระยะทาง GPS',
      'ผู้ใช้เลือกคู่ที่สนใจและเริ่มสร้างความสัมพันธ์ผ่านแชตหรือเกมทายใจ',
      'เมื่อสะสมหลอดความสัมพันธ์เต็มครบ 1, 2 และ 3 ดวง ระบบจะปลดล็อกความถี่ในการออกเดตมากขึ้น',
      'ผู้ใช้ตกลงสถานที่ นัดหมายวันเวลา บันทึกลงปฏิทิน และรับแจ้งเตือนล่วงหน้า 1 วัน',
      'ในวันออกเดต ผู้ใช้สามารถแชร์โลเคชัน ใช้แผนที่นำทาง กด SOS และรายงานพฤติกรรมไม่เหมาะสมได้',
    ],
    features: {
      users: [
        'ลงทะเบียนและลงชื่อเข้าใช้',
        'ค้นหาคู่และจับคู่',
        'แชตและเกมทายใจ',
        'แนะนำสถานที่เดต นัดหมาย และประเมินหลังเดต',
        'ความปลอดภัย รายงาน บล็อก แชร์พิกัด และ SOS',
      ],
      admin: [
        'จัดการข้อมูลผู้ใช้และเนื้อหาที่ถูกรายงาน',
        'ตรวจสอบกิจกรรมผิดปกติและดูแลฟังก์ชันความปลอดภัย',
        'วิเคราะห์ Feedback เพื่อปรับปรุงระบบ',
      ],
    },
    infrastructure: [
      { label: 'Mobile Client', items: ['Flutter', 'Google Auth', 'Firebase'], connector: 'REST API · Socket.io' },
      { label: 'Web & Admin', items: ['Vue.js', 'Vite', 'Tailwind CSS'], connector: 'JWT · Spring Security' },
      { label: 'Backend Core', items: ['Spring Boot', 'Socket.io', 'Google Gemini API', 'Google Maps API'], connector: 'JPA · Cache · Media' },
      { label: 'Data & Services', items: ['MySQL', 'Redis', 'Cloudinary', 'Thai ID OCR', 'THSMS', 'iApp'], connector: 'Docker Network' },
      { label: 'Infrastructure', items: ['Ubuntu', 'Docker Compose', 'Nginx Proxy Manager', 'GitHub Actions'] },
    ],
    techStack: [
      { category: 'Frontend Ecosystem', items: ['Flutter', 'Vue.js', 'Vite', 'Tailwind CSS'] },
      { category: 'Backend Core', items: ['Spring Boot', 'Spring Security', 'Socket.io'] },
      { category: 'Database & Caching', items: ['MySQL', 'Cloudinary', 'Redis'] },
      { category: 'Auth & Security', items: ['JWT', 'Google Auth API'] },
      { category: 'Third-party Services', items: ['Google Gemini API', 'Google Maps API', 'Thai ID OCR', 'THSMS', 'iApp', 'Firebase'] },
      { category: 'CI & CD', items: ['GitHub', 'GitHub Actions'] },
      { category: 'Infrastructure', items: ['Ubuntu', 'Docker', 'Docker Compose', 'Nginx Proxy Manager', 'Nginx'] },
      { category: 'Design & Collaboration', items: ['Figma', 'Canva', 'Microsoft Teams', 'Discord', 'Trello'] },
      { category: 'Testing', items: ['Postman'] },
    ],
    architectureImage: '/images/infrastructure/v4-system_architecture.png',
    images: [],
    links: {
      figma: undefined,
      youtube: 'https://www.youtube.com/watch?v=-ynxqWjgi0k&t=216s',
      live: undefined,
    },
  },
  'yip-invoice-service': {
    id: 'yip-invoice-service',
    title: 'YIP-Invoice-Service',
    subtitle: 'E-Tax invoice microservice platform from a 6-month internship',
    year: 'Internship · 6 Months',
    template: 'internship',
    tags: ['featured', 'internship', 'backend', 'microservice', 'docker'],
    certificateImage: '/images/certificate/yip_certificate.png',
    overview:
      'YIP-Invoice-Service is an e-Tax invoice service platform developed during a 6-month internship. The system is structured as multiple backend services for orchestrating invoice requests, rendering PDF documents, generating XML data, signing documents, queue-based processing, email delivery, file storage, and monitoring.',
    problemStatement: [
      'E-Tax invoice processing involves several steps that must happen reliably: template rendering, XML generation, document signing, storage, queue handling, and email delivery.',
      'Splitting the responsibilities into focused services makes the system easier to maintain, test, deploy, and scale without turning one backend into a fragile all-in-one service.',
    ],
    objectives: [
      'Build and maintain backend services for e-Tax invoice processing during the internship period.',
      'Separate PDF, XML, signature, email, file storage, queue listener, and orchestration responsibilities into focused services.',
      'Support upload, download, storage, and delivery flows for generated tax documents.',
      'Improve service structure by removing Tomcat usage and refactoring shared infrastructure logic.',
      'Use Docker Compose and monitoring support to make local and service-level operation easier.',
    ],
    process:
      'The project was part of a 6-month internship workflow. Work involved understanding an existing service structure, improving individual services, adding upload/download behavior, signing PDF documents, refactoring file storage from MinIO toward local storage, and keeping services aligned through shared libraries and compose configuration.',
    highlights: [
      'Microservice-oriented backend with orchestration, PDF, XML, signature, queue listener, email, and file storage services.',
      'PDF template service for rendering multiple tax document templates.',
      'Signature service supporting upload and download behavior for signed documents.',
      'Queue listener service for asynchronous processing between invoice-related services.',
      'File server service for e-Tax document storage and retrieval.',
      'Prometheus folder prepared for monitoring service behavior.',
      'Shared libraries and Docker Compose configuration to keep services consistent across local environments.',
    ],
    challenges: [
      { title: 'Service Boundaries', description: 'Each service needed a clear responsibility so PDF, XML, signing, email, queue, and storage logic did not become tangled.' },
      { title: 'Template Reliability', description: 'PDF template rendering had to support multiple working templates while preserving document accuracy.' },
      { title: 'Digital Signature Flow', description: 'Signing PDF documents required careful handling of upload, download, and document state.' },
      { title: 'Queue Processing', description: 'Asynchronous invoice flows needed queue listener behavior that could process work without losing context.' },
      { title: 'Storage Refactor', description: 'File storage behavior had to be refactored from MinIO toward local storage while keeping service behavior stable.' },
      { title: 'Deployment Consistency', description: 'Multiple services needed consistent configuration through environment folders, shared libraries, and Docker Compose.' },
    ],
    feasibility:
      'The internship scope was feasible because work was split into small services and improvements could be delivered service by service instead of rewriting the whole system at once.',
    targetAudience:
      'Internal business users and backend operators who need reliable e-Tax invoice generation, signing, storage, and delivery workflows.',
    systemOverview: [
      'The orchestrator service coordinates invoice requests and routes work to specialized services.',
      'PDF and PDF template services generate document output from approved tax invoice templates.',
      'XML and signature services prepare structured tax data and signed documents.',
      'Queue listener, email service, and file server handle asynchronous delivery, document storage, and retrieval.',
    ],
    workflow: [
      'Invoice data enters the orchestrator service.',
      'The PDF template service prepares the correct document template.',
      'PDF and XML services generate tax document outputs.',
      'The signature service signs the generated documents.',
      'The queue listener coordinates asynchronous follow-up tasks.',
      'File server and email service store and deliver the final documents.',
    ],
    features: {
      users: [
        'Generate e-Tax invoice documents',
        'Render PDF documents from templates',
        'Generate XML data for tax invoice flows',
        'Sign PDF documents',
        'Store, upload, download, and deliver files',
      ],
      admin: [
        'Monitor service behavior',
        'Manage environment and compose configuration',
        'Maintain shared libraries across services',
      ],
    },
    infrastructure: [
      { label: 'Entry & Orchestration', items: ['etax_orchestrator_service', 'shared_libs', 'env'], connector: 'REST · Internal Service Calls' },
      { label: 'Document Generation', items: ['etax_pdf_service', 'etax_pdf_template_service', 'etax_xml_service'], connector: 'Template · XML · PDF' },
      { label: 'Async & Delivery', items: ['etax_queue_listener_service', 'etax_email_service'], connector: 'Queue · Email' },
      { label: 'Trust & Storage', items: ['etax_signature_service', 'file_server'], connector: 'Upload · Download · Signed Files' },
      { label: 'Operations', items: ['Docker Compose', 'Prometheus', 'test_with_rest'] },
    ],
    techStack: [
      { category: 'Backend Services', items: ['Java', 'Spring Boot', 'REST API'] },
      { category: 'Document Flow', items: ['PDF', 'XML', 'Template Service', 'Digital Signature'] },
      { category: 'Async & Delivery', items: ['Queue Listener', 'Email Service'] },
      { category: 'Storage & Files', items: ['File Server', 'Upload', 'Download'] },
      { category: 'Ops', items: ['Docker', 'Docker Compose', 'Prometheus'] },
      { category: 'Development', items: ['GitHub', 'REST Client', 'Shared Libraries'] },
    ],
    architectureImage: undefined,
    images: [],
    links: {
      figma: undefined,
      youtube: undefined,
      live: undefined,
    },
  },
  'petstory': {
    id: 'petstory',
    title: 'PetStory',
    subtitle: 'แอปพลิเคชันดูแลสัตว์เลี้ยงแนว Instagram + Daily Mission + Health Tracker',
    year: 'Senior Project',
    template: 'case-study',
    tags: ['featured', 'fullstack', 'social', 'health-tracking'],
    commissioned: false,
    logo: undefined,
    appIcon: undefined,
    overview:
      'PetStory คือแพลตฟอร์มสำหรับผู้เลี้ยงสัตว์ที่รวมแนวคิด Instagram Social Feed, Daily Mission Gamification และ Health Tracker เข้าไว้ในแอปเดียว ผู้ใช้สามารถสร้างโปรไฟล์สัตว์เลี้ยง บันทึกการดูแลประจำวัน เช่น อาหาร เดิน อารมณ์ และน้ำหนัก ทำภารกิจเพื่อรับ EXP และยกระดับสัตว์เลี้ยง แชร์โพสต์ Feed และ Story ติดตามสุขภาพผ่านระบบวัคซีน ยา และการแจ้งเตือนเหตุการณ์สำคัญ พร้อมเชื่อมต่อกับเพื่อนและชุมชนผู้เลี้ยงสัตว์',
    problemStatement: [
      'ผู้เลี้ยงสัตว์มักต้องการบันทึกการดูแลสัตว์เลี้ยงไว้เพื่ออ้างอิง แต่เครื่องมือปัจจุบันมักเป็นเพียงไดอารี่ธรรมดาหรือไม่มีแรงจูงใจให้ใช้งานต่อเนื่อง',
      'การดูแลสุขภาพสัตว์เลี้ยงต้องติดตามหลายปัจจัย เช่น อาหาร น้ำหนัก วัคซีน และยา ซึ่งการเตือนเหตุการณ์สำคัญมักหลุดหายไปตามเวลา',
      'ผู้เลี้ยงสัตว์ต้องการพื้นที่ในการแชร์ความสุขของการเลี้ยงสัตว์และเชื่อมต่อกับชุมชนผู้เลี้ยงสัตว์คนอื่น',
    ],
    objectives: [
      'พัฒนาแอปที่ให้ผู้เลี้ยงสัตว์บันทึกกิจกรรมการดูแล เช่น อาหาร เดิน อารมณ์ และน้ำหนักใน workflow เดียว',
      'สร้างระบบ Daily Mission ที่เพิ่มแรงจูงใจผ่าน EXP และระบบยกระดับสัตว์เลี้ยง',
      'พัฒนาระบบสุขภาพที่รวม Weight Tracking, Vaccine Management, Medicine Reminder และ Health Alerts',
      'พัฒนาฟีเจอร์สังคม เช่น Feed, Story, Like, Comment และ Follow เพื่อสนับสนุนการสร้างชุมชน',
      'สร้างระบบ Moments สำหรับเก็บวันเกิด วันรับเลี้ยง และเหตุการณ์สำคัญของสัตว์เลี้ยง',
    ],
    process:
      'ทีมวิเคราะห์ความต้องการของผู้เลี้ยงสัตว์จริง และสังเกตพฤติกรรมการใช้งาน Social Media ร่วมกับ Health Tracking App จากนั้นนำแนวคิด Gamification มาช่วยเพิ่มแรงจูงใจในการใช้งานประจำวัน และแยกระบบออกเป็นโดเมนหลัก เช่น Auth, Pet, Mission, Health และ Social เพื่อให้พัฒนาและดูแลได้ชัดเจน',
    highlights: [
      'บันทึกการดูแลแบบ All-in-One สำหรับ Feeding, Walk, Mood และ Weight ใน workflow เดียว',
      'ระบบ Daily Mission พร้อม EXP และการ Level Up สัตว์เลี้ยง',
      'Health Tracking ครบทั้ง Weight History, Vaccine CRUD, Medicine Reminder และ Health Alerts',
      'Social Features เช่น Feed และ Story Posts, Like, Comment, Delete, Follow และ Unfollow',
      'Moments สำหรับปักหมุดวันสำคัญ เช่น วันเกิด วันรับเลี้ยง และความทรงจำพิเศษ',
      'Search Users, Followers และ Following List พร้อม Theme Settings',
      'Image Upload รองรับทั้ง Local Storage และ Cloudinary unsigned upload',
      'Admin Dashboard สำหรับ User Management, Post Moderation และ Activity Monitoring',
    ],
    challenges: [
      { title: 'Mission Generation Logic', description: 'ต้องออกแบบอัลกอริทึมสำหรับสุ่มสร้างภารกิจที่สมจริงและสัมพันธ์กับการดูแลสัตว์เลี้ยงแต่ละประเภท' },
      { title: 'EXP & Level System', description: 'ต้องออกแบบสูตร EXP ให้สมดุล เพื่อให้ผู้ใช้รู้สึกคุ้มค่าจากการทำ Mission โดยไม่เร็วหรือช้าเกินไป' },
      { title: 'Health Data Integrity', description: 'ต้องจัดการ Weight History, Vaccine Records และ Medicine Reminders ให้ถูกต้องและเรียงลำดับเวลาอย่างแม่นยำ' },
      { title: 'Care Log Schema Design', description: 'ต้องออกแบบ schema ที่รองรับ Feeding, Walk, Mood และ Weight ในโครงสร้างเดียวได้อย่างมีประสิทธิภาพ' },
      { title: 'Social Feed Performance', description: 'ต้องปรับประสิทธิภาพการโหลด Post, Like และ Comment เมื่อข้อมูลเพิ่มขึ้นด้วย Pagination' },
      { title: 'Image Storage Management', description: 'ต้องบริหารการอัปโหลดรูปและตัวเลือกระหว่าง Local Storage กับ Cloudinary ให้เสถียร' },
      { title: 'JWT Token Management', description: 'ต้องจัดการ Token Expiration, Refresh Token และ Logout ให้ถูกต้องทั้งฝั่ง Frontend และ Backend' },
    ],
    feasibility:
      'โครงการมีความเป็นไปได้สูง เพราะแต่ละองค์ประกอบมีตัวอย่างจากแอปที่มีอยู่แล้ว เช่น Social Platform, Health App และระบบ Gamification ทีมจึงเน้นการบูรณาการทุกส่วนให้ทำงานร่วมกันอย่างลงตัว พร้อมทดสอบ edge case เช่น multiple pets, timezone issues และ concurrent updates',
    targetAudience:
      'กลุ่มเป้าหมายคือคนไทยอายุ 15 ปีขึ้นไปที่เลี้ยงสัตว์ เช่น สุนัข แมว กระต่าย หรือนก และต้องการบันทึกการดูแล ติดตามสุขภาพ แชร์โปรไฟล์สัตว์เลี้ยง และเชื่อมต่อกับชุมชนผู้เลี้ยงสัตว์',
    systemOverview: [
      'ระบบเข้าสู่ระบบและแลกเปลี่ยน JWT Token สำหรับยืนยันตัวตนและควบคุมสิทธิ์การเข้าถึง',
      'ระบบโปรไฟล์สัตว์เลี้ยงสำหรับเก็บชื่อ สายพันธุ์ อายุ วันเกิด วันรับเลี้ยง น้ำหนัก ชีวประวัติ Level และ EXP',
      'ระบบ Care Log ที่รวม Feeding, Walk, Mood และ Weight ไว้ใน workflow เดียว',
      'ระบบ Daily Mission ที่สร้างภารกิจประจำวันและให้ EXP เพื่อยกระดับสัตว์เลี้ยง',
      'ระบบสุขภาพสำหรับ Weight History, Vaccine Records, Medicine Reminders และ Alerts',
      'ระบบสังคมที่รองรับ Feed และ Story Posts, Likes, Comments, Follow/Unfollow และ Search Users',
      'ระบบ Moments สำหรับเก็บเหตุการณ์สำคัญในชีวิตของสัตว์เลี้ยง',
      'ระบบตั้งค่า Theme และโปรไฟล์ผู้ใช้',
    ],
    workflow: [
      'ผู้ใช้สมัครสมาชิกและลงชื่อเข้าใช้ด้วย Email และ Password',
      'สร้างโปรไฟล์สัตว์เลี้ยงได้ตั้งแต่หนึ่งตัวขึ้นไป พร้อมรูปภาพและข้อมูลพื้นฐาน',
      'ระบบสร้าง Daily Mission เช่น Feeding, Walking, Mood Check และ Weight Tracking',
      'ผู้ใช้บันทึกการดูแลจาก Mission หรือเพิ่มเองภายหลัง พร้อมยกระดับสัตว์เลี้ยงเมื่อ EXP เต็ม',
      'ผู้ใช้ติดตามสุขภาพผ่าน Weight History, Vaccine Dates และ Medicine Reminders',
      'สร้างและแชร์ Feed หรือ Story Posts รวมถึงกดถูกใจและแสดงความคิดเห็นในโพสต์อื่น',
      'ติดตามหรือเลิกติดตามผู้ใช้อื่น ค้นหาเพื่อน และดูรายชื่อ Followers หรือ Following',
      'ปักหมุด Moments สำคัญ เช่น วันเกิด วันรับเลี้ยง และวันพิเศษ',
      'ปรับแต่ง Theme และตั้งค่าโปรไฟล์ส่วนตัว',
    ],
    features: {
      users: [
        'ลงทะเบียน เข้าสู่ระบบ และแก้ไขโปรไฟล์',
        'สร้างและจัดการโปรไฟล์สัตว์เลี้ยง',
        'ทำ Daily Mission และรับ EXP',
        'บันทึกการดูแล เช่น อาหาร เดิน อารมณ์ และน้ำหนัก',
        'ติดตามสุขภาพ เช่น น้ำหนัก วัคซีน ยา และการแจ้งเตือน',
        'สร้างและแชร์ Feed และ Story Posts',
        'ติดตามผู้ใช้ กดถูกใจ แสดงความคิดเห็น และค้นหาเพื่อน',
        'ปักหมุด Moments สำคัญ',
        'อัปโหลดรูปภาพ',
        'ปรับแต่ง Theme',
      ],
      admin: [
        'ดูสรุประบบทั้งหมด',
        'จัดการข้อมูลผู้ใช้ เช่น บล็อก อนุมัติ และตรวจสอบ',
        'จัดการโพสต์ด้วยการอนุมัติหรือปฏิเสธ',
        'ตรวจสอบกิจกรรมผู้ใช้และพฤติกรรมผิดปกติ',
      ],
    },
    infrastructure: [
      { label: 'Client App', items: ['Vue.js 3', 'Vite', 'Pinia'], connector: 'REST API · JWT' },
      { label: 'Application API', items: ['Spring Boot 3', 'Spring Security', 'Spring Data JPA'], connector: 'Data · Media' },
      { label: 'Data & Media', items: ['MySQL 8', 'Cloudinary / Local Storage'], connector: 'Docker Network' },
      { label: 'Delivery', items: ['Java 21', 'Maven', 'Docker Compose'] },
    ],
    techStack: [
      { category: 'Frontend', items: ['Vue.js 3', 'Vite', 'Tailwind CSS', 'Pinia', 'Three.js'] },
      { category: 'Backend', items: ['Spring Boot 3.3', 'Spring Security', 'Spring Data JPA'] },
      { category: 'Data & Storage', items: ['MySQL 8', 'Cloudinary', 'Local Storage'] },
      { category: 'Delivery', items: ['Java 21', 'Maven', 'Docker Compose'] },
      { category: 'Collaboration', items: ['Figma', 'Discord', 'GitHub'] },
      { category: 'Testing', items: ['Postman'] },
    ],
    architectureImage: undefined,
    images: [],
    links: {
      figma: undefined,
      youtube: undefined,
      live: undefined,
    },
  },
};

export const TOP_PROJECTS: TopProject[] = [
  {
    id: 'chat2date',
    number: '01',
    title: 'Chat2Date',
    description:
      'Dating platform ที่ใช้ matching, real-time chat, relationship score, date recommendation และ safety flow เพื่อพาผู้ใช้จากการคุยไปสู่การนัดพบจริง',
    categoryLabel: 'Full Stack',
    status: 'active',
    tech: ['Flutter', 'Vue.js', 'Spring Boot', 'MySQL', 'Socket.io', 'Docker'],
    accent: 'primary',
    detailId: 'chat2date',
  },
  {
    id: 'yip-invoice-service',
    number: '02',
    title: 'YIP-Invoice-Service',
    description:
      'E-Tax invoice microservice platform from a 6-month internship, covering orchestration, PDF/XML generation, signing, queue processing, email, storage, and monitoring.',
    categoryLabel: 'Internship',
    status: 'active',
    tech: ['Java', 'Spring Boot', 'Docker', 'PDF', 'XML', 'Prometheus'],
    accent: 'purple',
    detailId: 'yip-invoice-service',
  },
  {
    id: 'petstory',
    number: '03',
    title: 'PetStory',
    description:
      'Pet care platform ที่รวม social feed, daily mission gamification และ health tracking เพื่อให้ผู้ใช้ดูแลสัตว์เลี้ยง บันทึกกิจกรรม และแชร์ช่วงเวลาสำคัญได้ในที่เดียว',
    categoryLabel: 'Full Stack',
    status: 'active',
    tech: ['Vue.js 3', 'Spring Boot 3', 'MySQL 8', 'Pinia', 'Docker'],
    accent: 'orange',
    detailId: 'petstory',
  },
];

export const PROJECT_FOLDER_FILTERS: { id: 'all' | ProjectTag; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'internship', label: 'Internship' },
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'microservice', label: 'Microservice' },
];

export const PROJECT_FOLDERS: ProjectFolder[] = [
  {
    id: 'chat2date-folder',
    title: 'Chat2Date',
    description: 'Dating platform with matching, chat, relationship scoring, date unlock, place recommendation, and safety flow.',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    tags: ['featured', 'fullstack', 'mobile', 'ai', 'security'],
    status: 'active',
    year: 'Senior Project',
    tech: ['Flutter', 'Vue.js', 'Spring Boot', 'MySQL', 'Socket.io'],
    detailId: 'chat2date',
  },
  {
    id: 'petstory-folder',
    title: 'PetStory',
    description: 'Pet care platform combining social feed, daily missions, health tracking, moments, and pet profile management.',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    tags: ['featured', 'fullstack', 'social', 'health-tracking'],
    status: 'active',
    year: 'Senior Project',
    tech: ['Vue.js 3', 'Spring Boot 3', 'MySQL 8', 'Pinia'],
    detailId: 'petstory',
  },
  {
    id: 'yip-invoice-service-folder',
    title: 'YIP-Invoice-Service',
    description: 'E-Tax invoice microservice platform covering orchestration, PDF/XML, signing, queue processing, email, storage, and monitoring.',
    category: 'internship',
    categoryLabel: 'Internship',
    tags: ['featured', 'internship', 'backend', 'microservice', 'docker'],
    status: 'active',
    year: 'Internship · 6 Months',
    tech: ['Java', 'Spring Boot', 'Docker', 'PDF', 'XML'],
    detailId: 'yip-invoice-service',
  },
];

export const DEFAULT_PROJECT_CMS_STATE: ProjectCmsState = {
  featuredProjects: FEATURED_PROJECTS,
  topProjects: TOP_PROJECTS,
  projectFolders: PROJECT_FOLDERS,
  projectFolderFilters: PROJECT_FOLDER_FILTERS,
};
