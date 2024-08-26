-- DropForeignKey
ALTER TABLE `BacklogItemReview` DROP FOREIGN KEY `BacklogItemReview_backlogItemId_fkey`;

-- AddForeignKey
ALTER TABLE `BacklogItemReview` ADD CONSTRAINT `BacklogItemReview_backlogItemId_fkey` FOREIGN KEY (`backlogItemId`) REFERENCES `BacklogItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
