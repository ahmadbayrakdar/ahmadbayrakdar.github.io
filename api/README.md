# Portfolio API

FastAPI + SQLite backend for the portfolio (contract: `docs/ARCHITECTURE.md`). Python 3.12+ (VPS: 3.14), stdlib `sqlite3`
(WAL, foreign keys, versioned migrations), Pillow for images, no ORM.

```
api/
  app/            main.py (create_app), config, db, auth, ratelimit, images, schemas, services, middleware, routers/
  cli.py          create-admin, set-password, import, export, backup, restore
  deploy/         install.sh, systemd units, nginx site, restore.md
  tests/          pytest suite (see `pytest api/tests`)
```

## Run locally

```bash
cd api
export PORTFOLIO_SECRET=$(python -c "import secrets;print(secrets.token_hex(32))")   # >= 32 chars, required
export PORTFOLIO_DB=./data/portfolio.db PORTFOLIO_MEDIA_DIR=./data/media             # defaults: api/data/...
export PORTFOLIO_PUBLIC_URL=http://127.0.0.1:8810
printf 'a-long-local-password' | uv run --python 3.12 --with-requirements requirements.txt python cli.py create-admin --email me@example.com
uv run --python 3.12 --with-requirements requirements.txt uvicorn app.main:create_app_from_env --factory --port 8810
```

Locally, media files are written to `PORTFOLIO_MEDIA_DIR` but only nginx serves `/media/` in production; the dev server does not.

