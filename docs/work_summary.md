# RoboGames 2027 — Engineering & Development Work Summary

> **Domain:** `robogames.work`  
> **Repository:** `robogames_coming_soon`  
> **Prepared For:** RoboGames 2027 Organizing Committee (OC), Department of Computer Science & Engineering, University of Moratuwa  

---

## 1. Executive Summary

Following the acquisition of the domain **`robogames.work`**, the Organizing Committee required a high-fidelity, temporary static landing page to establish the domain's web presence. Because the domain is currently in a pre-announcement staging phase known only to OC members, the site was designed to serve as an **"Arena Boot Sequence"** &mdash; a cyberpunk-styled terminal console with interactive diagnostics, 3D mascot presence, direct links to the primary portal ([robo.cse.mrt.ac.lk](https://robo.cse.mrt.ac.lk/)), and strict search-crawler exclusion.

This document records the full development history, architecture decisions, asset handling, quality assurance testing, and deployment setup completed for the project.

---

## 2. Phase 1: Portal Scraping & Knowledge Extraction

To ensure visual and contextual alignment with the official competition, the public portal at `https://robo.cse.mrt.ac.lk/` was scraped and analyzed using custom Python scraping utilities (`BeautifulSoup4` + Next.js Server Component RSC payload extraction).

### Extracted Competition Data
* **School Track:** Webots simulation qualifier (Deadline: Feb 13) progressing to an in-person physical final at the University of Moratuwa using mailed custom line-following robots.
* **University Track:** Autonomous robotics algorithms, pathfinding, and optimization in Webots followed by an arena finale.
* **Open / BattleBots Track:** Single-elimination physical combat robotics in a polycarbonate-enclosed arena with strict weight/safety inspections.
* **Committee Directory:** Contacts for Induru Adeesha (Chair), Sithum Fernando (Co-Chair), Devindi Wickramarathna (Delegate Lead), and Anuhas Ranasinghe (Tech Lead).
* **Institutional Sponsors:** CSE Department (UoM), Institution of Engineers Sri Lanka (IESL), and SLT-Mobitel.

All data was synthesized and documented into [`docs/robogames_details.md`](robogames_details.md).

---

## 3. Phase 2: Technical Architecture & Design Decisions

### 3.1 Technology Stack
* **Framework:** Next.js (App Router) configured with `output: 'export'` for pure static compilation.
* **UI Engine:** React 19 + TypeScript.
* **Styling Strategy:** **Vanilla CSS** with a custom design system tokens layer (`src/app/globals.css`). This provides zero-runtime overhead, complete control over keyframe animations, glassmorphism, and responsive grid layouts without framework lock-in.
* **Iconography:** Lucide React combined with optimized SVG icons.
* **Typography:** `Space Grotesk` (headings) and `JetBrains Mono` (telemetry/terminal) loaded with zero layout shift via `next/font/google`.

### 3.2 Asset Pipeline
A migration script (`scripts/copy_assets.py`) was created to process and copy raw vector brand marks and 3D robot renders into the production directory:
* `public/logos/`: CSE Department crest, RoboGames wordmarks, IESL logo, SLT-Mobitel logo, UOM seal.
* `public/mascots/`: 3D BattleBot robot renders and hover rovers.

---

## 4. Phase 3: UI & Interactive Features

### 4.1 Arena Boot Sequence
* **Real-time Terminal Stream:** Progressively prints simulated system boot logs initializing Webots nodes, arena perimeter interlocks, and telemetry channels.
* **Interactive Command Parser:** Accepts input from users with dedicated responses:
  * `help`: Lists all available commands.
  * `status`: Outputs system telemetry and 88.4% readiness gauge.
  * `oc`: Displays the committee leads.
  * `categories`: Details the School, University, and Open BattleBots tracks.
  * `social`: Prints links to WhatsApp and Instagram.
  * `main`: Triggers redirect to `https://robo.cse.mrt.ac.lk/`.
  * `clear`: Clears the screen buffer.

### 4.2 3D Robot Mascot Widget
* Features the official RoboGames BattleBot mascot with glowing amber eyes.
* Utilizes a smooth floating keyframe (`animate-float`) and a reactive speech balloon that changes its dialogue in response to terminal commands.

### 4.3 Quick Action Hub & Social Integration
* **Primary CTA:** High-contrast yellow button leading to `robo.cse.mrt.ac.lk`.
* **WhatsApp Channel:** Green button connecting to the official community broadcast channel.
* **Instagram Profile:** Rose/pink button with dedicated SVG icon linking to `@robogames__`.

