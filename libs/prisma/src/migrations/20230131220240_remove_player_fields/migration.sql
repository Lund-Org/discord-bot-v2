/*
  Warnings:

  - You are about to drop the column `discordId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `twitchUsername` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Player` DROP FOREIGN KEY `Player_userId_fkey`;

-- DropIndex
DROP INDEX `Player_discordId_key` ON `Player`;

-- DropIndex
DROP INDEX `Player_twitchUsername_key` ON `Player`;

-- AlterTable
ALTER TABLE `Player` DROP COLUMN `discordId`,
    DROP COLUMN `twitchUsername`,
    DROP COLUMN `username`;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