Tests (no venv in the repo; uv's cache is used):

```bash
uv run --python 3.12 --with-requirements api/requirements.txt --with pytest --with httpx pytest api/tests -q
```

## Environment variables

| variable | default | meaning |
|---|---|---|
| `PORTFOLIO_SECRET` | required, >= 32 chars | HMAC key for tokens (and salt for stored IP hashes) |
| `PORTFOLIO_DB` | `api/data/portfolio.db` | SQLite file |
| `PORTFOLIO_MEDIA_DIR` | `api/data/media` | where WebP files are written (nginx serves it) |
| `PORTFOLIO_PUBLIC_URL` | `http://127.0.0.1:8810` | base for absolute media URLs, e.g. `https://portfolio-api.builderization.com` |
| `PORTFOLIO_CORS` | `https://ahmadbayrakdar.github.io,http://localhost:4321` | comma list of allowed origins |
| `PORTFOLIO_TRUST_PROXY` | off | `1` = take the client IP from `X-Real-IP` (set by nginx) for rate limits |
| `GITHUB_DISPATCH_TOKEN` | unset | enables `POST /api/admin/rebuild` |
| `GITHUB_REPO` | `ahmadbayrakdar/ahmadbayrakdar.github.io` | repository that receives `portfolio-content-changed` |

## Deploy (Ubuntu VPS)

Do not run anything that touches other sites; steps 1-2 only add the `portfolio` user, `/opt/portfolio-api`, `/var/lib/portfolio-api`,
`/var/backups/portfolio-api`, `/etc/portfolio-api` and three systemd units.

1. Copy the `api/` folder to the VPS and run the installer (idempotent; re-run it to deploy new code):
   ```bash
   sudo bash api/deploy/install.sh
   ```
   It generates `/etc/portfolio-api/env` (with a fresh `PORTFOLIO_SECRET`) only if the file does not exist, installs a venv,
   enables `portfolio-api.service` and `portfolio-api-backup.timer`, and installs the `portfolio-cli` wrapper.
2. Create the admin user:
   ```bash
   portfolio-cli create-admin --email you@example.com      # prompts for the password (>= 12 chars)
   ```
3. Install the nginx site (separate, manual step):
   ```bash
   sudo cp api/deploy/nginx-portfolio-api.conf /etc/nginx/sites-available/portfolio-api
   sudo ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/portfolio-api
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. TLS (wildcard DNS already points at the VPS):
   ```bash
   sudo certbot --nginx --redirect -d portfolio-api.builderization.com
   sudo nginx -t && sudo systemctl reload nginx
   ```
   `--redirect` makes certbot add the http -> https redirect without asking. The site file only declares its own `server`
   and one `limit_req_zone`; it sets nothing global, so the other sites are unaffected (`nginx -t` before every reload).
5. Verify: `curl -I http://portfolio-api.builderization.com/api/health` (expect a 301 to https), then `curl https://portfolio-api.builderization.com/api/health`. Optionally import content:
   `portfolio-cli import --file /tmp/seed.json --media-root /tmp/seed-images` (files must be readable by user `portfolio`).
6. Optional: put a fine-grained GitHub token in `/etc/portfolio-api/env` as `GITHUB_DISPATCH_TOKEN=...`, then
   `sudo systemctl restart portfolio-api`.

Logs: `journalctl -u portfolio-api -f`. Status: `systemctl status portfolio-api portfolio-api-backup.timer`.

## Seed / import format

```json
{ "profile": { "...": "..." },
  "projects": [ { "slug": "x", "title": "X", "category": "Web Applications", "kind": "Product",
                  "images": [ { "path": "shots/x1.png", "alt": "Dashboard", "cover": true },
                              { "url": "https://example.com/x2.jpg", "alt": "Login" } ] } ] }
```

- Projects are matched by `slug`: existing ones are updated (ids kept), new ones created. `status` defaults to `published` on import
  (the API itself defaults to `draft`).
- Local `path`s resolve against `--media-root` (default: the seed file's folder); URLs are downloaded with a 20 s timeout.
- Idempotent images: the original file name is stored in the nullable `media.source` column. Re-running only adds images whose file
  name was not imported before for that project (existing ones just get their `alt` / order refreshed). Two images in one project
  must therefore have different file names.
- If a project has no `images` but a `gallery` (an export file), the gallery URLs are used.
- `--replace` additionally deletes projects missing from the file and images not listed for imported projects.
- Exit code 2 means some images failed to load (reported on stderr); everything else was still imported.

`portfolio-cli export --out file.json` writes the `/api/export` shape (drafts included unless `--published-only`).

## Backup and restore

- `portfolio-api-backup.timer` runs daily at 03:30 (+ up to 15 min random delay): `cli.py backup --dest /var/backups/portfolio-api`
  writes `portfolio-<timestamp>.db` (SQLite online-backup API, safe while running) and `media-<timestamp>.tar.gz`, keeping the newest 14 of each.
- Manual: `portfolio-cli backup --dest /var/backups/portfolio-api`. Copy backups off the VPS regularly (they are on the same disk).
- Restore: see `deploy/restore.md` (stop the service first; `--yes` is required; integrity-checked; previous db kept as `.pre-restore`).

## Rotating secrets

- **Admin password**: `portfolio-cli set-password --email you@example.com` (reads the new password from the prompt / stdin).
  Tokens already issued stay valid until they expire (12 h); to cut them off immediately also rotate `PORTFOLIO_SECRET`.
- **`PORTFOLIO_SECRET`**: edit `/etc/portfolio-api/env` (`openssl rand -hex 32`), then `sudo systemctl restart portfolio-api`.
  All issued tokens become invalid (everyone must log in again). Stored IP hashes are derived from it, so old and new hashes just differ.
- **GitHub token**: replace `GITHUB_DISPATCH_TOKEN` in the env file and restart.

## Security notes

- Admin routes need `Authorization: Bearer <token>` (HMAC-SHA256, 12 h, user must still exist). Passwords: scrypt n=2^16 r=8 p=2 (64 MiB, one hash at a time per process).
- Login: 5 failed attempts / 15 min / client then 429 (in-memory, resets on restart; nginx also rate-limits `/api/`). The attempt is
  reserved before the password is checked (parallel requests cannot overshoot) and handed back on success. The client key is
  `X-Real-IP` (set by nginx, only read with `PORTFOLIO_TRUST_PROXY=1`), IPv6 collapsed to its /64, never `X-Forwarded-For`.
  The limiter holds at most 10000 keys (oldest evicted).
  Contact: 5 / hour / IP; the `website` honeypot is accepted (201) and dropped. Messages keep a salted SHA-256 of the IP only.
- Uploads: JPEG/PNG/WebP/GIF only, <= 15 MB each, Pillow-verified, <= 30 MP (memory cap: ~10 bytes/pixel while processing), EXIF/metadata stripped, re-encoded to WebP with random names.
  Request bodies above 16 MB get 413; everything except the image upload is capped at 2 MB (JSON is parsed before the token is
  checked). nginx caps non-upload bodies at 2 MB and the upload route at 17 MB.
- The API has no `/docs` or `/openapi.json`. Errors are always `{"detail": "..."}` without stack traces (details go to the journal).
- Every admin write is recorded in the `audit` table.
- Run exactly one uvicorn worker: rate limits live in process memory.

## Deviations / additions relative to the contract

- Category whitelist has 8 values (`Personal & Early Work` added at the coordinator's request; `docs/ARCHITECTURE.md` updated).
- Added `media.source` (nullable, migration 3) for idempotent imports; never exposed by the API.
- `featured` is returned as `0/1` (as the column), accepted as bool or 0/1.
- `PUT /api/admin/projects/{id}` merges: fields missing from the body keep their value; the result is validated as a whole.
  `cover_media_id` can only be changed through the cover endpoint.
- `PUT /api/admin/projects/order`: ids listed get priority 10, 20, ...; projects not listed follow in their previous order.
- `POST /api/admin/projects/{id}/media` accepts the form field `files[]` (or `files`), is all-or-nothing, max 20 files, returns
  `{"uploaded": [Media], "project": <full project>}`. The first image becomes the cover if none is set; deleting the cover promotes the next image.
- `PUT .../cover` accepts `{"media_id": null}` to clear the cover.
- `POST /api/contact` returns `{"ok": true}` with 201; `DELETE` endpoints return `{"ok": true}`.
- `POST /api/auth/login` response is `{token, expires_at}` with an ISO-8601 UTC `expires_at`; `GET /api/auth/me` returns `{email}`.
- `/var/lib/portfolio-api` is mode 751 (not 750) so nginx can traverse to `media/`; the database file is chmod 600 by the app and the
  service runs with `UMask=0077` (media files are explicitly chmod 644).
- Public project list items include `cover` and `gallery` but not `case_study`.
- The service starts uvicorn with `--factory app.main:create_app_from_env` (there is no module-level `app`).
