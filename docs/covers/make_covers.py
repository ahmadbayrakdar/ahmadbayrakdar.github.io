"""Draw SVG cover art (1600x1000) for portfolio projects that have no screenshot.

    python docs/covers/make_covers.py            # writes docs/covers/svg/<slug>.svg
Render to WebP for upload with any headless browser (the API accepts raster images only).
The site already frames every cover in a browser chrome, so each cover is drawn full-bleed like a real screen:
a homepage (business name in the nav, headline, motif panel, service cards), a desktop app (sidebar, stats,
table, motif panel) or a phone mock beside the product name. Motifs are line drawings themed to the business.
"""
import html, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg")
W, H = 1600, 1000

# ---- motifs: stroke drawings in a 100x100 box ("f" marks a filled accent shape) ------------------------
M = {
    "scissors": '<circle cx="30" cy="74" r="12"/><circle cx="70" cy="74" r="12"/><path d="M38 64 L74 16"/><path d="M62 64 L26 16"/><circle cx="50" cy="42" r="2.5" class="f"/>',
    "polish": '<rect x="32" y="44" width="36" height="42" rx="9"/><rect x="41" y="20" width="18" height="24" rx="4"/><path d="M40 60 h20"/><path d="M76 28 l6-6 M80 40 h9 M76 52 l6 6"/>',
    "lotus": '<path d="M50 80 C38 66 37 48 50 26 C63 48 62 66 50 80Z"/><path d="M50 80 C33 78 20 64 18 46 C33 48 45 58 50 80"/><path d="M50 80 C67 78 80 64 82 46 C67 48 55 58 50 80"/><path d="M26 88 h48"/>',
    "spray": '<path d="M36 42 h26 v40 a7 7 0 0 1-7 7 h-12 a7 7 0 0 1-7-7z"/><path d="M41 42 v-14 h20 l9 7"/><path d="M78 24 l7-4 M78 34 h10 M78 44 l7 4"/><path d="M42 62 h14"/>',
    "tire": '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="14"/><path d="M50 16 v20 M50 64 v20 M16 50 h20 M64 50 h20 M26 26 l14 14 M60 60 l14 14 M74 26 l-14 14 M40 60 l-14 14"/>',
    "gear": '<circle cx="50" cy="50" r="15"/><path d="M50 14 v12 M50 74 v12 M14 50 h12 M74 50 h12 M24 24 l9 9 M67 67 l9 9 M76 24 l-9 9 M33 67 l-9 9"/><circle cx="50" cy="50" r="27"/>',
    "network": '<circle cx="50" cy="22" r="9"/><circle cx="22" cy="74" r="9"/><circle cx="78" cy="74" r="9"/><circle cx="50" cy="54" r="6" class="f"/><path d="M50 31 v17 M45 58 L29 68 M55 58 L71 68 M31 74 h38"/>',
    "rings": '<circle cx="38" cy="56" r="22"/><circle cx="62" cy="56" r="22"/><path d="M58 22 l4-8 4 8-4 6z"/>',
    "comb": '<path d="M18 30 h64 v14 h-64z"/><path d="M24 44 v26 M32 44 v30 M40 44 v26 M48 44 v30 M56 44 v26 M64 44 v30 M72 44 v26"/>',
    "braid": '<path d="M50 12 C30 24 70 36 50 48 C30 60 70 72 50 84"/><path d="M50 12 C70 24 30 36 50 48 C70 60 30 72 50 84"/><path d="M44 88 h12"/>',
    "house": '<path d="M16 50 L50 20 L84 50"/><path d="M26 42 V82 H74 V42"/><rect x="42" y="56" width="16" height="26"/><path d="M66 18 v14"/>',
    "pulse": '<path d="M12 54 h20 l8-20 12 40 10-28 6 8 h20"/><rect x="14" y="16" width="72" height="68" rx="12"/>',
    "shirt": '<path d="M34 16 L16 28 L24 44 L32 40 V86 H68 V40 L76 44 L84 28 L66 16 C62 24 38 24 34 16Z"/><path d="M42 54 h16 M42 64 h16"/>',
    "candles": '<path d="M24 20 v60 M50 14 v66 M76 30 v48"/><rect x="18" y="34" width="12" height="26" rx="2"/><rect x="44" y="26" width="12" height="40" rx="2" class="f"/><rect x="70" y="42" width="12" height="22" rx="2"/><path d="M12 88 h76"/>',
    "crystal": '<path d="M50 10 L74 38 L50 90 L26 38 Z"/><path d="M26 38 h48 M50 10 L42 38 L50 90 L58 38 Z"/>',
    "people": '<circle cx="34" cy="34" r="10"/><circle cx="66" cy="34" r="10"/><path d="M18 74 c0-14 8-22 16-22 s16 8 16 22"/><path d="M50 74 c0-14 8-22 16-22 s16 8 16 22"/><path d="M50 14 C50 14 44 8 40 12 c-4 4 10 12 10 12 s14-8 10-12 c-4-4-10 2-10 2Z" class="f"/>',
    "envelope": '<rect x="14" y="26" width="72" height="50" rx="7"/><path d="M16 30 L50 56 L84 30"/><path d="M76 14 l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" class="f"/>',
    "chat": '<path d="M14 22 h48 a8 8 0 0 1 8 8 v22 a8 8 0 0 1-8 8 H36 l-12 10 v-10 h-10 a8 8 0 0 1-8-8 V30 a8 8 0 0 1 8-8Z"/><path d="M48 48 h30 a8 8 0 0 1 8 8 v16 a8 8 0 0 1-8 8 h-4 v8 l-10-8 H48 a8 8 0 0 1-8-8"/><path d="M22 36 h28 M22 46 h18"/>',
    "photo": '<rect x="12" y="20" width="54" height="44" rx="6"/><path d="M14 58 L32 40 L44 52 L52 44 L64 56"/><circle cx="50" cy="32" r="5"/><path d="M60 72 h26 l6 7-6 7 H60z"/><path d="M38 72 h14 M38 82 h14"/>',
    "phonecode": '<rect x="30" y="10" width="40" height="80" rx="8"/><path d="M44 18 h12"/><rect x="36" y="40" width="7" height="12" rx="2"/><rect x="46" y="40" width="7" height="12" rx="2" class="f"/><rect x="56" y="40" width="7" height="12" rx="2"/><path d="M44 80 h12"/>',
    "document": '<path d="M24 12 h36 l18 18 v58 H24z"/><path d="M60 12 v18 h18"/><path d="M34 46 h34 M34 56 h34 M34 66 h22"/><path d="M78 72 l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" class="f"/>',
    "market": '<rect x="12" y="16" width="34" height="30" rx="5"/><rect x="54" y="16" width="34" height="30" rx="5"/><rect x="12" y="54" width="34" height="30" rx="5"/><path d="M71 92 C71 92 56 76 56 66 a15 15 0 0 1 30 0 C86 76 71 92 71 92Z"/><circle cx="71" cy="66" r="5" class="f"/>',
}

