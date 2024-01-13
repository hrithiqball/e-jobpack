/*
  Warnings:

  - Added the required column `asset_id` to the `checklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."checklist" ADD COLUMN     "asset_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."checklist" ADD CONSTRAINT "checklist_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
