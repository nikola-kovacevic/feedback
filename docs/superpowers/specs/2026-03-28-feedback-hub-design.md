# Feedback Hub — Design Specification

A Peakon-style feedback analytics platform. Register applications, embed a lightweight feedback widget, and analyze responses through a rich dashboard with filtering, NPS/average scoring, sentiment analysis, and cross-app comparison.

## Requirements Summary

- **Feedback model:** Single 0-10 scored question + comment per survey. Comment required by default, toggleable per application.
- **Widget:** Embeddable JS plugin with two modes: floating button (slide-out panel) and inline embed. App owner chooses mode at registration.
- **User identity:** Anonymous by default. Host app can optionally pass metadata (userId, email, role, arbitrary key-values) when initializing the widget.
- **Dashboard:** Single-tenant web app. Email/password auth (JWT), designed so OAuth/SSO can be added later without rewriting the auth layer.
- **Analytics:** Rich analytics from v1: average score, NPS, response volume, score trends over time, score distribution histograms, sentiment analysis, word clouds from comments, cross-app comparison, exportable reports (CSV/JSON).
- **Theme:** Dark mode toggle (System / Light / Dark). Custom color palette with glassmorphism (frosted glass cards, backdrop blur).
- **Deployment:** Docker Compose, runs on any machine with `docker compose up`.

## Architecture

Monorepo with pnpm workspaces. Three packages:

