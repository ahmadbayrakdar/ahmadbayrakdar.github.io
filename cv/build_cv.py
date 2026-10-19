"""Build Ahmad Bayrakdar's CV as A4 PDFs: one master version plus role-tuned variants.

    C:/Ahmad/brain-data/envs/media/Scripts/python.exe -I cv/build_cv.py
Outputs cv/out/Ahmad-Bayrakdar-CV-<variant>.pdf (git-ignored) and copies the master to
public/Ahmad-Bayrakdar-CV.pdf for the portfolio site. Every fact here is verified (CV v6, LinkedIn,
live sites, repositories); variants only change emphasis and order, never the facts.
"""
import html, os, shutil
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "cv", "out")
CHROME = os.path.expanduser("~/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe")

CONTACT = [
    ("Email", "ahmad.bayrakdar.eg@gmail.com", "mailto:ahmad.bayrakdar.eg@gmail.com"),
    ("WhatsApp", "+20 108 085 7997", "https://wa.me/201080857997"),
    ("Portfolio", "ahmadbayrakdar.github.io", "https://ahmadbayrakdar.github.io/"),
    ("LinkedIn", "linkedin.com/in/ahmadbayrakdar", "https://www.linkedin.com/in/ahmadbayrakdar/"),
    ("GitHub", "github.com/ahmadbayrakdar", "https://github.com/ahmadbayrakdar"),
]
AVAILABILITY = "On-site in Damascus · hybrid · remote"

SKILLS = {
    "frontend": ("Frontend", "JavaScript, TypeScript, React, Next.js, Vue.js, Angular, Astro, Tailwind CSS, HTML5/CSS3, Arabic RTL & i18n"),
    "backend": ("Backend", "PHP 8, Laravel, Node.js, Express, NestJS, Fastify, Python, FastAPI, REST APIs, WebSockets"),
    "data": ("Data", "MySQL/MariaDB, PostgreSQL, SQLite, MongoDB, Redis, Prisma, Drizzle, Sequelize, TypeORM"),
    "ai": ("AI", "OpenAI, Gemini and Claude APIs, RAG (ChromaDB), agent pipelines with review gates, Claude Code"),
    "devops": ("DevOps", "Linux, nginx, systemd, Docker, GitLab CI, GitHub Actions, AWS, DigitalOcean, Vercel"),
    "design": ("Design", "Figma, UI/UX design, design systems, Adobe XD, Photoshop, Illustrator"),
    "apps": ("Desktop & mobile", "Electron, Expo (React Native)"),
    "process": ("Ways of working", "Agile/Scrum, Git code review, written specs and acceptance criteria, Trello/Jira, technical documentation"),
}

EXPERIENCE = {
    "growger": dict(
        role="Full Stack Engineer", company="Growger", where="Dalelo classifieds marketplace · hybrid",
        dates="Sep 2026 – Present",
        bullets=[
            "Engineer on Dalelo, an Arabic-first classifieds marketplace for real estate, vehicles, services and hotels, on the web and in iOS/Android apps, with tens of thousands of listings.",
            "Ran a security pass across admin, API and payment code: fixed SQL injection, IDOR, CSRF, privilege-escalation and client-controlled payment amount issues.",
            "Built mobile-app API endpoints (home feed, search on map, reels, saved-search alerts, account media) with rate limiting and an abuse blacklist.",
            "Reduced Google Maps cost exposure with caching, Places session tokens, throttled geocoding and bot blocking; designed a structured Areas location model.",
            "Shipped the site-wide redesign in eight QA-verified stages, with dark mode and RTL, English and Turkish passes.",
        ],
        stack="PHP (Flynax), Smarty, MySQL, JavaScript, Google Maps Platform"),
    "shrubhub": dict(
        role="Full Stack Software Engineer", company="ShrubHub", where="Remote · USA", dates="Oct 2023 – Sep 2026",
        bullets=[
            "Built and maintained full-stack features for ShrubHub, an online 3D landscape design and e-commerce platform, and its sister brands MonetizerEngine, Monetize Talks and Justice Guys.",
            "React front ends and Node.js/REST services; PHP platform modules for the shop, design orders and proposals, and customer, designer and installer portals.",
            "AI automation: voice-based AI call automation and email automation with the OpenAI and Gmail APIs.",
            "Delivered 30+ fast, SEO-ready websites for US local businesses through MonetizerEngine (React, Vite, Tailwind, GitHub-based deploys, Search Console).",
        ],
        stack="React, Node.js, PHP, MySQL, OpenAI API, Gmail API"),
    "proitx": dict(
        role="Full Stack Engineer & Product Architect", company="Proitx", where="UAE", dates="Sep 2020 – Sep 2023",
        bullets=[
            "Led the UX redesign in Figma and the full-stack rebuild of Smart Lab, a desktop laboratory information system: Vue 2 + Electron on a Node.js/Express + MySQL backend.",
            "Integrated lab analyzers (ASTM) so instrument results flow straight into patient files; built backend APIs and dashboards used by 20+ laboratories.",
            "Designed reception, results, work-table, permissions, billing and reporting workflows in Arabic, English and Turkish.",
            "Built and redesigned the Proitx company website across three versions.",
        ],
        stack="Vue 2, Vuetify, Electron, Node.js, Express, Sequelize, MySQL, Figma"),
    "evntoo": dict(
        role="Full Stack Developer", company="Evntoo", where="KSA & Egypt", dates="Apr 2022 – Jan 2023",
        bullets=[
            "Built e-learning and reservation platforms end to end: frontend interfaces and backend APIs.",
            "Restructured under-performing platforms into maintainable, efficient systems, working closely with backend and database teams.",
        ],
        stack="Laravel, PHP, Angular, JavaScript, MySQL"),
    "yessoft": dict(
        role="Full Stack Developer", company="Yes-Soft", where="Germany · remote", dates="May 2019 – Aug 2020",
        bullets=["Built custom full-stack solutions with WordPress, PHP and backend integrations; improved deployment pipelines and database-driven workflows."],
        stack="PHP, WordPress, MySQL, JavaScript"),
}

