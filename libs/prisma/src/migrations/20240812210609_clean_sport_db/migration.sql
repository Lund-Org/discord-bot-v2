/*
  Warnings:

  - The values [FOOTBALL,NBA,MOTORSPORT] on the enum `DiscordNotificationChannel_notificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_sportleaguetosportteam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_sportleaguetouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_sportteamtouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sportevent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sportleague` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sportteam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_SportLeagueToSportTeam` DROP FOREIGN KEY `_SportLeagueToSportTeam_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SportLeagueToSportTeam` DROP FOREIGN KEY `_SportLeagueToSportTeam_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SportLeagueToUser` DROP FOREIGN KEY `_SportLeagueToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SportLeagueToUser` DROP FOREIGN KEY `_SportLeagueToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SportTeamToUser` DROP FOREIGN KEY `_SportTeamToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SportTeamToUser` DROP FOREIGN KEY `_SportTeamToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `SportEvent` DROP FOREIGN KEY `SportEvent_leagueId_fkey`;

-- DropForeignKey
ALTER TABLE `SportEvent` DROP FOREIGN KEY `SportEvent_teamAId_fkey`;

-- DropForeignKey
ALTER TABLE `SportEvent` DROP FOREIGN KEY `SportEvent_teamBId_fkey`;

-- Clean notification channels
DELETE FROM `DiscordNotificationChannel` WHERE `notificationType` IN ('FOOTBALL', 'NBA', 'MOTORSPORT');

-- AlterTable
ALTER TABLE `DiscordNotificationChannel` MODIFY `notificationType` ENUM('BIRTHDAY', 'MEME', 'SHOP') NOT NULL;

-- DropTable
DROP TABLE `_SportLeagueToSportTeam`;

-- DropTable
DROP TABLE `_SportLeagueToUser`;

-- DropTable
DROP TABLE `_SportTeamToUser`;

-- DropTable
DROP TABLE `SportEvent`;

-- DropTable
DROP TABLE `SportLeague`;

-- DropTable
DROP TABLE `SportTeam`;

