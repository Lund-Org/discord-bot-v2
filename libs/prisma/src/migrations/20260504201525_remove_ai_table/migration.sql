/*
  Warnings:

  - You are about to drop the `AiAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AiAttempt` DROP FOREIGN KEY `AiAttempt_userId_fkey`;

-- DropTable
DROP TABLE `AiAttempt`;

-- CreateIndex
CREATE INDEX `BacklogItem_userId_idx` ON `BacklogItem`(`userId`);
