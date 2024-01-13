/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT "account_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_person_in_charge_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_tags_library" DROP CONSTRAINT "asset_tags_library_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_tags_library" DROP CONSTRAINT "asset_tags_library_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_type" DROP CONSTRAINT "asset_type_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_type" DROP CONSTRAINT "asset_type_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist" DROP CONSTRAINT "checklist_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist" DROP CONSTRAINT "checklist_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_library" DROP CONSTRAINT "checklist_library_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_library" DROP CONSTRAINT "checklist_library_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."history" DROP CONSTRAINT "history_action_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_library" DROP CONSTRAINT "subtask_library_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_library" DROP CONSTRAINT "subtask_library_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_library" DROP CONSTRAINT "task_library_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_library" DROP CONSTRAINT "task_library_updated_by_fkey";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
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
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_person_in_charge_fkey" FOREIGN KEY ("person_in_charge") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags_library" ADD CONSTRAINT "asset_tags_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags_library" ADD CONSTRAINT "asset_tags_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_library" ADD CONSTRAINT "checklist_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."history" ADD CONSTRAINT "history_action_by_fkey" FOREIGN KEY ("action_by") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
