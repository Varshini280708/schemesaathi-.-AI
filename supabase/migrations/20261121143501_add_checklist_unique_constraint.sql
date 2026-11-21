/*
# Add uniqueness for checklist item upserts

1. Purpose
   The frontend updates the whole checklist at once by upserting rows keyed
   on (device_user_id, scheme_id, label). This migration adds a unique
   constraint matching that key so Postgres can perform the upsert and
   repeated ticks never create duplicate rows.

2. Modified Tables
   - `checklist_items`: adds UNIQUE (device_user_id, scheme_id, label).

3. Security
   - None; policies and grants unchanged.

4. Important Notes
   - Existing duplicate rows (if any) would block the constraint; the DO
     block removes exact duplicates first, keeping the earliest row.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'checklist_items_device_scheme_label_key'
  ) THEN
    DELETE FROM checklist_items a
    USING checklist_items b
    WHERE a.id > b.id
      AND a.device_user_id = b.device_user_id
      AND a.scheme_id = b.scheme_id
      AND a.label = b.label;
    ALTER TABLE checklist_items
      ADD CONSTRAINT checklist_items_device_scheme_label_key
      UNIQUE (device_user_id, scheme_id, label);
  END IF;
END $$;
