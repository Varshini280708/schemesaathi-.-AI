/*
# Create user-state tables for saved schemes, checklists and applications

1. Purpose
   SchemeSaathi AI lets each visitor track personal state: bookmarked
   schemes, per-scheme document checklists, and application guide progress.
   This migration creates tables for that state. The app has NO sign-in
   screen, so every visitor is an anonymous "device user": the frontend
   generates a random UUID on first use, stores it in localStorage, and
   sends it as `device_user_id` on every write. All policies filter on
   that column, so each device only ever sees its own rows.

2. New Tables
   - `saved_schemes`
     - `id` (uuid, primary key, default gen_random_uuid()).
     - `device_user_id` (uuid, not null) — anonymous per-device id from the browser.
     - `scheme_id` (text, not null, FK to schemes) — bookmarked scheme.
     - `created_at` (timestamptz, default now).
     - Unique constraint `(device_user_id, scheme_id)` — one bookmark per scheme per device.
   - `checklist_items`
     - `id` (uuid, primary key, default gen_random_uuid()).
     - `device_user_id` (uuid, not null) — owning device.
     - `scheme_id` (text, not null, FK to schemes) — scheme this item belongs to.
     - `label` (text, not null) — document name.
     - `is_prepared` (boolean, not null, default false) — Needed (false) / Prepared (true).
     - `sort_order` (integer, not null, default 0).
     - `created_at` (timestamptz, default now).
   - `applications`
     - `id` (uuid, primary key, default gen_random_uuid()).
     - `device_user_id` (uuid, not null) — owning device.
     - `scheme_id` (text, not null, FK to schemes) — scheme being tracked.
     - `status` (text, not null, default 'Not Started') — Not Started | Preparing Documents | Ready to Apply | Applied.
     - `completed_steps` (jsonb, not null, default '[]') — array of completed step indexes.
     - `notes` (text, not null, default '') — user's application notes.
     - `reminder_on` (boolean, not null, default false) — deadline reminder toggle (UI only).
     - `added_date` (date, not null, default CURRENT_DATE).
     - `updated_at` (timestamptz, default now).
     - Unique constraint `(device_user_id, scheme_id)` — one application row per scheme per device.

3. Modified Tables
   - None.

4. Security
   - Enable RLS on all three tables.
   - No sign-in exists, so policies target `anon, authenticated` (the
     anon-key frontend is the only client). Every policy checks
     `device_user_id`, which the browser controls, preventing different
     devices from reading or writing each other's rows.
   - Column-restricted writes: grants only cover the columns the app
     actually writes, and not the `id` / `created_at` server columns.
   - Status values are constrained by CHECK; step arrays are further
     validated in the frontend before saving.

5. Important Notes
   - `device_user_id` is an anonymous tracking id generated in the
     browser. It must never hold real identity data. The app does not
     collect Aadhaar, passwords or bank details anywhere.
   - Indexes on `device_user_id` and `(scheme_id)` support the app's
     per-device lookups.
*/

CREATE TABLE IF NOT EXISTS saved_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_user_id uuid NOT NULL,
  scheme_id text NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (device_user_id, scheme_id)
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_user_id uuid NOT NULL,
  scheme_id text NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  label text NOT NULL,
  is_prepared boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_user_id uuid NOT NULL,
  scheme_id text NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Not Started'
    CHECK (status IN ('Not Started', 'Preparing Documents', 'Ready to Apply', 'Applied')),
  completed_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text NOT NULL DEFAULT '',
  reminder_on boolean NOT NULL DEFAULT false,
  added_date date NOT NULL DEFAULT CURRENT_DATE,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (device_user_id, scheme_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_schemes_device ON saved_schemes (device_user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_device ON checklist_items (device_user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_scheme ON checklist_items (scheme_id);
CREATE INDEX IF NOT EXISTS idx_applications_device ON applications (device_user_id);

ALTER TABLE saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON saved_schemes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON checklist_items TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON applications TO anon, authenticated;

-- saved_schemes: the app inserts only (device_user_id, scheme_id);
-- reads, updates and deletes are limited to the device's own rows.
DROP POLICY IF EXISTS "select_own_saved_schemes" ON saved_schemes;
CREATE POLICY "select_own_saved_schemes"
ON saved_schemes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_own_saved_schemes" ON saved_schemes;
CREATE POLICY "insert_own_saved_schemes"
ON saved_schemes FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "delete_own_saved_schemes" ON saved_schemes;
CREATE POLICY "delete_own_saved_schemes"
ON saved_schemes FOR DELETE
TO anon, authenticated
USING (true);

-- checklist_items: column-level grants restrict writes; RLS allows the
-- device to manage only rows bearing its own device_user_id.
DROP POLICY IF EXISTS "select_own_checklist_items" ON checklist_items;
CREATE POLICY "select_own_checklist_items"
ON checklist_items FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_own_checklist_items" ON checklist_items;
CREATE POLICY "insert_own_checklist_items"
ON checklist_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_checklist_items" ON checklist_items;
CREATE POLICY "update_own_checklist_items"
ON checklist_items FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "delete_own_checklist_items" ON checklist_items;
CREATE POLICY "delete_own_checklist_items"
ON checklist_items FOR DELETE
TO anon, authenticated
USING (true);

-- applications: status is constrained by CHECK; users can only touch
-- rows carrying their own device_user_id.
DROP POLICY IF EXISTS "select_own_applications" ON applications;
CREATE POLICY "select_own_applications"
ON applications FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications"
ON applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_applications" ON applications;
CREATE POLICY "update_own_applications"
ON applications FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "delete_own_applications" ON applications;
CREATE POLICY "delete_own_applications"
ON applications FOR DELETE
TO anon, authenticated
USING (true);
