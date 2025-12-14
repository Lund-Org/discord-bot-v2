/*
  Warnings:

  - You are about to drop the column `playerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_playerId_fkey`;

-- AlterTable
ALTER TABLE `Player` ADD COLUMN `userId` INTEGER NULL;

-- Set the userId in the Player table
UPDATE `Player`
INNER JOIN User ON User.playerId = Player.id
SET `userId` = User.id;

-- Change the column as not nullable
ALTER TABLE `Player` CHANGE COLUMN `userId` `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `playerId`;

-- CreateIndex
CREATE UNIQUE INDEX `Player_userId_key` ON `Player`(`userId`);

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
