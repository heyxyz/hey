/*
  Warnings:

  - The values [KILL_SWITCH] on the enum `FeatureType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeatureType_new" AS ENUM ('FEATURE', 'PERMISSION', 'MODE');
ALTER TABLE "Feature" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Feature" ALTER COLUMN "type" TYPE "FeatureType_new" USING ("type"::text::"FeatureType_new");
ALTER TYPE "FeatureType" RENAME TO "FeatureType_old";
ALTER TYPE "FeatureType_new" RENAME TO "FeatureType";
DROP TYPE "FeatureType_old";
ALTER TABLE "Feature" ALTER COLUMN "type" SET DEFAULT 'FEATURE';
COMMIT;