# ---- palettes ------------------------------------------------------------------------------------------
HUE = {"beauty": "#F2A7BF", "spa": "#8FD8C2", "clean": "#7CC9F0", "auto": "#F6A85B", "industry": "#D7BC7E",
       "net": "#74D3FF", "wedding": "#EBC77B", "health": "#6FDCAA", "estate": "#F1B65C", "ai": "#A99CFF",
       "game": "#C792FF", "trade": "#5EDB91", "fashion": "#F59FCB", "market": "#FF9E6E", "barber": "#B9C3D6",
       "family": "#F0A3A3", "lilac": "#C9A7F5", "peach": "#F7B58C", "coral": "#FF8C94", "gold": "#E9C46A"}

# slug: (motif, hue, layout, eyebrow, display name)
COVERS = {
    "mccleanhomeservices": ("spray", "clean", "site", "Home services", "McClean Home Services"),
    "empowerwellnessspa": ("lotus", "spa", "site", "Wellness spa", "Empower Wellness Spa"),
    "aministerinakilt": ("rings", "wedding", "site", "Wedding officiant", "Minister in a Kilt"),
    "roseeatelier": ("scissors", "beauty", "site", "Beauty salon · Miami", "Rosée Atelier"),
    "redglovecleaningco": ("spray", "coral", "site", "Cleaning company", "Red Glove Cleaning Co."),
    "tknails": ("polish", "beauty", "site", "Nail salon · Westwood", "TK Nails"),
    "sanaasalon": ("comb", "peach", "site", "Hair salon", "Salon Sanaa"),
    "jordanautofl": ("tire", "auto", "site", "Auto repair · Jacksonville", "Jordan Auto Repairs"),
    "floridafadez": ("scissors", "barber", "site", "Barbershop · Fort Lauderdale", "Florida Fadez"),
    "perfectnails": ("polish", "lilac", "site", "Nail salon · Saint Paul", "Perfect Nails"),
    "queennails": ("polish", "gold", "site", "Nail salon", "Queen Nails"),
    "ryannails": ("polish", "peach", "site", "Nail salon · West Jordan", "Ryan's Nails"),
    "omorfoindustrial": ("gear", "industry", "site", "Industrial air compressors", "Omorfo Industrial"),
    "nutelnetworks": ("network", "net", "site", "Networking & IT", "Nutel Networks"),
    "divinenailsandbeauty": ("polish", "coral", "site", "Nails & beauty", "Divine Nails and Beauty"),
    "mkbraids": ("braid", "beauty", "site", "Braiding studio", "MK Braids by Mouna"),
    "zawaj": ("people", "family", "phone", "Mobile app · in development", "Zawaj"),
    "buyutsyria": ("house", "estate", "site", "Marketplace & CRM", "BuyutSyria"),
    "smart-health-os": ("pulse", "health", "app", "Multi-tenant SaaS", "Smart Health OS"),
    "atelier-3d": ("shirt", "fashion", "app", "3D pipeline", "Atelier"),
    "mt5-bot-hosting": ("candles", "trade", "app", "Hosting panel", "Bot Hosting"),
    "riftborn": ("crystal", "game", "app", "Game prototype", "Riftborn"),
    "marhaba-syria": ("market", "market", "site", "Marketplace platform", "Marhaba Syria"),
    "ai-email-support-agent": ("envelope", "ai", "app", "AI · RAG agent", "Support Agent"),
    "ai-customer-chat-platform": ("chat", "ai", "app", "AI · real-time chat", "Chat Platform"),
    "ai-stock-metadata": ("photo", "ai", "app", "AI · computer vision", "Metadata AI"),
    "sms-otp-gateway": ("phonecode", "net", "phone", "API · integrations", "OTP Gateway"),
    "livevibely": ("document", "ai", "site", "AI · content engine", "LiveVibely"),
}

