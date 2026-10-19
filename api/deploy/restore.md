# Restore procedure

Backups live in `/var/backups/portfolio-api/` (daily 03:30 via `portfolio-api-backup.timer`, newest 14 kept):

- `portfolio-YYYYmmdd-HHMMSS.db`  - consistent SQLite snapshot (single file, no WAL)
- `media-YYYYmmdd-HHMMSS.tar.gz`  - the uploaded images (`media/` inside the archive)

Pick a matching pair (same or nearby timestamp). All commands run on the VPS as root.

## 1. Inspect (optional)

```bash
ls -lh /var/backups/portfolio-api/
sqlite3 /var/backups/portfolio-api/portfolio-20260101-033000.db 'PRAGMA integrity_check; SELECT COUNT(*) FROM projects;'
```

## 2. Stop the service (required)

`restore` replaces the live database file. The service must not have it open.

```bash
systemctl stop portfolio-api
```

## 3. Restore

```bash
portfolio-cli restore \
  --db    /var/backups/portfolio-api/portfolio-20260101-033000.db \
  --media /var/backups/portfolio-api/media-20260101-033000.tar.gz \
  --yes
```

What it does:

1. Refuses to run without `--yes`.
2. Opens the backup read-only and runs `PRAGMA integrity_check`; aborts on anything but `ok`.
3. Copies it next to the live db, deletes stale `-wal` / `-shm` files, moves the current db to
   `portfolio.db.pre-restore` (replacing any older one), and puts the restored db in place.
4. Applies any newer schema migrations to the restored db.
5. With `--media`: extracts to a staging dir, moves the current `media/` to `media.pre-restore/`,
   and swaps the restored directory in (mode 755 so nginx can read it).

Use `--db` only if you just need the data back and the images are intact.

`portfolio-cli` runs as the `portfolio` user, so file ownership stays correct. If you call
`/opt/portfolio-api/venv/bin/python /opt/portfolio-api/cli.py restore ...` as root instead, run
`chown -R portfolio:portfolio /var/lib/portfolio-api` afterwards (and `chmod 755 /var/lib/portfolio-api/media`).

## 4. Start and verify

```bash
systemctl start portfolio-api
curl -fsS http://127.0.0.1:8810/api/health
curl -fsS https://portfolio-api.builderization.com/api/export | head -c 300
```

Log in to the admin panel and check projects, images and messages. Then trigger "Publish site" so the static
site is rebuilt from the restored data.

## 5. Undo a bad restore

The previous state is still there:

```bash
systemctl stop portfolio-api
cd /var/lib/portfolio-api
mv portfolio.db portfolio.db.bad && mv portfolio.db.pre-restore portfolio.db
rm -f portfolio.db-wal portfolio.db-shm
mv media media.bad && mv media.pre-restore media
chown -R portfolio:portfolio /var/lib/portfolio-api
systemctl start portfolio-api
```

## Rebuilding from nothing (VPS lost)

1. Run `api/deploy/install.sh`, set up nginx and certbot per `api/README.md`.
2. `systemctl stop portfolio-api`, copy the backup pair over (`scp`), run step 3.
   Keep a copy of `/etc/portfolio-api/env` elsewhere: a new `PORTFOLIO_SECRET` just means everyone logs in again.
3. If no backup exists, the last committed `src/data/snapshot.json` (an `/api/export` file) can be re-imported:
   `portfolio-cli import --file snapshot.json` (images are re-downloaded from their old URLs if still reachable).
4. Admin users live in the database, so they come back with the restore. After a from-scratch rebuild create one again:
   `portfolio-cli create-admin --email you@example.com`.