```
feedback/
├── packages/
│   ├── backend/       # NestJS API server
│   ├── frontend/      # React dashboard SPA
│   └── widget/        # Embeddable JS plugin
├── docker-compose.yml
├── .env.example
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

Docker Compose services:

| Service    | Image              | Port | Purpose                          |
|------------|--------------------|------|----------------------------------|
| `backend`  | Node 20 Alpine     | 3000 | NestJS API                       |
| `frontend` | nginx:alpine       | 80   | Serves React static build        |
| `postgres` | postgres:16-alpine | 5432 | Database                         |

The widget JS bundle is served by the backend at `/widget/feedback.js` (static file, no separate service needed).

## Data Model

Four entities in PostgreSQL, managed via TypeORM migrations:

### User (dashboard users)

| Column       | Type         | Notes                              |
|--------------|--------------|------------------------------------|
| id           | uuid (PK)    | Generated                          |
| email        | varchar(255) | Unique, indexed                    |
| passwordHash | varchar(255) |                                    |
| name         | varchar(255) |                                    |
| role         | enum         | 'admin' or 'member'                |
| createdAt    | timestamptz  |                                    |
| updatedAt    | timestamptz  |                                    |

### Application (registered apps)

| Column       | Type         | Notes                                          |
|--------------|--------------|-------------------------------------------------|
| id           | uuid (PK)    | Generated                                       |
| name         | varchar(255) |                                                 |
| description  | text         | Optional                                        |
| apiKey       | varchar(64)  | Unique, indexed. Prefixed `fbk_`                |
| widgetConfig | jsonb        | See Widget Config schema below                  |
| createdBy    | uuid (FK)    | References User.id                              |
| createdAt    | timestamptz  |                                                 |
| updatedAt    | timestamptz  |                                                 |

**Widget Config JSON schema:**

```jsonc
{
  "mode": "floating", // or "inline"
  "question": "How would you rate your experience?",
  "commentRequired": true,
  "themeColor": "#354B8C",
  "cooldownHours": 24,
  "position": "bottom-right"
}
```

### FeedbackResponse

| Column        | Type         | Notes                                          |
|---------------|--------------|-------------------------------------------------|
| id            | uuid (PK)    | Generated                                       |
| applicationId | uuid (FK)    | References Application.id, indexed              |
| score         | smallint     | 0-10                                            |
| comment       | text         | Required or optional based on app config        |
| sentiment     | enum         | 'positive', 'negative', 'neutral'. Computed on insert. |
| userMetadata  | jsonb        | Optional. Whatever the host app passes.         |
| createdAt     | timestamptz  | Indexed (composite with applicationId)          |

**Indexes:**
- `idx_feedback_app_created` on `(applicationId, createdAt DESC)` — primary query path for filtered analytics
- `idx_feedback_created` on `(createdAt DESC)` — for cross-app date filtering

### RefreshToken (for JWT refresh flow)

| Column    | Type         | Notes                   |
|-----------|--------------|-------------------------|
| id        | uuid (PK)    |                         |
| userId    | uuid (FK)    | References User.id      |
| token     | varchar(255) | Hashed, unique, indexed |
| expiresAt | timestamptz  |                         |
| createdAt | timestamptz  |                         |

## API Design

### Widget API (API-key auth via request body or URL param)

| Method | Endpoint                    | Purpose                        |
|--------|-----------------------------|--------------------------------|
| GET    | /api/widget/config/:apiKey  | Fetch widget config            |
| POST   | /api/widget/feedback        | Submit feedback response       |

**POST /api/widget/feedback body:**
```json
{
  "apiKey": "fbk_xxxxxxxxxxxx",
  "score": 8,
  "comment": "Great experience",
  "userMetadata": { "userId": "123", "email": "jane@example.com" }
}
```

### Dashboard API (JWT Bearer auth)

**Auth:**

| Method | Endpoint               | Purpose          |
|--------|------------------------|------------------|
| POST   | /api/auth/register     | Create account   |
| POST   | /api/auth/login        | Get JWT + refresh token |
| POST   | /api/auth/refresh      | Refresh JWT      |
| GET    | /api/auth/me           | Current user     |

**Applications CRUD:**

| Method | Endpoint                              | Purpose              |
|--------|---------------------------------------|----------------------|
| GET    | /api/applications                     | List all             |
| POST   | /api/applications                     | Create (generates apiKey) |
| GET    | /api/applications/:id                 | Detail + embed snippet |
| PATCH  | /api/applications/:id                 | Update config        |
| DELETE | /api/applications/:id                 | Delete               |
| POST   | /api/applications/:id/regenerate-key  | Rotate API key       |

**Feedback & Analytics:**

| Method | Endpoint                    | Purpose                                    |
|--------|-----------------------------|--------------------------------------------|
| GET    | /api/feedback               | Paginated list, filterable                 |
| GET    | /api/feedback/export        | CSV/JSON export (streaming)                |
| GET    | /api/analytics/summary      | Avg score, NPS, response count per app     |
| GET    | /api/analytics/trends       | Score over time (daily/weekly/monthly)     |
| GET    | /api/analytics/distribution | Score histogram (count per 0-10)           |
| GET    | /api/analytics/sentiment    | Sentiment breakdown (pos/neg/neutral)      |
| GET    | /api/analytics/word-cloud   | Top words/phrases from comments (TF-IDF)   |
| GET    | /api/analytics/comparison   | Cross-app comparison metrics               |

**Common query params for analytics endpoints:**
- `applicationId` — filter by app (optional, omit for all)
- `dateFrom`, `dateTo` — ISO date range
- `userMetadata[key]=value` — filter by metadata fields
- `granularity` — for trends: `daily`, `weekly`, `monthly`

## Widget Architecture

Standalone vanilla TypeScript bundle. No React or framework dependency. Target bundle size: ~15-20KB gzipped.

**Build:** Vite library mode, output as IIFE to `packages/widget/dist/feedback.js`.

**Shadow DOM:** The widget renders inside a Shadow DOM to isolate its styles from the host application. No CSS leaks in either direction.

**Two integration modes:**

Floating mode (script tag + init):
```html
<script src="https://your-server.com/widget/feedback.js"></script>
<script>
  FeedbackWidget.init({
    apiKey: 'fbk_xxxxxxxxxxxx',
    user: { id: '123', email: 'jane@example.com', role: 'admin' }
  });
</script>
```

Inline mode (render into a target element):
```html
<div id="feedback-container"></div>
<script src="https://your-server.com/widget/feedback.js"></script>
<script>
  FeedbackWidget.render({
    apiKey: 'fbk_xxxxxxxxxxxx',
    target: '#feedback-container',
    user: { id: '123' }
  });
