# n8n Workflows

This folder contains workflow assets for the AI claims reconciliation pipeline.

---

## Contents
- `RAG-OCR-workflow.json` → Example OCR + RAG workflow.
- `AGENTIC-MCP-claims-rec.json` → Claims reconciliation workflow.
- `credentials.json` → Template for local credentials (do not store real secrets here).
- `medical-rules.xlsx` → Reference rules used during reconciliation.

---

## How to import workflows

1. Open n8n at http://localhost:5678.
2. Select **Import** and upload a `.json` workflow from this folder.
3. Configure credentials for database, storage, or external APIs.
4. Save and run the workflow.

---

## Tips for juniors
- Start by importing `RAG-OCR-workflow.json`.
- Use small test documents first.
- Always validate outputs in Supabase before running on batches.