PROJECTS = {
    "marhaba": ("Marhaba Syria", "Classifieds marketplace platform (in development): Next.js 15 + PostgreSQL with row-level security, BullMQ jobs, Typesense search, OTP sign-in, admin MFA and moderation; 3 apps, 10 packages, 137 migrations."),
    "builderization": ("Builderization", "My studio's bilingual EN/AR site (TanStack Start, React 19, Tailwind) with an SVG illustration system, a lead API and push-to-deploy via GitLab CI to a VPS I run. builderization.com"),
    "ahaloop": ("Ahaloop", "Agentic short-video pipeline: Claude Code skills, a review gate on every asset and a novelty gate; FastAPI gateway on a VPS publishing to YouTube, TikTok, Instagram and Facebook."),
    "emailagent": ("AI email support agent", "FastAPI service for a Shopify brand: IMAP inbox, RAG over store documents (ChromaDB), Shopify lookups and OpenAI-drafted replies; Docker + GitLab CI."),
    "chat": ("AI customer-chat platform", "NestJS + TypeORM + MySQL with role guards, Socket.IO real-time chat with human handover, OpenAI assistant and Shopify integration."),
    "portfolio": ("Portfolio platform", "Astro static site on GitHub Pages fed by a self-hosted FastAPI + SQLite CMS with WebP media pipeline, admin panel, backups and CI rebuilds. ahmadbayrakdar.github.io"),
    "metadata": ("AI image metadata automation", "Python + Gemini vision tool that wrote titles, keywords and categories for ~10,000 stock images, turning weeks of work into hours."),
    "otp": ("SMS & WhatsApp OTP gateway", "Laravel 12 + Sanctum API routing codes to MTN Syria, Twilio or the WhatsApp Cloud API with SMS fallback (Dalelo)."),
    "buyut": ("BuyutSyria", "Real-estate marketplace and CRM: Laravel 13 API + Vue 3 SPA with listing verification, agencies, leads and campaigns, Leaflet maps and an OpenStreetMap geo import."),
    "lms": ("Afaq LMS", "Laravel e-learning platform for a health-education academy in Saudi Arabia (Arabic/English)."),
}

EDUCATION = ("BSc Computer Engineering", "International University for Science and Technology, Damascus", "2015 – 2021",
             "Top grades in programming-related coursework")
LANGUAGES = "Arabic (native) · English (professional)"

BASE_SUMMARY = ("Full-stack engineer with 7+ years of shipping production web platforms, business systems and desktop "
                "apps for companies in the USA, UAE, Saudi Arabia, Germany and Syria. I work across the stack — React, "
                "Vue and TypeScript front ends; PHP/Laravel, Node.js and Python back ends; MySQL and PostgreSQL — and "
                "take features from Figma to deployment. I use AI coding tools daily with tests and code review, and "
                "integrate LLMs (OpenAI, Gemini, Claude) into products.")

