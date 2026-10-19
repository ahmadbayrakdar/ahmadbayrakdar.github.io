"""Draw SVG cover art (1600x1000) for portfolio projects that have no screenshot.

    python docs/covers/make_covers.py            # writes docs/covers/svg/<slug>.svg
Render to WebP for upload with any headless browser (the API accepts raster images only).
Each cover is deliberately plain: one or two line icons themed to the business above the project name,
on a dark ground with a soft glow in the project's hue.
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
    "sparkle": '<path d="M50 10 l8 24 24 8-24 8-8 24-8-24-24-8 24-8z"/><path d="M80 66 l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/>',
    "wrench": '<path d="M68 14 a17 17 0 0 0-15 23 L20 70 a8 8 0 0 0 11 11 L64 48 a17 17 0 0 0 23-15 l-11 6-9-4-2-9z"/>',
    "pin": '<path d="M50 88 C50 88 24 60 24 40 a26 26 0 0 1 52 0 C76 60 50 88 50 88Z"/><circle cx="50" cy="40" r="10"/>',
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


# Display name and icons per cover (second icon optional).
NAMES = {
    "mt5-bot-hosting": "Bot Hosting Panel", "ai-email-support-agent": "Email Support Agent",
    "ai-customer-chat-platform": "Customer-Chat Platform", "ai-stock-metadata": "Image Metadata AI",
    "sms-otp-gateway": "OTP Gateway", "aministerinakilt": "Minister in a Kilt", "jordanautofl": "Jordan Auto Repairs",
}
SECOND = {
    "roseeatelier": "comb", "floridafadez": "comb", "mkbraids": "comb", "sanaasalon": "scissors",
    "tknails": "sparkle", "perfectnails": "sparkle", "queennails": "sparkle", "ryannails": "sparkle",
    "divinenailsandbeauty": "sparkle", "mccleanhomeservices": "sparkle", "redglovecleaningco": "sparkle",
    "jordanautofl": "wrench", "buyutsyria": "pin", "marhaba-syria": "pin",
}


def cover(slug, spec):
    """Plain cover: one or two icons above the project name, on a dark ground with a soft glow."""
    mot, hk, _layout, _eyebrow, name = spec
    name = NAMES.get(slug, name)
    hue = HUE[hk]
    icons = [mot] + ([SECOND[slug]] if slug in SECOND else [])
    size, gap = 230, 70
    total = len(icons) * size + (len(icons) - 1) * gap
    x0 = (W - total) / 2
    lines = wrap(name, 22)[:2]
    fs = 92 if len(lines) == 1 else 80
    icon_y = 250 if len(lines) == 1 else 210
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         f'<defs><radialGradient id="g" cx="50%" cy="38%" r="55%"><stop offset="0" stop-color="{hue}" stop-opacity=".22"/>'
         f'<stop offset="1" stop-color="{hue}" stop-opacity="0"/></radialGradient></defs>',
         '<rect width="100%" height="100%" fill="#0B0D11"/>',
         '<rect width="100%" height="100%" fill="url(#g)"/>']
    for i, m in enumerate(icons):
        p.append(motif(m, x0 + i * (size + gap), icon_y, size, hue, 4.6))
    ty = icon_y + size + 150
    for i, ln in enumerate(lines):
        p.append(f'<text x="{W / 2}" y="{ty + i * fs * 1.08:.0f}" text-anchor="middle" font-family="{SANS}" font-weight="700" '
                 f'font-size="{fs}" letter-spacing="-1.5" fill="#F1F2F4">{esc(ln)}</text>')
    p.append("</svg>")
    return "\n".join(p)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for slug, spec in COVERS.items():
        with open(os.path.join(OUT, f"{slug}.svg"), "w", encoding="utf-8") as f:
            f.write(cover(slug, spec))
    print(len(COVERS), "covers ->", OUT)
