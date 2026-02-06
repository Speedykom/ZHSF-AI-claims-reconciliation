# ZHSF AI Claims Reconciliation

This repository contains a local, Docker‑Compose based stack to prototype and develop the ZHSF AI claims reconciliation workflow. It combines workflow automation (n8n), data services (Supabase/Postgres), vector search (Qdrant), OCR, and a frontend for review.

---

## 1) What this project does

The goal is to automatically reconcile healthcare claims by:
- ingesting claim documents (PDF/images),
- extracting text with OCR,
- normalizing the data,
- matching claims against reference records,
- writing reconciliation results to a database,
- and providing a UI for review and audit.

---

## 2) Quick start (local)

### Prerequisites
- Docker + Docker Compose
- Node.js (only needed if you want to run the frontend locally outside Docker)

### Step‑by‑step
1. **Configure environment**
   - Copy `.env.template` to `.env` and update values as needed.
2. **Start the stack**
   - Run: `make start`
3. **Verify services**
   - n8n: http://localhost:5678
   - Supabase Studio: http://localhost:3000
   - Qdrant: http://localhost:6333
4. **Stop the stack**
   - Run: `make stop`

---

## 3) Services & Ports

| Service | Purpose | Port |
|---------|---------|------|
| n8n | Workflow automation & orchestration | 5678 |
| n8n-postgres | n8n internal database | 5432 |
| Supabase Studio | DB management UI | 3000 |
| Supabase (Postgres/API/Auth/Storage) | Core data services | internal |
| Qdrant | Vector search / similarity | 6333 |
| PaddleOCR | Document text extraction | internal |
| Frontend | Review UI | 3000 (if run locally) |

---

## 4) Repository map (what to look at first)

- `docker-compose.yml` → all services and networking.
- `n8n/` → workflows, credentials template, and reference rules.
- `supabase/` → database development assets and local setup.
- `qdrant/` → vector DB configuration.
- `paddleocr/` → OCR service.
- `frontend/` → UI for reviewing reconciliation results.
- `init-test-db/` → SQL seed data for local testing.
- `training-onboarding-zhsf.md` → full onboarding and workshop plan.

---

## 5) Local workflow (end‑to‑end)

1. **Bring up services** with `make start`.
2. **Load sample data**
   - Use SQL scripts in `init-test-db/` to populate test claims.
3. **Open n8n** and import workflows from `n8n/` if needed.
4. **Upload a sample claim** to storage or through the OCR workflow.
5. **Run reconciliation** and inspect results in Supabase tables.
6. **Review results** in the frontend (if enabled).

---

## 6) Useful commands

- `make start` → start all services
- `make stop` → stop services
- `make build` → rebuild images
- `make destroy` → stop and remove volumes

---

## 7) Troubleshooting (local)

- If n8n does not load, verify Docker is running and check container logs.
- If Supabase Studio is blank, confirm the stack is up and port 3000 is free.
- If OCR outputs are empty, test with a higher quality scan.

---

## 8) Component documentation

Each major component has a dedicated README for junior‑friendly onboarding:

- n8n → `n8n/README.md`
- Supabase → `supabase/README.md`
- Qdrant → `qdrant/README.md`
- OCR (PaddleOCR) → `paddleocr/README.md`
- Frontend → `frontend/README.md`
- Test DB seed → `init-test-db/README.md`

---

## 9) Next steps for ZHSF integration

The integration with the real ZHSF MIS database/API is covered in:
- `training-onboarding-zhsf.md`

This includes security, staging, ETL, and deployment guidance.
