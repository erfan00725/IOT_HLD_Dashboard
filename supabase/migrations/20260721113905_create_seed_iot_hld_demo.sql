-- Reset only the selected IoT demo home's operational data and reseed the
-- devices/states used by the Node-RED Schema v2 simulation.
-- It deliberately preserves auth.users, public."user", and the home itself.

create or replace function public.reset_iot_demo_data(
  p_home_id uuid,
  p_user_id uuid,
  p_confirmation text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_device_count integer;
  v_room_count integer;
begin
  if p_confirmation <> 'RESET_IOT_DEMO_DATA' then
    raise exception using
      errcode = '22023',
      message = 'Reset confirmation is invalid.';
  end if;

  select owner_id into v_owner_id from public.homes where id = p_home_id;
  if not found then
    raise exception using errcode = 'P0001', message = 'Home not found.';
  end if;

  if v_owner_id <> p_user_id or not exists (
    select 1 from public."user" where id = p_user_id and is_active
  ) then
    raise exception using
      errcode = '42501',
      message = 'Only the active owner of this home may reset its demo data.';
  end if;

  -- external_key is globally unique. Never overwrite a different home's device.
  if exists (
    select 1 from public.devices
    where external_key in (
      'presence_main', 'kitchen_gas_stove', 'kitchen_light',
      'front_door_lock', 'house_keys'
    ) and home_id <> p_home_id
  ) then
    raise exception using
      errcode = '23505',
      message = 'A demo external_key is already assigned to another home.';
  end if;

  -- Delete in dependency order. Historical and current state are intentionally reset.
  delete from public.reminder_events where home_id = p_home_id;
  delete from public.leave_sessions where home_id = p_home_id;
  delete from public.device_state_events
    where device_id in (select id from public.devices where home_id = p_home_id);
  delete from public.device_latest_states
    where device_id in (select id from public.devices where home_id = p_home_id);
  delete from public.reminder_rules
    where device_id in (select id from public.devices where home_id = p_home_id);
  delete from public.devices where home_id = p_home_id;
  delete from public.rooms where home_id = p_home_id;

  -- Device types and states are shared reference data, so they are upserted, not deleted.
  insert into public.device_types (id, label, icon, created_at)
  values
    ('presence', 'Presence sensor', 'user-round-check', now()),
    ('switch', 'Switchable device', 'power', now()),
    ('lock', 'Door lock', 'lock-keyhole', now()),
    ('item', 'Item tracker', 'key-round', now())
  on conflict (id) do update set label = excluded.label, icon = excluded.icon;

  insert into public.device_type_states (device_type_id, state_key, label, is_safe_state)
  values
    ('presence', 'home', 'At home', true),
    ('presence', 'left', 'Left home', false),
    ('switch', 'off', 'Off', true),
    ('switch', 'on', 'On', false),
    ('lock', 'locked', 'Locked', true),
    ('lock', 'unlocked', 'Unlocked', false),
    ('item', 'taken', 'Taken', true),
    ('item', 'missing', 'Missing', false)
  on conflict (device_type_id, state_key) do update
    set label = excluded.label, is_safe_state = excluded.is_safe_state;

  insert into public.rooms (home_id, name, code, floor_label, sort_order)
  values
    (p_home_id, 'Entrance', 'entrance', 'Ground floor', 1),
    (p_home_id, 'Kitchen', 'kitchen', 'Ground floor', 2)
  on conflict (home_id, code) do update
    set name = excluded.name, floor_label = excluded.floor_label,
        sort_order = excluded.sort_order, updated_at = now();

  insert into public.devices (
    home_id, room_id, device_type_id, external_key, name, category,
    reminder_enabled, safe_device_type_state_id, active, metadata
  )
  select
    p_home_id,
    r.id,
    v.device_type_id,
    v.external_key,
    v.name,
    v.category,
    true,
    safe_state.id,
    true,
    jsonb_build_object('simulated', true, 'mqtt_topic', 'home/' || v.external_key || '/state')
  from (values
    ('presence_main', 'Presence sensor', 'presence', 'entrance', 1, 'home'),
    ('kitchen_gas_stove', 'Gas stove', 'switch', 'kitchen', 2, 'off'),
    ('kitchen_light', 'Kitchen light', 'switch', 'kitchen', 2, 'off'),
    ('front_door_lock', 'Front door lock', 'lock', 'entrance', 5, 'locked'),
    ('house_keys', 'House keys', 'item', 'entrance', 5, 'taken')
  ) as v(external_key, name, device_type_id, room_code, category, safe_state_key)
  join public.rooms r on r.home_id = p_home_id and r.code = v.room_code
  join public.device_type_states safe_state
    on safe_state.device_type_id = v.device_type_id
   and safe_state.state_key = v.safe_state_key;

  insert into public.device_latest_states (
    device_id, device_type_state_id, source, last_seen_at
  )
  select d.id, d.safe_device_type_state_id, 'node-red-reset', now()
  from public.devices d
  where d.home_id = p_home_id;

  insert into public.reminder_rules (
    device_id, trigger_presence_state, trigger_device_type_state_id,
    reminder_text, severity, active
  )
  select d.id, 'left', state.id, rule.reminder_text, rule.severity, true
  from (values
    ('kitchen_gas_stove', 'on', 'Gas stove is still on. Turn it off.', 5::smallint),
    ('kitchen_light', 'on', 'Kitchen light is still on.', 2::smallint),
    ('front_door_lock', 'unlocked', 'Front door is unlocked. Lock it.', 4::smallint),
    ('house_keys', 'missing', 'Do not forget your house keys.', 3::smallint)
  ) as rule(external_key, state_key, reminder_text, severity)
  join public.devices d
    on d.home_id = p_home_id and d.external_key = rule.external_key
  join public.device_type_states state
    on state.device_type_id = d.device_type_id and state.state_key = rule.state_key
  on conflict (device_id, trigger_device_type_state_id) do update
    set reminder_text = excluded.reminder_text,
        severity = excluded.severity,
        active = true,
        updated_at = now();

  select count(*) into v_device_count from public.devices where home_id = p_home_id;
  select count(*) into v_room_count from public.rooms where home_id = p_home_id;

  return jsonb_build_object(
    'home_id', p_home_id,
    'rooms', v_room_count,
    'devices', v_device_count,
    'initial_states', jsonb_build_object(
      'presence_main', 'home', 'kitchen_gas_stove', 'off',
      'kitchen_light', 'off', 'front_door_lock', 'locked', 'house_keys', 'taken'
    )
  );
end;
$$;

revoke all on function public.reset_iot_demo_data(uuid, uuid, text) from public;
grant execute on function public.reset_iot_demo_data(uuid, uuid, text) to service_role;