### 4.4 Staging Security & Privacy
* Configured `<meta name="robots" content="noindex, nofollow" />` in `src/app/layout.tsx`.
* Created `public/robots.txt` with `Disallow: /` to prevent public search engine indexing during staging.

---

## 5. Phase 4: Verification & Browser Subagent Testing

Automated browser subagents were dispatched to `http://localhost:3000` to validate the live UI:
* Verified that the floating navbar, logos, and `.WORK` tag render sharply across desktop and mobile viewports.
* Executed interactive commands (`status`, `oc`, `social`) in the terminal and confirmed reactive mascot dialogue updates.
* Verified hover transitions on the WhatsApp and Instagram action buttons.
* Tested the production build pipeline (`npm run build`), confirming static export generates `out/index.html` with zero build or hydration errors.

---

## 6. Phase 5: CI/CD Pipeline & Git Organization

* **Git History:** The codebase was staged and organized into 4 logical conventional commits:
  1. `chore: initialize Next.js static export setup and project documentation`
  2. `feat(assets): add brand logos, 3D mascots, competition docs, and utility scripts`
  3. `feat(public): add web-optimized logos, mascots, and robots.txt`
  4. `feat(ui): implement Arena Boot Sequence landing page and interactive terminal`
* **Automated CI Workflow:** Configured `.github/workflows/ci.yml` running Node.js 20 build and static export checks on both `main` and `dev` branches.

---

## 8. Phase 6: Organizing Committee Expansion, Performance Optimization & Mobile UX

Following review by the Organizing Committee, several refinements were completed:

1. **Navbar Cleanup:** Removed the "OC STAGING PREVIEW" badge from the navigation bar, maintaining a cleaner brand representation alongside the primary portal destination.
2. **Layout Streamlining:** Removed the three repetitive context cards above the footer, allowing the terminal console and mascot bot to be the primary focus of the page.
3. **Organizing Committee Roster Expansion:**
   * Added the Academic Advisor (Dr. Sulochana Sooriyarachchi) and key leads: Web Lead (Dulranga Dhawanitha), Design Lead (Dineth Thenuwara), Event Lead (Kaveen Hirumal), Finance Lead (Kavindu Jayalath), Logistic Lead (Sachithra Vithanage), and Editorial Lead (Sheereen Rizwan).
   * Updated `docs/robogames_details.md`, `AGENTS.md`, and the interactive terminal `oc` command parser.
4. **Mascot & Asset Performance Optimization (Fixing 10s delay):**
   * **Root Cause:** The mascot image was served as an uncompressed 3000x3000px PNG weighing **9.2 MB**. In static export mode, Next.js serves static assets without runtime on-the-fly resizing. In addition, the University crest was 2.5 MB.
   * **Solution:** Resized and generated a high-DPI 600x600 WebP asset (`battlebot_waving.webp`) at **93.9 KB** (a **99% reduction**), an optimized PNG fallback at 381.7 KB, and compressed the UoM logo down to 55.6 KB. Initial page payload was cut from > 12 MB to < 250 KB, reducing mascot rendering time from ~10 seconds to instantaneous (< 50ms).
5. **Mobile UX Overhaul:**
   * Enforced `font-size: 16px` on the terminal input field on mobile devices to prevent automatic iOS Safari viewport zoom on focus.
   * Responsive navigation bar with adjusted logo proportions and touch targets.
   * Sized action buttons for touch friendliness (`min-height: 44px`).
   * Custom cyberpunk-themed scrollbars for the terminal body.
   * Fully responsive typography and margins preventing any horizontal overflow across devices.

---

## 9. Deliverables Index

| Document / Artifact | Path | Description |
| :--- | :--- | :--- |
| **Competition Details** | `docs/robogames_details.md` | Scraped rules, categories, timelines, and contacts |
| **Design Specification** | `docs/design_spec.md` | Complete design tokens, typography, and component guide |
| **Work Summary** | `docs/work_summary.md` | This engineering history and implementation report |
| **CI Workflow** | `.github/workflows/ci.yml` | GitHub Actions pipeline for `main` and `dev` |
| **Landing Application** | `src/app/` | Layout, page component, and Vanilla CSS design system |
| **Static Production Export**| `out/` | Ready-to-host static HTML/CSS/JS bundles |

