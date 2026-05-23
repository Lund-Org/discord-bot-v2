/*
  Warnings:

  - A unique constraint covering the columns `[playerId,slot]` on the table `AdventurePlayerEquipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,equipmentId]` on the table `AdventurePlayerInventoryEquipment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AdventurePlayerEquipment_playerId_slot_key` ON `AdventurePlayerEquipment`(`playerId`, `slot`);

-- CreateIndex
CREATE UNIQUE INDEX `AdventurePlayerInventoryEquipment_playerId_equipmentId_key` ON `AdventurePlayerInventoryEquipment`(`playerId`, `equipmentId`);
