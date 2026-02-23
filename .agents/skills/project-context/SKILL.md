---
name: Project Context - Fujipp Website
description: The core architecture, stack, rules, and expectations for the Fujipp Website project.
---

# Project Context Prompt – Fujipp Website

You are assisting in designing and implementing a full-stack web application called Fujipp Website.

## 🔷 Project Overview

Fujipp Website is a full-stack web application built with:

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui

Hosted on:
- Rukcom Web Hosting (Static Hosting)
- Domain: https://www.fujipp.com

### Backend
- Spring Boot (Java)
- Spring Web (REST API)
- Spring Data JPA + Hibernate
- Spring Security
- JWT Authentication (Access + Refresh Token with rotation)

Hosted on:
- DigitalOcean VPS (or VM)
- API Domain: https://api.fujipp.com

### Database
- MySQL (Same host as backend)
- Port: 3306 (localhost only)

### Reverse Proxy
- NGINX
- Public Port: 443 (HTTPS)
- Proxy to Spring Boot on Port 8080 (internal)

### CI/CD
- GitHub Repository
- GitHub Actions
- Deploy frontend build to Rukcom
- Deploy backend (jar/docker) to VPS

## 🔷 Network & Port Architecture

### Public Ports
- 443 → Frontend (Rukcom)
- 443 → Backend NGINX (DigitalOcean VPS)

### Internal Ports (Not Public)
- Spring Boot: 8080
- MySQL: 3306 (localhost)
- Redis (optional): 6379

### Flow:
1. Client → https://www.fujipp.com (443)
2. Client → https://api.fujipp.com (443)
3. NGINX → Spring Boot (8080)
4. Spring Boot → MySQL (3306)

## 🔷 Security Rules
- Only port 443 exposed publicly
- MySQL accessible only via localhost
- CORS allow only https://www.fujipp.com
- JWT-based authentication
- HTTPS enforced

## 🔷 Development Environment
Local Ports:
- Frontend (Vite): 5173
- Backend (Spring Boot): 8080
- MySQL: 3306

## 🔷 Expectations from AI
When suggesting architecture, code, or deployment strategies:
- Respect current stack
- Do not suggest changing framework unless justified
- Maintain separation between frontend hosting and backend hosting
- Ensure security best practices
- Keep production ports and structure consistent

## 🔷 Coding Standards & Naming Conventions
A clean and readable codebase is mandatory. Adhere strictly to the following conventions:

### Clean Architecture & Code Organization
- **Separation of Concerns**: Keep business logic out of controllers and UI components.
- **Single Responsibility**: Each function/class/component should do exactly one thing.
- **Modularity**: Break down large files into smaller, focused modules.
- **Meaningful Names**: Choose descriptive, unambiguous names over abbreviations (e.g., `getUserProfile` instead of `getUsrPrf`).

### Frontend (React + TypeScript)
- **Files & Folders**: `kebab-case` for folders (e.g., `user-profile`, `auth-context`).
- **Components**: `PascalCase` for React component files and function names (e.g., `UserProfile.tsx`, `const UserProfile = () => {}`).
- **Hooks**: `camelCase` starting with `use` (e.g., `useAuth.ts`, `useFetchUser`).
- **Interfaces / Types**: `PascalCase` (e.g., `interface UserProfile {}`, `type AppTheme = "light" | "dark";`). Prefix interfaces with `I` only if requested, otherwise standard `PascalCase` is preferred.
- **Variables & Functions**: `camelCase` (e.g., `const isLoading = true;`, `function calculateTotal() {}`).
- **Constants**: `UPPER_SNAKE_CASE` for global constants (e.g., `const MAX_LOGIN_ATTEMPTS = 3;`).
- **Component Props**: `[ComponentName]Props` (e.g., `interface UserProfileProps {}`).

