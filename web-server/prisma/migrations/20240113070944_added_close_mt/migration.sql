/*
  Warnings:

  - You are about to drop the column `title` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `is_complete` on the `maintenance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."checklist" DROP COLUMN "title",
ADD COLUMN     "is_close" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."maintenance" DROP COLUMN "is_complete",
ADD COLUMN     "closed_by" TEXT,
ADD COLUMN     "is_close" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_closed_by_fkey" FOREIGN KEY ("closed_by") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
