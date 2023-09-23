create table
  public.asset_tags (
    uid text not null,
    title text not null,
    color text null,
    asset_uid text null,
    constraint asset_tags_pkey primary key (uid),
    constraint asset_tags_asset_uid_fkey foreign key (asset_uid) references asset (uid) on update cascade on delete cascade
  ) tablespace pg_default;