SANS = "Segoe UI, Arial, sans-serif"
MONO = "Consolas, monospace"


def esc(t):
    return html.escape(t)


def wrap(text, limit):
    """Greedy word wrap by character count (enough for short display names)."""
    lines, cur = [], ""
    for word in text.split():
        if cur and len(cur) + 1 + len(word) > limit:
            lines.append(cur)
            cur = word
        else:
            cur = f"{cur} {word}".strip()
    return lines + [cur] if cur else lines


def motif(name, x, y, size, hue, stroke=3.0):
    body = M[name].replace('class="f"', f'fill="{hue}"')
    return (f'<g transform="translate({x} {y}) scale({size / 100})" fill="none" stroke="{hue}" '
            f'stroke-width="{stroke}" stroke-linecap="round" stroke-linejoin="round">{body}</g>')


def bars(x, y, widths, gap=26, h=10, op=".18"):
    return "".join(f'<rect x="{x}" y="{y + i * gap:.0f}" width="{w}" height="{h}" rx="{h / 2}" '
                   f'fill="#FFFFFF" fill-opacity="{op}"/>' for i, w in enumerate(widths))


def site(mot, hue, eyebrow, name):
    """Homepage: nav with the business name, headline, motif panel, three service cards."""
    p = [f'<text x="80" y="64" font-family="{SANS}" font-weight="700" font-size="32" fill="#ECEDEF">{esc(name)}</text>']
    for i in range(3):
        p.append(f'<rect x="{900 + i * 110}" y="48" width="80" height="10" rx="5" fill="#FFFFFF" fill-opacity=".22"/>')
    p.append(f'<rect x="1290" y="31" width="230" height="46" rx="23" fill="{hue}"/>')
    p.append(f'<rect x="1322" y="49" width="166" height="10" rx="5" fill="#0B0D11" fill-opacity=".55"/>')
    p.append('<path d="M0 108 H1600" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="2"/>')
    p.append(f'<text x="80" y="236" font-family="{MONO}" font-size="24" letter-spacing="5" fill="{hue}">{esc(eyebrow.upper())}</text>')
    lines = wrap(name, 15)[:3]
    size = 96 if len(lines) <= 2 else 80
    for i, ln in enumerate(lines):
        p.append(f'<text x="74" y="{336 + i * size * 1.04:.0f}" font-family="{SANS}" font-weight="700" font-size="{size}" '
                 f'letter-spacing="-2" fill="#F1F2F4">{esc(ln)}</text>')
    ty = 336 + len(lines) * size * 1.04 + 4
    p.append(bars(80, ty, (620, 560, 470)))
    by = ty + 108
    p.append(f'<rect x="80" y="{by:.0f}" width="230" height="64" rx="32" fill="{hue}"/>')
    p.append(f'<rect x="112" y="{by + 27:.0f}" width="166" height="10" rx="5" fill="#0B0D11" fill-opacity=".55"/>')
    p.append(f'<rect x="330" y="{by:.0f}" width="210" height="64" rx="32" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2"/>')
    p.append(f'<rect x="362" y="{by + 27:.0f}" width="146" height="10" rx="5" fill="#FFFFFF" fill-opacity=".35"/>')
    p.append(f'<rect x="900" y="164" width="620" height="566" rx="30" fill="{hue}" fill-opacity=".10" stroke="{hue}" stroke-opacity=".35" stroke-width="2"/>')
    p.append(motif(mot, 1010, 247, 400, hue))
    for i in range(3):
        x = 80 + i * 490
        p.append(f'<rect x="{x}" y="806" width="460" height="164" rx="22" fill="#FFFFFF" fill-opacity=".05" stroke="#FFFFFF" stroke-opacity=".09"/>')
        p.append(f'<circle cx="{x + 52}" cy="856" r="20" fill="{hue}" fill-opacity=".85"/>')
        p.append(bars(x + 90, 842, (200, 260), gap=28, h=10, op=".26"))
        p.append(bars(x + 32, 906, (380, 320), gap=24, h=8, op=".12"))
    return "".join(p)


