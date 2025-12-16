# Supabase / Postgres Best Practices

This document captures guidelines for schema design, performance, and security when using Supabase Postgres.

## Key Naming

- Prefer `SUPABASE_PUBLISHABLE_KEY` (format `sb_publishable_...`) for client-side usage.
- Treat `SUPABASE_SERVICE_ROLE_KEY` as server-only. Never ship it to the client.
- During migration, legacy anon keys may exist; publishable keys are the forward path.

## Performance

- Use indexes strategically on columns used in:
  - `WHERE`
  - `JOIN`
  - `ORDER BY`
- Avoid `SELECT *`; explicitly fetch needed columns.
- Use `EXPLAIN` to inspect query plans and avoid sequential scans.
- Choose appropriate index types:
  - B-tree (default)
  - BRIN for monotonic columns like `created_at`
  - GIN for JSON/array searching
- Keep statistics fresh with `ANALYZE`.
- Paginate by default (`LIMIT`/`OFFSET`, range queries). Avoid unbounded reads.

## SQL Style

- Use `snake_case` for tables/columns.
- Keep queries readable; use comments for non-trivial logic.
- Use CTEs (`WITH`) for complex queries.
- Consider database functions for reusable logic (RPC).

## Security

- Enable Row Level Security (RLS) on all user-owned tables.
- Use `auth.uid()` in RLS policies.
- Use primary keys for FK references to Supabase-managed tables (e.g. `auth.users`).
- Protect service role key; it bypasses RLS.

## Schema Version Control

- Prefer Supabase CLI migrations for version-controlled schema changes.
- Keep SQL migrations in repo and apply in CI/CD for production.
