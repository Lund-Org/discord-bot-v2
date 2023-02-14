/*
  Warnings:

  - You are about to drop the column `leagueId` on the `SportTeam` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,sportApiId,year]` on the table `SportTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `SportTeam` DROP FOREIGN KEY `SportTeam_leagueId_fkey`;

-- DropIndex
DROP INDEX `SportTeam_name_sportApiId_leagueId_key` ON `SportTeam`;

-- AlterTable
ALTER TABLE `SportTeam` DROP COLUMN `leagueId`;

-- CreateTable
CREATE TABLE `_SportLeagueToSportTeam` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SportLeagueToSportTeam_AB_unique`(`A`, `B`),
    INDEX `_SportLeagueToSportTeam_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SportTeam_name_sportApiId_year_key` ON `SportTeam`(`name`, `sportApiId`, `year`);

-- AddForeignKey
ALTER TABLE `_SportLeagueToSportTeam` ADD CONSTRAINT `_SportLeagueToSportTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `SportLeague`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SportLeagueToSportTeam` ADD CONSTRAINT `_SportLeagueToSportTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `SportTeam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
