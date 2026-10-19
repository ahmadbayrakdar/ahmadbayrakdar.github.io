# Portfolio architecture

```
Browser ──► https://ahmadbayrakdar.github.io        (GitHub Pages, static Astro build: /, /projects/, /projects/<slug>/, /admin/)
               │  build time: GET /api/export  (GitHub Actions, hourly + on "Publish site")
               │  runtime:    contact form, admin panel (Bearer token)
               ▼
        https://portfolio-api.builderization.com    (nginx TLS on the Builderization VPS 45.153.184.201)
               ├── /api/*    → 127.0.0.1:8810  portfolio-api.service (FastAPI + uvicorn, 1 worker, user portfolio)
               └── /media/*  → /var/lib/portfolio-api/media (served by nginx, immutable cache)
                     SQLite: /var/lib/portfolio-api/portfolio.db (WAL)   never exposed to the network
                     Backups: /var/backups/portfolio-api/ daily (portfolio-api-backup.timer), 14 kept
                     Secrets: /etc/portfolio-api/env (0600, root:portfolio)
```

Nothing else on the VPS is touched: builderization.com (:3300, :8100) and brain-uploader (:8790) keep running.
The only shared files changed are a new nginx site file and a certbot certificate for the new subdomain
(wildcard DNS `*.builderization.com` already points at the VPS).

## Data model (SQLite)

`projects`
| column | type | notes |
|---|---|---|
| id | INTEGER PK | |
| slug | TEXT UNIQUE | url segment, `^[a-z0-9-]+$` |
| title, tagline, summary | TEXT | summary ≤ 280 chars for cards |
| category | TEXT | one of: `SaaS & Platforms`, `Web Applications`, `Desktop & Mobile`, `Client Websites`, `E-commerce`, `UI/UX Design`, `AI & Automation`, `Personal & Early Work` |
| kind | TEXT | `Product` \| `Client` \| `Employment` \| `Personal` |
| client, industry, location, role | TEXT | |
| year_start, year_end | INTEGER NULL | year_end NULL = ongoing ("Present") |
| status | TEXT | `draft` \| `published` |
| featured | INTEGER 0/1 | |
| priority | INTEGER | display order, ascending (featured first, then priority) |
| tech, tags, highlights | TEXT (JSON array of strings) | |
| links | TEXT (JSON `[{label,url}]`) | |
| live_url, repo_url | TEXT NULL | |
| case_study | TEXT (JSON, see below) | |
| seo_title, seo_description | TEXT NULL | |
| cover_media_id | INTEGER NULL FK media | |
| created_at, updated_at, published_at | TEXT ISO-8601 UTC | |

`case_study` JSON: `{ "overview": str, "problem": str, "role": str, "responsibilities": [str], "features": [str],
"architecture": str, "challenges": [{"challenge": str, "solution": str}], "results": [str], "notes": str }`
— every key optional; empty case_study = no case-study page sections.

`media`: id, project_id (NULL allowed), file (webp name), thumb (webp name), width, height, bytes, alt, sort, created_at.
`users`: id, email UNIQUE, pass_hash (hashlib.scrypt n=2^15,r=8,p=1, salted), created_at.
`settings`: key PK, value JSON — key `profile` (see below).
`messages`: id, name, email, company, body, ip_hash, read 0/1, created_at.
`audit`: id, at, user, action, target — every admin write.

`profile` JSON: `{name, headline, positioning, intro, location, availability, email, whatsapp, linkedin, github, youtube,
resume_url, about:[str], expertise:[{title, description, skills:[str], evidence:[slug]}],
experience:[{role, company, location, start, end, bullets:[str], projects:[slug]}], education:[{degree, school, start, end}]}`

## API (JSON; errors are `{"detail": str}`)

Public (CORS: `https://ahmadbayrakdar.github.io`, `http://localhost:4321`):
- `GET /api/health` → `{ok, version}`
- `GET /api/profile`
- `GET /api/projects?category=&featured=1` → published projects, list shape (no case_study), ordered featured desc, priority asc
- `GET /api/projects/{slug}` → published project, full shape (with gallery)
- `GET /api/export` → `{profile, projects:[full shape], generated_at}` (used by the static build)
- `POST /api/contact` `{name, email, company?, message, website?}` (`website` = honeypot) → 201; 5/hour/IP

Admin (header `Authorization: Bearer <token>`; token = HMAC-SHA256 signed `{sub, exp}`, 12 h):
- `POST /api/auth/login` `{email, password}` → `{token, expires_at}`; 5 failed tries / 15 min / IP → 429
- `GET /api/auth/me`
- `GET /api/admin/projects` (all statuses) · `POST /api/admin/projects` · `GET|PUT|DELETE /api/admin/projects/{id}`
- `PUT /api/admin/projects/order` `{ids:[...]}` → rewrites priority 10,20,30…
- `POST /api/admin/projects/{id}/media` multipart `files[]` (jpeg/png/webp/gif ≤ 15 MB each) → WebP ≤ 2400 px + 800 px thumb, EXIF stripped
- `PATCH /api/admin/media/{id}` `{alt?, sort?}` · `DELETE /api/admin/media/{id}`
- `PUT /api/admin/projects/{id}/cover` `{media_id}`
- `GET|PUT /api/admin/profile`
- `GET /api/admin/messages` · `PATCH /api/admin/messages/{id}` `{read}` · `DELETE /api/admin/messages/{id}`
- `POST /api/admin/rebuild` → GitHub `repository_dispatch` (`portfolio-content-changed`) when `GITHUB_DISPATCH_TOKEN` is set

Full project shape: all columns above with JSON decoded, plus `cover: Media|null`, `gallery: [Media]`;
`Media = {id, url, thumb_url, width, height, alt, sort}` (absolute URLs under `/media/`).

## Static site

Astro 5 (static output) + React islands (project filter, admin). Build reads `PORTFOLIO_API` (`/api/export`) and falls back to
`src/data/snapshot.json` (last good export, committed) if the API is unreachable. Pages are pre-rendered, so every project page is
crawlable; `sitemap.xml`, canonical URLs, Open Graph images and JSON-LD come from the same data.
Deploy: `.github/workflows/deploy.yml` (push to main, hourly cron, `repository_dispatch`) → GitHub Pages (source: GitHub Actions).
