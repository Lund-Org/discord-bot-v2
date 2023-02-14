/*
  Warnings:

  - A unique constraint covering the columns `[name,sportApiId,leagueId]` on the table `SportTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `SportTeam_name_sportApiId_year_key` ON `SportTeam`;

-- CreateIndex
CREATE UNIQUE INDEX `SportTeam_name_sportApiId_leagueId_key` ON `SportTeam`(`name`, `sportApiId`, `leagueId`);
