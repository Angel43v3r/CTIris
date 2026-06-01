# CTIris

CTIris is a Cyber Threat Intelligence (CTI) dashboard designed as an educational tool for students and hobbyists learning about threat intelligence concepts, STIX objects, and TAXII feeds.

## Project Goal

Provide a beginner-friendly dashboard for exploring real-world CTI data. Future iterations may add educational tooltips (hover-over definitions for terms like STIX, TAXII, indicators, etc.).

## Architecture

Microservices stack running in Docker Compose:

| Service | Description |
|---|---|
| `postgres` | PostgreSQL database storing all CTI data |
| `db-svc` | Python service that runs Alembic migrations on startup |
| `ingestion-svc` | Python service that polls TAXII feeds and ingests STIX objects |
| `query-svc` | FastAPI read-only API serving the frontend |
| `gateway` | Nginx reverse proxy — routes `/api/*` to `query-svc` |
| `frontend` | React + TypeScript + MUI dashboard |

## API

Base URL: `http://localhost/api` (nginx proxies `/api/*` → `query-svc:8000/*`)

| Endpoint | Description |
|---|---|
| `GET /health` | Liveness check |
| `GET /stix?type=&limit=&offset=` | Paginated STIX objects; filter by type |
| `GET /stix/{stix_id}` | Single STIX object |
| `GET /feeds` | All configured TAXII feeds |
| `GET /feeds/{feed_id}` | Single feed by UUID |
| `GET /ingestion-log?feed_id=&limit=` | Ingestion run history |

## Frontend Stack

- **React 18** with TypeScript
- **Material UI v5** for components and icons (`@mui/icons-material`)
- **Vite** dev server (port 5173) with `/api` proxied to `http://localhost:80`
- Theme colors defined in `frontend/src/constants/themeColors.ts` — dark cyberpunk palette

## Frontend Structure

```
frontend/src/
  api/client.ts          # Typed fetch wrappers for all API endpoints + shared types
  constants/themeColors.ts
  components/
    DashboardHeader.tsx  # App header with dynamic status/feed chips
    DashboardBody.tsx    # Tab container (Dashboard | Feeds | STIX Objects)
    DashboardTab.tsx     # Summary stat cards by STIX type
    FeedsTab.tsx         # Feed status cards
    StixBrowser.tsx      # Searchable/filterable STIX table + detail drawer
```

## Data Models

**STIX Object** (`stix_objects` table):
- `stix_id` (PK): e.g. `malware--uuid`
- `type`: STIX type string
- `properties`: full STIX JSON (JSONB)
- `stix_created`, `stix_modified`, `ingested_at`: timestamps

**Feed** (`feeds` table):
- `id`, `name`, `url`, `enabled`, `poll_frequency_min`
- `status`: `active | paused | error`
- `last_polled_at`

**Ingestion Log** (`ingestion_log` table):
- `items_received`, `items_new`, `items_updated`
- `status`: `success | partial | failed`
- `errors`: JSONB

## Running Locally

```bash
docker compose up --build
```

Frontend dev (with Docker stack already running):

```bash
cd frontend && npm install && npm run dev
```
## Extra fixes we need to do
```yaml
volumes:
  - ./frontend:/app
  - /app/node_modules  # may not shadow correctly on Mac/Windows Docker Desktop
```

On a fresh clone with no host `node_modules`, Docker Desktop on Mac/Windows may expose an empty `/app/node_modules`, causing `Cannot find module vite`. Consider a multi-stage Dockerfile build instead of the bind-mount + anonymous volume pattern.

---

## 6. `StixData.tsx:87` — No guard before `new Date(r.created)`

```tsx
// current
{new Date(r.created).toLocaleDateString()}

// fix
{r.created ? new Date(r.created).toLocaleDateString() : '-'}
```

If both `stix_created` and `ingested_at` are absent from the API response, `r.created` is `undefined` and `new Date(undefined)` renders the literal string `"Invalid Date"` in the cell.

---

## 7. `AttackTechniques.tsx:32` — Row key uses `r.name` instead of unique `r.id`

```tsx
// current
<TableRow key={r.name} ...>

// fix
<TableRow key={r.id} ...>
```

`r.id` (MITRE technique ID e.g. `T1566`) is unique and already available. If real data with duplicate technique names is loaded, React will mis-diff rows.

---

## 8. `App.tsx:8` — `Container` replaced with `Box` loses maxWidth centering

```tsx
// current — stretches to 100% on wide viewports
<Box>

// fix
<Container>   // or: <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
```

MUI `Container` provides responsive `maxWidth` and `margin: auto`. The plain `Box` replacement causes the dashboard to stretch full-width on wide monitors.

---

## 9 & 10. `StatCard.tsx` + `DashboardBody.tsx` — Hardcoded placeholder cards

`StatCard` accepts no props; all 8 instances render `"8"` / `"Total Malware"`. For the UI PR:
- Add `value: string | number` and `label: string` props to `StatCard`
- Replace the 8 identical `<StatCard />` elements in `DashboardBody` with a config array + `.map()`
- Add `key` prop to each mapped card