-- AlterTable
ALTER TABLE "public"."Status" ALTER COLUMN "hasDrunk" DROP DEFAULT;
ALTER TABLE "Status" ADD COLUMN "hasDrunk" BOOLEAN NOT NULL;
