/*
  Warnings:

  - The values [choice,selectOne,check,number,selectMultiple] on the enum `TaskType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_by` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `person_in_charge` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `asset_type` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `asset_type` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `checklist_library` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `checklist_library` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `checklist_library` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `checklist_library` table. All the data in the column will be lost.
  - You are about to drop the column `approved_by` on the `maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `closed_by` on the `maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `requested_by` on the `maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `subtask_library` table. All the data in the column will be lost.
  - You are about to drop the column `task_order` on the `subtask_library` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `subtask_library` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `task_library` table. All the data in the column will be lost.
  - You are about to drop the column `have_subtask` on the `task_library` table. All the data in the column will be lost.
  - You are about to drop the column `task_order` on the `task_library` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `task_library` table. All the data in the column will be lost.
  - You are about to drop the `asset_tags_library` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checklist_use` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subtask_use` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_use` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by_id` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `asset_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `asset_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `checklist_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `checklist_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `history_meta` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approved_by_id` to the `maintenance` table without a default value. This is not possible if the table is not empty.
  - Made the column `start_date` on table `maintenance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `task_type` on table `subtask` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `created_by_id` to the `subtask_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `subtask_library` table without a default value. This is not possible if the table is not empty.
  - Made the column `task_activity` on table `task` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `created_by_id` to the `task_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `task_library` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."HistoryMeta" AS ENUM ('ASSET', 'MAINTENANCE', 'USER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TaskType_new" AS ENUM ('CHOICE', 'NUMBER', 'CHECK', 'MULTIPLE_SELECT', 'SINGLE_SELECT');
ALTER TABLE "public"."subtask" ALTER COLUMN "task_type" DROP DEFAULT;
ALTER TABLE "public"."task" ALTER COLUMN "task_type" DROP DEFAULT;
ALTER TABLE "public"."subtask" ALTER COLUMN "task_type" TYPE "public"."TaskType_new" USING ("task_type"::text::"public"."TaskType_new");
ALTER TABLE "public"."subtask_library" ALTER COLUMN "task_type" TYPE "public"."TaskType_new" USING ("task_type"::text::"public"."TaskType_new");
ALTER TABLE "public"."task" ALTER COLUMN "task_type" TYPE "public"."TaskType_new" USING ("task_type"::text::"public"."TaskType_new");
ALTER TABLE "public"."task_library" ALTER COLUMN "task_type" TYPE "public"."TaskType_new" USING ("task_type"::text::"public"."TaskType_new");
ALTER TYPE "public"."TaskType" RENAME TO "TaskType_old";
ALTER TYPE "public"."TaskType_new" RENAME TO "TaskType";
DROP TYPE "public"."TaskType_old";
ALTER TABLE "public"."subtask" ALTER COLUMN "task_type" SET DEFAULT 'CHECK';
ALTER TABLE "public"."task" ALTER COLUMN "task_type" SET DEFAULT 'CHECK';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_person_in_charge_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_tags" DROP CONSTRAINT "asset_tags_asset_tags_library_id_fkey";

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
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_checklist_library_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance" DROP CONSTRAINT "maintenance_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance" DROP CONSTRAINT "maintenance_closed_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_library" DROP CONSTRAINT "subtask_library_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_library" DROP CONSTRAINT "subtask_library_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_use" DROP CONSTRAINT "subtask_use_subtask_library_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_use" DROP CONSTRAINT "subtask_use_task_use_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_library" DROP CONSTRAINT "task_library_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_library" DROP CONSTRAINT "task_library_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_use" DROP CONSTRAINT "task_use_checklist_use_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_use" DROP CONSTRAINT "task_use_task_library_id_fkey";

-- AlterTable
ALTER TABLE "public"."asset" DROP COLUMN "created_by",
DROP COLUMN "person_in_charge",
DROP COLUMN "updated_by",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "person_in_charge_id" TEXT,
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."asset_type" DROP COLUMN "created_by",
DROP COLUMN "updated_by",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."checklist" DROP COLUMN "created_by",
DROP COLUMN "updated_by",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."checklist_library" DROP COLUMN "color",
DROP COLUMN "created_by",
DROP COLUMN "icon",
DROP COLUMN "updated_by",
ADD COLUMN     "asset_id" TEXT,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "maintenance_library_id" TEXT,
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."history" ADD COLUMN     "history_meta" "public"."HistoryMeta" NOT NULL,
ADD COLUMN     "meta_value" TEXT;

-- AlterTable
ALTER TABLE "public"."maintenance" DROP COLUMN "approved_by",
DROP COLUMN "closed_by",
DROP COLUMN "requested_by",
ADD COLUMN     "approved_by_id" TEXT NOT NULL,
ADD COLUMN     "closed_by_id" TEXT,
ADD COLUMN     "is_rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_requested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reject_reason" TEXT,
ADD COLUMN     "rejected_by_id" TEXT,
ADD COLUMN     "rejected_on" TIMESTAMP(3),
ADD COLUMN     "requested_by_id" TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "start_date" SET NOT NULL,
ALTER COLUMN "requested_on" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."subtask" ALTER COLUMN "task_type" SET NOT NULL,
ALTER COLUMN "task_type" SET DEFAULT 'CHECK';

-- AlterTable
ALTER TABLE "public"."subtask_library" DROP COLUMN "created_by",
DROP COLUMN "task_order",
DROP COLUMN "updated_by",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "task_library_id" TEXT,
ADD COLUMN     "task_type" "public"."TaskType" NOT NULL DEFAULT 'CHECK',
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."task" ALTER COLUMN "task_activity" SET NOT NULL,
ALTER COLUMN "task_type" SET DEFAULT 'CHECK';

-- AlterTable
ALTER TABLE "public"."task_library" DROP COLUMN "created_by",
DROP COLUMN "have_subtask",
DROP COLUMN "task_order",
DROP COLUMN "updated_by",
ADD COLUMN     "checklistLibraryId" TEXT,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "list_choice" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "task_type" "public"."TaskType" NOT NULL DEFAULT 'CHECK',
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."asset_tags_library";

-- DropTable
DROP TABLE "public"."checklist_use";

-- DropTable
DROP TABLE "public"."subtask_use";

-- DropTable
DROP TABLE "public"."task_use";

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

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_person_in_charge_id_fkey" FOREIGN KEY ("person_in_charge_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_type" ADD CONSTRAINT "asset_type_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_task_library_id_fkey" FOREIGN KEY ("task_library_id") REFERENCES "public"."task_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_library" ADD CONSTRAINT "subtask_library_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_checklistLibraryId_fkey" FOREIGN KEY ("checklistLibraryId") REFERENCES "public"."checklist_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_library" ADD CONSTRAINT "task_library_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
