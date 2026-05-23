/*
  Warnings:

  - You are about to drop the column `magicalDamageMultiplierHigherBound` on the `AdventureEnemy` table. All the data in the column will be lost.
  - You are about to drop the column `magicalDamageMultiplierLowerBound` on the `AdventureEnemy` table. All the data in the column will be lost.
  - Added the required column `magicDamageMultiplierHigherBound` to the `AdventureEnemy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magicDamageMultiplierLowerBound` to the `AdventureEnemy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AdventureEnemy` DROP COLUMN `magicalDamageMultiplierHigherBound`,
    DROP COLUMN `magicalDamageMultiplierLowerBound`,
    ADD COLUMN `magicDamageMultiplierHigherBound` DOUBLE NOT NULL,
    ADD COLUMN `magicDamageMultiplierLowerBound` DOUBLE NOT NULL;
