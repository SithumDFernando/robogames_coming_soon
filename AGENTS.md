<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Guidelines & Repository Architecture: RoboGames 2027 (`robogames.work`)

Welcome, AI Agent. This document defines the engineering standards, architecture constraints, design system references, and operational workflows for this repository. Follow these instructions strictly when modifying, extending, or maintaining this codebase.

---

## 1. Project Identity & Staging Scope

* **Purpose:** Teaser and operational staging portal for `robogames.work`, supporting **RoboGames 2027**.
* **Host Organization:** Department of Computer Science & Engineering (CSE), University of Moratuwa in collaboration with the Institution of Engineers, Sri Lanka (IESL).
* **Principal Sponsor:** SLT-MOBITEL.
* **Confidentiality:** This domain is currently in an unannounced **internal preview state** exclusively for Organizing Committee (OC) members.
* **Crawler Protection:** Must remain strictly excluded from search engines (`noindex, nofollow` in `src/app/layout.tsx` and `Disallow: /` in `public/robots.txt`). Do not remove these rules.

---

## 2. Hard Rule: Relative Paths in Documentation

> [!IMPORTANT]
> **ALWAYS use relative paths or paths starting from the repository root in all documentation (`.md`) files.**
> * **DO:** Use `docs/design_spec.md`, `src/app/globals.css`, `public/logos/`, or `./.github/workflows/ci.yml`.
> * **NEVER DO:** Never commit machine-specific absolute paths (e.g. `file:///c:/Users/...`, `C:\Users\...`, or `/home/user/...`). Absolute paths break across collaborator machines, GitHub web previews, and CI runners.

---

## 3. Reference Documentation & Specifications (`docs/`)

Always consult the dedicated documentation files before making architectural, design, or textual changes:

| Specification Document | Path | Purpose & Contents |
| :--- | :--- | :--- |
| **Design Specification** | [`docs/design_spec.md`](docs/design_spec.md) | Authoritative style guide: design tokens, color palette (`#F8D826`, `#070709`, surfaces), typography scale (`Space Grotesk` & `JetBrains Mono`), component blueprints, micro-animations, and responsive breakpoints. |
| **Competition Details** | [`docs/robogames_details.md`](docs/robogames_details.md) | Verified competition data: School, University, and Open (BattleBots) tracks, Webots simulation requirements, hardware distribution workflows, timelines, and committee directories. |
| **Engineering Work Summary**| [`docs/work_summary.md`](docs/work_summary.md) | Historical record of project milestones, scraping methods, asset pipelines, browser subagent QA testing, and CI/CD setup. |
| **Strategic Ideas & Roadmap**| [`docs/ideas.md`](docs/ideas.md) | Conceptual blueprints and feature ideas for `robogames.work`: ArenaOS live telemetry, Webots pre-flight linter, 3D digital twins, and OC operational tools. |
| **Visual Inception Benchmarks**| [`docs/ss/`](docs/ss/) | Screenshots of the official public portal (`home .png`, `contact us.png`, `footer.png`, `partners.png`) for visual alignment. |

---

## 4. Technology Stack & Hard Constraints

### 4.1 Framework & Build Rules
* **Runtime:** Next.js (App Router, Turbopack enabled) + React 19 + TypeScript.
* **Static Export Mandate:** Configured with `output: 'export'` in `next.config.ts`.
  * **Rule:** Do NOT use server-side runtime APIs (e.g., dynamic server-rendered routes without `generateStaticParams`, server actions requiring node servers, or dynamic middleware).
  * **Rule:** Ensure all static output (`out/`) compiles without runtime dependencies.

### 4.2 Styling Strategy: Vanilla CSS
* **Rule:** All styling must be written in **Vanilla CSS** inside [`src/app/globals.css`](src/app/globals.css).
* **Avoid ad-hoc Tailwind classes:** Unless Tailwind is officially configured with a postcss processor, utility classes like `p-4`, `flex`, `grid` will not process. Use semantic BEM-like classnames (`.nav-bar`, `.terminal-card`, `.mascot-figure`, `.btn-primary-action`) mapped to CSS custom properties.
* **Color Tokens:**
  * Backgrounds: `--bg-primary: #070709`, `--bg-surface: #0E0E13`, `--bg-surface-elevated: #16161F`
  * Signature Accent: `--accent-yellow: #F8D826`, `--accent-yellow-hover: #FFE44A`
  * Status Accents: WhatsApp Emerald `--accent-green: #25D366`, Instagram Pink `--accent-instagram: #F472B6`, Unix Red `#FF5F56`, Staging Amber `#F59E0B`

