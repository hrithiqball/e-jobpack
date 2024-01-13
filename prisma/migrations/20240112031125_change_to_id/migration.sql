/*
  Warnings:

  - The values [management,exploration] on the enum `Department` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,supervisor,maintainer] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `provider_account_id` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `provider_type` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `account` table. All the data in the column will be lost.
  - The primary key for the `asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status_uid` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `asset` table. All the data in the column will be lost.
  - The primary key for the `asset_status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `asset_status` table. All the data in the column will be lost.
  - The primary key for the `asset_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `asset_tags_library_uid` on the `asset_tags` table. All the data in the column will be lost.
  - You are about to drop the column `asset_uid` on the `asset_tags` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `asset_tags` table. All the data in the column will be lost.
  - The primary key for the `asset_tags_library` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `asset_tags_library` table. All the data in the column will be lost.
  - The primary key for the `asset_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `asset_type` table. All the data in the column will be lost.
  - The primary key for the `checklist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `maintenance_uid` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `checklist` table. All the data in the column will be lost.
  - The primary key for the `checklist_library` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `checklist_library` table. All the data in the column will be lost.
  - The primary key for the `checklist_use` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `asset_uid` on the `checklist_use` table. All the data in the column will be lost.
  - You are about to drop the column `checklist_library_uid` on the `checklist_use` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `checklist_use` table. All the data in the column will be lost.
  - The primary key for the `maintenance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `asset_uid` on the `maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `maintenance` table. All the data in the column will be lost.
  - The primary key for the `subtask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `task_bool` on the `subtask` table. All the data in the column will be lost.
  - You are about to drop the column `task_uid` on the `subtask` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `subtask` table. All the data in the column will be lost.
  - The primary key for the `subtask_library` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `subtask_library` table. All the data in the column will be lost.
  - The primary key for the `subtask_use` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subtask_library_uid` on the `subtask_use` table. All the data in the column will be lost.
  - You are about to drop the column `task_use_uid` on the `subtask_use` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `subtask_use` table. All the data in the column will be lost.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `checklist_uid` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `task` table. All the data in the column will be lost.
  - The primary key for the `task_library` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `task_library` table. All the data in the column will be lost.
  - The primary key for the `task_use` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `checklist_use_uid` on the `task_use` table. All the data in the column will be lost.
  - You are about to drop the column `task_library_uid` on the `task_use` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `task_use` table. All the data in the column will be lost.
  - You are about to drop the column `enable_dashboard` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `first_page` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `is_dark_mode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `asset_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_id` to the `asset_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_tags_library_id` to the `asset_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `asset_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `asset_tags_library` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `asset_type` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id` to the `checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maintenance_id` to the `checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `checklist_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_id` to the `checklist_use` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `checklist_use` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `maintenance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id` to the `subtask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_id` to the `subtask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `subtask_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `subtask_use` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_use_id` to the `subtask_use` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checklist_id` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `task_library` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checklist_use_id` to the `task_use` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `task_use` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Department_new" AS ENUM ('INSTRUMENT', 'ELECTRICAL', 'MECHANICAL', 'MANAGEMENT');
ALTER TABLE "public"."user" ALTER COLUMN "department" DROP DEFAULT;
ALTER TABLE "public"."user" ALTER COLUMN "department" TYPE "public"."Department_new" USING ("department"::text::"public"."Department_new");
ALTER TYPE "public"."Department" RENAME TO "Department_old";
ALTER TYPE "public"."Department_new" RENAME TO "Department";
DROP TYPE "public"."Department_old";
ALTER TABLE "public"."user" ALTER COLUMN "department" SET DEFAULT 'MANAGEMENT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'SUPERVISOR', 'TECHNICIAN');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."user" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TaskType" ADD VALUE 'CHOICE';
ALTER TYPE "public"."TaskType" ADD VALUE 'NUMBER';
ALTER TYPE "public"."TaskType" ADD VALUE 'CHECK';
ALTER TYPE "public"."TaskType" ADD VALUE 'MULTIPLE_SELECT';
ALTER TYPE "public"."TaskType" ADD VALUE 'SINGLE_SELECT';

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_status_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_type_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_tags" DROP CONSTRAINT "asset_tags_asset_tags_library_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset_tags" DROP CONSTRAINT "asset_tags_asset_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist" DROP CONSTRAINT "checklist_asset_fk";

-- DropForeignKey
ALTER TABLE "public"."checklist" DROP CONSTRAINT "checklist_maintenance_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_asset_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_checklist_library_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."maintenance" DROP CONSTRAINT "maintenance_asset_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask" DROP CONSTRAINT "subtask_task_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_use" DROP CONSTRAINT "subtask_use_subtask_library_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."subtask_use" DROP CONSTRAINT "subtask_use_task_use_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."task" DROP CONSTRAINT "task_checklist_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_use" DROP CONSTRAINT "task_use_checklist_use_uid_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_use" DROP CONSTRAINT "task_use_task_library_uid_fkey";

-- AlterTable
ALTER TABLE "public"."account" DROP COLUMN "created_at",
DROP COLUMN "provider_account_id",
DROP COLUMN "provider_id",
DROP COLUMN "provider_type",
DROP COLUMN "updated_at",
ADD COLUMN     "provider" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_pkey",
DROP COLUMN "status_uid",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "status_id" TEXT,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "asset_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."asset_status" DROP CONSTRAINT "asset_status_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "asset_status_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."asset_tags" DROP CONSTRAINT "asset_tags_pkey",
DROP COLUMN "asset_tags_library_uid",
DROP COLUMN "asset_uid",
DROP COLUMN "uid",
ADD COLUMN     "asset_id" TEXT NOT NULL,
ADD COLUMN     "asset_tags_library_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "asset_tags_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."asset_tags_library" DROP CONSTRAINT "asset_tags_library_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "asset_tags_library_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."asset_type" DROP CONSTRAINT "asset_type_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "asset_type_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."checklist" DROP CONSTRAINT "checklist_pkey",
DROP COLUMN "maintenance_uid",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "maintenance_id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "checklist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."checklist_library" DROP CONSTRAINT "checklist_library_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "checklist_library_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."checklist_use" DROP CONSTRAINT "checklist_use_pkey",
DROP COLUMN "asset_uid",
DROP COLUMN "checklist_library_uid",
DROP COLUMN "uid",
ADD COLUMN     "asset_id" TEXT NOT NULL,
ADD COLUMN     "checklist_library_id" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "checklist_use_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."maintenance" DROP CONSTRAINT "maintenance_pkey",
DROP COLUMN "asset_uid",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "is_complete" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."subtask" DROP CONSTRAINT "subtask_pkey",
DROP COLUMN "task_bool",
DROP COLUMN "task_uid",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "taskBool" BOOLEAN DEFAULT false,
ADD COLUMN     "task_id" TEXT NOT NULL,
ALTER COLUMN "task_check" SET DEFAULT false,
ALTER COLUMN "task_selected" SET DEFAULT ARRAY[]::TEXT[],
ADD CONSTRAINT "subtask_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."subtask_library" DROP CONSTRAINT "subtask_library_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "subtask_library_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."subtask_use" DROP CONSTRAINT "subtask_use_pkey",
DROP COLUMN "subtask_library_uid",
DROP COLUMN "task_use_uid",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "subtask_library_id" TEXT,
ADD COLUMN     "task_use_id" TEXT NOT NULL,
ADD CONSTRAINT "subtask_use_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."task" DROP CONSTRAINT "task2_pkey",
DROP COLUMN "checklist_uid",
DROP COLUMN "uid",
ADD COLUMN     "checklist_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "task_bool" SET DEFAULT false,
ADD CONSTRAINT "task2_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."task_library" DROP CONSTRAINT "task_library_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "created_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_on" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "have_subtask" SET DEFAULT false,
ADD CONSTRAINT "task_library_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."task_use" DROP CONSTRAINT "task_use_pkey",
DROP COLUMN "checklist_use_uid",
DROP COLUMN "task_library_uid",
DROP COLUMN "uid",
ADD COLUMN     "checklist_use_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "task_library_id" TEXT,
ADD CONSTRAINT "task_use_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "enable_dashboard",
DROP COLUMN "first_page",
DROP COLUMN "is_dark_mode",
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "department" SET DEFAULT 'MANAGEMENT',
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "public"."session";

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."asset_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."asset_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags" ADD CONSTRAINT "asset_tags_asset_tags_library_id_fkey" FOREIGN KEY ("asset_tags_library_id") REFERENCES "public"."asset_tags_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_tags" ADD CONSTRAINT "asset_tags_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "public"."maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_use" ADD CONSTRAINT "checklist_use_checklist_library_id_fkey" FOREIGN KEY ("checklist_library_id") REFERENCES "public"."checklist_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask" ADD CONSTRAINT "subtask_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_use" ADD CONSTRAINT "subtask_use_subtask_library_id_fkey" FOREIGN KEY ("subtask_library_id") REFERENCES "public"."subtask_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subtask_use" ADD CONSTRAINT "subtask_use_task_use_id_fkey" FOREIGN KEY ("task_use_id") REFERENCES "public"."task_use"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task" ADD CONSTRAINT "task_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_use" ADD CONSTRAINT "task_use_checklist_use_id_fkey" FOREIGN KEY ("checklist_use_id") REFERENCES "public"."checklist_use"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_use" ADD CONSTRAINT "task_use_task_library_id_fkey" FOREIGN KEY ("task_library_id") REFERENCES "public"."task_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
