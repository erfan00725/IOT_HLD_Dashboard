-- Migration: refactor_reminder_rules

-- 1. Remove FKs that reference old columns before dropping them
--    devices.device_external_key references reminder_rules, and
--    reminder_rules.device_external_key references devices.external_key.
--    Drop the FK on reminder_rules first (it references devices),
--    then handle any FK on devices that references reminder_rules.
DO $$
DECLARE
  conname text;
BEGIN
  -- Drop FK constraint on reminder_rules that references devices
  SELECT conname INTO conname
  FROM pg_constraint
  WHERE conrelid = 'public.reminder_rules'::regclass
    AND confrelid = 'public.devices'::regclass
    AND contype = 'f'
  LIMIT 1;

  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.reminder_rules DROP CONSTRAINT %I', conname);
  END IF;

  -- Drop FK constraint on devices that references reminder_rules (if any)
  SELECT conname INTO conname
  FROM pg_constraint
  WHERE conrelid = 'public.devices'::regclass
    AND confrelid = 'public.reminder_rules'::regclass
    AND contype = 'f'
  LIMIT 1;

  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.devices DROP CONSTRAINT %I', conname);
  END IF;

  -- Drop any unique constraints on reminder_rules that reference old columns
  FOR conname IN
    SELECT c.conname
    FROM pg_constraint c
    WHERE c.conrelid = 'public.reminder_rules'::regclass
      AND c.contype IN ('u', 'p')
      AND EXISTS (
        SELECT 1 FROM pg_attribute a
        WHERE a.attrelid = c.conrelid
          AND a.attnum = ANY(c.conkey)
          AND a.attname IN ('device_external_key', 'trigger_device_state')
      )
  LOOP
    EXECUTE format('ALTER TABLE public.reminder_rules DROP CONSTRAINT %I', conname);
  END LOOP;
END $$;

-- 2. Add new columns
ALTER TABLE reminder_rules
  ADD COLUMN device_id UUID REFERENCES devices(id),
  ADD COLUMN trigger_device_type_state_id BIGINT REFERENCES device_type_states(id);

-- 3. Drop old columns
ALTER TABLE reminder_rules
  DROP COLUMN device_external_key,
  DROP COLUMN trigger_device_state;

-- 4. Add unique constraint on new columns
ALTER TABLE reminder_rules
  ADD CONSTRAINT reminder_rules_home_trigger_key
  UNIQUE (home_id, device_id, trigger_device_type_state_id);