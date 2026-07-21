-- supabase/migrations/20260721144000_add_reminder_rules_conflict_constraint.sql

-- The reset RPC upserts one rule per device + triggering state.
-- This unique constraint is also the correct database invariant.
alter table public.reminder_rules
  drop constraint if exists reminder_rules_device_id_trigger_device_type_state_id_key;

alter table public.reminder_rules
  add constraint reminder_rules_device_id_trigger_device_type_state_id_key
  unique (device_id, trigger_device_type_state_id);