VARIANTS = {
    "fullstack": dict(title="Senior Full-Stack Engineer", summary=BASE_SUMMARY,
                      skills=["frontend", "backend", "data", "ai", "devops", "design", "apps"],
                      projects=["marhaba", "builderization", "ahaloop", "emailagent", "portfolio"]),
    "laravel": dict(title="Senior Full-Stack Developer · PHP/Laravel & Vue",
                    summary=("Full-stack developer with 7+ years of production PHP work — Laravel, core PHP and a large "
                             "commercial PHP platform — paired with Vue and React front ends. I care about secure, "
                             "maintainable code: recent work includes closing SQL injection, IDOR and CSRF issues, rate-"
                             "limited APIs for mobile apps and MySQL query tuning. Comfortable owning admin panels, "
                             "background jobs, third-party integrations and deployments (Docker, CI/CD, Linux)."),
                    skills=["backend", "data", "frontend", "devops", "ai", "design"],
                    projects=["buyut", "otp", "lms", "builderization", "portfolio"]),
    "ai": dict(title="AI & Full-Stack Engineer",
               summary=("Engineer who ships LLM features into production, not just demos: a RAG email-support agent for a "
                        "Shopify brand, an agentic video pipeline with automated review and novelty gates, and AI "
                        "automation for call and email workflows. 7+ years of full-stack engineering underneath — React, "
                        "Vue, TypeScript, PHP/Laravel, Node.js, Python/FastAPI — so I can judge and own the code end to "
                        "end, including cost, latency and failure modes."),
               skills=["ai", "backend", "frontend", "data", "devops", "process"],
               projects=["ahaloop", "emailagent", "chat", "metadata", "marhaba"]),
    "erpnext": dict(title="Senior Full-Stack Developer · Python, Vue & React",
                    summary=("Full-stack developer with 7+ years across Python (FastAPI), PHP/Laravel and Node.js back "
                             "ends and Vue/React front ends, including e-learning platforms for Saudi academies (Afaq LMS, "
                             "Sna Academy). Experienced with payment-gateway security, REST APIs, background workers, "
                             "Docker and CI/CD, and integrating OpenAI into products. Quick to learn new frameworks such as "
                             "Frappe/ERPNext and Open edX."),
                    skills=["backend", "frontend", "ai", "data", "devops", "design"],
                    projects=["lms", "emailagent", "portfolio", "marhaba", "otp"]),
    "webmobile": dict(title="Full-Stack Engineer · Web & Mobile",
                      summary=BASE_SUMMARY + " Strong in bilingual Arabic/English (RTL) interfaces and in payment, messaging and analytics integrations.",
                      skills=["frontend", "backend", "apps", "ai", "data", "devops", "design"],
                      projects=["builderization", "marhaba", "emailagent", "otp", "portfolio"]),
    "node": dict(title="Full-Stack Developer · TypeScript, React & Node.js",
                 summary=("Full-stack developer working daily in TypeScript, React/Next.js and Node.js (Express, NestJS, "
                          "Fastify), with JWT auth and role-based access, SQL databases with ORMs (Prisma, Drizzle, "
                          "TypeORM), Redis/BullMQ queues and Socket.IO. 7+ years of shipping production systems, comfortable "
                          "in code review and in a fast-moving team."),
                 skills=["frontend", "backend", "data", "devops", "ai", "design"],
                 projects=["marhaba", "chat", "builderization", "portfolio", "ahaloop"]),
    "payments": dict(title="Senior Full-Stack Engineer · Payments & Secure Systems",
                     summary=("Full-stack engineer with 7+ years building secure web applications and APIs. Payment-"
                              "relevant work includes fixing client-controlled payment amounts in PayPal and Yookassa "
                              "gateways, server-side validation and rate limiting on production APIs, and a wallet/ledger "
                              "design with payment adapters. My back-end experience is in PHP/Laravel, TypeScript "
                              "(NestJS) and Python; I am ready to work in .NET and Java, applying the same object-"
                              "oriented and security practices."),
                     skills=["backend", "data", "frontend", "devops", "process", "ai"],
                     projects=["marhaba", "otp", "chat", "portfolio", "buyut"]),
    "pm": dict(title="Technical Project Lead · Full-Stack Engineer",
               summary=("Engineer-turned-delivery-lead with 7+ years shipping software for clients in the USA, Gulf and "
                        "Syria. I turn client needs into written specs and acceptance criteria, plan and track delivery, "
                        "and keep several products moving at once — from leading the Smart Lab product redesign at Proitx "
                        "to delivering 30+ client websites at MonetizerEngine. I use AI tools (Claude, ChatGPT) daily for "
                        "requirements, documentation and reporting."),
               skills=["process", "ai", "backend", "frontend", "design", "devops"],
               projects=["marhaba", "builderization", "ahaloop", "portfolio", "lms"]),
    "coordinator": dict(title="Project Coordinator · Technical Background",
                        summary=("Organised, detail-oriented professional with 7+ years in software delivery for "
                                 "international companies. Experienced in coordinating work across remote teams and "
                                 "clients, planning timelines, keeping clear documentation and progress reports, and "
                                 "setting up the tools and systems an office runs on. Fluent Arabic and English."),
                        skills=["process", "ai", "design", "frontend", "backend"],
                        projects=["builderization", "marhaba", "portfolio"]),
}

