-- Migration: refactor_state_tables

-- device_state_events
ALTER TABLE device_state_events
  ADD COLUMN device_id UUID REFERENCES devices(id),
  ADD COLUMN device_type_state_id BIGINT REFERENCES device_type_states(id);

-- After data migration:
-- CASCADE drops dependent objects (e.g. RLS policy state_events_owner_all)
-- that reference these columns. Recreate policies after migration if needed.
ALTER TABLE device_state_events
  DROP COLUMN device_external_key CASCADE,
  DROP COLUMN state_value CASCADE,
  DROP COLUMN home_id CASCADE,
  DROP COLUMN room_id CASCADE;

-- device_latest_states
ALTER TABLE device_latest_states
  ADD COLUMN device_id UUID REFERENCES devices(id),
  ADD COLUMN device_type_state_id BIGINT REFERENCES device_type_states(id);

-- After data migration:
ALTER TABLE device_latest_states
  DROP COLUMN device_external_key CASCADE,
  DROP COLUMN state_value CASCADE,
  DROP COLUMN home_id CASCADE,
  DROP COLUMN room_id CASCADE;
