import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Media } from '../lib/types';
import { api, uploadMedia } from './api';
import { sortedMedia } from './model';
import { Icon, useConfirm, useToast } from './ui';

type QueueItem = { key: string; name: string; size: number; preview: string; progress: number; state: 'queued' | 'uploading' | 'done' | 'error'; error?: string };

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX = 15 * 1024 * 1024;

type Props = {
  projectId: number | null;
  media: Media[];
  coverId: number | null;
  onReload: () => Promise<void>;
  onMediaChange: (m: Media[], coverId: number | null) => void;
};

export default function MediaManager({ projectId, media, coverId, onReload, onMediaChange }: Props) {
  const toast = useToast();
  const confirm = useConfirm();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const ordered = sortedMedia(media);

  useEffect(() => () => queue.forEach((q) => URL.revokeObjectURL(q.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const patchQueue = (key: string, p: Partial<QueueItem>) => setQueue((q) => q.map((x) => (x.key === key ? { ...x, ...p } : x)));

  const upload = useCallback(
    async (files: File[]) => {
      if (projectId == null) return;
      const ok: File[] = [];
      for (const f of files) {
        if (!ACCEPT.includes(f.type)) toast.err(`${f.name}: only JPEG, PNG, WebP or GIF.`);
        else if (f.size > MAX) toast.err(`${f.name}: larger than 15 MB.`);
        else ok.push(f);
      }
      if (!ok.length) return;
      const items: QueueItem[] = ok.map((f) => ({ key: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`, name: f.name, size: f.size, preview: URL.createObjectURL(f), progress: 0, state: 'queued' }));
      setQueue((q) => [...q, ...items]);
      let fail = 0;
      // two at a time
      const pending = items.map((it, i) => ({ it, f: ok[i]! }));
      const worker = async () => {
        for (let job = pending.shift(); job; job = pending.shift()) {
          patchQueue(job.it.key, { state: 'uploading' });
          try {
            await uploadMedia(projectId, job.f, (pct) => patchQueue(job.it.key, { progress: pct }));
            patchQueue(job.it.key, { state: 'done', progress: 100 });
          } catch (e) {
            fail++;
            patchQueue(job.it.key, { state: 'error', error: (e as Error).message });
          }
        }
      };
      await Promise.all([worker(), worker()]);
      await onReload();
      if (fail === 0) toast.ok(`Uploaded ${items.length} ${items.length === 1 ? 'image' : 'images'}.`);
      else toast.err(`${fail} of ${items.length} uploads failed.`);
      window.setTimeout(() => {
        setQueue((q) => {
          q.filter((x) => x.state === 'done').forEach((x) => URL.revokeObjectURL(x.preview));
          return q.filter((x) => x.state !== 'done');
        });
      }, 1500);
    },
    [projectId, onReload, toast],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void upload(Array.from(e.dataTransfer.files));
  };

  const setCover = async (m: Media) => {
    if (projectId == null) return;
    try {
      await api.setCover(projectId, m.id);
      onMediaChange(media, m.id);
      toast.ok('Cover updated.');
    } catch (e) {
      toast.err((e as Error).message);
    }
  };

  const saveAlt = async (m: Media, alt: string) => {
    if (alt === m.alt) return;
    try {
      await api.patchMedia(m.id, { alt });
      onMediaChange(media.map((x) => (x.id === m.id ? { ...x, alt } : x)), coverId);
    } catch (e) {
      toast.err(`Alt text not saved: ${(e as Error).message}`);
    }
  };

  const remove = async (m: Media) => {
    const ok = await confirm({ title: 'Delete this image?', body: 'It is removed from the project and the server. This cannot be undone.', confirmLabel: 'Delete image', danger: true });
    if (!ok) return;
    try {
      await api.deleteMedia(m.id);
      onMediaChange(media.filter((x) => x.id !== m.id), coverId === m.id ? null : coverId);
      toast.ok('Image deleted.');
      if (coverId === m.id) void onReload();
    } catch (e) {
      toast.err((e as Error).message);
    }
  };

  const onDragEnd = async (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const from = ordered.findIndex((m) => m.id === e.active.id);
    const to = ordered.findIndex((m) => m.id === e.over!.id);
    const moved = arrayMove(ordered, from, to).map((m, i) => ({ ...m, sort: i }));
    onMediaChange(moved, coverId);
    try {
      const changed = moved.filter((m, i) => ordered[i]?.id !== m.id || ordered[i]?.sort !== i);
      await Promise.all(changed.map((m) => api.patchMedia(m.id, { sort: m.sort })));
      toast.ok('Image order saved.');
    } catch (err) {
      toast.err(`Order not saved: ${(err as Error).message}`);
      void onReload();
    }
  };

  if (projectId == null) {
    return (
      <div className="a-empty a-empty-box">
        <p>Save the project once to start uploading images.</p>
        <p className="a-hint">Media is attached to a saved project. Save as a draft first, then return to this tab.</p>
      </div>
    );
  }

  return (
    <div className="a-media">
      <div
        className={`a-drop ${over ? 'is-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <Icon name="download" size={22} />
        <p>
          <strong>Drag and drop images here</strong>
          <span className="a-muted"> — JPEG, PNG, WebP or GIF, up to 15 MB each</span>
        </p>
        <button type="button" className="a-btn" onClick={() => inputRef.current?.click()}>
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(',')}
          multiple
          hidden
          onChange={(e) => {
            void upload(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="a-queue" aria-label="Uploads">
          {queue.map((q) => (
            <li key={q.key} className={`a-queue-item is-${q.state}`}>
              <img src={q.preview} alt="" width={48} height={32} />
              <div className="a-queue-main">
                <span className="a-queue-name">{q.name}</span>
                <div className="a-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={q.progress} aria-label={`Upload progress for ${q.name}`}>
                  <span style={{ width: `${q.progress}%` }} />
                </div>
              </div>
              <span className="a-queue-state a-mono">{q.state === 'error' ? q.error : q.state === 'done' ? 'Done' : q.state === 'queued' ? 'Queued' : `${q.progress}%`}</span>
            </li>
          ))}
        </ul>
      )}

      {ordered.length === 0 ? (
        <p className="a-empty">No images yet. The first image you upload becomes the cover.</p>
      ) : (
        <>
          <p className="a-hint">Drag a card (or focus its handle, press Space, then use arrow keys) to reorder. The cover is used in cards and social previews.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={ordered.map((m) => m.id)} strategy={rectSortingStrategy}>
              <ul className="a-mediagrid">
                {ordered.map((m) => (
                  <MediaCard key={m.id} m={m} isCover={coverId === m.id} onCover={() => setCover(m)} onAlt={(v) => saveAlt(m, v)} onDelete={() => remove(m)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

function MediaCard({ m, isCover, onCover, onAlt, onDelete }: { m: Media; isCover: boolean; onCover: () => void; onAlt: (v: string) => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: m.id });
  const [alt, setAlt] = useState(m.alt ?? '');
  useEffect(() => setAlt(m.alt ?? ''), [m.alt]);
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`a-mcard ${isDragging ? 'is-dragging' : ''} ${isCover ? 'is-cover' : ''}`}>
      <div className="a-mcard-img">
        <img src={m.thumb_url || m.url} alt={m.alt || ''} width={m.width} height={m.height} loading="lazy" />
        {isCover && <span className="a-pill a-pill-cover">Cover</span>}
        <button type="button" ref={setActivatorNodeRef} className="a-icon-btn a-handle a-mcard-handle" aria-label="Reorder image" {...attributes} {...listeners}>
          <Icon name="grip" size={16} />
        </button>
      </div>
      <div className="a-mcard-body">
        <label className="sr-only" htmlFor={`alt-${m.id}`}>
          Alt text
        </label>
        <input id={`alt-${m.id}`} className="a-input" placeholder="Alt text (describe the screen)" value={alt} onChange={(e) => setAlt(e.target.value)} onBlur={() => onAlt(alt)} />
        <div className="a-mcard-actions">
          <button type="button" className="a-btn a-btn-sm" onClick={onCover} disabled={isCover} aria-pressed={isCover}>
            {isCover ? 'Cover image' : 'Set as cover'}
          </button>
          <button type="button" className="a-icon-btn a-danger" onClick={onDelete} aria-label="Delete image">
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
