/*
# Tighten grants: make catalog read-only, scope user-state writes

1. Purpose
   Follow-up hardening for the SchemeSaathi tables. The previous migration
   relied on missing policies to block writes, but grants were broad. This
   migration narrows privileges to exactly what the app needs.

2. Changed Objects (no schema changes, no data changes)
   - `schemes`, `scheme_categories`: catalog is read-only for the app —
     revoke INSERT/UPDATE/DELETE from anon + authenticated. SELECT remains.
   - `saved_schemes`: restrict INSERT to only (device_user_id, scheme_id);
     UPDATE is not used by the app — revoke it; DELETE keeps table-level grant.
   - `checklist_items`: restrict INSERT to app columns (device_user_id,
     scheme_id, label, is_prepared, sort_order) and UPDATE to the fields
     the checklist screen can change (label, is_prepared, sort_order).
   - `applications`: restrict INSERT to app columns and UPDATE to the
     fields the app can change (status, completed_steps, notes,
     reminder_on, updated_at). `device_user_id`, `scheme_id` and
     `added_date` become immutable after insert.

3. Security
   - Grants only; RLS policies unchanged.
   - Principle of least privilege: the anon-key client can no longer
     modify catalog rows, forge `device_user_id`/`scheme_id`/`added_date`
     on existing rows, or alter read-only columns.

4. Important Notes
   - service_role keeps full access for any future server-side tooling.
*/

REVOKE INSERT, UPDATE, DELETE ON schemes FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON scheme_categories FROM anon, authenticated;

REVOKE INSERT, UPDATE ON saved_schemes FROM anon, authenticated;
GRANT INSERT (device_user_id, scheme_id) ON saved_schemes TO anon, authenticated;

REVOKE INSERT, UPDATE ON checklist_items FROM anon, authenticated;
GRANT INSERT (device_user_id, scheme_id, label, is_prepared, sort_order) ON checklist_items TO anon, authenticated;
GRANT UPDATE (label, is_prepared, sort_order) ON checklist_items TO anon, authenticated;

REVOKE INSERT, UPDATE ON applications FROM anon, authenticated;
GRANT INSERT (device_user_id, scheme_id, status, completed_steps, notes, reminder_on, added_date) ON applications TO anon, authenticated;
GRANT UPDATE (status, completed_steps, notes, reminder_on, updated_at) ON applications TO anon, authenticated;
