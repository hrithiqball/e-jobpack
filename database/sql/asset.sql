create table
  public.asset (
    uid text not null,
    name text not null,
    description text null,
    type text not null,
    checklist_uid text not null,
    created_by text not null,
    created_on timestamp with time zone not null default (now() at time zone 'utc'::text),
    updated_by text not null,
    last_maintenance timestamp with time zone null,
    last_maintainee text[] null,
    location text null,
    next_maintenance timestamp with time zone null,
    status_uid text null,
    constraint asset_pkey primary key (uid),
    constraint asset_status_uid_fkey foreign key (status_uid) references asset_status (uid) on update cascade on delete cascade,
    constraint asset_type_fkey foreign key (
      type
    ) references asset_type (uid) on update cascade on delete cascade
  ) tablespace pg_default;