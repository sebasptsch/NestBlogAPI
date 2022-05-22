/*
  Warnings:

  - You are about to drop the column `mimetype` on the `images` table. All the data in the column will be lost.
  - Added the required column `name` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "mimetype",
ADD COLUMN     "name" TEXT NOT NULL;
