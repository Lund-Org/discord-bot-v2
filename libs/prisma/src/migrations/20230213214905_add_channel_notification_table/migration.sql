-- CreateTable
CREATE TABLE `DiscordNotificationChannel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordChannelId` VARCHAR(191) NOT NULL,
    `notificationType` ENUM('BIRTHDAY', 'MEME', 'SHOP', 'FOOTBALL', 'NBA', 'MOTORSPORT') NOT NULL,

    UNIQUE INDEX `DiscordNotificationChannel_notificationType_key`(`notificationType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
