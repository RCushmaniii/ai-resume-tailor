# Session Log — ai-resume-tailor

Entries are newest-first. Each entry documents one Claude Code working session.

---

<!-- New entries go above this line -->

## Session: 2026-10-26 (backend container runs as non-root; Sentry finally reports)

**Outcome:** two PRs merged and deployed to the Hetzner box. The Flask container runs as uid 1000
instead of root, and the backend reports errors to Sentry for the first time since the project was
created in April.

### Accomplished

- **Non-root container (#44).** `server/Dockerfile` creates an `app` user (uid 1000, with a home
  directory) and switches to it. No chown layer: the app writes nothing to disk. Proved before
  editing by running the production image on the box with `--user 1000:1000` against the real env
  file (`/api/health` 200, both gunicorn workers booted). That run logged
  `Permission denied: '/.gunicorn'`, which is why the user has a real home directory. New
  `server/.dockerignore` keeps `venv`, tests and env files out of the build context.
- **Sentry (#45).** `sentry-sdk[flask]` initializes only when `SENTRY_DSN` is set. Unhandled
  exceptions (real 5xx) are reported; rejected uploads, auth failures and 429s never become alerts.
  Tracing 10%, no default PII. The DSN of the existing project `cushlabs-resume-tailor` went into
  the box's env file (mode 600). Verified end to end: an info-level probe sent from the live
  container arrived as `CUSHLABS-RESUME-TAILOR-1` and was resolved with a note.
- **Deployed** both via `cushlabs-prod-server/scripts/deploy-service.sh resume-tailor` (auto-rollback
  on failed healthcheck). Live: `uid=1000`, healthy, https://resume.cushlabs.ai/api/health 200. The
  compose service also carries `no-new-privileges` and `cap_drop: ALL` since prod-server PR #30.

### Decisions Made

- No `ignore_errors` list yet: the project has never received a real event. Filters get added when a
  genuinely noisy issue appears, not speculatively.

### Immediate Next Steps

- [ ] `CLAUDE.md` still shows the retired `docker compose up -d --build` deploy line and a Render
      hosting row; the real flow is merge → CI image → `deploy-service.sh resume-tailor`.
- [ ] Sentry project platform is `javascript-nextjs`; set to `python-flask` (cosmetic).
