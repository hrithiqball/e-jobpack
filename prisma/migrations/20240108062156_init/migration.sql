-- CreateEnum
CREATE TYPE "public"."Department" AS ENUM ('management', 'exploration');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'supervisor', 'maintainer');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('choice', 'selectOne', 'check', 'number', 'selectMultiple');

-- CreateTable
CREATE TABLE "public"."asset" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "created_by" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "last_maintenance" TIMESTAMP(3),
    "last_maintainee" TEXT[],
    "location" TEXT,
    "next_maintenance" TIMESTAMP(3),
    "status_uid" TEXT,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "person_in_charge" TEXT,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."asset_status" (
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "asset_status_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."asset_tags" (
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "asset_uid" TEXT NOT NULL,
    "asset_tags_library_uid" TEXT NOT NULL,

    CONSTRAINT "asset_tags_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."asset_tags_library" (
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "asset_tags_library_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."asset_type" (
    "uid" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "asset_type_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."checklist" (
    "uid" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "maintenance_uid" TEXT NOT NULL,

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."checklist_library" (
    "uid" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,

    CONSTRAINT "checklist_library_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."checklist_use" (
    "uid" TEXT NOT NULL,
    "created_on" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3),
    "updated_by" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "checklist_library_uid" TEXT,
    "asset_uid" TEXT NOT NULL,

    CONSTRAINT "checklist_use_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."history" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_on" TIMESTAMP(3) NOT NULL,
    "activity" TEXT NOT NULL,
    "action_by" TEXT NOT NULL,
    "action_on" TIMESTAMP(3) NOT NULL,
    "task_uid" TEXT,
    "subtask_uid" TEXT,
    "maintenance_uid" TEXT,
    "asset_uid" TEXT,
    "subtask_use_uid" TEXT,
    "task_use" TEXT,
    "checklist_use" TEXT,
    "subtask_library_uid" TEXT,
    "task_library_uid" TEXT,
    "checklist_library_uid" TEXT,
    "asset_tags_library" TEXT,
    "asset_type_uid" TEXT,
    "asset_tags_uid" TEXT,
    "user_uid" TEXT,

    CONSTRAINT "history_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."maintenance" (
    "uid" TEXT NOT NULL,
    "asset_uid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "maintainee" TEXT,
    "attachment_path" TEXT,
    "approved_by" TEXT,
    "approved_on" TIMESTAMP(3),

    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."subtask" (
    "uid" TEXT NOT NULL,
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "issue" TEXT,
    "deadline" TIMESTAMP(3),
    "completed_by" TEXT,
    "task_uid" TEXT NOT NULL,
    "task_order" SMALLINT NOT NULL,
    "task_type" "public"."TaskType" DEFAULT 'choice',
    "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_number_val" SMALLINT,
    "task_check" BOOLEAN,
    "task_selected" TEXT[],
    "task_bool" BOOLEAN DEFAULT false,

    CONSTRAINT "subtask_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."subtask_library" (
    "uid" TEXT NOT NULL,
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "task_order" BIGINT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "subtask_library_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."subtask_use" (
    "uid" TEXT NOT NULL,
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "task_use_uid" TEXT NOT NULL,
    "task_order" SMALLINT NOT NULL,
    "subtask_library_uid" TEXT,

    CONSTRAINT "subtask_use_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."task" (
    "uid" TEXT NOT NULL,
    "task_activity" TEXT,
    "description" TEXT,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "issue" TEXT,
    "deadline" TIMESTAMP(3),
    "completed_by" TEXT,
    "task_order" SMALLINT NOT NULL,
    "have_subtask" BOOLEAN NOT NULL DEFAULT false,
    "checklist_uid" TEXT NOT NULL,
    "task_type" "public"."TaskType" NOT NULL DEFAULT 'check',
    "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_bool" BOOLEAN,
    "task_selected" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_number_val" SMALLINT,
    "task_check" BOOLEAN DEFAULT false,

    CONSTRAINT "task2_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."task_library" (
    "uid" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "have_subtask" BOOLEAN NOT NULL,
    "task_order" BIGINT NOT NULL,

    CONSTRAINT "task_library_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."task_use" (
    "uid" TEXT NOT NULL,
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "task_order" SMALLINT NOT NULL,
    "have_subtask" BOOLEAN NOT NULL DEFAULT false,
    "checklist_use_uid" TEXT NOT NULL,
    "task_library_uid" TEXT,

    CONSTRAINT "task_use_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_request" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "first_page" SMALLINT NOT NULL,
    "enable_dashboard" BOOLEAN NOT NULL DEFAULT false,
    "is_dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "department" "public"."Department" DEFAULT 'management',
    "role" "public"."Role" DEFAULT 'maintainer',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "public"."session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "session_access_token_key" ON "public"."session"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_request_token_key" ON "public"."verification_request"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_person_in_charge_fkey" FOREIGN KEY ("person_in_charge") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_status_uid_fkey" FOREIGN KEY ("status_uid") REFERENCES "public"."asset_status"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."asset_type"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags" ADD CONSTRAINT "asset_tags_asset_tags_library_uid_fkey" FOREIGN KEY ("asset_tags_library_uid") REFERENCES "public"."asset_tags_library"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags" ADD CONSTRAINT "asset_tags_asset_uid_fkey" FOREIGN KEY ("asset_uid") REFERENCES "public"."asset"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags_library" ADD CONSTRAINT "asset_tags_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags_library" ADD CONSTRAINT "asset_tags_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_maintenance_uid_fkey" FOREIGN KEY ("maintenance_uid") REFERENCES "public"."maintenance"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_asset_uid_fkey" FOREIGN KEY ("asset_uid") REFERENCES "public"."asset"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_checklist_library_uid_fkey" FOREIGN KEY ("checklist_library_uid") REFERENCES "public"."checklist_library"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."history" ADD CONSTRAINT "history_action_by_fkey" FOREIGN KEY ("action_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_asset_uid_fkey" FOREIGN KEY ("asset_uid") REFERENCES "public"."asset"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask" ADD CONSTRAINT "subtask_task_uid_fkey" FOREIGN KEY ("task_uid") REFERENCES "public"."task"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_use" ADD CONSTRAINT "subtask_use_subtask_library_uid_fkey" FOREIGN KEY ("subtask_library_uid") REFERENCES "public"."subtask_library"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_use" ADD CONSTRAINT "subtask_use_task_use_uid_fkey" FOREIGN KEY ("task_use_uid") REFERENCES "public"."task_use"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task" ADD CONSTRAINT "task_checklist_uid_fkey" FOREIGN KEY ("checklist_uid") REFERENCES "public"."checklist"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_use" ADD CONSTRAINT "task_use_checklist_use_uid_fkey" FOREIGN KEY ("checklist_use_uid") REFERENCES "public"."checklist_use"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_use" ADD CONSTRAINT "task_use_task_library_uid_fkey" FOREIGN KEY ("task_library_uid") REFERENCES "public"."task_library"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
