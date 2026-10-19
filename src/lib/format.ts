const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2023-10" -> "Oct 2023"; "2015" -> "2015"; null -> null */
export function fmtDate(v: string | null | undefined): string | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})/.exec(v);
  if (m) return `${MONTHS[Number(m[2]) - 1] ?? ''} ${m[1]}`.trim();
  return v;
}

export function period(start?: string | null, end?: string | null): string {
  const s = fmtDate(start);
  const e = fmtDate(end) ?? 'Present';
  if (!s) return e;
  return `${s} — ${e}`;
}

export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function absoluteUrl(path: string, site: URL | string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.replace(/^\//, ''), String(site).replace(/\/?$/, '/')).toString();
}

export function waLink(num: string): string {
  return `https://wa.me/${num.replace(/[^\d]/g, '')}`;
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('') || 'AB'
  );
}

export function yearsSince(year: number): number {
  return Math.max(0, new Date().getFullYear() - year);
}
