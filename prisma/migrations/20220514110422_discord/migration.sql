/*
  Warnings:

  - The values [GOOGLE] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('DISCORD', 'GITHUB', 'LOCAL');
ALTER TABLE "accounts" ALTER COLUMN "provider" TYPE "AccountType_new" USING ("provider"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
COMMIT;
