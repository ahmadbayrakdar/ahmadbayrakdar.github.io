import type { Media } from '../lib/types';
import type { ProjectForm } from './model';

/**
 * Renders the project with the same class names / CSS as the public case study page
 * (src/styles/case-study.css + global.css), from the unsaved editor state.
 */
export default function CaseStudyPreview({ form, cover, gallery }: { form: ProjectForm; cover: Media | null; gallery: Media[] }) {
  const cs = form.case_study;
  const rest = gallery.filter((m) => m.id !== cover?.id);
  const timeline = form.year_start ? (form.year_end ? (form.year_end === form.year_start ? form.year_start : `${form.year_start} – ${form.year_end}`) : `${form.year_start} – Present`) : '';
  const meta = [
    ['Role', form.role],
    ['Timeline', timeline],
    ['Client', form.client],
    ['Type', form.kind],
    ['Platform', form.category],
  ].filter(([, v]) => !!v) as [string, string][];
  const resp = cs.responsibilities.filter(Boolean);
  const features = cs.features.filter(Boolean);
  const results = cs.results.filter(Boolean);
  const challenges = cs.challenges.filter((c) => c.challenge || c.solution);
  const arch = cs.architecture.split('\n').filter((l) => l.trim());
  const host = (() => {
    try {
      return form.live_url ? new URL(form.live_url).host.replace(/^www\./, '') : form.title;
    } catch {
      return form.title;
    }
  })();

  return (
    <article className="preview-page">
      <header className="cs-head">
        <nav className="cs-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <span>Home</span>
            </li>
            <li>
              <span>Projects</span>
            </li>
            <li>
              <span aria-current="page">{form.title || 'Untitled'}</span>
            </li>
          </ol>
        </nav>
        <h1>{form.title || 'Untitled project'}</h1>
        {form.tagline && <p className="lead">{form.tagline}</p>}
        {meta.length > 0 && (
          <dl className="cs-meta">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="cs-actions">
          {form.live_url && <span className="btn btn-primary">Live site</span>}
          {form.repo_url && <span className="btn btn-secondary">Repository</span>}
          {form.links.filter((l) => l.url).map((l, i) => (
            <span className="btn btn-secondary" key={i}>
              {l.label || l.url}
            </span>
          ))}
        </div>
      </header>

      {cover && (
        <div className="cs-cover">
          <div className="frame">
            <div className="frame-bar">
              <span className="frame-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="frame-url">{host}</span>
            </div>
            <div className="frame-body">
              <img src={cover.url} alt={cover.alt || form.title} width={cover.width} height={cover.height} />
            </div>
          </div>
        </div>
      )}

      <div className="cs-layout">
        <div className="cs-main">
          {cs.overview && (
            <section className="cs-section">
              <h2>
                <span className="mono">Overview</span>What this project is
              </h2>
              <p className="cs-prose cs-prose--strong">{cs.overview}</p>
            </section>
          )}
          {cs.problem && (
            <section className="cs-section">
              <h2>
                <span className="mono">Context</span>The problem
              </h2>
              <p className="cs-prose">{cs.problem}</p>
            </section>
          )}
          {(cs.role || resp.length > 0) && (
            <section className="cs-section">
              <h2>
                <span className="mono">Contribution</span>My role &amp; responsibilities
              </h2>
              {cs.role && <p className="cs-prose">{cs.role}</p>}
              {resp.length > 0 && (
                <ul className="cs-list">
                  {resp.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {features.length > 0 && (
            <section className="cs-section">
              <h2>
                <span className="mono">Scope</span>Key features
              </h2>
              <ul className="cs-list cs-features">
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </section>
          )}
          {arch.length > 0 && (
            <section className="cs-section">
              <h2>
                <span className="mono">System</span>Architecture
              </h2>
              <pre className="cs-arch">
                <code>
                  {arch.map((line, i) => (
                    <span key={i}>
                      {i > 0 && '\n'}
                      {line.split('→').map((part, j) => (
                        <span key={j}>
                          {j > 0 && <span className="arrow">→</span>}
                          {part}
                        </span>
                      ))}
                    </span>
                  ))}
                </code>
              </pre>
            </section>
          )}
          {challenges.length > 0 && (
            <section className="cs-section">
              <h2>
                <span className="mono">Engineering</span>Challenges &amp; solutions
              </h2>
              <div className="cs-challenges">
                {challenges.map((c, i) => (
                  <div className="cs-pair" key={i}>
                    <div>
                      <span className="mono">Challenge</span>
                      <p>{c.challenge}</p>
                    </div>
                    <div>
                      <span className="mono">Solution</span>
                      <p>{c.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {results.length > 0 && (
            <section className="cs-section">
              <h2>
                <span className="mono">Outcome</span>Results
              </h2>
              <ul className="cs-list cs-results">
                {results.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          )}
          {(form.tech.length > 0 || form.tags.length > 0) && (
            <section className="cs-section">
              <h2>
                <span className="mono">Stack</span>Tech stack
              </h2>
              <div className="cs-tech">
                {form.tech.length > 0 && (
                  <div>
                    <h3>Technology</h3>
                    <ul className="chips">
                      {form.tech.map((t) => (
                        <li className="chip" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {form.tags.length > 0 && (
                  <div>
                    <h3>Tags</h3>
                    <ul className="chips">
                      {form.tags.map((t) => (
                        <li className="chip" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
          {rest.length > 0 && (
            <section className="cs-section">
              <h2>
                <span className="mono">Gallery</span>More screens
              </h2>
              <ul className="cs-gallery">
                {rest.map((m) => (
                  <li key={m.id}>
                    <button type="button" tabIndex={-1}>
                      <img src={m.thumb_url || m.url} alt={m.alt || ''} width={m.width} height={m.height} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {cs.notes && (
            <section className="cs-section">
              <h2>
                <span className="mono">Notes</span>Additional notes
              </h2>
              <p className="cs-prose">{cs.notes}</p>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
