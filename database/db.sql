-- Generated from dbeaver DDL
-- public.asset_status definition
-- Drop table
-- DROP TABLE asset_status;
CREATE TABLE asset_status (
    uid text NOT NULL,
    title text NOT NULL,
    color text NULL,
    CONSTRAINT asset_status_pkey PRIMARY KEY (uid)
);

COMMENT ON TABLE public.asset_status IS 'Configurable user defined status for asset usage';

-- public."user" definition
-- Drop table
-- DROP TABLE "user";
CREATE TABLE "user" (
    uid text NOT NULL,
    "name" text NOT NULL,
    email text NOT NULL,
    "password" text NOT NULL,
    first_page int8 NOT NULL DEFAULT '0' ::bigint,
    enable_dashboard bool NOT NULL DEFAULT FALSE,
    is_dark_mode bool NOT NULL DEFAULT FALSE,
    CONSTRAINT user_pkey PRIMARY KEY (uid)
);

COMMENT ON TABLE public."user" IS 'User information for tracking';

-- public.asset_tags_library definition
-- Drop table
-- DROP TABLE asset_tags_library;
CREATE TABLE asset_tags_library (
    uid text NOT NULL,
    title text NOT NULL,
    color text NULL,
    created_on timestamptz NOT NULL,
    updated_on timestamptz NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    CONSTRAINT asset_tags_library_pkey PRIMARY KEY (uid),
    CONSTRAINT asset_tags_library_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_tags_library_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.asset_tags_library IS 'Reusable tags for any asset';

-- public.asset_type definition
-- Drop table
-- DROP TABLE asset_type;
CREATE TABLE asset_type (
    uid text NOT NULL,
    created_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    created_by text NOT NULL,
    updated_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_by text NOT NULL,
    title text NOT NULL,
    description text NULL,
    icon text NULL,
    CONSTRAINT asset_type_pkey PRIMARY KEY (uid),
    CONSTRAINT asset_type_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_type_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.asset_type IS 'Configurable user defined type for asset usage';

-- public.checklist_library definition
-- Drop table
-- DROP TABLE checklist_library;
CREATE TABLE checklist_library (
    uid text NOT NULL,
    created_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    created_by text NOT NULL,
    updated_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_by text NOT NULL,
    title text NOT NULL,
    description text NULL,
    color text NULL,
    icon text NULL,
    CONSTRAINT checklist_library_pkey PRIMARY KEY (uid),
    CONSTRAINT checklist_library_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT checklist_library_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.checklist_library IS 'Reusable checklist for any asset';

-- public.history definition
-- Drop table
-- DROP TABLE history;
CREATE TABLE history (
    uid uuid NOT NULL DEFAULT gen_random_uuid (),
    created_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    activity text NOT NULL,
    action_by text NOT NULL,
    action_on timestamptz NOT NULL,
    task_uid text NULL,
    subtask_uid text NULL,
    maintenance_uid text NULL,
    asset_uid text NULL,
    subtask_use_uid text NULL,
    task_use text NULL,
    checklist_use text NULL,
    subtask_library_uid text NULL,
    task_library_uid text NULL,
    checklist_library_uid text NULL,
    asset_tags_library text NULL,
    asset_type_uid text NULL,
    asset_tags_uid text NULL,
    user_uid text NULL,
    CONSTRAINT history_pkey PRIMARY KEY (uid),
    CONSTRAINT history_action_by_fkey FOREIGN KEY (action_by) REFERENCES "user" (uid) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- public.subtask_library definition
-- Drop table
-- DROP TABLE subtask_library;
CREATE TABLE subtask_library (
    uid text NOT NULL,
    task_activity text NOT NULL,
    description text NULL,
    task_order int8 NOT NULL,
    created_on timestamptz NOT NULL,
    created_by text NOT NULL,
    updated_on timestamptz NOT NULL,
    updated_by text NOT NULL,
    CONSTRAINT subtask_library_pkey PRIMARY KEY (uid),
    CONSTRAINT subtask_library_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT subtask_library_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- public.task_library definition
-- Drop table
-- DROP TABLE task_library;
CREATE TABLE task_library (
    uid text NOT NULL,
    created_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    created_by text NOT NULL,
    updated_by text NOT NULL,
    updated_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    task_activity text NOT NULL,
    description text NULL,
    have_subtask bool NOT NULL,
    task_order int8 NOT NULL,
    CONSTRAINT task_library_pkey PRIMARY KEY (uid),
    CONSTRAINT task_library_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT task_library_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.task_library IS 'Reusable task for any checklist';

-- public.asset definition
-- Drop table
-- DROP TABLE asset;
CREATE TABLE asset (
    uid text NOT NULL,
    "name" text NOT NULL,
    description text NULL,
    "type" text NULL,
    created_by text NOT NULL,
    created_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_by text NOT NULL,
    last_maintenance timestamptz NULL,
    last_maintainee _text NULL,
    "location" text NULL,
    next_maintenance timestamptz NULL,
    status_uid text NULL,
    updated_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    person_in_charge text NULL,
    CONSTRAINT asset_pkey PRIMARY KEY (uid),
    CONSTRAINT asset_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_person_in_charge_fkey FOREIGN KEY (person_in_charge) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_status_uid_fkey FOREIGN KEY (status_uid) REFERENCES asset_status (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_type_fkey FOREIGN KEY ("type") REFERENCES asset_type (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.asset IS 'Asset information and data';

-- public.asset_tags definition
-- Drop table
-- DROP TABLE asset_tags;
CREATE TABLE asset_tags (
    uid text NOT NULL,
    title text NOT NULL,
    color text NULL,
    asset_uid text NOT NULL,
    asset_tags_library_uid text NOT NULL,
    CONSTRAINT asset_tags_pkey PRIMARY KEY (uid),
    CONSTRAINT asset_tags_asset_tags_library_uid_fkey FOREIGN KEY (asset_tags_library_uid) REFERENCES asset_tags_library (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT asset_tags_asset_uid_fkey FOREIGN KEY (asset_uid) REFERENCES asset (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.asset_tags IS 'Tags used by asset for filtering purposes';

-- public.checklist_use definition
-- Drop table
-- DROP TABLE checklist_use;
CREATE TABLE checklist_use (
    uid text NOT NULL,
    created_on timestamptz NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    created_by text NULL,
    updated_on timestamptz NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_by text NULL,
    title text NOT NULL,
    description text NULL,
    color text NULL,
    icon text NULL,
    checklist_library_uid text NULL,
    asset_uid text NOT NULL,
    CONSTRAINT checklist_use_pkey PRIMARY KEY (uid),
    CONSTRAINT checklist_use_asset_uid_fkey FOREIGN KEY (asset_uid) REFERENCES asset (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT checklist_use_checklist_library_uid_fkey FOREIGN KEY (checklist_library_uid) REFERENCES checklist_library (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT checklist_use_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid),
    CONSTRAINT checklist_use_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid)
);

-- public.maintenance definition
-- Drop table
-- DROP TABLE maintenance;
CREATE TABLE maintenance (
    uid text NOT NULL,
    asset_uid text NOT NULL,
    "date" timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    maintainee text NULL,
    attachment_path text NULL,
    approved_by text NULL,
    approved_on timestamptz NULL,
    CONSTRAINT maintenance_pkey PRIMARY KEY (uid),
    CONSTRAINT maintenance_asset_uid_fkey FOREIGN KEY (asset_uid) REFERENCES asset (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.maintenance IS 'Maintenance done for an asset';

-- public.task_use definition
-- Drop table
-- DROP TABLE task_use;
CREATE TABLE task_use (
    uid text NOT NULL,
    task_activity text NOT NULL,
    description text NULL,
    task_order int8 NOT NULL,
    have_subtask bool NOT NULL DEFAULT FALSE,
    checklist_use_uid text NOT NULL,
    task_library_uid text NULL,
    CONSTRAINT task_use_pkey PRIMARY KEY (uid),
    CONSTRAINT task_use_checklist_use_uid_fkey FOREIGN KEY (checklist_use_uid) REFERENCES checklist_use (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT task_use_task_library_uid_fkey FOREIGN KEY (task_library_uid) REFERENCES task_library (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- public.checklist definition
-- Drop table
-- DROP TABLE checklist;
CREATE TABLE checklist (
    uid text NOT NULL,
    created_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    created_by text NOT NULL,
    updated_on timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_by text NOT NULL,
    title text NOT NULL,
    description text NULL,
    color text NULL,
    icon text NULL,
    maintenance_uid text NOT NULL,
    CONSTRAINT checklist_pkey PRIMARY KEY (uid),
    CONSTRAINT checklist_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT checklist_maintenance_uid_fkey FOREIGN KEY (maintenance_uid) REFERENCES maintenance (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT checklist_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user" (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.checklist IS 'Checklist used for maintenance purpose';

-- public.subtask_use definition
-- Drop table
-- DROP TABLE subtask_use;
CREATE TABLE subtask_use (
    uid text NOT NULL,
    task_activity text NOT NULL,
    description text NULL,
    task_use_uid text NOT NULL,
    task_order int8 NOT NULL,
    subtask_library_uid text NULL,
    CONSTRAINT subtask_use_pkey PRIMARY KEY (uid),
    CONSTRAINT subtask_use_subtask_library_uid_fkey FOREIGN KEY (subtask_library_uid) REFERENCES subtask_library (uid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT subtask_use_task_use_uid_fkey FOREIGN KEY (task_use_uid) REFERENCES task_use (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- public.task definition
-- Drop table
-- DROP TABLE task;
CREATE TABLE task (
    uid text NOT NULL,
    task_activity text NOT NULL,
    description text NULL,
    is_complete bool NOT NULL DEFAULT FALSE,
    remarks text NULL,
    issue text NULL,
    deadline timestamptz NULL,
    completed_by text NULL,
    task_order int8 NOT NULL,
    have_subtask bool NOT NULL DEFAULT FALSE,
    checklist_uid text NOT NULL,
    CONSTRAINT task2_pkey PRIMARY KEY (uid),
    CONSTRAINT task_checklist_uid_fkey FOREIGN KEY (checklist_uid) REFERENCES checklist (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.task IS 'Main task of maintenance in order';

-- public.subtask definition
-- Drop table
-- DROP TABLE subtask;
CREATE TABLE subtask (
    uid text NOT NULL,
    task_activity text NOT NULL,
    description text NULL,
    is_complete bool NOT NULL DEFAULT FALSE,
    remarks text NULL,
    issue text NULL,
    deadline timestamptz NULL,
    completed_by text NULL,
    task_uid text NOT NULL,
    task_order int8 NOT NULL,
    CONSTRAINT subtask_pkey PRIMARY KEY (uid),
    CONSTRAINT subtask_task_uid_fkey FOREIGN KEY (task_uid) REFERENCES task (uid) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE public.subtask IS 'Sub task of main task in order';
