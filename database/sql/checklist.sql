create table
  public.checklist (
    uid text not null,
    created_on timestamp with time zone not null default (now() at time zone 'utc'::text),
    created_by text not null,
    updated_on timestamp with time zone not null,
    updated_by text not null,
    title text not null,
    description text null,
    color text null,
    icon text null,
    asset_uid text null,
    constraint checklist_pkey primary key (uid),
    constraint checklist_asset_uid_fkey foreign key (asset_uid) references asset (uid) on update cascade on delete cascade
  ) tablespace pg_default;