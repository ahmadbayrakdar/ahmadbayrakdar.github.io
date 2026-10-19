import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, KINDS, type Media } from '../lib/types';
import { api } from './api';
import { clearDirty, ChipInput, ErrorState, Field, Icon, ListEditor, Modal, Repeater, Select, Skeleton, Spinner, Tabs, TextArea, TextInput, Toggle, fmtDateTime, useConfirm, useToast, useUnsavedGuard } from './ui';
import { emptyForm, formToPayload, projectToForm, slugify, sortedMedia, validateForm, type AdminProject, type ProjectForm } from './model';
import MediaManager from './MediaManager';
import CaseStudyPreview from './CaseStudyPreview';

type TabId = 'basics' | 'case' | 'media' | 'links';

const tabOfError: Record<string, TabId> = { title: 'basics', slug: 'basics', summary: 'basics', year_start: 'basics', year_end: 'basics', live_url: 'links', repo_url: 'links' };

export default function ProjectEditor({ id }: { id: number | null }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(id !== null);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saved, setSaved] = useState(() => JSON.stringify(emptyForm()));
  const [record, setRecord] = useState<AdminProject | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [coverId, setCoverId] = useState<number | null>(null);
  const [tab, setTab] = useState<TabId>('basics');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<null | 'save' | 'publish' | 'unpublish' | 'delete'>(null);
  const [preview, setPreview] = useState(false);
  const slugTouched = useRef(id !== null);

  const dirty = JSON.stringify(form) !== saved;
  useUnsavedGuard(dirty);

  const apply = useCallback((p: AdminProject) => {
    const f = projectToForm(p);
    setForm(f);
    setSaved(JSON.stringify(f));
    setRecord(p);
    setMedia(p.gallery ?? []);
    setCoverId(p.cover?.id ?? null);
  }, []);

  const load = useCallback(() => {
    if (id === null) return;
    setLoading(true);
    setLoadError('');
    api
      .getProject(id)
      .then(apply)
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [id, apply]);
  useEffect(load, [load]);

  const set = <K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setCs = <K extends keyof ProjectForm['case_study']>(k: K, v: ProjectForm['case_study'][K]) => setForm((f) => ({ ...f, case_study: { ...f.case_study, [k]: v } }));

  const onTitle = (v: string) =>
    setForm((f) => ({ ...f, title: v, slug: slugTouched.current ? f.slug : slugify(v) }));

  const reloadMedia = useCallback(async () => {
    if (id === null) return;
    const p = await api.getProject(id);
    setMedia(p.gallery ?? []);
    setCoverId(p.cover?.id ?? null);
    setRecord((r) => (r ? { ...r, cover: p.cover, gallery: p.gallery } : p));
  }, [id]);

  const save = async (status?: 'draft' | 'published') => {
    const next: ProjectForm = status ? { ...form, status } : form;
    const errs = validateForm(next);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      setTab(tabOfError[first] ?? 'basics');
      toast.err(errs[first]!);
      return;
    }
    setSaving(status === 'published' ? 'publish' : status === 'draft' && form.status === 'published' ? 'unpublish' : 'save');
    try {
      const payload = formToPayload(next);
      if (id === null) {
        const created = await api.createProject(payload);
        clearDirty();
        toast.ok(status === 'published' ? 'Project created and published.' : 'Draft created. You can now add images.');
        window.location.hash = `#/projects/${created.id}`;
        return;
      }
      const updated = await api.updateProject(id, payload);
      const fresh = updated && typeof updated === 'object' && 'id' in updated ? updated : await api.getProject(id);
      const f = projectToForm({ ...fresh, gallery: fresh.gallery ?? media, cover: fresh.cover ?? record?.cover ?? null });
      setForm(f);
      setSaved(JSON.stringify(f));
      setRecord((r) => ({ ...(r as AdminProject), ...fresh }));
      toast.ok(status === 'published' ? 'Published. Use "Publish site" to rebuild the website.' : status === 'draft' && form.status === 'published' ? 'Unpublished. It is now a draft.' : 'Saved.');
    } catch (e) {
      toast.err(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(null);
    }
  };

  const remove = async () => {
    if (id === null) return;
    const ok = await confirm({ title: `Delete “${form.title || 'this project'}”?`, body: 'The project and its images are permanently removed. This cannot be undone.', confirmLabel: 'Delete project', danger: true });
    if (!ok) return;
    setSaving('delete');
    try {
      await api.deleteProject(id);
      clearDirty();
      toast.ok('Project deleted.');
      window.location.hash = '#/projects';
    } catch (e) {
      toast.err((e as Error).message);
      setSaving(null);
    }
  };

  const cover = useMemo(() => media.find((m) => m.id === coverId) ?? sortedMedia(media)[0] ?? null, [media, coverId]);

  if (loading) {
    return (
      <div className="a-page">
        <Skeleton rows={6} height={52} />
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="a-page">
        <ErrorState message={loadError} onRetry={load} />
      </div>
    );
  }

  const csFilled = Object.entries(form.case_study).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : !!String(v).trim())).length;
  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'case', label: 'Case study', badge: csFilled ? String(csFilled) : undefined },
    { id: 'media', label: 'Media', badge: media.length ? String(media.length) : undefined },
    { id: 'links', label: 'Links & SEO' },
  ];
  const isPublished = form.status === 'published';
  const busy = saving !== null;

  return (
    <div className="a-page a-editor">
      <div className="a-page-head">
        <div>
          <a className="a-back" href="#/projects">
            <Icon name="arrowLeft" size={14} /> All projects
          </a>
          <h1>{id === null ? 'New project' : form.title || 'Untitled project'}</h1>
          <p className="a-muted">
            <span className={`a-pill a-pill-${form.status}`}>{isPublished ? 'Published' : 'Draft'}</span>
            {record?.updated_at && <span className="a-sub-inline"> Updated {fmtDateTime(record.updated_at)}</span>}
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Project sections" />

      <div className="a-panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'basics' && (
          <div className="a-grid">
            <Field label="Title" htmlFor="f-title" error={errors.title}>
              <TextInput id="f-title" value={form.title} onChange={onTitle} aria-invalid={!!errors.title} required />
            </Field>
            <Field label="Slug" htmlFor="f-slug" error={errors.slug} hint={<>Public URL: /projects/<b>{form.slug || 'slug'}</b>/ {id === null ? '· follows the title until you edit it' : '· changing it breaks existing links'}</>}>
              <TextInput
                id="f-slug"
                value={form.slug}
                onChange={(v) => {
                  slugTouched.current = true;
                  set('slug', v.toLowerCase());
                }}
                aria-invalid={!!errors.slug}
                spellCheck={false}
              />
            </Field>
            <div className="a-span-2">
              <Field label="Tagline" htmlFor="f-tagline" hint="One line under the title.">
                <TextInput id="f-tagline" value={form.tagline} onChange={(v) => set('tagline', v)} />
              </Field>
            </div>
            <div className="a-span-2">
              <Field label="Summary" htmlFor="f-summary" error={errors.summary} counter={<span className={form.summary.length > 280 ? 'over' : ''}>{form.summary.length}/280</span>} hint="Shown on project cards. Keep it to one or two plain sentences.">
                <TextArea id="f-summary" rows={3} value={form.summary} onChange={(v) => set('summary', v)} aria-invalid={!!errors.summary} />
              </Field>
            </div>
            <Field label="Category" htmlFor="f-category">
              <Select id="f-category" value={form.category} onChange={(v) => set('category', v)} options={CATEGORIES} />
            </Field>
            <Field label="Kind" htmlFor="f-kind">
              <Select id="f-kind" value={form.kind} onChange={(v) => set('kind', v)} options={KINDS} />
            </Field>
            <Field label="Client" htmlFor="f-client">
              <TextInput id="f-client" value={form.client} onChange={(v) => set('client', v)} />
            </Field>
            <Field label="Industry" htmlFor="f-industry">
              <TextInput id="f-industry" value={form.industry} onChange={(v) => set('industry', v)} />
            </Field>
            <Field label="Location" htmlFor="f-location">
              <TextInput id="f-location" value={form.location} onChange={(v) => set('location', v)} />
            </Field>
            <Field label="Your role" htmlFor="f-role">
              <TextInput id="f-role" value={form.role} onChange={(v) => set('role', v)} />
            </Field>
            <Field label="Year started" htmlFor="f-ys" error={errors.year_start}>
              <TextInput id="f-ys" inputMode="numeric" maxLength={4} value={form.year_start} onChange={(v) => set('year_start', v)} aria-invalid={!!errors.year_start} />
            </Field>
            <Field label="Year ended" htmlFor="f-ye" error={errors.year_end} hint="Leave empty if ongoing (shown as Present).">
              <TextInput id="f-ye" inputMode="numeric" maxLength={4} value={form.year_end} onChange={(v) => set('year_end', v)} aria-invalid={!!errors.year_end} />
            </Field>
            <Field label="Status" htmlFor="f-status">
              <Select id="f-status" value={form.status} onChange={(v) => set('status', v as 'draft' | 'published')} options={['draft', 'published']} />
            </Field>
            <div className="a-field a-field-toggle">
              <Toggle id="f-featured" checked={form.featured} onChange={(v) => set('featured', v)} label="Featured in “Selected work”" />
            </div>
          </div>
        )}

        {tab === 'case' && (
          <div className="a-stack">
            <p className="a-hint">Every section is optional. Sections left empty are not rendered on the public page. Write only what is true and verifiable.</p>
            <Field label="Overview" htmlFor="c-overview">
              <TextArea id="c-overview" rows={5} value={form.case_study.overview} onChange={(v) => setCs('overview', v)} />
            </Field>
            <Field label="The problem" htmlFor="c-problem">
              <TextArea id="c-problem" rows={4} value={form.case_study.problem} onChange={(v) => setCs('problem', v)} />
            </Field>
            <Field label="My role" htmlFor="c-role">
              <TextArea id="c-role" rows={3} value={form.case_study.role} onChange={(v) => setCs('role', v)} />
            </Field>
            <Field label="Responsibilities">
              <ListEditor idPrefix="c-resp" value={form.case_study.responsibilities} onChange={(v) => setCs('responsibilities', v)} placeholder="Responsibility" addLabel="Add responsibility" />
            </Field>
            <Field label="Key features">
              <ListEditor idPrefix="c-feat" value={form.case_study.features} onChange={(v) => setCs('features', v)} placeholder="Feature" addLabel="Add feature" />
            </Field>
            <Field label="Architecture" htmlFor="c-arch" hint="Plain text. Lines using → arrows render as a diagram-style block, e.g. Browser → API → Database.">
              <TextArea id="c-arch" rows={5} className="a-mono-area" value={form.case_study.architecture} onChange={(v) => setCs('architecture', v)} spellCheck={false} />
            </Field>
            <Field label="Challenges & solutions">
              <Repeater
                value={form.case_study.challenges}
                onChange={(v) => setCs('challenges', v)}
                blank={() => ({ challenge: '', solution: '' })}
                addLabel="Add challenge"
                label="Challenge"
                render={(item, patch, i) => (
                  <div className="a-grid">
                    <Field label="Challenge" htmlFor={`ch-c-${i}`}>
                      <TextArea id={`ch-c-${i}`} rows={3} value={item.challenge} onChange={(v) => patch({ challenge: v })} />
                    </Field>
                    <Field label="Solution" htmlFor={`ch-s-${i}`}>
                      <TextArea id={`ch-s-${i}`} rows={3} value={item.solution} onChange={(v) => patch({ solution: v })} />
                    </Field>
                  </div>
                )}
              />
            </Field>
            <Field label="Results" hint="Only outcomes you can verify. No invented metrics.">
              <ListEditor idPrefix="c-res" value={form.case_study.results} onChange={(v) => setCs('results', v)} placeholder="Result" addLabel="Add result" />
            </Field>
            <Field label="Notes" htmlFor="c-notes" hint="Shown at the bottom of the page as “Additional notes”.">
              <TextArea id="c-notes" rows={3} value={form.case_study.notes} onChange={(v) => setCs('notes', v)} />
            </Field>
          </div>
        )}

        {tab === 'media' && (
          <MediaManager
            projectId={id}
            media={media}
            coverId={coverId}
            onReload={reloadMedia}
            onMediaChange={(m, c) => {
              setMedia(m);
              setCoverId(c);
            }}
          />
        )}

        {tab === 'links' && (
          <div className="a-stack">
            <div className="a-grid">
              <Field label="Live URL" htmlFor="l-live" error={errors.live_url}>
                <TextInput id="l-live" type="url" placeholder="https://" value={form.live_url} onChange={(v) => set('live_url', v)} aria-invalid={!!errors.live_url} />
              </Field>
              <Field label="Repository URL" htmlFor="l-repo" error={errors.repo_url}>
                <TextInput id="l-repo" type="url" placeholder="https://github.com/…" value={form.repo_url} onChange={(v) => set('repo_url', v)} aria-invalid={!!errors.repo_url} />
              </Field>
            </div>
            <Field label="Other links">
              <Repeater
                value={form.links}
                onChange={(v) => set('links', v)}
                blank={() => ({ label: '', url: '' })}
                addLabel="Add link"
                label="Link"
                render={(item, patch, i) => (
                  <div className="a-grid">
                    <Field label="Label" htmlFor={`lk-l-${i}`}>
                      <TextInput id={`lk-l-${i}`} value={item.label} onChange={(v) => patch({ label: v })} />
                    </Field>
                    <Field label="URL" htmlFor={`lk-u-${i}`}>
                      <TextInput id={`lk-u-${i}`} type="url" value={item.url} onChange={(v) => patch({ url: v })} />
                    </Field>
                  </div>
                )}
              />
            </Field>
            <Field label="Technologies" htmlFor="l-tech" hint="Press Enter or comma to add. The first six show on cards.">
              <ChipInput id="l-tech" value={form.tech} onChange={(v) => set('tech', v)} placeholder="Add technology" />
            </Field>
            <Field label="Tags" htmlFor="l-tags">
              <ChipInput id="l-tags" value={form.tags} onChange={(v) => set('tags', v)} placeholder="Add tag" />
            </Field>
            <Field label="Highlights" hint="Short factual lines. Up to three show on the home page.">
              <ListEditor idPrefix="l-high" value={form.highlights} onChange={(v) => set('highlights', v)} placeholder="Highlight" addLabel="Add highlight" />
            </Field>
            <div className="a-grid">
              <Field label="SEO title" htmlFor="l-seot" counter={<Hint n={form.seo_title.length} lo={30} hi={60} />} hint="Falls back to “Title — Name”.">
                <TextInput id="l-seot" value={form.seo_title} onChange={(v) => set('seo_title', v)} />
              </Field>
              <Field label="SEO description" htmlFor="l-seod" counter={<Hint n={form.seo_description.length} lo={70} hi={160} />} hint="Falls back to the summary.">
                <TextArea id="l-seod" rows={3} value={form.seo_description} onChange={(v) => set('seo_description', v)} />
              </Field>
            </div>
            <div className="a-serp" aria-label="Search result preview">
              <p className="a-serp-url">ahmadbayrakdar.github.io › projects › {form.slug || 'slug'}</p>
              <p className="a-serp-title">{(form.seo_title || `${form.title || 'Untitled'} — Ahmad Bayrakdar`).slice(0, 70)}</p>
              <p className="a-serp-desc">{(form.seo_description || form.summary || form.tagline || 'No description yet.').slice(0, 170)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="a-footer" role="region" aria-label="Project actions">
        <div className="a-footer-left">
          {dirty ? <span className="a-unsaved">Unsaved changes</span> : <span className="a-muted">All changes saved</span>}
        </div>
        <div className="a-footer-actions">
          {id !== null && (
            <button type="button" className="a-btn a-btn-danger-ghost" onClick={remove} disabled={busy}>
              {saving === 'delete' ? <Spinner /> : <Icon name="trash" size={15} />} Delete
            </button>
          )}
          <button type="button" className="a-btn" onClick={() => setPreview(true)}>
            <Icon name="eye" size={15} /> Preview
          </button>
          <button type="button" className="a-btn" onClick={() => save()} disabled={busy || (!dirty && id !== null)}>
            {saving === 'save' && <Spinner />} {isPublished ? 'Save changes' : 'Save draft'}
          </button>
          {isPublished ? (
            <button type="button" className="a-btn" onClick={() => save('draft')} disabled={busy}>
              {saving === 'unpublish' && <Spinner />} Unpublish
            </button>
          ) : (
            <button type="button" className="a-btn a-btn-primary" onClick={() => save('published')} disabled={busy}>
              {saving === 'publish' && <Spinner />} Publish
            </button>
          )}
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title={`Preview — ${form.title || 'Untitled'}`} wide>
        <div className="preview-scope">
          <CaseStudyPreview form={form} cover={cover} gallery={sortedMedia(media)} />
        </div>
      </Modal>
    </div>
  );
}

function Hint({ n, lo, hi }: { n: number; lo: number; hi: number }) {
  const state = n === 0 ? '' : n > hi ? 'over' : n >= lo ? 'good' : 'short';
  return (
    <span className={state}>
      {n}/{hi}
      {state === 'short' && ' · a bit short'}
      {state === 'over' && ' · too long, may be cut off'}
    </span>
  );
}
