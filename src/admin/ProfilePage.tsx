import { useCallback, useEffect, useState } from 'react';
import type { Profile } from '../lib/types';
import { api } from './api';
import { ChipInput, ErrorState, Field, ListEditor, Repeater, Skeleton, Spinner, TextArea, TextInput, clearDirty, useToast, useUnsavedGuard } from './ui';

const blankProfile = (): Profile => ({
  name: '',
  headline: '',
  positioning: '',
  intro: '',
  location: '',
  availability: '',
  email: '',
  whatsapp: '',
  linkedin: '',
  github: '',
  youtube: '',
  resume_url: '',
  about: [],
  expertise: [],
  experience: [],
  education: [],
});

/** Normalise nulls to strings for inputs; turn blanks back into nulls on save. */
const toForm = (p: Profile): Profile => ({
  ...blankProfile(),
  ...p,
  whatsapp: p.whatsapp ?? '',
  linkedin: p.linkedin ?? '',
  github: p.github ?? '',
  youtube: p.youtube ?? '',
  resume_url: p.resume_url ?? '',
  about: p.about ?? [],
  expertise: (p.expertise ?? []).map((e) => ({ ...e, skills: e.skills ?? [], evidence: e.evidence ?? [] })),
  experience: (p.experience ?? []).map((e) => ({ ...e, end: e.end ?? '', bullets: e.bullets ?? [], projects: e.projects ?? [] })),
  education: (p.education ?? []).map((e) => ({ ...e, end: e.end ?? '' })),
});
const nul = (v: string | null) => (v && v.trim() ? v.trim() : null);
const toPayload = (f: Profile): Profile => ({
  ...f,
  whatsapp: nul(f.whatsapp),
  linkedin: nul(f.linkedin),
  github: nul(f.github),
  youtube: nul(f.youtube),
  resume_url: nul(f.resume_url),
  about: f.about.map((a) => a.trim()).filter(Boolean),
  expertise: f.expertise.map((e) => ({ ...e, skills: e.skills.filter(Boolean), evidence: e.evidence.filter(Boolean) })),
  experience: f.experience.map((e) => ({ ...e, end: nul(e.end), bullets: e.bullets.map((b) => b.trim()).filter(Boolean), projects: e.projects.filter(Boolean) })),
  education: f.education.map((e) => ({ ...e, end: nul(e.end) })),
});