CSS = """
@page { size: A4; margin: 14mm 15mm 14mm 15mm; }
* { box-sizing: border-box; }
body { font-family: "Segoe UI", Arial, sans-serif; color: #16181D; font-size: 9.6pt; line-height: 1.42; margin: 0; }
a { color: inherit; text-decoration: none; }
header { display: grid; gap: 4px; padding-bottom: 10px; border-bottom: 1.5px solid #16181D; }
h1 { font-size: 22pt; line-height: 1.05; margin: 0; letter-spacing: -0.4px; }
.role { font-size: 11.5pt; font-weight: 600; color: #3446C8; }
.contact { display: flex; flex-wrap: wrap; gap: 2px 14px; font-size: 8.6pt; color: #3D424B; }
.contact b { font-weight: 600; color: #16181D; }
section { margin-top: 11px; }
h2 { font-size: 9pt; letter-spacing: 1.4px; text-transform: uppercase; color: #3446C8; margin: 0 0 5px; }
p { margin: 0; }
.skills { display: grid; grid-template-columns: 30mm 1fr; gap: 2px 10px; }
.skills dt { font-weight: 600; }
.skills dd { margin: 0; }
.job { margin-top: 7px; break-inside: avoid; }
.job-head { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
.job-head .t { font-weight: 700; font-size: 10.2pt; }
.job-head .t span { font-weight: 400; color: #3D424B; }
.job-head .d { white-space: nowrap; font-size: 8.8pt; color: #3D424B; font-variant-numeric: tabular-nums; }
ul { margin: 3px 0 0; padding-left: 14px; }
li { margin: 1.5px 0; }
.stack { font-size: 8.4pt; color: #565C66; margin-top: 2px; }
.proj { margin-top: 4px; break-inside: avoid; }
.proj b { font-weight: 700; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
"""


def esc(s):
    return html.escape(s)


def render(v):
    c = " ".join(f'<span><b>{esc(k)}</b> <a href="{u}">{esc(t)}</a></span>' for k, t, u in CONTACT)
    skills = "".join(f"<dt>{esc(SKILLS[k][0])}</dt><dd>{esc(SKILLS[k][1])}</dd>" for k in v["skills"])
    jobs = []
    for key in ("growger", "shrubhub", "proitx", "evntoo", "yessoft"):
        j = EXPERIENCE[key]
        lis = "".join(f"<li>{esc(b)}</li>" for b in j["bullets"])
        jobs.append(f'<div class="job"><div class="job-head"><div class="t">{esc(j["role"])} · {esc(j["company"])} '
                    f'<span>— {esc(j["where"])}</span></div><div class="d">{esc(j["dates"])}</div></div>'
                    f'<ul>{lis}</ul><div class="stack">{esc(j["stack"])}</div></div>')
    projs = "".join(f'<div class="proj"><b>{esc(PROJECTS[k][0])}</b> — {esc(PROJECTS[k][1])}</div>' for k in v["projects"])
    deg, school, years, note = EDUCATION
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Ahmad Bayrakdar — CV</title>
<style>{CSS}</style></head><body>
<header><h1>Ahmad Bayrakdar</h1><div class="role">{esc(v["title"])}</div>
<div class="contact">{c}<span><b>Availability</b> {esc(AVAILABILITY)}</span></div></header>
<section><h2>Profile</h2><p>{esc(v["summary"])}</p></section>
<section><h2>Skills</h2><dl class="skills">{skills}</dl></section>
<section><h2>Experience</h2>{"".join(jobs)}</section>
<section><h2>Selected projects</h2>{projs}</section>
<section class="two"><div><h2>Education</h2><p><b>{esc(deg)}</b><br>{esc(school)} · {esc(years)}<br>{esc(note)}</p></div>
<div><h2>Languages</h2><p>{esc(LANGUAGES)}</p></div></section>
</body></html>"""


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page()
        for name, v in VARIANTS.items():
            pg.set_content(render(v), wait_until="load")
            dest = os.path.join(OUT, f"Ahmad-Bayrakdar-CV-{name}.pdf")
            pg.pdf(path=dest, format="A4", print_background=True, prefer_css_page_size=True)
            print(name, os.path.getsize(dest))
        b.close()
    shutil.copy2(os.path.join(OUT, "Ahmad-Bayrakdar-CV-fullstack.pdf"), os.path.join(ROOT, "public", "Ahmad-Bayrakdar-CV.pdf"))
    print("master -> public/Ahmad-Bayrakdar-CV.pdf")
