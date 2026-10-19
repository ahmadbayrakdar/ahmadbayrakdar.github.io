#!/usr/bin/env bash
# Idempotent installer for the portfolio API. Run as root on the VPS (Ubuntu):
#   sudo bash api/deploy/install.sh
# Does NOT touch nginx or certbot (see api/README.md for those steps).
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
    echo "Run as root: sudo bash $0" >&2
    exit 1
fi

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR=/opt/portfolio-api
DATA_DIR=/var/lib/portfolio-api
BACKUP_DIR=/var/backups/portfolio-api
ENV_DIR=/etc/portfolio-api
ENV_FILE=$ENV_DIR/env
PYTHON="${PYTHON:-python3}"

echo "==> system user"
if ! id portfolio >/dev/null 2>&1; then
    useradd --system --home-dir "$DATA_DIR" --shell /usr/sbin/nologin --user-group portfolio
fi

echo "==> directories"
install -d -m 755 -o root -g root "$APP_DIR"
# 751: the service owns it, nginx (www-data) may traverse to /media but cannot list or read the database.
install -d -m 751 -o portfolio -g portfolio "$DATA_DIR"
install -d -m 755 -o portfolio -g portfolio "$DATA_DIR/media"
install -d -m 700 -o portfolio -g portfolio "$BACKUP_DIR"
install -d -m 750 -o root -g portfolio "$ENV_DIR"

echo "==> code"
rm -rf "$APP_DIR/app"
cp -a "$SRC/app" "$APP_DIR/app"
find "$APP_DIR/app" -name __pycache__ -type d -prune -exec rm -rf {} +
install -m 644 "$SRC/cli.py" "$APP_DIR/cli.py"
install -m 644 "$SRC/requirements.txt" "$APP_DIR/requirements.txt"
chown -R root:root "$APP_DIR"
chmod -R u=rwX,go=rX "$APP_DIR/app"   # never inherit group/world-write from the source checkout

echo "==> environment file"
if [[ ! -f $ENV_FILE ]]; then
    # Subshell: a script-wide umask 077 would make the venv below unreadable for the service user.
    ( umask 077
    cat > "$ENV_FILE" <<EOF
PORTFOLIO_SECRET=$(openssl rand -hex 32)
PORTFOLIO_DB=$DATA_DIR/portfolio.db
PORTFOLIO_MEDIA_DIR=$DATA_DIR/media
PORTFOLIO_PUBLIC_URL=https://portfolio-api.builderization.com
PORTFOLIO_CORS=https://ahmadbayrakdar.github.io,http://localhost:4321
PORTFOLIO_TRUST_PROXY=1
GITHUB_REPO=ahmadbayrakdar/ahmadbayrakdar.github.io
# GITHUB_DISPATCH_TOKEN=   # fine-grained PAT, repo "Contents: read/write" (repository_dispatch)
EOF
    )
    echo "    created $ENV_FILE with a fresh PORTFOLIO_SECRET"
else
    echo "    $ENV_FILE exists, left untouched"
fi
chown root:portfolio "$ENV_FILE"
chmod 0640 "$ENV_FILE"

echo "==> python venv"
if [[ ! -x $APP_DIR/venv/bin/python ]]; then
    "$PYTHON" -m venv "$APP_DIR/venv"
fi
"$APP_DIR/venv/bin/pip" install --quiet --upgrade pip
"$APP_DIR/venv/bin/pip" install --quiet -r "$APP_DIR/requirements.txt"
chmod -R go+rX,go-w "$APP_DIR/venv"   # the service user must be able to read it (repairs a venv made under a strict umask)

echo "==> cli wrapper (/usr/local/bin/portfolio-cli)"
cat > /usr/local/bin/portfolio-cli <<'EOF'
#!/usr/bin/env bash
# Runs the portfolio CLI as the service user with the service environment.
set -euo pipefail
set -a; . /etc/portfolio-api/env; set +a
exec runuser -u portfolio -- /opt/portfolio-api/venv/bin/python /opt/portfolio-api/cli.py "$@"
EOF
chmod 755 /usr/local/bin/portfolio-cli

echo "==> systemd"
install -m 644 "$SRC/deploy/portfolio-api.service" /etc/systemd/system/portfolio-api.service
install -m 644 "$SRC/deploy/portfolio-api-backup.service" /etc/systemd/system/portfolio-api-backup.service
install -m 644 "$SRC/deploy/portfolio-api-backup.timer" /etc/systemd/system/portfolio-api-backup.timer
systemctl daemon-reload
systemctl enable --now portfolio-api.service portfolio-api-backup.timer
systemctl restart portfolio-api.service

for _ in $(seq 1 15); do
    curl -fsS http://127.0.0.1:8810/api/health >/dev/null 2>&1 && break
    sleep 1
done
if curl -fsS http://127.0.0.1:8810/api/health >/dev/null 2>&1; then
    echo "==> API is up on 127.0.0.1:8810"
else
    echo "!! health check failed: journalctl -u portfolio-api -n 50" >&2
    exit 1
fi

cat <<EOF

Next steps (not done by this script):
  1. Create the admin:   printf '%s' 'a-long-password' | portfolio-cli create-admin --email you@example.com
     (or run it without the pipe to be prompted)
  2. Install the nginx site, nginx -t, reload, certbot  -> see api/README.md
EOF
