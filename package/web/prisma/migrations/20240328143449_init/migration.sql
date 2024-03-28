-- CreateEnum
CREATE TYPE "public"."Department" AS ENUM ('INSTRUMENT', 'ELECTRICAL', 'MECHANICAL', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SUPERVISOR', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('CHOICE', 'NUMBER', 'CHECK', 'MULTIPLE_SELECT', 'SINGLE_SELECT');

-- CreateEnum
CREATE TYPE "public"."HistoryMeta" AS ENUM ('ASSET', 'MAINTENANCE', 'USER');

-- CreateEnum
CREATE TYPE "public"."MaintenanceStatus" AS ENUM ('REQUESTED', 'REJECTED', 'ACCEPTED', 'OPENED', 'CLOSED', 'APPROVED');

-- CreateTable
CREATE TABLE "public"."asset" (
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT NOT NULL,
    "last_maintenance" TIMESTAMP(3),
    "last_maintainee" TEXT[],
    "location" TEXT,
    "next_maintenance" TIMESTAMP(3),
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "person_in_charge_id" TEXT,
    "tag" TEXT,
    "id" TEXT NOT NULL,
    "status_id" TEXT,
    "is_archive" BOOLEAN DEFAULT false,
    "attachment_path" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "asset_cover" TEXT,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_status" (
    "title" TEXT NOT NULL,
    "color" TEXT,
    "id" TEXT NOT NULL,

    CONSTRAINT "asset_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_tags" (
    "title" TEXT NOT NULL,
    "color" TEXT,
    "asset_id" TEXT NOT NULL,
    "asset_tags_library_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "asset_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_type" (
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "id" TEXT NOT NULL,

    CONSTRAINT "asset_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklist" (
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT NOT NULL,
    "is_close" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "asset_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "maintenance_id" TEXT NOT NULL,
    "attachment_path" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklist_library" (
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL,
    "maintenance_library_id" TEXT,
    "asset_id" TEXT,

    CONSTRAINT "checklist_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."history" (
    "activity" TEXT NOT NULL,
    "action_by" TEXT NOT NULL,
    "action_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "history_meta" "public"."HistoryMeta" NOT NULL,
    "meta_value" TEXT,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance" (
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maintainee" TEXT,
    "approved_by_id" TEXT NOT NULL,
    "approved_on" TIMESTAMP(3),
    "asset_ids" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "id" TEXT NOT NULL,
    "is_close" BOOLEAN NOT NULL DEFAULT false,
    "closed_by_id" TEXT,
    "closed_on" TIMESTAMP(3),
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "requested_by_id" TEXT,
    "requested_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_rejected" BOOLEAN NOT NULL DEFAULT false,
    "rejected_by_id" TEXT,
    "is_requested" BOOLEAN NOT NULL DEFAULT false,
    "rejected_on" TIMESTAMP(3),
    "accepted_by_id" TEXT,
    "accepted_on" TIMESTAMP(3),
    "maintenance_status" "public"."MaintenanceStatus" NOT NULL DEFAULT 'REQUESTED',
    "rejected_reason" TEXT,
    "attachment_path" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance_library" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subtask" (
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "issue" TEXT,
    "deadline" TIMESTAMP(3),
    "completed_by" TEXT,
    "task_order" SMALLINT NOT NULL,
    "task_type" "public"."TaskType" NOT NULL DEFAULT 'CHECK',
    "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_number_val" SMALLINT,
    "task_check" BOOLEAN DEFAULT false,
    "task_selected" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "id" TEXT NOT NULL,
    "taskBool" BOOLEAN DEFAULT false,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "subtask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subtask_library" (
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "task_library_id" TEXT,
    "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_type" "public"."TaskType" NOT NULL DEFAULT 'CHECK',
    "task_order" SMALLINT NOT NULL,

    CONSTRAINT "subtask_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task" (
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "issue" TEXT,
    "deadline" TIMESTAMP(3),
    "completed_by" TEXT,
    "task_order" SMALLINT NOT NULL,
    "have_subtask" BOOLEAN NOT NULL DEFAULT false,
    "task_type" "public"."TaskType" NOT NULL DEFAULT 'CHECK',
    "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_bool" BOOLEAN,
    "task_selected" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_number_val" SMALLINT,
    "task_check" BOOLEAN DEFAULT false,
    "checklist_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "task2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_library" (
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "task_activity" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL,
    "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task_type" "public"."TaskType" NOT NULL DEFAULT 'CHECK',
    "checklist_library_id" TEXT,
    "task_order" SMALLINT NOT NULL,

    CONSTRAINT "task_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" TIMESTAMP(3),
    "provider" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department" "public"."Department" NOT NULL DEFAULT 'MANAGEMENT',
    "role" "public"."Role" NOT NULL DEFAULT 'TECHNICIAN',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_rejected" BOOLEAN NOT NULL DEFAULT false,
    "department_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_assignee" (
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "task_assignee_pkey" PRIMARY KEY ("task_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."maintenance_member" (
    "maintenanceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "maintenance_member_pkey" PRIMARY KEY ("maintenanceId","userId")
);

-- CreateTable
CREATE TABLE "public"."department_enum" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "department_enum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "company" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "contractor_type_id" TEXT,

    CONSTRAINT "contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor_type" (
    "id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "contractor_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_request_token_key" ON "public"."verification_request"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_person_in_charge_id_fkey" FOREIGN KEY ("person_in_charge_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."asset_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."asset_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags" ADD CONSTRAINT "asset_tags_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "public"."maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_maintenance_library_id_fkey" FOREIGN KEY ("maintenance_library_id") REFERENCES "public"."maintenance_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."history" ADD CONSTRAINT "history_action_by_fkey" FOREIGN KEY ("action_by") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_accepted_by_id_fkey" FOREIGN KEY ("accepted_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_closed_by_id_fkey" FOREIGN KEY ("closed_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_library" ADD CONSTRAINT "maintenance_library_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_library" ADD CONSTRAINT "maintenance_library_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask" ADD CONSTRAINT "subtask_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_task_library_id_fkey" FOREIGN KEY ("task_library_id") REFERENCES "public"."task_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task" ADD CONSTRAINT "task_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_checklist_library_id_fkey" FOREIGN KEY ("checklist_library_id") REFERENCES "public"."checklist_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "public_user_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department_enum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_assignee" ADD CONSTRAINT "public_task_assignee_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_assignee" ADD CONSTRAINT "public_task_assignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_member" ADD CONSTRAINT "public_maintenance_member_maintenance_id_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "public"."maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_member" ADD CONSTRAINT "public_maintenance_member_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contractor" ADD CONSTRAINT "public_contractor_contractor_type_id_fkey" FOREIGN KEY ("contractor_type_id") REFERENCES "public"."contractor_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."contractor_type" ADD CONSTRAINT "public_contractor_type_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."contractor_type" ADD CONSTRAINT "public_contractor_type_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
