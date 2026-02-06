# Supabase (Local Data Layer)

Supabase provides the PostgreSQL database, APIs, authentication, and storage used by the reconciliation workflows.

---

## Contents
- `dev/` → Local development configuration.
- `volumes/` → Local data volumes.
- `reset.sh` → Utility to reset local Supabase state (use with caution).

---

## Local usage

1. Start the stack with `make start` from the repo root.
2. Open Supabase Studio:
   - http://localhost:3000
3. Use the SQL editor to inspect tables or run queries.

---

## Data flow reference

- **Staging tables** → incoming claims and reference records.
- **Reconciliation tables** → outputs produced by workflows.
- **Storage** → uploaded claim documents and OCR outputs.

---

## Tips
- Keep production credentials out of local configs.
- Use the SQL scripts in `init-test-db/` to seed data.

