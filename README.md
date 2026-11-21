# SchemeSaathi AI

**Government benefits made simple.**

SchemeSaathi AI is an AI-powered government scheme discovery and application guidance platform, built first for students and citizens of Telangana, India. Describe your situation in plain language (or use the simulated voice input) and the app shows schemes that may match — with eligibility explanations, personalised document checklists, step-by-step application guidance and deadline tracking.

> **Disclaimer:** This is a prototype with illustrative sample data. It is not affiliated with, endorsed by, or verified against any government body. Match results are indicative only — final eligibility is always determined by the relevant government authority. The app never asks for Aadhaar numbers, OTPs, passwords or bank details.

---

## Features

### Discovery
- **AI Scheme Discovery** — describe your situation in a chat interface; a mock AI assistant matches your description against the scheme catalog, asks follow-up questions and links matching schemes.
- **Search & filters** — full-text search, category filter, deadline window (7/30/90 days) and sorting by relevance, deadline or name.
- **7 categories** — Education, Agriculture, Women & Family, Employment, Healthcare, Housing, Senior Citizens.

### Schemes
- **Scheme cards** — name, category, description, eligibility summary, benefit, "Potential match" indicator, deadline and last-verified date.
- **Scheme details** — who can apply, eligibility requirements, conditions needing further verification, benefits, required documents, application process, important dates, official source and disclaimer.

### Guidance & tracking
- **Document checklist** — interactive per-scheme checklist with Needed/Prepared status, progress bar, custom items, reset and preparation tips.
- **Application guide** — 6-step guided process with progress bar, per-step completion and an application notes pad.
- **My Applications** — all tracked schemes with statuses (Not Started → Preparing Documents → Ready to Apply → Applied) and progress percentages.
- **Deadlines** — upcoming deadlines with priority labels, sorting, a monthly calendar view and reminder toggles (UI only).
- **Floating AI assistant** — available on every page with suggested questions and a typing animation.

### Settings
- Language: **English, Telugu, Hindi**
- Font size (small / medium / large) and high-contrast mode
- Theme selection, voice-assistance demo and privacy information

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Styling | Tailwind CSS (custom navy/teal/lavender/orange theme) |
| Icons | Lucide React |
| Routing | React Router |
| Database | Supabase (Postgres with Row Level Security) |
| Offline fallback | localStorage |

---

## Database

The app uses a Supabase Postgres database with two groups of tables:

### 1. Scheme catalog (read-only for the app)
- **`schemes`** — the full catalog of 12 illustrative schemes with structured JSON fields (eligibility, documents, steps, dates).
- **`scheme_categories`** — the 7 lookup categories.

Both are publicly readable (`SELECT` for `anon` + `authenticated`) with RLS enabled; write access is restricted to server-side roles.

### 2. Per-device user state (no sign-in required)
The app is single-tenant and has **no login**. On first visit, the browser generates an anonymous UUID (`device_user_id`) that scopes all personal data:

- **`saved_schemes`** — bookmarked schemes per device.
- **`checklist_items`** — per-scheme document checklist state.
- **`applications`** — guide progress, status, notes and reminder flags.

All three have RLS enabled with policies scoped to the device identifier, plus column-level grants so the client can only write the fields the app actually uses.

### Migrations
Schema is managed through versioned SQL migrations in `supabase/migrations/`:

1. `create_schemes_catalog` — catalog tables, RLS, and idempotent seed data.
2. `create_user_state_tables` — device-scoped state tables, RLS and grants.
3. `tighten_grants_user_state` — least-privilege column grants.
4. `add_checklist_unique_constraint` — uniqueness for checklist upserts.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Type-check and build
npm run typecheck
npm run build
```

The app reads its Supabase URL and anon key from environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). These are pre-configured in the project environment — no manual setup needed.

**Offline / demo mode:** if the database is unreachable, the app automatically falls back to the bundled mock data and localStorage, so demos always work.

---

## Data Persistence

| Data | Stored in |
|---|---|
| Scheme catalog | Supabase (`schemes`, `scheme_categories`) |
| Saved schemes | Supabase (`saved_schemes`) + localStorage fallback |
| Checklists | Supabase (`checklist_items`) + localStorage fallback |
| Application progress & notes | Supabase (`applications`) + localStorage fallback |
| Recently viewed, language, font size, theme | localStorage (device-only preferences) |

Clearing your browser data or using a different device starts a fresh session — no personal data is collected beyond your saved schemes, checklist ticks and application notes.

---

## Project Structure

```
src/
├── components/       # Navigation (sidebar + bottom nav), SchemeCard, FloatingAssistant
├── data/             # Bundled mock scheme data (offline fallback)
├── lib/              # Supabase client, scheme service, mock AI engine, i18n, date helpers
├── pages/            # Landing, Dashboard, Discover, Saved, Checklist,
│                     # SchemeDetails, Guide, Applications, Deadlines, Settings, NotFound
└── store/            # App-wide state with Supabase sync + localStorage persistence
supabase/
└── migrations/       # Versioned SQL schema + seed migrations
```

---

## Privacy & Safety Principles

- No sign-up, no personal accounts, no tracking beyond an anonymous device ID.
- Never collects Aadhaar, OTPs, passwords or bank account numbers.
- Checklists ask you to *prepare* documents yourself — nothing is uploaded.
- Application guides end at the **official portal** — the app never submits anything for you.
- Every page labels scheme data as illustrative; match results are never presented as guaranteed eligibility.

---

## Roadmap Ideas

- Real speech-to-text for voice input and regional-language AI replies.
- Admin panel for scheme catalog editors with verified source links.
- Real notification scheduling for deadline reminders.
- Multi-user accounts with cross-device sync (the schema's `device_user_id` can be migrated to `auth.users` IDs).
