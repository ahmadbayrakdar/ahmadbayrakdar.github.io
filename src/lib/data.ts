import snapshot from '../data/snapshot.json';
import type { ExportData, Project, Profile } from './types';

export * from './types';

const DEFAULT_API = 'https://portfolio-api.builderization.com';
const API = (process.env.PORTFOLIO_API ?? import.meta.env.PORTFOLIO_API ?? DEFAULT_API).replace(/\/$/, '');

let cache: Promise<ExportData> | null = null;

function isExport(x: unknown): x is ExportData {
  const d = x as ExportData | null;
  return !!d && typeof d === 'object' && !!d.profile && Array.isArray(d.projects);
}

async function load(): Promise<ExportData> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(`${API}/api/export`, { signal: ctrl.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    if (!isExport(json)) throw new Error('unexpected export shape');
    console.log(`[data] loaded ${json.projects.length} projects from ${API}`);
    return json;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[data] WARNING: ${API}/api/export unavailable (${reason}); using src/data/snapshot.json`);
    return snapshot as unknown as ExportData;
  } finally {
    clearTimeout(timer);
  }
}

/** Fetches once per build; falls back to the committed snapshot. */
export function getData(): Promise<ExportData> {
  cache ??= load();
  return cache;
}

function sortProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || a.priority - b.priority || a.id - b.id,
  );
}

export async function getProfile(): Promise<Profile> {
  return (await getData()).profile;
}

/** Published projects, ordered: featured first, then priority ascending. */
export async function getProjects(): Promise<Project[]> {
  const { projects } = await getData();
  return sortProjects(projects.filter((p) => p.status === 'published'));
}

export async function getFeatured(): Promise<Project[]> {
  return (await getProjects()).filter((p) => !!p.featured);
}

export function hasCaseStudy(p: Project): boolean {
  const c = p.case_study;
  if (!c) return false;
  return Object.values(c).some((v) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim() !== '' : !!v));
}

export function yearsLabel(p: Pick<Project, 'year_start' | 'year_end'>): string {
  const s = p.year_start ? String(p.year_start) : '';
  const e = p.year_end ? String(p.year_end) : '';
  if (!s && !e) return '';
  if (s && !e) return `${s} – Present`;
  if (!s) return e;
  return s === e ? s : `${s} – ${e}`;
}

export function coverOf(p: Project) {
  return p.cover ?? p.gallery?.[0] ?? null;
}

export function stripTags(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}