### 4.3 Typography
* Loaded via `next/font/google` in [`src/app/layout.tsx`](src/app/layout.tsx):
  * Headings & UI: `Space_Grotesk` (`var(--font-heading)`)
  * Terminal, Code & Telemetry: `JetBrains_Mono` (`var(--font-mono)`)

---

## 5. Asset Management Pipeline

* **Source Assets (`assets/`):** Raw, high-resolution master vectors and renders (do not delete or edit directly).
  * `assets/logos/`: CSE, UOM, IESL, SLT, and RoboGames branding.
  * `assets/mascots/`: 3D renders of BattleBot combat robots and School/Uni rovers.
* **Production Static Assets (`public/`):**
  * Web-optimized SVG/PNG files served by Next.js at `/logos/` and `/mascots/`.
  * Always use [`scripts/copy_assets.py`](scripts/copy_assets.py) when syncing or adding new assets.
  * When rendering images in Next.js, always specify explicit `width`, `height`, and `style={{ width: 'auto', height: 'Xpx' }}` to prevent layout shift and aspect ratio warnings.

---

## 6. Component & UI Conventions

### 6.1 Interactive Terminal Console (`terminal@robogames.work:~`)
* The terminal in [`src/app/page.tsx`](src/app/page.tsx) must auto-scroll its internal container (`terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight`), **never** scrolling the entire window.
* When adding new features or external destinations, register corresponding commands in the `handleCommand` switch statement (e.g., `help`, `status`, `oc`, `categories`, `social`, `main`, `clear`).

### 6.2 3D Mascot Widget
* Uses `animate-float` keyframe loop for continuous gentle floating motion.
* The speech balloon reacts dynamically to user interactions in the terminal console.

### 6.3 Brand Social Links
* **Primary Portal:** `https://robo.cse.mrt.ac.lk/`
* **WhatsApp Community:** `https://whatsapp.com/channel/0029VbE3zlc7IUYcNUqb9n0S`
* **Instagram Profile:** `https://www.instagram.com/robogames__?dlrf=YngwdjVqa2JhMmVq`

---

## 7. Verification & Quality Assurance Workflow

Before concluding any code change or committing work:

1. **Test Production Build & Static Export:**
   ```bash
   npm run build
   ```
   * Ensure TypeScript compiles without errors.
   * Verify that Next.js static pages prerender successfully (`3/3 static pages`).
   * Confirm that `out/index.html` and `out/robots.txt` are created.

2. **Verify in Development Server:**
   ```bash
   npm run dev
   ```
   * Test at `http://localhost:3000`.
   * Check for console warnings regarding image dimensions or hydration mismatches.

3. **CI Pipeline Compliance:**
   * All changes must satisfy [`.github/workflows/ci.yml`](.github/workflows/ci.yml) which executes `npm ci` and `npm run build` on `main` and `dev` branches.

---

## 8. Organizing Committee (OC) Contacts

If technical clarifications are required regarding event rules or institutional assets:

* **Academic Advisor:** Dr. Sulochana Sooriyarachchi
* **Chairperson:** Induru Adeesha (`induru.24@cse.mrt.ac.lk` | `+94 71 033 4085`)
* **Co-Chairperson:** Sithum Fernando (`sithum.24@cse.mrt.ac.lk` | `+94 77 434 8111`)
* **Technical Lead:** Anuhas Ranasinghe (`anuhas.24@cse.mrt.ac.lk` | `+94 76 965 2770`)
* **Design Lead:** Dineth Thenuwara
* **Publicity Lead:** Thisath Kariyawasam
* **Web Lead:** Dulranga Dhawanitha
* **Finance Lead:** Kavindu Jayalath
* **Event Lead:** Kaveen Hirumal
* **Logistic Lead:** Sachithra Vithanage
* **Delegate Lead:** Devindi Wickramarathna (`devindi.24@cse.mrt.ac.lk` | `+94 70 166 3373`)
* **Editorial Lead:** Sheereen Rizwan

