FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Unprivileged runtime user. It needs a real home directory: gunicorn's control
# server creates a socket under $HOME/.gunicorn, and with a bare uid and no home
# it logs "Permission denied: '/.gunicorn'" on every start (seen 2026-10-26 when
# the production image was run with --user 1000:1000). uid 1000 matches the
# `deploy` user on the Hetzner box.
RUN useradd --create-home --uid 1000 --user-group --shell /usr/sbin/nologin app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# The app writes nothing to disk (uploads are parsed in memory, the database is
# remote Postgres), so the root-owned 644/755 application files are fine as-is
# and no chown layer is needed.
USER app

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/health')" || exit 1

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120"]
