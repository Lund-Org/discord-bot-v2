-- DropForeignKey
ALTER TABLE `GachaDailyShopItem` DROP FOREIGN KEY `DailyShopItem_cardTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `GachaDailyShopItem` DROP FOREIGN KEY `DailyShopItem_dailyShopId_fkey`;

-- DropForeignKey
ALTER TABLE `GachaPlayer` DROP FOREIGN KEY `Player_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GachaPlayerInventory` DROP FOREIGN KEY `PlayerInventory_cardTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `GachaPlayerInventory` DROP FOREIGN KEY `PlayerInventory_playerId_fkey`;

-- AlterTable
ALTER TABLE `Pagination` ADD COLUMN `type` ENUM('GACHA_INVENTORY', 'ADVENTURE_INVENTORY') NOT NULL DEFAULT 'GACHA_INVENTORY';

-- CreateTable
CREATE TABLE `AdventurePlayer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gold` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `experience` INTEGER NOT NULL DEFAULT 0,
    `raidLeft` INTEGER NOT NULL DEFAULT 5,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AdventurePlayer_userId_key`(`userId`),
    INDEX `AdventurePlayer_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdventureEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `physicalDamageLowerBound` INTEGER NOT NULL,
    `magicDamageLowerBound` INTEGER NOT NULL,
    `physicalDamageHigherBound` INTEGER NOT NULL,
    `magicDamageHigherBound` INTEGER NOT NULL,
    `life` INTEGER NOT NULL,
    `shield` INTEGER NOT NULL,
    `consummable` BOOLEAN NOT NULL,
    `rarity` ENUM('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC') NOT NULL,
    `mainSlot` ENUM('HEAD', 'BODY', 'ARM_LEFT', 'ARM_RIGHT', 'PANTS', 'SHOES', 'HAND_LEFT', 'HAND_RIGHT', 'CONSUMABLE_1', 'CONSUMABLE_2') NOT NULL,
    `secondarySlot` ENUM('HEAD', 'BODY', 'ARM_LEFT', 'ARM_RIGHT', 'PANTS', 'SHOES', 'HAND_LEFT', 'HAND_RIGHT', 'CONSUMABLE_1', 'CONSUMABLE_2') NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdventureEnnemy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
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

