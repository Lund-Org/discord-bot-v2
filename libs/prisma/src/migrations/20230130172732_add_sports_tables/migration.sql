-- CreateTable
CREATE TABLE `SportEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `teamAId` INTEGER NULL,
    `teamBId` INTEGER NULL,
    `startAt` DATETIME(3) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `category` ENUM('FOOTBALL', 'BASKET', 'MOTORSPORT') NOT NULL,
    `leagueId` INTEGER NOT NULL,

    INDEX `SportEvent_teamAId_idx`(`teamAId`),
    INDEX `SportEvent_teamBId_idx`(`teamBId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SportLeague` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `sportApiId` INTEGER NULL,
    `year` INTEGER NOT NULL,

    INDEX `SportLeague_sportApiId_idx`(`sportApiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SportRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` VARCHAR(191) NOT NULL,
    `category` ENUM('FOOTBALL', 'BASKET', 'MOTORSPORT') NOT NULL,

    UNIQUE INDEX `SportRole_roleId_category_key`(`roleId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SportTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NOT NULL,
    `sportApiId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,

    UNIQUE INDEX `SportTeam_name_sportApiId_year_key`(`name`, `sportApiId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PlayerToSportTeam` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PlayerToSportTeam_AB_unique`(`A`, `B`),
    INDEX `_PlayerToSportTeam_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SportEvent` ADD CONSTRAINT `SportEvent_teamAId_fkey` FOREIGN KEY (`teamAId`) REFERENCES `SportTeam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SportEvent` ADD CONSTRAINT `SportEvent_teamBId_fkey` FOREIGN KEY (`teamBId`) REFERENCES `SportTeam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SportEvent` ADD CONSTRAINT `SportEvent_leagueId_fkey` FOREIGN KEY (`leagueId`) REFERENCES `SportLeague`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToSportTeam` ADD CONSTRAINT `_PlayerToSportTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToSportTeam` ADD CONSTRAINT `_PlayerToSportTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `SportTeam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
