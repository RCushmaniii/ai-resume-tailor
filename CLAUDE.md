@AGENTS.md

## Claude Code Capabilities

**You have access to:**
- **Neon CLI** (`neonctl`) - Database management
- **File system** - Read/write all project files
- **Bash commands** - Git, pnpm, python, etc.

**Neon CLI Commands:**
```bash
# Authenticate
npx neonctl auth

# Database operations
npx neonctl databases list
npx neonctl connection-string

# Run SQL against the database
psql $DATABASE_URL -f server/schema.sql
```

## Session Log

A running log of all working sessions is maintained at `docs/SESSION_LOG.md`.
Always append a new entry at the top of this file before closing a session.
Use the `session-logger` skill to generate the entry.
