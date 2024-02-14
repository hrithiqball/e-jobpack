-- AlterTable
ALTER TABLE "public"."asset" ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "public"."maintenance" ADD COLUMN     "asset_ids" TEXT[],
ADD COLUMN     "deadline" TIMESTAMP(3),
ALTER COLUMN "asset_uid" DROP NOT NULL;