export default function ProfilePage() {
  const toast = useToast();
  const [form, setForm] = useState<Profile | null>(null);
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);

  const load = useCallback(() => {
    setError('');
    api
      .getProfile()
      .then((p) => {
        const f = toForm(p);
        setForm(f);
        setSaved(JSON.stringify(f));
      })
      .catch((e: Error) => setError(e.message));
    api
      .listProjects()
      .then((l) => setSlugs(l.map((p) => p.slug)))
      .catch(() => {});
  }, []);
  useEffect(load, [load]);

  const dirty = !!form && JSON.stringify(form) !== saved;
  useUnsavedGuard(dirty);

  if (error) return <div className="a-page"><ErrorState message={error} onRetry={load} /></div>;
  if (!form) return <div className="a-page"><Skeleton rows={8} height={52} /></div>;

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const text = (k: keyof Profile, label: string, opts: { hint?: string; type?: string } = {}) => (
    <Field label={label} htmlFor={`p-${String(k)}`} hint={opts.hint}>
      <TextInput id={`p-${String(k)}`} type={opts.type} value={String(form[k] ?? '')} onChange={(v) => set(k, v as never)} />
    </Field>
  );

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.saveProfile(toPayload(form));
      const f = toForm(res && typeof res === 'object' && 'name' in res ? res : toPayload(form));
      setForm(f);
      setSaved(JSON.stringify(f));
      clearDirty();
      toast.ok('Profile saved. Use “Publish site” to update the website.');
    } catch (e) {
      toast.err(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="a-page a-editor">
      <div className="a-page-head">
        <div>
          <h1>Profile</h1>
          <p className="a-muted">Drives the hero, expertise, experience, about and contact sections of the public site.</p>
        </div>
      </div>

      <section className="a-section" aria-labelledby="ps-identity">
        <h2 id="ps-identity">Identity</h2>
        <div className="a-grid">
          {text('name', 'Full name')}
          {text('positioning', 'Positioning', { hint: 'Short job title, used in the page title and structured data.' })}
          <div className="a-span-2">
            <Field label="Headline" htmlFor="p-headline" hint="The main hero heading.">
              <TextArea id="p-headline" rows={2} value={form.headline} onChange={(v) => set('headline', v)} />
            </Field>
          </div>
          <div className="a-span-2">
            <Field label="Intro" htmlFor="p-intro" hint="The paragraph under the headline.">
              <TextArea id="p-intro" rows={3} value={form.intro} onChange={(v) => set('intro', v)} />
            </Field>
          </div>
          {text('location', 'Location')}
          {text('availability', 'Availability', { hint: 'Shown in the green pill, e.g. “Open to remote roles”.' })}
        </div>
      </section>

      <section className="a-section" aria-labelledby="ps-contact">
        <h2 id="ps-contact">Contact &amp; links</h2>
        <div className="a-grid">
          {text('email', 'Email', { type: 'email' })}
          {text('whatsapp', 'WhatsApp', { hint: 'International format, e.g. +20…' })}
          {text('linkedin', 'LinkedIn URL', { type: 'url' })}
          {text('github', 'GitHub URL', { type: 'url' })}
          {text('youtube', 'YouTube URL', { type: 'url' })}
          {text('resume_url', 'Résumé URL', { hint: 'e.g. /Ahmad-Bayrakdar-CV.pdf' })}
        </div>
      </section>

      <section className="a-section" aria-labelledby="ps-about">
        <h2 id="ps-about">About</h2>
        <Field label="Paragraphs" hint="Two short paragraphs work best.">
          <ListEditor idPrefix="p-about" value={form.about} onChange={(v) => set('about', v)} placeholder="Paragraph" multiline addLabel="Add paragraph" />
        </Field>
      </section>

      <section className="a-section" aria-labelledby="ps-exp">
        <h2 id="ps-exp">Expertise</h2>
        <Repeater
          value={form.expertise}
          onChange={(v) => set('expertise', v)}
          blank={() => ({ title: '', description: '', skills: [], evidence: [] })}
          addLabel="Add expertise area"
          label="Area"
          render={(item, patch, i) => (
            <div className="a-stack">
              <Field label="Title" htmlFor={`x-t-${i}`}>
                <TextInput id={`x-t-${i}`} value={item.title} onChange={(v) => patch({ title: v })} />
              </Field>
              <Field label="Description" htmlFor={`x-d-${i}`}>
                <TextArea id={`x-d-${i}`} rows={3} value={item.description} onChange={(v) => patch({ description: v })} />
              </Field>
              <Field label="Skills" htmlFor={`x-s-${i}`}>
                <ChipInput id={`x-s-${i}`} value={item.skills} onChange={(v) => patch({ skills: v })} placeholder="Add skill" />
              </Field>
              <Field label="Evidence (project slugs)" htmlFor={`x-e-${i}`} hint="Projects that prove this skill. They are linked as “Proof”.">
                <ChipInput id={`x-e-${i}`} value={item.evidence} onChange={(v) => patch({ evidence: v })} placeholder="Add project slug" suggestions={slugs} />
              </Field>
            </div>
          )}
        />
      </section>

      <section className="a-section" aria-labelledby="ps-work">
        <h2 id="ps-work">Experience</h2>
        <Repeater
          value={form.experience}
          onChange={(v) => set('experience', v)}
          blank={() => ({ role: '', company: '', location: '', start: '', end: '', bullets: [], projects: [] })}
          addLabel="Add position"
          label="Position"
          render={(item, patch, i) => (
            <div className="a-stack">
              <div className="a-grid">
                <Field label="Role" htmlFor={`w-r-${i}`}>
                  <TextInput id={`w-r-${i}`} value={item.role} onChange={(v) => patch({ role: v })} />
                </Field>
                <Field label="Company" htmlFor={`w-c-${i}`}>
                  <TextInput id={`w-c-${i}`} value={item.company} onChange={(v) => patch({ company: v })} />
                </Field>
                <Field label="Location" htmlFor={`w-l-${i}`}>
                  <TextInput id={`w-l-${i}`} value={item.location} onChange={(v) => patch({ location: v })} />
                </Field>
                <div className="a-grid a-grid-2tight">
                  <Field label="Start" htmlFor={`w-s-${i}`} hint="YYYY-MM">
                    <TextInput id={`w-s-${i}`} value={item.start} onChange={(v) => patch({ start: v })} placeholder="2023-10" />
                  </Field>
                  <Field label="End" htmlFor={`w-e-${i}`} hint="Empty = Present">
                    <TextInput id={`w-e-${i}`} value={item.end ?? ''} onChange={(v) => patch({ end: v })} placeholder="" />
                  </Field>
                </div>
              </div>
              <Field label="Highlights">
                <ListEditor idPrefix={`w-b-${i}`} value={item.bullets} onChange={(v) => patch({ bullets: v })} placeholder="Bullet" multiline addLabel="Add bullet" />
              </Field>
              <Field label="Linked projects (slugs)" htmlFor={`w-p-${i}`}>
                <ChipInput id={`w-p-${i}`} value={item.projects} onChange={(v) => patch({ projects: v })} placeholder="Add project slug" suggestions={slugs} />
              </Field>
            </div>
          )}
        />
      </section>

      <section className="a-section" aria-labelledby="ps-edu">
        <h2 id="ps-edu">Education</h2>
        <Repeater
          value={form.education}
          onChange={(v) => set('education', v)}
          blank={() => ({ degree: '', school: '', start: '', end: '' })}
          addLabel="Add education"
          label="Entry"
          render={(item, patch, i) => (
            <div className="a-grid">
              <Field label="Degree" htmlFor={`e-d-${i}`}>
                <TextInput id={`e-d-${i}`} value={item.degree} onChange={(v) => patch({ degree: v })} />
              </Field>
              <Field label="School" htmlFor={`e-s-${i}`}>
                <TextInput id={`e-s-${i}`} value={item.school} onChange={(v) => patch({ school: v })} />
              </Field>
              <Field label="Start" htmlFor={`e-a-${i}`}>
                <TextInput id={`e-a-${i}`} value={item.start} onChange={(v) => patch({ start: v })} />
              </Field>
              <Field label="End" htmlFor={`e-b-${i}`}>
                <TextInput id={`e-b-${i}`} value={item.end ?? ''} onChange={(v) => patch({ end: v })} />
              </Field>
            </div>
          )}
        />
      </section>

      <div className="a-footer" role="region" aria-label="Profile actions">
        <div className="a-footer-left">{dirty ? <span className="a-unsaved">Unsaved changes</span> : <span className="a-muted">All changes saved</span>}</div>
        <div className="a-footer-actions">
          <button type="button" className="a-btn" onClick={load} disabled={!dirty || saving}>
            Discard
          </button>
          <button type="button" className="a-btn a-btn-primary" onClick={save} disabled={!dirty || saving}>
            {saving && <Spinner />} Save profile
          </button>
        </div>
      </div>
    </div>
  );
}
