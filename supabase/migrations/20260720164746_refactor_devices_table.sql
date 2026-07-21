-- Migration: refactor_devices_table

-- Add new columns
ALTER TABLE devices
  ADD COLUMN device_type_id TEXT REFERENCES device_types(id),
  ADD COLUMN safe_device_type_state_id BIGINT REFERENCES device_type_states(id),
  ADD COLUMN category_int INTEGER; -- replaces enum if needed

-- After data migration, drop old columns
-- CASCADE removes dependent views (v_device_inventory, v_latest_device_states)
-- that reference expected_safe_state; recreate them later if still needed.
ALTER TABLE devices
  DROP COLUMN expected_safe_state CASCADE,
  DROP COLUMN category CASCADE; -- enum column

-- Rename category_int to category
ALTER TABLE devices RENAME COLUMN category_int TO category;