-- CreateTable
CREATE TABLE `DailyShop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopDay` INTEGER NOT NULL,
    `shopMonth` INTEGER NOT NULL,
    `shopYear` INTEGER NOT NULL,
    `threadId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DailyShop_shopDay_shopMonth_shopYear_key`(`shopDay`, `shopMonth`, `shopYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyShopItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cardTypeId` INTEGER NOT NULL,
    `dailyShopId` INTEGER NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `price` INTEGER NOT NULL,

    INDEX `DailyShopItem_dailyShopId_idx`(`dailyShopId`),
    INDEX `DailyShopItem_cardTypeId_idx`(`cardTypeId`),
    UNIQUE INDEX `DailyShopItem_cardTypeId_dailyShopId_key`(`cardTypeId`, `dailyShopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyPurchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `dailyShopId` INTEGER NOT NULL,

    INDEX `DailyPurchase_dailyShopId_idx`(`dailyShopId`),
    INDEX `DailyPurchase_playerId_idx`(`playerId`),
    UNIQUE INDEX `DailyPurchase_playerId_dailyShopId_key`(`playerId`, `dailyShopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyShopItem` ADD CONSTRAINT `DailyShopItem_cardTypeId_fkey` FOREIGN KEY (`cardTypeId`) REFERENCES `CardType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyShopItem` ADD CONSTRAINT `DailyShopItem_dailyShopId_fkey` FOREIGN KEY (`dailyShopId`) REFERENCES `DailyShop`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPurchase` ADD CONSTRAINT `DailyPurchase_dailyShopId_fkey` FOREIGN KEY (`dailyShopId`) REFERENCES `DailyShopItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyPurchase` ADD CONSTRAINT `DailyPurchase_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO Config (name, value) VALUES ('SHOP_PRICES', '{ "gold": 5000, "basic": 3000 }')
