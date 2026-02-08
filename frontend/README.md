# Frontend (Claims Review UI)

This frontend provides a user interface for reviewing reconciliation results, exceptions, and audit data.

---

## 1) Prerequisites
- Node.js 18+
- npm / yarn / pnpm / bun

---

## 2) Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local` (if present) or create `.env.local`.
   - Add required keys (for example):
     ```
     OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open the app:
   - http://localhost:3000

---

## 3) Common workflows

- **Update UI text or layout** → edit `app/page.tsx`.
- **Add new pages** → add files under `app/`.
- **Connect to APIs** → use the Supabase REST/GraphQL endpoints or n8n webhook endpoints.

---

## 4) Build & production

```bash
npm run build
npm run start
```

---

## 5) Troubleshooting

- If the page is blank, check your `.env.local` values.
- If API calls fail, confirm the backend services are running.

