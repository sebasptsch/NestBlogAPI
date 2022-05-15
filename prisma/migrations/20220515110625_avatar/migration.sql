/*
  Warnings:

  - A unique constraint covering the columns `[avatarUserId]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "avatarUserId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "images_avatarUserId_key" ON "images"("avatarUserId");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_avatarUserId_fkey" FOREIGN KEY ("avatarUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
