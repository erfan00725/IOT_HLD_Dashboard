-- Fix validation for INSERTs into public.devices.
-- On INSERT, validate against NEW.device_type_id directly because NEW.id
-- is not queryable from public.devices until the row has been inserted.

create or replace function public.validate_device_safe_state_type()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  state_device_type_id text;
begin
  -- safe_device_type_state_id is nullable.
  if new.safe_device_type_state_id is null then
    return new;
  end if;

  select dts.device_type_id
  into state_device_type_id
  from public.device_type_states as dts
  where dts.id = new.safe_device_type_state_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = format(
        'devices.safe_device_type_state_id references a state that does not exist: %s',
        new.safe_device_type_state_id
      );
  end if;

  if new.device_type_id is distinct from state_device_type_id then
    raise exception using
      errcode = '23514',
      message = format(
        'devices.safe_device_type_state_id is invalid: device type "%s" cannot use state %s from type "%s".',
        new.device_type_id,
        new.safe_device_type_state_id,
        state_device_type_id
      ),
      detail = 'The safe state must belong to the same device type as the device.',
      hint = 'Select a device_type_state whose device_type_id matches devices.device_type_id.';
  end if;

  return new;
end;
$$;

-- Recreate explicitly, in case its event list was changed during prior migrations.
drop trigger if exists trg_validate_device_safe_state_type on public.devices;

create trigger trg_validate_device_safe_state_type
before insert or update of device_type_id, safe_device_type_state_id
on public.devices
for each row
execute function public.validate_device_safe_state_type();