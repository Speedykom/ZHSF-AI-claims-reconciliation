# ZHSF AI Claims Reconciliation

**Goal:** To automate healthcare claims reconciliation processes for the Zanzibar Health Sector Fund (ZHSF) using AI-powered workflows, integrating N8N for automation, Supabase for data management, and Qdrant for intelligent document processing and matching.

A Docker Compose-based local environment for AI healthcare claims reconciliation, combining :
* Workflow automation
* Robust backend services
* Vector database functionality
* OCR Applications

## Services Overview

| Service | Description | Port |
|---------|-------------|------|
| n8n | AI workflow automation for claims processing | 5678 |
| n8n-postgres | PostgreSQL database for N8N workflows | 5432 |
| studio | Supabase Studio for data management | 3000 |
| auth | Authentication service | - |
| rest | REST API for data operations | - |
| realtime | Real-time data synchronization | - |
| storage | Document storage API | - |
| functions | Custom edge functions | - |
| vector | Log aggregation for monitoring | - |
| qdrant | Vector database for document similarity | 6333 |

## Quick Start

1. Ensure Docker and Docker Compose are installed
2. Configure environment variables by copying `.env.template` to `.env` and editing as needed
3. Run `make start`
4. Access N8N at http://localhost:5678 for workflow setup
5. Access Supabase Studio at http://localhost:3000 for data management
6. Access Qdrant at http://localhost:6333 for vector database operations
7. Connect to PostgreSQL database at localhost:5432 for direct database access

## Development Commands

- `make start` - Start all services
- `make stop` - Stop all services
- `make build` - Build or rebuild services
- `make destroy` - Stop services and remove volumes/orphaned resources

## Requirements

- Docker
- Docker Compose
- Environment variables configured (see `.env` example)

## Services Snapshot (Temporary)

<img width="1919" height="1079" alt="2" src="https://github.com/user-attachments/assets/053b3005-4a3d-4fca-9bf4-6c6086d30666" />
<img width="1919" height="1079" alt="1" src="https://github.com/user-attachments/assets/bf536db8-5c22-4a2b-b37b-464580724664" />
<img width="1919" height="1079" alt="3" src="https://github.com/user-attachments/assets/934da283-48e1-4b87-a756-308f9d471027" />

