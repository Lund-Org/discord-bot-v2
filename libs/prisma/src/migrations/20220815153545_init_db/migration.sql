-- CreateTable
CREATE TABLE `Birthday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordId` VARCHAR(255) NOT NULL,
    `birthdayDay` INTEGER NOT NULL,
    `birthdayMonth` INTEGER NOT NULL,
    `birthdayYear` INTEGER NOT NULL,

    UNIQUE INDEX `Birthday_discordId_key`(`discordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `level` INTEGER NOT NULL,
    `imageName` VARCHAR(255) NOT NULL,
    `isFusion` TINYINT NOT NULL DEFAULT 0,
    `lore` TEXT NOT NULL,

    UNIQUE INDEX `CardType_name_key`(`name`),
    UNIQUE INDEX `CardType_imageName_key`(`imageName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `value` JSON NOT NULL,

    UNIQUE INDEX `Config_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beginningDatetime` DATETIME(0) NOT NULL,
    `endDatetime` DATETIME(0) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `bonus` JSON NOT NULL,

    UNIQUE INDEX `Gift_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagination` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page` INTEGER NOT NULL,
    `discordMessageId` VARCHAR(255) NOT NULL,
    `discordUserId` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Pagination_discordMessageId_key`(`discordMessageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordId` VARCHAR(255) NOT NULL,
    `points` INTEGER NOT NULL,
    `lastMessageDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastDailyDraw` DATETIME(0) NULL,
    `joinDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `twitchUsername` VARCHAR(255) NULL,
    `username` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Player_discordId_key`(`discordId`),
    UNIQUE INDEX `Player_twitchUsername_key`(`twitchUsername`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,
    `cardTypeId` INTEGER NOT NULL,
    `type` VARCHAR(255) NOT NULL,

    INDEX `PlayerInventory_cardTypeId_idx`(`cardTypeId`),
    INDEX `PlayerInventory_playerId_idx`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CardFusions` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CardFusions_AB_unique`(`A`, `B`),
    INDEX `_CardFusions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GiftToPlayer` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GiftToPlayer_AB_unique`(`A`, `B`),
    INDEX `_GiftToPlayer_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlayerInventory` ADD CONSTRAINT `PlayerInventory_cardTypeId_fkey` FOREIGN KEY (`cardTypeId`) REFERENCES `CardType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerInventory` ADD CONSTRAINT `PlayerInventory_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CardFusions` ADD CONSTRAINT `_CardFusions_A_fkey` FOREIGN KEY (`A`) REFERENCES `CardType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CardFusions` ADD CONSTRAINT `_CardFusions_B_fkey` FOREIGN KEY (`B`) REFERENCES `CardType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GiftToPlayer` ADD CONSTRAINT `_GiftToPlayer_A_fkey` FOREIGN KEY (`A`) REFERENCES `Gift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GiftToPlayer` ADD CONSTRAINT `_GiftToPlayer_B_fkey` FOREIGN KEY (`B`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
