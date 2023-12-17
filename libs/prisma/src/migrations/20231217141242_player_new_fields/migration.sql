/*
  Warnings:

  - A unique constraint covering the columns `[finishRank]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Player` ADD COLUMN `finishRank` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Player_finishRank_key` ON `Player`(`finishRank`);
