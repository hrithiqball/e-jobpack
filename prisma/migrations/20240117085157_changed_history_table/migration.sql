/*
  Warnings:

  - The primary key for the `history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `asset_tags_library` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `asset_tags_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `asset_type_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `asset_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `checklist_library_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `checklist_use` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `created_on` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `maintenance_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `subtask_library_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `subtask_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `subtask_use_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `task_library_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `task_uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `task_use` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `user_uid` on the `history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."asset" ADD COLUMN     "is_archive" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "public"."history" DROP CONSTRAINT "history_pkey",
DROP COLUMN "asset_tags_library",
DROP COLUMN "asset_tags_uid",
DROP COLUMN "asset_type_uid",
DROP COLUMN "asset_uid",
DROP COLUMN "checklist_library_uid",
DROP COLUMN "checklist_use",
DROP COLUMN "created_on",
DROP COLUMN "maintenance_uid",
DROP COLUMN "subtask_library_uid",
DROP COLUMN "subtask_uid",
DROP COLUMN "subtask_use_uid",
DROP COLUMN "task_library_uid",
DROP COLUMN "task_uid",
DROP COLUMN "task_use",
DROP COLUMN "uid",
DROP COLUMN "user_uid",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "action_on" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "history_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."maintenance" ADD COLUMN     "closed_on" TIMESTAMP(3),
ADD COLUMN     "is_open" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requested_by" TEXT,
ADD COLUMN     "requested_on" TIMESTAMP(3);
