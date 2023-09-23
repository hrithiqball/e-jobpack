create table
  public.asset_status (
    uid text not null,
    title text not null,
    color text null,
    constraint asset_status_pkey primary key (uid)
  ) tablespace pg_default;