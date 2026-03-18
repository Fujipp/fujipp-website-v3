# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

## [0.5.0] - 2026-03-17

### Features
- `frontend` add ProjectDetailModal — click any project card to expand full details (icon, description, tech stack, links, image slideshow)
- `frontend` add crossfade image slideshow with dot indicators for featured project card
- `frontend` add thumbnail image display on regular project cards
- `frontend` add click-to-zoom image viewer for project images (reuse CertificateModal)
- `frontend` add internship project entries: RPA-001 SFTP File Processing & Message Queue System, Etax Service e-Tax Invoice with Digital Signature
- `frontend` add internship learning experience entries: Report Generation (JasperReports, Oracle DB) and Software Testing (JUnit 5, Mockito, Postman)
- `frontend` replace all project card emojis with Lucide icons

### Fixes
- `frontend` fix ProjectDetailModal close button overlapping image panel
- `frontend` fix image click bug in detail modal slideshow — move onClick to container using slideIdx reference
- `frontend` fix All Work section title color to match Projects hero heading
- `frontend` add stopPropagation on all inner interactive elements in project cards (links, cert button, image thumb)

### Styles
- `frontend` add zoom hint badge on detail modal image slideshow (hover to reveal)
- `frontend` add pointer-events: none on stacked slideshow images to prevent invisible-layer click interception

---

## [0.4.0] - 2026-03-16

### Features
- `frontend` add changelog page with vertical timeline UI
- `frontend` register /changelog route with mobileOnly flag
- `frontend` add project stats overview section (releases, changes, features, fixes)

### Styles
- `frontend` apply project design tokens to changelog cards, badges, and timeline

---

## [0.3.0] - 2026-03-14

### Features
- `frontend` add performance page with live Google PageSpeed Insights integration
- `frontend` add lighthouse score ring animations (Performance, Accessibility, Best Practices, SEO)
- `frontend` add core web vitals grid with live data (LCP, CLS, TBT, FCP, TTI, SI)
- `frontend` add tech stack showcase section with brand icons
- `frontend` add design tokens display (colors, fonts, spacing, radius)
- `frontend` add 404 Not Found page with Lottie animation
- `frontend` add dynamic document title based on current route
- `frontend` update favicon and deploy path configuration

### Performance
- `frontend` add localStorage caching for PSI results with 1-hour TTL
- `frontend` add 60-second cooldown between forced live refreshes

### CI/CD
- `infra` add GitHub Actions workflow for frontend deployment to Rukcom hosting

---

## [0.2.0] - 2026-03-11

### Features
- `frontend` add About page with full-screen parallax background slideshow
- `frontend` add bilingual bio section with TH/EN language toggle
- `frontend` add skill groups with brand-accurate icons (Frontend, Backend, Tools & Other)
- `frontend` add AI Tools section (Claude, GPT, Gemini)
- `frontend` add horizontal-scrolling education timeline with sticky immersive effect
- `frontend` add interactive Hobbies & Interests section with expandable detail modal
- `frontend` add Contact section with social cards
- `frontend` add footer component

### Styles
- `frontend` implement scroll-driven parallax animations with useScroll + useTransform
- `frontend` add glassmorphism card with backdrop blur in hero section
- `frontend` optimize GPU layer promotion (will-change, translateZ) for smooth animations
- `frontend` add color-coded tech group accenting via color-mix and CSS tokens

### Fixes
- `frontend` add browser theming meta tags and fix theme hook for system preference changes
- `frontend` improve theme transition timing with singleton OS prefers-color-scheme listener
- `frontend` fix AppNavbar z-index to stay above hobby modal backdrop layers

---

## [0.1.0] - 2026-03-10

### Features
- `frontend` add HomePage hero with mascot, slanted surface bands, and centered text
- `frontend` add dark/light/system theme toggle with localStorage persistence
- `frontend` add animated BackgroundEffect component with floating elements
- `frontend` configure react-router-dom with centralized route definitions
- `frontend` add responsive AppNavbar with mobile sidebar (drawer) support
- `frontend` add Projects page placeholder

### Build
- `frontend` scaffold React 19 + Vite 8 (beta) project
- `frontend` configure Tailwind CSS v4 with Vite plugin
- `frontend` add shadcn/ui component system with Button component
- `frontend` configure TypeScript with path aliases (@/*)
- `frontend` migrate global styles to token-based architecture under styles/tokens/
- `frontend` extract theme logic into reusable useAppTheme hook

### Chores
- `repo` initialize monorepo structure
- `repo` add project context, .cursorrules, and .windsurfrules for IDE standards
- `repo` configure standard .gitignore for frontend and backend monorepo
- `repo` stop tracking .DS_Store files
- `database` initialize core schema v1 (users, roles, content, media, tags, contact messages)