def app(mot, hue, eyebrow, name):
    """Desktop app: sidebar with the product name, stat tiles, a table, and a feature panel with the motif."""
    p = ['<rect x="0" y="0" width="320" height="1000" fill="#FFFFFF" fill-opacity=".035"/>',
         '<path d="M320 0 V1000" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="2"/>',
         f'<rect x="40" y="52" width="40" height="40" rx="11" fill="{hue}"/>']
    for i, ln in enumerate(wrap(name, 11)[:2]):
        p.append(f'<text x="96" y="{82 + i * 36}" font-family="{SANS}" font-weight="700" font-size="30" fill="#ECEDEF">{esc(ln)}</text>')
    for i in range(8):
        on = i == 1
        if on:
            p.append(f'<rect x="28" y="{180 + i * 62}" width="264" height="46" rx="12" fill="{hue}" fill-opacity=".16"/>')
        p.append(f'<rect x="52" y="{197 + i * 62}" width="16" height="12" rx="3" fill="{hue if on else "#FFFFFF"}" fill-opacity="{1 if on else .25}"/>')
        p.append(f'<rect x="84" y="{198 + i * 62}" width="{150 - i % 3 * 26}" height="10" rx="5" fill="#FFFFFF" fill-opacity="{.6 if on else .2}"/>')
    p.append(f'<text x="380" y="92" font-family="{MONO}" font-size="22" letter-spacing="5" fill="{hue}">{esc(eyebrow.upper())}</text>')
    p.append('<rect x="380" y="118" width="420" height="22" rx="8" fill="#FFFFFF" fill-opacity=".8"/>')
    for i in range(3):
        x = 380 + i * 225
        p.append(f'<rect x="{x}" y="190" width="205" height="130" rx="18" fill="#FFFFFF" fill-opacity=".05" stroke="#FFFFFF" stroke-opacity=".09"/>')
        p.append(f'<rect x="{x + 24}" y="216" width="90" height="10" rx="5" fill="#FFFFFF" fill-opacity=".28"/>')
        p.append(f'<rect x="{x + 24}" y="248" width="{110 + i * 14}" height="34" rx="8" fill="{hue if i == 0 else "#FFFFFF"}" fill-opacity="{.95 if i == 0 else .7}"/>')
    for i in range(7):
        y = 370 + i * 80
        p.append(f'<rect x="380" y="{y}" width="655" height="62" rx="14" fill="#FFFFFF" fill-opacity="{.06 if i % 2 == 0 else .03}"/>')
        p.append(f'<circle cx="414" cy="{y + 31}" r="12" fill="{hue}" fill-opacity="{.8 if i < 2 else .35}"/>')
        p.append(f'<rect x="442" y="{y + 20}" width="{230 - i * 16}" height="10" rx="5" fill="#FFFFFF" fill-opacity=".26"/>')
        p.append(f'<rect x="442" y="{y + 38}" width="{150 - i * 8}" height="8" rx="4" fill="#FFFFFF" fill-opacity=".12"/>')
        p.append(f'<rect x="935" y="{y + 21}" width="74" height="20" rx="10" fill="{hue}" fill-opacity="{.3 if i % 3 else .7}"/>')
    p.append(f'<rect x="1075" y="118" width="465" height="822" rx="30" fill="{hue}" fill-opacity=".09" stroke="{hue}" stroke-opacity=".32" stroke-width="2"/>')
    p.append(motif(mot, 1127, 349, 360, hue))
    return "".join(p)


