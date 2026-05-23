/*
  Warnings:

  - You are about to drop the column `ennemyId` on the `AdventureRaidRoom` table. All the data in the column will be lost.
  - You are about to drop the column `ennemyLevel` on the `AdventureRaidRoom` table. All the data in the column will be lost.
  - You are about to drop the `AdventureEnnemy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AdventureRaidRoom` DROP FOREIGN KEY `AdventureRaidRoom_ennemyId_fkey`;

-- DropIndex
DROP INDEX `AdventureRaidRoom_ennemyId_idx` ON `AdventureRaidRoom`;

-- AlterTable
ALTER TABLE `AdventureRaidRoom` DROP COLUMN `ennemyId`,
    DROP COLUMN `ennemyLevel`,
    ADD COLUMN `enemyId` INTEGER NULL,
    ADD COLUMN `enemyLevel` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `enemyLife` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `seen` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `AdventureEnnemy`;

-- CreateTable
CREATE TABLE `AdventureEnemy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `difficulty` INTEGER NOT NULL DEFAULT 1,
    `physicalDamageMultiplierLowerBound` DOUBLE NOT NULL,
    `magicalDamageMultiplierLowerBound` DOUBLE NOT NULL,
    `physicalDamageMultiplierHigherBound` DOUBLE NOT NULL,
    `magicalDamageMultiplierHigherBound` DOUBLE NOT NULL,
    `lifeMultiplier` DOUBLE NOT NULL,
    `shieldMultiplier` DOUBLE NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AdventureRaidRoom_enemyId_idx` ON `AdventureRaidRoom`(`enemyId`);

-- AddForeignKey
ALTER TABLE `AdventureRaidRoom` ADD CONSTRAINT `AdventureRaidRoom_enemyId_fkey` FOREIGN KEY (`enemyId`) REFERENCES `AdventureEnemy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
