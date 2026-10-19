import type { CaseStudy, Challenge, Media, Project, ProjectLink } from '../lib/types';

export type AdminProject = Project;

/** Editable shape (strings for inputs; converted to the API payload on save). */
export type ProjectForm = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: string;
  kind: string;
  client: string;
  industry: string;
  location: string;
  role: string;
  year_start: string;
  year_end: string;
  status: 'draft' | 'published';
  featured: boolean;
  tech: string[];
  tags: string[];
  highlights: string[];
  links: ProjectLink[];
  live_url: string;
  repo_url: string;
  seo_title: string;
  seo_description: string;
  case_study: {
    overview: string;
    problem: string;
    role: string;
    responsibilities: string[];
    features: string[];
    architecture: string;
    challenges: Challenge[];
    results: string[];
    notes: string;
  };
};

export type ProjectPayload = {
  slug: string;
  title: string;
  tagline: string | null;
  summary: string | null;
  category: string;
  kind: string;
  client: string | null;
  industry: string | null;
  location: string | null;
  role: string | null;
  year_start: number | null;
  year_end: number | null;
  status: 'draft' | 'published';
  featured: boolean;
  tech: string[];
  tags: string[];
  highlights: string[];
  links: ProjectLink[];
  live_url: string | null;
  repo_url: string | null;
  case_study: CaseStudy;
  seo_title: string | null;
  seo_description: string | null;
};

export const emptyForm = (): ProjectForm => ({
  slug: '',
  title: '',
  tagline: '',
  summary: '',
  category: 'Web Applications',
  kind: 'Product',
  client: '',
  industry: '',
  location: '',
  role: '',
  year_start: String(new Date().getFullYear()),
  year_end: '',
  status: 'draft',
  featured: false,
  tech: [],
  tags: [],
  highlights: [],
  links: [],
  live_url: '',
  repo_url: '',
  seo_title: '',
  seo_description: '',
  case_study: {
    overview: '',
    problem: '',
    role: '',
    responsibilities: [],
    features: [],
    architecture: '',
    challenges: [],
    results: [],
    notes: '',
  },
});

const s = (v: unknown): string => (v == null ? '' : String(v));

export function projectToForm(p: AdminProject): ProjectForm {
  const cs = p.case_study ?? {};
  return {
    slug: p.slug,
    title: p.title,
    tagline: s(p.tagline),
    summary: s(p.summary),
    category: p.category,
    kind: p.kind,
    client: s(p.client),
    industry: s(p.industry),
    location: s(p.location),
    role: s(p.role),
    year_start: s(p.year_start),
    year_end: s(p.year_end),
    status: p.status,
    featured: !!p.featured,
    tech: [...(p.tech ?? [])],
    tags: [...(p.tags ?? [])],
    highlights: [...(p.highlights ?? [])],
    links: (p.links ?? []).map((l) => ({ ...l })),
    live_url: s(p.live_url),
    repo_url: s(p.repo_url),
    seo_title: s(p.seo_title),
    seo_description: s(p.seo_description),
    case_study: {
      overview: s(cs.overview),
      problem: s(cs.problem),
      role: s(cs.role),
      responsibilities: [...(cs.responsibilities ?? [])],
      features: [...(cs.features ?? [])],
      architecture: s(cs.architecture),
      challenges: (cs.challenges ?? []).map((c) => ({ ...c })),
      results: [...(cs.results ?? [])],
      notes: s(cs.notes),
    },
  };
}

const nul = (v: string): string | null => (v.trim() === '' ? null : v.trim());
const num = (v: string): number | null => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};
const clean = (a: string[]): string[] => a.map((x) => x.trim()).filter(Boolean);

export function formToPayload(f: ProjectForm): ProjectPayload {
  const c = f.case_study;
  const cs: CaseStudy = {};
  if (c.overview.trim()) cs.overview = c.overview.trim();
  if (c.problem.trim()) cs.problem = c.problem.trim();
  if (c.role.trim()) cs.role = c.role.trim();
  if (clean(c.responsibilities).length) cs.responsibilities = clean(c.responsibilities);
  if (clean(c.features).length) cs.features = clean(c.features);
  if (c.architecture.trim()) cs.architecture = c.architecture.replace(/\s+$/, '');
  const ch = c.challenges.filter((x) => x.challenge.trim() || x.solution.trim());
  if (ch.length) cs.challenges = ch.map((x) => ({ challenge: x.challenge.trim(), solution: x.solution.trim() }));
  if (clean(c.results).length) cs.results = clean(c.results);
  if (c.notes.trim()) cs.notes = c.notes.trim();
  return {
    slug: f.slug.trim(),
    title: f.title.trim(),
    tagline: nul(f.tagline),
    summary: nul(f.summary),
    category: f.category,
    kind: f.kind,
    client: nul(f.client),
    industry: nul(f.industry),
    location: nul(f.location),
    role: nul(f.role),
    year_start: num(f.year_start),
    year_end: num(f.year_end),
    status: f.status,
    featured: f.featured,
    tech: clean(f.tech),
    tags: clean(f.tags),
    highlights: clean(f.highlights),
    links: f.links.filter((l) => l.url.trim()).map((l) => ({ label: l.label.trim() || l.url.trim(), url: l.url.trim() })),
    live_url: nul(f.live_url),
    repo_url: nul(f.repo_url),
    case_study: cs,
    seo_title: nul(f.seo_title),
    seo_description: nul(f.seo_description),
  };
}

export function slugify(t: string): string {
  return t
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export const sortedMedia = (m: Media[]): Media[] => [...m].sort((a, b) => a.sort - b.sort || a.id - b.id);

/** Public ordering: featured first, then priority. */
export function sortAdmin(list: AdminProject[]): AdminProject[] {
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.priority - b.priority || a.id - b.id);
}

export function validateForm(f: ProjectForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.title.trim()) e.title = 'Title is required.';
  if (!f.slug.trim()) e.slug = 'Slug is required.';
  else if (!/^[a-z0-9-]+$/.test(f.slug.trim())) e.slug = 'Use lowercase letters, numbers and hyphens only.';
  if (f.summary.length > 280) e.summary = 'Summary must be 280 characters or fewer.';
  for (const k of ['year_start', 'year_end'] as const) {
    if (f[k].trim() && !/^\d{4}$/.test(f[k].trim())) e[k] = 'Use a four-digit year.';
  }
  for (const k of ['live_url', 'repo_url'] as const) {
    if (f[k].trim() && !/^https?:\/\//i.test(f[k].trim())) e[k] = 'Must start with http:// or https://';
  }
  return e;
}
