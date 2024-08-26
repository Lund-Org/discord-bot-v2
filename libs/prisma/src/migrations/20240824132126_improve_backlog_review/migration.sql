/*
  Warnings:

  - You are about to drop the column `rating` on the `backlogitem` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `backlogitem` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE `BacklogItemReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backlogItemId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `review` TEXT NULL,
    `duration` INTEGER NULL,
    `completion` INTEGER NULL,

    UNIQUE INDEX `BacklogItemReview_backlogItemId_key`(`backlogItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BacklogItemReviewPros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backlogItemReviewId` INTEGER NOT NULL,
    `value` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BacklogItemReviewCons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backlogItemReviewId` INTEGER NOT NULL,
    `value` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BacklogItemReview` ADD CONSTRAINT `BacklogItemReview_backlogItemId_fkey` FOREIGN KEY (`backlogItemId`) REFERENCES `BacklogItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BacklogItemReviewPros` ADD CONSTRAINT `BacklogItemReviewPros_backlogItemReviewId_fkey` FOREIGN KEY (`backlogItemReviewId`) REFERENCES `BacklogItemReview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BacklogItemReviewCons` ADD CONSTRAINT `BacklogItemReviewCons_backlogItemReviewId_fkey` FOREIGN KEY (`backlogItemReviewId`) REFERENCES `BacklogItemReview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO `BacklogItemReview` (`backlogItemId`,`rating`,`review`,`duration`,`completion`)
SELECT `id`, `rating`, `reason`, null, null FROM `BacklogItem`
WHERE `status` IN ('FINISHED', 'ABANDONED');

-- AlterTable
ALTER TABLE `backlogitem` DROP COLUMN `rating`,
    DROP COLUMN `reason`;
