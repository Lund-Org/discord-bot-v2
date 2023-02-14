/*
  Warnings:

  - Added the required column `leagueId` to the `SportTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SportTeam` ADD COLUMN `leagueId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SportTeam` ADD CONSTRAINT `SportTeam_leagueId_fkey` FOREIGN KEY (`leagueId`) REFERENCES `SportLeague`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
