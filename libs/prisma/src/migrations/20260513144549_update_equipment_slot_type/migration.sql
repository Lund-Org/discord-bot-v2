/*
  Warnings:

  - You are about to drop the column `mainSlot` on the `AdventureEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `secondarySlot` on the `AdventureEquipment` table. All the data in the column will be lost.
  - Added the required column `slot` to the `AdventureEquipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AdventureEquipment` DROP COLUMN `mainSlot`,
    DROP COLUMN `secondarySlot`,
    ADD COLUMN `slot` ENUM('HEAD', 'BODY', 'ARM', 'PANTS', 'SHOES', 'HAND', 'DUAL_HAND', 'CONSUMABLE') NOT NULL;
