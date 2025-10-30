/*
  Warnings:

  - You are about to drop the `_PlayerToSportTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_PlayerToSportTeam` DROP FOREIGN KEY `_PlayerToSportTeam_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PlayerToSportTeam` DROP FOREIGN KEY `_PlayerToSportTeam_B_fkey`;

-- AlterTable
ALTER TABLE `SportTeam` MODIFY `sportApiId` INTEGER NULL;

-- DropTable
DROP TABLE `_PlayerToSportTeam`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordId` VARCHAR(255) NOT NULL,
    `twitchUsername` VARCHAR(255) NULL,
    `username` VARCHAR(255) NOT NULL,
    `playerId` INTEGER NOT NULL,

    UNIQUE INDEX `User_discordId_key`(`discordId`),
    UNIQUE INDEX `User_twitchUsername_key`(`twitchUsername`),
    UNIQUE INDEX `User_playerId_key`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SportLeagueToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SportLeagueToUser_AB_unique`(`A`, `B`),
    INDEX `_SportLeagueToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SportTeamToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SportTeamToUser_AB_unique`(`A`, `B`),
    INDEX `_SportTeamToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SportLeagueToUser` ADD CONSTRAINT `_SportLeagueToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `SportLeague`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SportLeagueToUser` ADD CONSTRAINT `_SportLeagueToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SportTeamToUser` ADD CONSTRAINT `_SportTeamToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `SportTeam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SportTeamToUser` ADD CONSTRAINT `_SportTeamToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Fill the user table with the player ones
INSERT INTO User (discordId, twitchUsername, username, playerId)
SELECT discordId, twitchUsername, username, id as playerId
FROM Player;
