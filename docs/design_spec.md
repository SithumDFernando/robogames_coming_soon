# RoboGames 2027 — Design Specification & Style Guide

> **Project:** `robogames.work` (Arena Boot Sequence)  
> **Target Audience:** Internal Organizing Committee (OC) Preview / Pre-launch Teaser  
> **Brand Identity:** Department of Computer Science & Engineering, University of Moratuwa  

---

## 1. Aesthetic Vision & Design Philosophy

The visual identity of `robogames.work` bridges two core aesthetics:
1. **Collegiate Engineering Prestige:** Clean, structured editorial layouts representing the University of Moratuwa and the Institution of Engineers, Sri Lanka (IESL).
2. **Cyberpunk Arena Telemetry:** High-contrast dark backgrounds, glowing phosphor yellow accents, terminal command buffers, and reactive 3D robot mascots that evoke the energy of competitive autonomous combat robotics.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Surfaces & Backgrounds
| Token Name | Hex / CSS Value | Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#070709` | Root viewport background |
| `--bg-surface` | `#0E0E13` | Primary cards, floating navbar, and side panels |
| `--bg-surface-elevated` | `#16161F` | Elevated popovers, dialogues, and tooltips |
| `--bg-terminal` | `rgba(12, 12, 16, 0.90)` | Terminal viewport with 14px backdrop blur |

### 2.2 Brand & Functional Accents
| Token Name | Hex / CSS Value | Description & Intent |
| :--- | :--- | :--- |
| `--accent-yellow` | `#F8D826` | Signature RoboGames yellow brand accent |
| `--accent-yellow-hover` | `#FFE44A` | Interactive hover state for yellow elements |
| `--accent-yellow-dim` | `rgba(248, 216, 38, 0.12)` | Subtle tinted container backgrounds and badges |
| `--accent-green` | `#25D366` | WhatsApp emerald & nominal system status indicator |
| `--accent-green-dim` | `rgba(37, 211, 102, 0.12)` | Tinted background for WhatsApp button and active beacon |
| `--accent-instagram` | `#F472B6` | Instagram brand tint (`rgba(225, 48, 108, 0.12)` background) |
| `--accent-red` | `#FF5F56` | Unix close dot & critical terminal error log |
| `--accent-amber` | `#F59E0B` | Staging warning badge & confidential channel alert |

### 2.3 Typography & Borders
| Token Name | Hex / CSS Value | Usage |
| :--- | :--- | :--- |
| `--text-main` | `#F5F5F7` | Primary headings, button labels, and high-emphasis text |
| `--text-muted` | `#9696A0` | Body copy, secondary descriptions, and terminal logs |
| `--text-dim` | `#5C5C68` | Placeholder text, copyright, and ASCII borders |
| `--border-light` | `rgba(255, 255, 255, 0.10)` | General card, input, and divider boundaries |
| `--border-yellow` | `rgba(248, 216, 38, 0.35)` | Highlighted boundaries, tags, and interactive focus |

---

## 3. Typography Hierarchy

### 3.1 Font Families
* **Heading & Display:** `Space Grotesk` (weights: `600`, `700`, `900`) &mdash; geometric, architectural grotesque with sharp mechanical terminations.
* **Telemetry & Monospaced:** `JetBrains Mono` (weights: `400`, `500`, `700`) &mdash; high legibility, optimized code tracking, and clear symbol distinctions.

### 3.2 Type Scale
| Level | Font Family | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | Space Grotesk | `clamp(48px, 9vw, 96px)` | 900 | `1.0` | `-0.02em` |
| **Section Title** | Space Grotesk | `clamp(16px, 2.5vw, 24px)`| 700 | `1.2` | `0.02em` |
| **Card Title** | Space Grotesk | `17px` | 700 | `1.3` | `0` |
| **Body Standard** | Space Grotesk | `14px – 15px` | 400 | `1.6` | `0` |
| **Telemetry / Logs**| JetBrains Mono | `13px` | 400 / 500 | `1.5` | `0` |
| **Badges & Tags** | JetBrains Mono | `10px – 12px` | 600 / 700 | `1.0` | `0.05em – 0.15em` |

---

## 4. Component Blueprints

