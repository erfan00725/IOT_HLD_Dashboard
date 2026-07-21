create or replace function public.record_device_state(
  p_external_key text,
  p_state_key text,
  p_mqtt_topic text default null,
  p_payload jsonb default '{}'::jsonb,
  p_source text default 'node-red',
  p_observed_at timestamptz default now()
)
returns table (
  device_id uuid,
  home_id uuid,
  device_type_id text,
  device_type_state_id bigint,
  previous_state_key text,
  current_state_key text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_device public.devices%rowtype;
  target_state public.device_type_states%rowtype;
  previous_state_id bigint;
begin
  select d.*
  into target_device
  from public.devices d
  where d.external_key = trim(p_external_key)
    and d.active = true;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = format('Unknown or inactive device: %s', p_external_key);
  end if;

  select dts.*
  into target_state
  from public.device_type_states dts
  where dts.device_type_id = target_device.device_type_id
    and dts.state_key = lower(trim(p_state_key));

  if not found then
    raise exception using
      errcode = 'P0001',
      message = format(
        'State "%s" is not valid for device "%s" of type "%s".',
        p_state_key,
        target_device.external_key,
        target_device.device_type_id
      );
  end if;

  select dls.device_type_state_id
  into previous_state_id
  from public.device_latest_states dls
  where dls.device_id = target_device.id;

  -- Avoid duplicate event rows for retained MQTT messages or unchanged values.
  if previous_state_id is not distinct from target_state.id then
    return;
  end if;

  insert into public.device_latest_states (
    device_id,
    device_type_state_id,
    source,
    last_seen_at
  )
  values (
    target_device.id,
    target_state.id,
    coalesce(nullif(trim(p_source), ''), 'node-red'),
    coalesce(p_observed_at, now())
  )
  on conflict (device_id) do update
  set
    device_type_state_id = excluded.device_type_state_id,
    source = excluded.source,
    last_seen_at = excluded.last_seen_at,
    updated_at = now();

  insert into public.device_state_events (
    device_id,
    mqtt_topic,
    device_type_state_id,
    payload,
    source,
    observed_at
  )
  values (
    target_device.id,
    p_mqtt_topic,
    target_state.id,
    coalesce(p_payload, '{}'::jsonb),
    coalesce(nullif(trim(p_source), ''), 'node-red'),
    coalesce(p_observed_at, now())
  );

  return query
  select
    target_device.id,
    target_device.home_id,
    target_device.device_type_id,
    target_state.id,
    previous_state.state_key,
    target_state.state_key
  from public.device_type_states previous_state
  where previous_state.id = previous_state_id

  union all

  select
    target_device.id,
    target_device.home_id,
    target_device.device_type_id,
    target_state.id,
    null::text,
    target_state.state_key
  where previous_state_id is null;
end;
$$;

revoke all on function public.record_device_state(
  text,
  text,
  text,
  jsonb,
  text,
  timestamptz
) from public;

grant execute on function public.record_device_state(
  text,
  text,
  text,
  jsonb,
  text,
  timestamptz
) to service_role;