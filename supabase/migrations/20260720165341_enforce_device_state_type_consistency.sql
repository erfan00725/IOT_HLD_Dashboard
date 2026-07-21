-- Enforces that each selected device type state belongs to the same
-- device type as the related device.

create or replace function public.assert_device_state_matches_device_type(
  p_device_id uuid,
  p_device_type_state_id bigint,
  p_context text
)
returns void
language plpgsql
set search_path = public
as $$
declare
  actual_device_type_id text;
  state_device_type_id text;
begin
  -- Nullable state references are allowed where the column is nullable.
  if p_device_type_state_id is null then
    return;
  end if;

  select d.device_type_id
  into actual_device_type_id
  from public.devices d
  where d.id = p_device_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = format(
        '%s references a device that does not exist: %s',
        p_context,
        p_device_id
      );
  end if;

  select dts.device_type_id
  into state_device_type_id
  from public.device_type_states dts
  where dts.id = p_device_type_state_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = format(
        '%s references a device type state that does not exist: %s',
        p_context,
        p_device_type_state_id
      );
  end if;

  if actual_device_type_id is distinct from state_device_type_id then
    raise exception using
      errcode = '23514',
      message = format(
        '%s is invalid: device type "%s" cannot use state %s from device type "%s"',
        p_context,
        actual_device_type_id,
        p_device_type_state_id,
        state_device_type_id
      ),
      detail = 'The selected device_type_state must belong to the referenced device''s device_type.',
      hint = 'Use a device_type_state whose device_type_id matches devices.device_type_id.';
  end if;
end;
$$;


-- 1. devices.safe_device_type_state_id
create or replace function public.validate_device_safe_state_type()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.assert_device_state_matches_device_type(
    new.id,
    new.safe_device_type_state_id,
    'devices.safe_device_type_state_id'
  );

  return new;
end;
$$;

drop trigger if exists trg_validate_device_safe_state_type on public.devices;

create trigger trg_validate_device_safe_state_type
before insert or update of device_type_id, safe_device_type_state_id
on public.devices
for each row
execute function public.validate_device_safe_state_type();


-- 2. device_latest_states.device_type_state_id
create or replace function public.validate_latest_state_type()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.assert_device_state_matches_device_type(
    new.device_id,
    new.device_type_state_id,
    'device_latest_states.device_type_state_id'
  );

  return new;
end;
$$;

drop trigger if exists trg_validate_latest_state_type on public.device_latest_states;

create trigger trg_validate_latest_state_type
before insert or update of device_id, device_type_state_id
on public.device_latest_states
for each row
execute function public.validate_latest_state_type();


-- 3. device_state_events.device_type_state_id
create or replace function public.validate_state_event_type()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.assert_device_state_matches_device_type(
    new.device_id,
    new.device_type_state_id,
    'device_state_events.device_type_state_id'
  );

  return new;
end;
$$;

drop trigger if exists trg_validate_state_event_type on public.device_state_events;

create trigger trg_validate_state_event_type
before insert or update of device_id, device_type_state_id
on public.device_state_events
for each row
execute function public.validate_state_event_type();


-- 4. reminder_rules.trigger_device_type_state_id
-- Ensure columns exist (handles case where refactor_reminder_rules was applied empty)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reminder_rules' AND column_name = 'device_id'
  ) THEN
    ALTER TABLE public.reminder_rules ADD COLUMN device_id UUID REFERENCES public.devices(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reminder_rules' AND column_name = 'trigger_device_type_state_id'
  ) THEN
    ALTER TABLE public.reminder_rules ADD COLUMN trigger_device_type_state_id BIGINT REFERENCES public.device_type_states(id);
  END IF;
END $$;

create or replace function public.validate_reminder_rule_state_type()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.assert_device_state_matches_device_type(
    new.device_id,
    new.trigger_device_type_state_id,
    'reminder_rules.trigger_device_type_state_id'
  );

  return new;
end;
$$;

drop trigger if exists trg_validate_reminder_rule_state_type on public.reminder_rules;

create trigger trg_validate_reminder_rule_state_type
before insert or update of device_id, trigger_device_type_state_id
on public.reminder_rules
for each row
execute function public.validate_reminder_rule_state_type();


-- Protect integrity if someone changes a state's parent device type.
create or replace function public.prevent_device_type_state_reassignment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.device_type_id is distinct from old.device_type_id then
    if exists (
      select 1
      from public.devices d
      where d.safe_device_type_state_id = old.id
    )
    or exists (
      select 1
      from public.device_latest_states dls
      where dls.device_type_state_id = old.id
    )
    or exists (
      select 1
      from public.device_state_events dse
      where dse.device_type_state_id = old.id
    )
    or exists (
      select 1
      from public.reminder_rules rr
      where rr.trigger_device_type_state_id = old.id
    ) then
      raise exception using
        errcode = '23514',
        message = format(
          'Cannot change device type for state %s because it is already in use.',
          old.id
        ),
        hint = 'Create a new state for the target device type instead.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_device_type_state_reassignment
on public.device_type_states;

create trigger trg_prevent_device_type_state_reassignment
before update of device_type_id
on public.device_type_states
for each row
execute function public.prevent_device_type_state_reassignment();