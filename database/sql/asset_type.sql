create table
  public.asset_type (
    uid text not null,
    created_on timestamp with time zone not null default (now() at time zone 'utc'::text),
    created_by text not null,
    updated_on timestamp with time zone not null,
    updated_by text not null,
    title text not null,
    description text null,
    icon text null,
    constraint asset_type_pkey primary key (uid)
  ) tablespace pg_default;