### 4.1 Floating Pill Navbar
* **Container:** 72px fixed height, `14px` border radius, frosted glass (`rgba(14, 14, 19, 0.85)` + 12px blur).
* **Left Segment:**
  * CSE Department crest (`height: 28px; width: auto`).
  * Hairline separator (`1px solid rgba(255, 255, 255, 0.15)`).
  * RoboGames SVG wordmark + `.WORK` tag (`#F8D826`, 11px monospaced).
* **Right Segment:**
  * `OC STAGING PREVIEW` badge with animated glowing pulse dot.
  * Direct portal link: `Main Portal ↗` (`btn-portal` style).

### 4.2 Arena Telemetry Terminal Card
* **Window Frame:** Dual-tone dark container with Unix title bar dots (Red `#FF5F56`, Amber `#FFBD2E`, Green `#27C93F`).
* **Progress Gauge:** Integrated boot percentage readout with animated amber/yellow progress fill.
* **Buffer Screen:** Fixed height scrollable container (`300px`) showing ASCII banners and categorized color-coded logs (`log-yellow`, `log-green`, `log-amber`, `log-gray`, `log-red`).
* **Command Prompt:** Real-time CLI parser accepting `help`, `status`, `oc`, `categories`, `social`, `main`, and `clear`.

### 4.3 3D Mascot Interactive Card
* **Figure Container:** 160px &times; 160px float container with smooth continuous floating keyframe (`animate-float`).
* **3D Asset:** High-resolution render of the BattleBot mascot featuring glowing amber visor eyes.
* **Dialogue Balloon:** Dark bubble (`#181822`) with dynamic reactive quotes triggered by user terminal inputs.

### 4.4 Quick Action Hub
* **Primary Portal Button:** Solid high-contrast RoboGames yellow (`#F8D826`) button with arrow icon, leading directly to `robo.cse.mrt.ac.lk`.
* **Social Community Grid:** 2-column balanced action strip:
  * **WhatsApp:** Emerald green badge with community channel invitation.
  * **Instagram:** Pink/rose badge with `@robogames__` official profile link.

### 4.5 Institutional Partner Footer
* **Layout:** Flex row on desktop, stack on mobile.
* **Crest Display:** University of Moratuwa seal and CSE Department wordmark.
* **Affiliate Badges:** Institution of Engineers, Sri Lanka (IESL) and SLT-Mobitel.
* **Copyright Notice:** `robogames.work • © 2027 RoboGames // ALL RIGHTS RESERVED // OC SANDBOX`.

---

## 5. Motion, Atmosphere & Micro-interactions

### 5.1 Ambient Background & Scanlines
* **Radial Lighting:** Multi-layer radial gradients centered at the top-middle (`rgba(248, 216, 38, 0.13)`) and bottom-left (`rgba(248, 216, 38, 0.04)`).
* **Cyber Grid:** 40px &times; 40px subtle geometric grid lines (`rgba(255, 255, 255, 0.035)`).
* **Scanline Overlay:** 4px alternating linear gradient at 35% opacity across the entire viewport.

### 5.2 Keyframe Animations
```css
/* Continuous floating mascot motion */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1.5deg); }
}

/* Pulsing radar dot for status beacon */
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

/* Volumetric text glow */
.hero-title {
  text-shadow: 0 0 40px rgba(248, 216, 38, 0.35);
}
```

---

## 6. Responsive Breakpoints

| Breakpoint | Window Width | Layout Behaviors |
| :--- | :--- | :--- |
| **Mobile** | `< 768px` | Single column; terminal and mascot stack vertically; footer centers crests; hero title clamps to 48px. |
| **Tablet** | `768px – 991px` | Terminal takes full width; quick actions and feature strip form 2-column or 3-column rows. |
| **Desktop** | `≥ 992px` | 7:5 grid split between Terminal and Mascot/Actions; horizontal footer; maximum width restricted to 1220px. |

---

## 7. Staging Security & SEO Rules

* **Robots Exclusion:** Enforced via `public/robots.txt` (`User-agent: *`, `Disallow: /`).
* **HTML Head Metadata:** Injected `<meta name="robots" content="noindex, nofollow" />` in `src/app/layout.tsx`.
* **Private State Notice:** Clearly communicates OC-only staging scope to prevent participant confusion prior to public launch.
