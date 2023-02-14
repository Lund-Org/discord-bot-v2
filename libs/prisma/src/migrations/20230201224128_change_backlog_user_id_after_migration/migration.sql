/*
  Warnings:

  - Made the column `userId` on table `BacklogItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `BacklogItem` DROP FOREIGN KEY `BacklogItem_userId_fkey`;

-- AlterTable
ALTER TABLE `BacklogItem` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `BacklogItem` ADD CONSTRAINT `BacklogItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
