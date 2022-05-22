-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
