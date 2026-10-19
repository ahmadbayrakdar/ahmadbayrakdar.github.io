# Design brief — ahmadbayrakdar.github.io

Audience: technical recruiters and engineering managers deciding in < 60 s whether to interview Ahmad for
Senior Full-Stack / Frontend / Product Engineer roles (remote, international). Every screen must answer:
*what does he build, how good is it, what exactly did he do, how do I contact him.*

Tone: calm, precise, engineered. No hype words ("passionate", "rockstar", "cutting-edge", "unleash"), no emoji,
no fake metrics, no 3D, no particle backgrounds, no typewriter effects. Restraint is the premium signal.

## Visual system

- Fonts (self-hosted via `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`, `font-display: swap`,
  preload the Geist latin woff2): Geist for everything, Geist Mono for eyebrows, meta labels, tech chips, numbers.
- Type scale (clamp, fluid): display 44→76 px / 1.02 / -0.035em / 600; h2 30→44 / 1.1 / -0.025em / 600;
  h3 20→24 / 1.25 / -0.01em / 600; body 16→17 / 1.65; small 14; mono labels 12 / 0.08em uppercase.
- Colour tokens on `:root` (light) and `[data-theme=dark]` + `@media (prefers-color-scheme: dark)` when no explicit choice.
  Dark is the default look in screenshots.
  - dark: `--bg #0A0B0D`, `--bg-elev #111317`, `--surface #15181D`, `--border rgba(255,255,255,.08)`,
    `--border-strong rgba(255,255,255,.16)`, `--text #ECEDEF`, `--muted #9AA1AC`, `--faint #6B717B`,
    `--accent #8B9CFF`, `--accent-ink #0A0B0D`, `--ok #4ADE80`
  - light: `--bg #FAFAF8`, `--bg-elev #FFFFFF`, `--surface #F3F3F1`, `--border rgba(10,11,13,.08)`,
    `--border-strong rgba(10,11,13,.16)`, `--text #0E0F12`, `--muted #555B66`, `--faint #8A9099`,
    `--accent #3B4FD9`, `--accent-ink #FFFFFF`, `--ok #15803D`
  - All text/background pairs must meet WCAG AA (check muted on surface).
- One decorative element only: a very soft radial glow (accent at 10–14 % opacity, blurred) behind the hero and a
  1 px dotted grid that fades out (mask-image). Nowhere else.
- Radius 14 px cards, 10 px controls, 999 px pills. Borders, not shadows; on hover a card lifts its border to
  `--border-strong` and the screenshot scales 1.02 over 400 ms `cubic-bezier(.2,.7,.2,1)`.
- Screenshots always sit in a minimal browser frame (3 dots + URL text in mono) or, for desktop apps, a window frame.
  `aspect-ratio: 16/10`, `object-fit: cover; object-position: top`. Width/height attributes set, `loading="lazy"` except the
  first featured image, `decoding="async"`, `srcset` with the 800 px thumb and the full image.
- Motion: elements fade+rise 12 px once when entering the viewport (IntersectionObserver, 500 ms, stagger 60 ms).
  Everything disabled under `prefers-reduced-motion`. No scroll-jacking, no smooth-scroll libraries.
- Layout: container 1200 px max, 24 px side padding (16 px under 480 px). Sections 120 px apart (72 px mobile).
  Each section starts with a mono eyebrow `01 / Selected work` and an h2.

## Pages

### Home `/`
1. **Header** (sticky, translucent `--bg` 80 % + backdrop blur, bottom border on scroll): "Ahmad Bayrakdar" wordmark (mono initials
   badge "AB" + name), nav: Work, Expertise, Experience, About, Contact; theme toggle (sun/moon icon, aria-label, persists in
   localStorage), primary button "Hire me" → #contact. Mobile: menu button opens a full-width sheet; focus trapped; Esc closes.
