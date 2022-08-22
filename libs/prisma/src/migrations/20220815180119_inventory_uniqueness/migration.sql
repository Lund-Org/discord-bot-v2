/*
  Warnings:

  - A unique constraint covering the columns `[playerId,cardTypeId,type]` on the table `PlayerInventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PlayerInventory_playerId_cardTypeId_type_key` ON `PlayerInventory`(`playerId`, `cardTypeId`, `type`);