def phone(mot, hue, eyebrow, name):
    """Phone mock on the right, product name and copy on the left."""
    px, py, pw, ph = 1010, 90, 420, 820
    p = [f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="60" fill="url(#s)" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="3"/>',
         f'<rect x="{px + 160}" y="{py + 24}" width="100" height="26" rx="13" fill="#000000" fill-opacity=".6"/>',
         f'<rect x="{px + 40}" y="{py + 100}" width="{pw - 80}" height="330" rx="28" fill="{hue}" fill-opacity=".10" stroke="{hue}" stroke-opacity=".35" stroke-width="2"/>',
         motif(mot, px + 85, py + 140, 250, hue, 3.4)]
    for i in range(4):
        p.append(f'<rect x="{px + 40}" y="{py + 470 + i * 66}" width="{pw - 80}" height="50" rx="16" fill="#FFFFFF" fill-opacity="{.1 if i == 0 else .06}"/>')
        p.append(f'<rect x="{px + 64}" y="{py + 490 + i * 66}" width="{170 - i * 22}" height="10" rx="5" fill="#FFFFFF" fill-opacity=".26"/>')
    p.append(f'<rect x="{px + 40}" y="{py + ph - 96}" width="{pw - 80}" height="56" rx="28" fill="{hue}"/>')
    p.append(f'<text x="140" y="330" font-family="{MONO}" font-size="24" letter-spacing="5" fill="{hue}">{esc(eyebrow.upper())}</text>')
    lines = wrap(name, 14)[:3]
    for i, ln in enumerate(lines):
        p.append(f'<text x="134" y="{432 + i * 92}" font-family="{SANS}" font-weight="700" font-size="88" letter-spacing="-2" fill="#F1F2F4">{esc(ln)}</text>')
    p.append(bars(140, 432 + len(lines) * 92 + 4, (600, 540, 440)))
    return "".join(p)


def cover(spec):
    mot, hk, layout, eyebrow, name = spec
    hue = HUE[hk]
    head = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
            '<defs>',
            f'<radialGradient id="g" cx="80%" cy="18%" r="75%"><stop offset="0" stop-color="{hue}" stop-opacity=".26"/>'
            f'<stop offset=".55" stop-color="{hue}" stop-opacity=".05"/><stop offset="1" stop-color="{hue}" stop-opacity="0"/></radialGradient>',
            '<pattern id="d" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#FFFFFF" fill-opacity=".06"/></pattern>',
            '<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1E26"/><stop offset="1" stop-color="#12151B"/></linearGradient>',
            '</defs>',
            '<rect width="100%" height="100%" fill="#0B0D11"/>',
            '<rect width="100%" height="100%" fill="url(#d)"/>',
            '<rect width="100%" height="100%" fill="url(#g)"/>']
    body = {"site": site, "app": app, "phone": phone}[layout](mot, hue, eyebrow, name)
    return "\n".join(head + [body, "</svg>"])


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for slug, spec in COVERS.items():
        with open(os.path.join(OUT, f"{slug}.svg"), "w", encoding="utf-8") as f:
            f.write(cover(spec))
    print(len(COVERS), "covers ->", OUT)
