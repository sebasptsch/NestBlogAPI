-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "imageId" INTEGER;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
