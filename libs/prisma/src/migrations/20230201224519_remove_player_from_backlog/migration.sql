/*
  Warnings:

  - You are about to drop the column `playerId` on the `BacklogItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,igdbGameId]` on the table `BacklogItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `BacklogItem` DROP FOREIGN KEY `BacklogItem_playerId_fkey`;

-- DropIndex
DROP INDEX `BacklogItem_playerId_igdbGameId_key` ON `BacklogItem`;

-- AlterTable
ALTER TABLE `BacklogItem` DROP COLUMN `playerId`;

-- CreateIndex
CREATE UNIQUE INDEX `BacklogItem_userId_igdbGameId_key` ON `BacklogItem`(`userId`, `igdbGameId`);
