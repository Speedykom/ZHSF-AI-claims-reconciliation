# Qdrant (Vector Database)

Qdrant stores vector embeddings for claims and reference records, enabling similarity search during reconciliation.

---

## Contents
- `production.yaml` → Qdrant configuration used by Docker Compose.

---

## Local usage

1. Start the stack with `make start` from the repo root.
2. Open Qdrant:
   - http://localhost:6333
3. Use the Qdrant API to create collections and search vectors.

---

## Tips
- Keep embeddings consistent (same model and parameters).
- Use separate collections for claims vs reference data.

