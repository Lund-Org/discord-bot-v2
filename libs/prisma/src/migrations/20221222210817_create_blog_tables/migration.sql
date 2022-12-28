-- CreateTable
CREATE TABLE `BlogPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(255) NOT NULL,
    `category` ENUM('NEWS', 'TECH', 'VIDEO', 'OTHER') NOT NULL,
    `state` ENUM('PUBLISHED', 'NOT_PUBLISHED') NOT NULL,
    `postAt` DATETIME(3) NOT NULL,
    `description` TEXT NOT NULL,
    `bannerUrl` VARCHAR(255) NOT NULL,
    `thumbnailUrl` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `BlogPost_filename_key`(`filename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlogPostToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BlogPostToTag_AB_unique`(`A`, `B`),
    INDEX `_BlogPostToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BlogPostToTag` ADD CONSTRAINT `_BlogPostToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogPostToTag` ADD CONSTRAINT `_BlogPostToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
