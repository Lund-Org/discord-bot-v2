/*
  Warnings:

  - Added the required column `health` to the `AdventurePlayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AdventurePlayer` ADD COLUMN `health` INTEGER NOT NULL;