### Backend (Spring Boot + Java)
- **Packages**: `lowercase` with dot notation (e.g., `com.fujipp.api.controller`, `com.fujipp.api.service`).
- **Classes & Interfaces**: `PascalCase` (e.g., `UserController`, `UserRepository`, `AuthService`).
- **Variables & Methods**: `camelCase` (e.g., `findUserById()`, `private String emailAddr;`).
- **Constants**: `UPPER_SNAKE_CASE` with `static final` (e.g., `public static final int MAX_RETRY = 3;`).
- **REST Endpoints**: `kebab-case` for URIs, use plural nouns (e.g., `/api/v1/users`, `/api/v1/auth/login`).
- **DTOs / Payloads**: Append `Request` or `Response` or `DTO` (e.g., `UserRegistrationRequest`, `UserProfileResponse`).

### Database (MySQL)
- **Tables**: `snake_case`, plural or singular based on convention, but be consistent (e.g., `users`, `user_roles`).
- **Columns**: `snake_case` (e.g., `first_name`, `created_at`).
- **Foreign Keys**: `[table_singular]_id` (e.g., `user_id`).

## 🔷 Additional Recommendations
To further ensure a manageable and scalable project, consider the following best practices:

### State Management (Frontend)
- Use **Context API** or **Zustand** for global state instead of prop-drilling if the application scales. Keep component state local (`useState`) whenever possible.
- Use **React Query (TanStack Query)** for server-state management (fetching, caching, synchronizing API data) instead of raw `useEffect` blocks.

### Error Handling & Logging
- **Frontend**: Implement global error boundaries. Catch API errors cleanly and display user-friendly toast notifications.
- **Backend**: Use `@ControllerAdvice` for global exception handling. Do not return stack traces to the client in production. Use a structured format like `ApiErrorResponse(status, message, timestamp)`.

### Git Workflow & GitHub Copilot Commits
To standardize commits, especially when using GitHub Desktop and Copilot, always use **Conventional Commits**:

**1. Format:** `<type>(<scope>): <subject>`

**Allowed Types:**
- `feat` = เพิ่มฟีเจอร์
- `fix` = แก้บัค
- `docs` = เอกสาร
- `style` = format/spacing (ไม่กระทบ logic)
- `refactor` = ปรับโครง/โค้ด แต่ไม่เพิ่มฟีเจอร์
- `perf` = ปรับให้เร็วขึ้น
- `test` = เพิ่ม/แก้เทส
- `build` = build system/deps (เช่น package, gradle)
- `ci` = CI workflow
- `chore` = งานจิปาถะ เช่น rename, cleanup, config

**Allowed Scopes:** `frontend`, `backend`, `database`, `docs`, `infra`, `repo`
*(If changes span multiple scopes, use `repo` or `infra` and explain in the subject).*

**2. Subject (หลัง :):**
- เริ่มด้วยกริยา (เช่น add, create, update, remove, setup)
- ตัวเล็กทั้งหมด ไม่ใส่จุดท้ายประโยค
- สั้น ชัด (50–72 ตัวอักษร)

**3. Body (ถ้ามีหลายจุด):**
ใช้ bullet list บอกว่า "ทำอะไร/ทำไม" แบบสั้นๆ เช่น:
```
feat(frontend): setup base layout and routing
- add app shell layout
- add public routes (/, /about)
- configure env and build scripts
```

**4. Breaking Change:**
ใส่ `!` หลัง scope เช่น `feat(backend)!: rename auth endpoint paths`

**5. GitHub Copilot Prompt:**
*(Paste this into Copilot to auto-generate compliant commits)*
```text
Use Conventional Commits: <type>(<scope>): <subject>
Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
Allowed scopes: frontend, backend, database, docs, infra, repo
Subject: lowercase imperative verb, no trailing period, <= 72 chars
If changes span multiple scopes, use scope repo
Add body bullets when more than 1 logical change
```

### Testing
- **Frontend**: Write unit tests for core utilities and complex hooks using **Vitest** or **Jest**.
- **Backend**: Assert business logic with **JUnit 5** and **Mockito**. Test your repositories and controllers using `@DataJpaTest` and `@WebMvcTest`.
