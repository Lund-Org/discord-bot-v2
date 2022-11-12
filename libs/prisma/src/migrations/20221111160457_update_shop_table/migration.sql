/*
  Warnings:

  - You are about to drop the column `dailyShopId` on the `DailyPurchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId,dailyShopItemId]` on the table `DailyPurchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dailyShopItemId` to the `DailyPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DailyPurchase` DROP FOREIGN KEY `DailyPurchase_dailyShopId_fkey`;

-- DropIndex
DROP INDEX `DailyPurchase_playerId_dailyShopId_key` ON `DailyPurchase`;

-- AlterTable
ALTER TABLE `DailyPurchase` DROP COLUMN `dailyShopId`,
    ADD COLUMN `dailyShopItemId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `DailyPurchase_dailyShopItemId_idx` ON `DailyPurchase`(`dailyShopItemId`);

-- CreateIndex
CREATE UNIQUE INDEX `DailyPurchase_playerId_dailyShopItemId_key` ON `DailyPurchase`(`playerId`, `dailyShopItemId`);

-- AddForeignKey
ALTER TABLE `DailyPurchase` ADD CONSTRAINT `DailyPurchase_dailyShopItemId_fkey` FOREIGN KEY (`dailyShopItemId`) REFERENCES `DailyShopItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
