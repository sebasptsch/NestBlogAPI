/*
  Warnings:

  - You are about to drop the column `avatarUserId` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_avatarUserId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_imageId_fkey";

-- DropIndex
DROP INDEX "images_avatarUserId_key";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "avatarUserId";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "imageId",
ADD COLUMN     "bannerSrc" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarSrc" TEXT;
