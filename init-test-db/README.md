# Test Database Seed Data

This folder contains SQL scripts to initialize and populate a local test database.

---

## Contents
- `01_create_claim.sql` → Creates schema/tables for claims.
- `02_insert_claims.sql` → Inserts sample claim data.

---

## How to use

1. Start the stack with `make start`.
2. Open Supabase Studio at http://localhost:3000.
3. Use the SQL editor to run the scripts in order:
   - `01_create_claim.sql`
   - `02_insert_claims.sql`

---

## Tips
- Always run the create script before the insert script.
- Adjust the sample data to test edge cases.

