begin;

-- =============================================================================
-- CLEAN-SLATE SCHEMA ALIGNMENT
-- Keeps: auth.users and public."user"
-- Deletes: all IoT application/reference data and the old Test table
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Remove RLS policies that can depend on legacy reminder_rules columns.
-- -----------------------------------------------------------------------------

drop policy if exists reminder_rules_owner_all
on public.reminder_rules;


-- -----------------------------------------------------------------------------
-- 2. Delete data from children to parents.
-- -----------------------------------------------------------------------------

delete from public.reminder_events;
delete from public.leave_sessions;

delete from public.device_state_events;
delete from public.device_latest_states;

delete from public.reminder_rules;
delete from public.devices;
delete from public.rooms;
delete from public.homes;

delete from public.device_type_states;
delete from public.device_types;

drop table if exists public."Test";


-- -----------------------------------------------------------------------------
-- 3. Remove legacy columns and constraints.
-- Each command is safe if the column/constraint was removed by an earlier,
-- partially applied migration.
-- -----------------------------------------------------------------------------

alter table public.reminder_rules
  drop constraint if exists reminder_rules_home_id_fkey,
  drop constraint if exists reminder_rules_device_external_key_fkey,
  drop column if exists home_id,
  drop column if exists device_external_key,
  drop column if exists trigger_device_state;

alter table public.device_latest_states
  drop column if exists state_payload;


-- -----------------------------------------------------------------------------
-- 4. Make typed state-model columns mandatory.
-- Tables were emptied above, so this cannot fail due to old null rows.
-- -----------------------------------------------------------------------------

alter table public.devices
  alter column device_type_id set not null,
  alter column category set not null;

alter table public.device_latest_states
  alter column device_id set not null,
  alter column device_type_state_id set not null;

alter table public.device_state_events
  alter column device_id set not null,
  alter column device_type_state_id set not null;

alter table public.reminder_rules
  alter column device_id set not null,
  alter column trigger_device_type_state_id set not null;


-- -----------------------------------------------------------------------------
-- 5. Add target uniqueness and primary keys.
-- -----------------------------------------------------------------------------

alter table public.rooms
  drop constraint if exists rooms_home_id_code_key,
  add constraint rooms_home_id_code_key
    unique (home_id, code);

alter table public.device_type_states
  drop constraint if exists device_type_states_device_type_id_state_key_key,
  add constraint device_type_states_device_type_id_state_key_key
    unique (device_type_id, state_key);

alter table public.device_latest_states
  drop constraint if exists device_latest_states_pkey,
  add constraint device_latest_states_pkey
    primary key (device_id);

alter table public.reminder_rules
  drop constraint if exists reminder_rules_device_id_trigger_device_type_state_id_key,
  add constraint reminder_rules_device_id_trigger_device_type_state_id_key
    unique (device_id, trigger_device_type_state_id);


-- -----------------------------------------------------------------------------
-- 6. Recreate foreign keys with explicit cascade behaviour for device-owned data.
-- -----------------------------------------------------------------------------

alter table public.device_latest_states
  drop constraint if exists device_latest_states_device_id_fkey,
  add constraint device_latest_states_device_id_fkey
    foreign key (device_id)
    references public.devices (id)
    on delete cascade;

alter table public.device_state_events
  drop constraint if exists device_state_events_device_id_fkey,
  add constraint device_state_events_device_id_fkey
    foreign key (device_id)
    references public.devices (id)
    on delete cascade;

alter table public.reminder_rules
  drop constraint if exists reminder_rules_device_id_fkey,
  add constraint reminder_rules_device_id_fkey
    foreign key (device_id)
    references public.devices (id)
    on delete cascade;


-- -----------------------------------------------------------------------------
-- 7. Add query-performance indexes.
-- -----------------------------------------------------------------------------

create index if not exists devices_home_id_idx
  on public.devices (home_id);

create index if not exists devices_room_id_idx
  on public.devices (room_id);

create index if not exists reminder_rules_device_id_idx
  on public.reminder_rules (device_id);

create index if not exists device_state_events_device_id_observed_at_idx
  on public.device_state_events (device_id, observed_at desc);


-- -----------------------------------------------------------------------------
-- 8. Recreate RLS policy using the normalized ownership route:
-- reminder_rules.device_id -> devices.home_id -> homes.owner_id.
-- -----------------------------------------------------------------------------

create policy reminder_rules_owner_all
on public.reminder_rules
for all
to authenticated
using (
  exists (
    select 1
    from public.devices as device
    join public.homes as home
      on home.id = device.home_id
    where device.id = reminder_rules.device_id
      and home.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.devices as device
    join public.homes as home
      on home.id = device.home_id
    where device.id = reminder_rules.device_id
      and home.owner_id = auth.uid()
  )
);

commit;