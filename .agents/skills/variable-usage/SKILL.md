---
name: Variable Usage - Fujipp Website
description: Project conventions for using variables and tokens in Fujipp Website (CSS theme variables, Tailwind token usage, and environment variables). Use when adding UI styles, theming, or config variables.
---

# Variable Usage - Fujipp Website

Use this skill when tasks involve variables in this project, especially theme tokens and configuration values.

## Scope
- Frontend style variables in `apps/frontend/fujipp-frontend/src/index.css`
- Tailwind/shadcn token usage in React components
- Environment variables for frontend config

## Rules
1. Never hardcode brand/status colors in components. Use existing tokens first.
2. For UI colors, prefer semantic Tailwind utilities mapped from tokens:
- `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`
- `border-border`, `bg-muted`, `text-muted-foreground`, `ring-ring`
3. Add new tokens in both light and dark blocks:
- `:root, :root.light, [data-theme="light"]`
- `:root.dark, .dark, [data-theme="dark"]`
4. If a token must be available via Tailwind utility, expose it in `@theme inline` as `--color-*`.
5. Keep naming semantic and stable:
- Prefer `--success`, `--warning`, `--input-border-focus`
- Avoid raw names like `--blue-1` unless it is a shared neutral/chart scale

## Theme workflow
1. Check existing token in `index.css`.
2. Reuse existing token in component class names.
3. If missing, add token to light + dark + system-dark fallback block.
4. Add `--color-*` mapping in `@theme inline` only if utility class support is needed.
5. Verify contrast quickly for text on primary backgrounds.

## Env variable workflow (Vite)
1. Frontend-exposed variables must be prefixed with `VITE_`.
2. Read through `import.meta.env` only.
3. Never commit secrets in frontend env files.
4. If adding a new env var, also document a safe default in code path.

## Done criteria
- No new hardcoded design colors in TSX/CSS component files.
- New variable names are semantic and consistent.
- Theme behaves in light and dark modes.
