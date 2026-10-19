export type Media = {
  id: number;
  url: string;
  thumb_url: string;
  width: number;
  height: number;
  alt: string;
  sort: number;
};

export type Challenge = { challenge: string; solution: string };

export type CaseStudy = {
  overview?: string;
  problem?: string;
  role?: string;
  responsibilities?: string[];
  features?: string[];
  architecture?: string;
  challenges?: Challenge[];
  results?: string[];
  notes?: string;
};

export type ProjectLink = { label: string; url: string };

export const CATEGORIES = [
  'SaaS & Platforms',
  'Web Applications',
  'Desktop & Mobile',
  'Client Websites',
  'E-commerce',
  'UI/UX Design',
  'AI & Automation',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const KINDS = ['Product', 'Client', 'Employment', 'Personal'] as const;
export type Kind = (typeof KINDS)[number];

export type Project = {
  id: number;
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
  year_start: number | string | null;
  year_end: number | string | null;
  status: 'draft' | 'published';
  featured: boolean | number;
  priority: number;
  tech: string[];
  tags: string[];
  highlights: string[];
  links: ProjectLink[];
  live_url: string | null;
  repo_url: string | null;
  case_study: CaseStudy | null;
  seo_title: string | null;
  seo_description: string | null;
  cover: Media | null;
  gallery: Media[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type Expertise = {
  title: string;
  description: string;
  skills: string[];
  evidence: string[];
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  bullets: string[];
  projects: string[];
};

export type Education = {
  degree: string;
  school: string;
  start: string;
  end: string | null;
};

export type Profile = {
  name: string;
  headline: string;
  positioning: string;
  intro: string;
  location: string;
  availability: string;
  email: string;
  whatsapp: string | null;
  linkedin: string | null;
  github: string | null;
  youtube: string | null;
  resume_url: string | null;
  about: string[];
  expertise: Expertise[];
  experience: Experience[];
  education: Education[];
};

export type ExportData = {
  profile: Profile;
  projects: Project[];
  generated_at: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  body: string;
  read: boolean | number;
  created_at: string;
};
