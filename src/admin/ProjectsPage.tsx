import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from './api';
import { formToPayload, projectToForm, sortAdmin, type AdminProject } from './model';
import { ErrorState, Icon, Skeleton, fmtDate, useToast } from './ui';

type StatusFilter = 'all' | 'published' | 'draft';

export default function ProjectsPage() {
  const toast = useToast();
  const [items, setItems] = useState<AdminProject[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => {
    setError('');
    api
      .listProjects()
      .then((l) => setItems(sortAdmin(l)))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const filtering = q.trim() !== '' || status !== 'all';
  const visible = useMemo(() => {
    if (!items) return [];
    const needle = q.trim().toLowerCase();
    return items.filter((p) => (status === 'all' || p.status === status) && (!needle || `${p.title} ${p.slug} ${p.category}`.toLowerCase().includes(needle)));
  }, [items, q, status]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const onDragEnd = async (e: DragEndEvent) => {
    if (!items || !e.over || e.active.id === e.over.id) return;
    const from = items.findIndex((p) => p.id === e.active.id);
    const to = items.findIndex((p) => p.id === e.over!.id);
    if (from < 0 || to < 0) return;
    const prev = items;
    const moved = arrayMove(items, from, to);
    setItems(moved);
    try {
      await api.reorder(moved.map((p) => p.id));
      toast.ok('Order saved.');
    } catch (err) {
      setItems(prev);
      toast.err(`Could not save order: ${(err as Error).message}`);
    }
  };

  /** Toggles go through a full GET + PUT so partial-update semantics never matter. */
  const patch = async (p: AdminProject, change: { featured?: boolean; status?: 'draft' | 'published' }, okMsg: string) => {
    setBusyId(p.id);
    try {
      const full = await api.getProject(p.id);
      const body = formToPayload(projectToForm(full));
      Object.assign(body, change);
      const saved = await api.updateProject(p.id, body);
      setItems((l) => (l ? sortAdmin(l.map((x) => (x.id === p.id ? { ...x, ...saved, cover: saved.cover ?? x.cover } : x))) : l));
      toast.ok(okMsg);
    } catch (err) {
      toast.err((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const total = items?.length ?? 0;
  const published = items?.filter((p) => p.status === 'published').length ?? 0;

  return (
    <div className="a-page">
      <div className="a-page-head">
        <div>
          <h1>Projects</h1>
          {items && (
            <p className="a-muted">
              {total} total · {published} published · {total - published} draft
            </p>
          )}
        </div>
        <a className="a-btn a-btn-primary" href="#/projects/new">
          <Icon name="plus" size={16} /> New project
        </a>
      </div>

      <div className="a-toolbar">
        <div className="a-search">
          <Icon name="search" size={16} />
          <label className="sr-only" htmlFor="proj-q">
            Search projects
          </label>
          <input id="proj-q" className="a-input" type="search" placeholder="Search title, slug or category" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="a-seg" role="group" aria-label="Filter by status">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>
              {s[0]!.toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!items && !error && <Skeleton rows={8} height={56} />}

      {items && (
        <>
          <p className="a-hint">
            {filtering
              ? 'Clear the search and status filter to reorder.'
              : 'Drag the handle (or focus it and use Space then arrow keys) to reorder. Featured projects always show first on the site; order applies within each group.'}
          </p>
          <div className="a-tablewrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th className="col-handle">
                    <span className="sr-only">Reorder</span>
                  </th>
                  <th className="col-thumb">
                    <span className="sr-only">Cover</span>
                  </th>
                  <th>Title</th>
                  <th className="col-cat">Category</th>
                  <th>Status</th>
                  <th className="col-center">Featured</th>
                  <th className="col-center">Published</th>
                  <th className="col-date">Updated</th>
                </tr>
              </thead>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={visible.map((p) => p.id)} strategy={verticalListSortingStrategy} disabled={filtering}>
                  <tbody>
                    {visible.map((p) => (
                      <Row key={p.id} p={p} disabled={filtering} busy={busyId === p.id} onFeatured={() => patch(p, { featured: !p.featured }, p.featured ? 'Removed from featured.' : 'Marked as featured.')} onPublish={() => patch(p, { status: p.status === 'published' ? 'draft' : 'published' }, p.status === 'published' ? 'Unpublished (now a draft).' : 'Published.')} />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
            {visible.length === 0 && <p className="a-empty">{total === 0 ? 'No projects yet. Create the first one.' : 'No projects match the current filters.'}</p>}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ p, disabled, busy, onFeatured, onPublish }: { p: AdminProject; disabled: boolean; busy: boolean; onFeatured: () => void; onPublish: () => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: p.id, disabled });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const cover = p.cover ?? p.gallery?.[0] ?? null;
  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? 'is-dragging' : undefined} aria-busy={busy}>
      <td className="col-handle">
        <button type="button" ref={setActivatorNodeRef} className="a-icon-btn a-handle" disabled={disabled} aria-label={`Reorder ${p.title}`} {...attributes} {...listeners}>
          <Icon name="grip" size={18} />
        </button>
      </td>
      <td className="col-thumb">{cover ? <img className="a-thumb" src={cover.thumb_url || cover.url} alt="" width={64} height={40} loading="lazy" /> : <span className="a-thumb a-thumb-empty" />}</td>
      <td>
        <a className="a-title-link" href={`#/projects/${p.id}`}>
          {p.title || '(untitled)'}
        </a>
        <span className="a-sub a-mono">/{p.slug}</span>
      </td>
      <td className="col-cat">{p.category}</td>
      <td>
        <span className={`a-pill a-pill-${p.status}`}>{p.status === 'published' ? 'Published' : 'Draft'}</span>
      </td>
      <td className="col-center">
        <button type="button" className={`a-icon-btn a-star ${p.featured ? 'on' : ''}`} aria-pressed={!!p.featured} aria-label={`Featured: ${p.title}`} onClick={onFeatured} disabled={busy}>
          <Icon name={p.featured ? 'starFill' : 'star'} size={18} />
        </button>
      </td>
      <td className="col-center">
        <label className="a-switch a-switch-bare">
          <input type="checkbox" role="switch" checked={p.status === 'published'} onChange={onPublish} disabled={busy} aria-label={`Published: ${p.title}`} />
          <span className="a-switch-track" aria-hidden="true" />
        </label>
      </td>
      <td className="col-date a-muted">{fmtDate(p.updated_at)}</td>
    </tr>
  );
}