</script>
```

**Behavior:**
- On init/render, fetches config from `/api/widget/config/:apiKey`
- Floating mode: fixed-position button (bottom-right by default, configurable), opens slide-out panel on click
- Displays the configured question text with a 0-10 score selector and comment field
- On submit: POST to `/api/widget/feedback`, show thank-you state, auto-dismiss after 3s
- Rate limiting: stores last submission timestamp in localStorage, respects `cooldownHours` from config
- Graceful degradation: if backend unreachable, widget hides silently (no console errors in host app)

## Frontend Architecture

React 18+ SPA with Ant Design 5 component library.

**Routing (React Router v6):**

| Route                    | Page              | Description                    |
|--------------------------|-------------------|--------------------------------|
| /login                   | Login             | Email/password form            |
| /register                | Register          | Registration form              |
| /                        | Dashboard         | Main analytics view            |
| /applications            | Applications      | List of registered apps        |
| /applications/new        | New Application   | Registration form + config     |
| /applications/:id        | Application Detail| Config, embed snippet, preview |
| /responses               | Responses         | Paginated feedback table       |
| /comparison              | Comparison        | Cross-app comparison           |
| /export                  | Export            | Export configuration           |
| /settings                | Settings          | User profile, theme prefs      |

**State management:**
- TanStack Query (React Query) for all server state (caching, refetching, pagination)
- React Context for theme (light/dark/system) and auth state
- No Redux. App is not complex enough to warrant it.

**Charting:** Recharts for score trend line charts, distribution bar charts, and comparison views.

**Design system:**
- Ant Design 5 components: Select, Button, Tag, Table, Card, DatePicker, Input, Modal, Drawer, Menu, Layout
- Custom theme tokens via Ant's ConfigProvider for the color palette:
  - Primary: #354B8C (blue)
  - Success: #2D733E (green)
  - Warning: #F2BB77 (amber)
  - Error: #D93A2B (red)
  - Background: #F2F1F0 (off-white) for light, #0f1225 for dark
- Glassmorphism layer: custom CSS class applied to Card components (`backdrop-filter: blur(20px)`, semi-transparent backgrounds, subtle borders)
- Theme toggle: System / Light / Dark, persisted to localStorage

**Dashboard page layout:**
- Left sidebar: navigation links (no icons), brand header, theme toggle at bottom
- Filter bar: Ant Select dropdowns for app, date range, score, user metadata. Reset + Export buttons.
- Summary cards row: 4 glass cards (Avg Score, NPS, Total Responses, This Week) with trend indicators
- Charts row: Score trend (2/3 width) + Score distribution histogram (1/3 width)
- Bottom row: Word cloud / top keywords + Recent comments feed

## Sentiment Analysis

Server-side, no external API dependencies.

- **Library:** `natural` (Node.js NLP toolkit)
- **Tokenization:** Split comments into words, remove stopwords
- **Sentiment scoring:** Lexicon-based (AFINN or similar). Classify each comment as positive/negative/neutral. Store result in `FeedbackResponse.sentiment` column on insert.
- **Word cloud:** TF-IDF extraction across comments for a given filter scope. Return top 30 terms with their frequency weights.
- **Caching:** Analytics results cached server-side with 5-minute TTL (simple in-memory cache via NestJS CacheModule). Cache key includes the full filter signature.

## Error Handling & Edge Cases

- **Widget unreachable:** Widget hides itself silently. No console.error in host app.
- **Rate limiting:** Widget stores last submission timestamp in localStorage. Respects `cooldownHours` from config. Shows "Thank you, you've already submitted feedback" if within cooldown.
- **Empty states:** Dashboard shows clear empty states for apps with zero feedback. Includes CTA with embed snippet to guide the user.
- **API key rotation:** `POST /applications/:id/regenerate-key` generates a new key. Old key remains valid for 24 hours (grace period to update host apps). Backend checks both keys during the grace window.
- **Export large datasets:** Streaming response for CSV/JSON export. No in-memory buffering of full result set.
- **Input validation:** All DTOs validated via class-validator. Score must be 0-10 integer. Comment length capped at 2000 characters. API key format validated.
- **CORS:** Backend configures CORS to allow widget requests from any origin (the widget runs on host app domains). Dashboard API restricted to the frontend origin.

## Deployment

Single `docker compose up` brings everything up.

```yaml
# docker-compose.yml (structure)
services:
  postgres:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    environment: [POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD]

  backend:
    build: ./packages/backend
    depends_on: [postgres]
    environment: [DATABASE_URL, JWT_SECRET, CORS_ORIGIN]
    ports: ["3000:3000"]

  frontend:
    build: ./packages/frontend
    depends_on: [backend]
    ports: ["80:80"]

volumes:
  postgres_data:
```

**.env.example:**
```
POSTGRES_DB=feedback
POSTGRES_USER=feedback
POSTGRES_PASSWORD=changeme
JWT_SECRET=changeme
CORS_ORIGIN=http://localhost
```

**Backend Dockerfile:** Multi-stage build. Stage 1: install + build. Stage 2: Node 20 Alpine, copy dist, run with `node dist/main.js`.

**Frontend Dockerfile:** Multi-stage. Stage 1: install + `pnpm build`. Stage 2: nginx:alpine, copy build output, custom nginx.conf to proxy `/api/*` to backend and serve SPA fallback.

**Running on any PC:**
1. Clone the repo
2. Copy `.env.example` to `.env`, adjust secrets
3. `docker compose up --build`
4. Open `http://localhost`

No Node.js, no PostgreSQL, no toolchain required on the host machine. Just Docker.
