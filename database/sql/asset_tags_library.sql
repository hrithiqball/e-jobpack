create table
  public.asset_tags_library (
    uid text not null,
    title text not null,
    color text null,
    constraint asset_tags_library_pkey primary key (uid)
  ) tablespace pg_default;