-- CreateTable
CREATE TABLE `AdventurePlayerEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `equipmentId` INTEGER NOT NULL,
    `slot` ENUM('HEAD', 'BODY', 'ARM_LEFT', 'ARM_RIGHT', 'PANTS', 'SHOES', 'HAND_LEFT', 'HAND_RIGHT', 'CONSUMABLE_1', 'CONSUMABLE_2') NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdventurePlayerEquipment_playerId_idx`(`playerId`),
    INDEX `AdventurePlayerEquipment_equipmentId_idx`(`equipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdventurePlayerInventoryEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `equipmentId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdventurePlayerInventoryEquipment_playerId_idx`(`playerId`),
    INDEX `AdventurePlayerInventoryEquipment_equipmentId_idx`(`equipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdventureRaid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `threadId` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,
    `playerX` INTEGER NOT NULL,
    `playerY` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdventureRaid_playerId_idx`(`playerId`),
    INDEX `AdventureRaid_threadId_idx`(`threadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdventureRaidRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raidId` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `isEscape` BOOLEAN NOT NULL,
    `ennemyId` INTEGER NULL,
    `ennemyLevel` INTEGER NOT NULL DEFAULT 1,
    `equipmentId` INTEGER NULL,
    `equipmentTaken` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdventureRaidRoom_raidId_idx`(`raidId`),
    INDEX `AdventureRaidRoom_ennemyId_idx`(`ennemyId`),
    INDEX `AdventureRaidRoom_equipmentId_idx`(`equipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `User_discordId_idx` ON `User`(`discordId`);

-- AddForeignKey
ALTER TABLE `GachaDailyShopItem` ADD CONSTRAINT `GachaDailyShopItem_cardTypeId_fkey` FOREIGN KEY (`cardTypeId`) REFERENCES `CardType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GachaDailyShopItem` ADD CONSTRAINT `GachaDailyShopItem_dailyShopId_fkey` FOREIGN KEY (`dailyShopId`) REFERENCES `GachaDailyShop`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GachaPlayer` ADD CONSTRAINT `GachaPlayer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GachaPlayerInventory` ADD CONSTRAINT `GachaPlayerInventory_cardTypeId_fkey` FOREIGN KEY (`cardTypeId`) REFERENCES `CardType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GachaPlayerInventory` ADD CONSTRAINT `GachaPlayerInventory_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `GachaPlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventurePlayer` ADD CONSTRAINT `AdventurePlayer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventurePlayerEquipment` ADD CONSTRAINT `AdventurePlayerEquipment_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `AdventurePlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventurePlayerEquipment` ADD CONSTRAINT `AdventurePlayerEquipment_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `AdventureEquipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventurePlayerInventoryEquipment` ADD CONSTRAINT `AdventurePlayerInventoryEquipment_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `AdventurePlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventurePlayerInventoryEquipment` ADD CONSTRAINT `AdventurePlayerInventoryEquipment_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `AdventureEquipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventureRaid` ADD CONSTRAINT `AdventureRaid_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `AdventurePlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventureRaidRoom` ADD CONSTRAINT `AdventureRaidRoom_raidId_fkey` FOREIGN KEY (`raidId`) REFERENCES `AdventureRaid`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventureRaidRoom` ADD CONSTRAINT `AdventureRaidRoom_ennemyId_fkey` FOREIGN KEY (`ennemyId`) REFERENCES `AdventureEnnemy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventureRaidRoom` ADD CONSTRAINT `AdventureRaidRoom_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `AdventureEquipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `GachaDailyShop` RENAME INDEX `DailyShop_shopDay_shopMonth_shopYear_key` TO `GachaDailyShop_shopDay_shopMonth_shopYear_key`;

-- RenameIndex
ALTER TABLE `GachaDailyShopItem` RENAME INDEX `DailyShopItem_cardTypeId_dailyShopId_key` TO `GachaDailyShopItem_cardTypeId_dailyShopId_key`;

-- RenameIndex
ALTER TABLE `GachaDailyShopItem` RENAME INDEX `DailyShopItem_cardTypeId_idx` TO `GachaDailyShopItem_cardTypeId_idx`;

-- RenameIndex
ALTER TABLE `GachaDailyShopItem` RENAME INDEX `DailyShopItem_dailyShopId_idx` TO `GachaDailyShopItem_dailyShopId_idx`;

-- RenameIndex
ALTER TABLE `GachaGift` RENAME INDEX `Gift_code_key` TO `GachaGift_code_key`;

-- RenameIndex
ALTER TABLE `GachaPlayer` RENAME INDEX `Player_finishRank_key` TO `GachaPlayer_finishRank_key`;

-- RenameIndex
ALTER TABLE `GachaPlayer` RENAME INDEX `Player_userId_key` TO `GachaPlayer_userId_key`;

-- RenameIndex
ALTER TABLE `GachaPlayerInventory` RENAME INDEX `PlayerInventory_cardTypeId_idx` TO `GachaPlayerInventory_cardTypeId_idx`;

-- RenameIndex
ALTER TABLE `GachaPlayerInventory` RENAME INDEX `PlayerInventory_playerId_cardTypeId_type_key` TO `GachaPlayerInventory_playerId_cardTypeId_type_key`;

-- RenameIndex
ALTER TABLE `GachaPlayerInventory` RENAME INDEX `PlayerInventory_playerId_idx` TO `GachaPlayerInventory_playerId_idx`;

-- RenameIndex
ALTER TABLE `_GachaGiftToGachaPlayer` RENAME INDEX `_GiftToPlayer_AB_unique` TO `_GachaGiftToGachaPlayer_AB_unique`;

-- RenameIndex
ALTER TABLE `_GachaGiftToGachaPlayer` RENAME INDEX `_GiftToPlayer_B_index` TO `_GachaGiftToGachaPlayer_B_index`;