2. **Hero**: left column — availability pill with green dot (`profile.availability`), h1 = `profile.headline`
   (e.g. "Full-stack engineer who ships complete products — from Figma to production."), lead paragraph `profile.intro`,
   CTA row: primary "View selected work" (#work), secondary "Download résumé" (resume_url), tertiary text link "Contact".
   Below: a "proof row" of 3–4 mono facts computed from data or profile (years of experience from profile, number of published
   projects from data, countries from profile, primary stack). Right column — portrait (`/images/ahmadbayrakdar.jpg`, rounded 20 px,
   subtle border, grayscale 0 %) with a small floating card "Currently: <role> @ <company>" from experience[0].
3. **Selected work** `#work`: featured projects (featured = true, priority order), each a large card alternating image left/right on
   desktop (stacked on mobile): browser-framed cover, index number in mono ("01"), title, tagline, meta row (role · years · kind),
   up to 3 `highlights` as short lines with an accent tick, tech chips (max 6 + "+n"), actions "Read case study →" (if case_study
   has content) and "Live site ↗" (if live_url). First featured card is the largest.
4. **Expertise** `#expertise`: 4–5 cards from `profile.expertise` — title, 1–2 sentence description, skills as chips, and
   "Proof:" with links to evidence project pages. Not a logo wall.
5. **Experience** `#experience`: vertical timeline from `profile.experience` (role, company, location, period in mono, bullets,
   linked projects as chips). Education as a compact last row.
6. **More projects** `#projects`: every other published project as a compact card grid (3 cols desktop, 2 tablet, 1 mobile):
   cover thumb, title, one-line summary, year, 3 chips. Filter bar: category chips with counts + text search (vanilla JS on
   pre-rendered cards; without JS all cards show). "Show all n" progressive disclosure after 9 cards. Link "Browse all projects" →
   `/projects/`.
7. **About** `#about`: 2 short paragraphs (`profile.about`), how I work (3 points), languages.
8. **Contact** `#contact`: big h2 "Let's build something reliable." + email (copy button), WhatsApp, LinkedIn, GitHub, résumé;
   contact form (name, email, company optional, message, hidden honeypot `website`) → `POST {API}/api/contact`, inline
   validation, loading state, success and error states with aria-live.
9. **Footer**: © year, "Built with Astro · data served from a self-hosted API", links.

### `/projects/`
Full filterable list (same card component as #6), category + kind filters, search, sort (featured, newest).

### `/projects/<slug>/`
- Breadcrumb, title, tagline, meta grid (Role, Timeline, Client/Company, Type, Platform), action buttons (Live, Repo, other links).
- Large cover in frame, then sections only when they have content: Overview, The problem, My role & responsibilities,
  Key features (2-col list), Architecture (text; render simple `→` arrows lines as a code-ish block), Challenges & solutions
  (pairs, side by side), Results (only verified items), Tech stack (grouped chips), Gallery (grid, click opens an accessible
  lightbox `<dialog>` with arrows/Esc).
- Sidebar on desktop (sticky): quick facts + table of contents.
- Bottom: previous / next project, CTA "Interested in working together?".
- JSON-LD `CreativeWork` + `BreadcrumbList`; OG image = cover; canonical URL.

### `/admin/` (React island, `client:only`, noindex)
See docs/ARCHITECTURE.md for API. Screens: Login → Projects (table with drag handle reorder, columns: cover thumb, title,
category, status pill, featured star toggle, updated; search + status filter; "New project") → Editor (tabs: Basics, Case study,
Media, Links & SEO; sticky footer: Save draft / Publish / Unpublish / Preview / Delete with confirm) → Media manager (drag & drop
multi-upload with per-file progress, client-side preview, set cover, alt text, reorder by drag, delete) → Profile (form for profile
JSON incl. expertise/experience repeaters) → Messages (inbox, mark read, delete) → "Publish site" button in the top bar (calls
/api/admin/rebuild, shows result). Unsaved-change guard. Token kept in sessionStorage only. Same tokens/fonts as the site, denser.

## SEO / performance / a11y
- `<title>`/description per page, canonical, OG + Twitter cards, `sitemap.xml` (@astrojs/sitemap), robots.txt (disallow /admin/),
  JSON-LD `Person` on home with sameAs.
- Lighthouse targets: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO 100 (measure, don't claim).
- Skip link, visible focus rings (2 px accent outline + offset), semantic landmarks, alt text, 44 px touch targets,
  no horizontal scroll at 360 px.
