-- AlterTable
ALTER TABLE `BacklogItem` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BacklogItem` ADD CONSTRAINT `BacklogItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Set the userId in the BacklogItem table
UPDATE `BacklogItem`
INNER JOIN Player ON Player.id = BacklogItem.playerId
INNER JOIN User ON User.id = Player.userId
SET BacklogItem.userId = User.id;

