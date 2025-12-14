-- AlterTable
ALTER TABLE `Player` ADD COLUMN `lastPointsReminder` DATETIME(0) NULL,
    ADD COLUMN `wantToBeWarn` BOOLEAN NOT NULL DEFAULT false;
