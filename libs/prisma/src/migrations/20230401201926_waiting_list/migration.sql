-- CreateTable
CREATE TABLE `ExpectedGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `igdbId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `platformId` INTEGER NULL,
    `addToBacklog` BOOLEAN NOT NULL,
    `cancelled` BOOLEAN NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ExpectedGame_igdbId_userId_key`(`igdbId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameCache` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `igdbId` INTEGER NOT NULL,
    `content` JSON NOT NULL,

    UNIQUE INDEX `GameCache_igdbId_key`(`igdbId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpectedGameReleaseDate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `platformId` INTEGER NOT NULL,
    `expectedGameId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExpectedGame` ADD CONSTRAINT `ExpectedGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpectedGameReleaseDate` ADD CONSTRAINT `ExpectedGameReleaseDate_expectedGameId_fkey` FOREIGN KEY (`expectedGameId`) REFERENCES `ExpectedGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
