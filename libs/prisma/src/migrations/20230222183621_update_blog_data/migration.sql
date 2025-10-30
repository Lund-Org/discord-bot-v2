/*
  Warnings:

  - The values [VIDEO] on the enum `BlogPost_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `BlogPost` MODIFY `category` ENUM('NEWS', 'TECH', 'VIDEOGAME', 'OTHER') NOT NULL;
UPDATE `Tag` SET `name` = "Jeu vidéo" WHERE `id` = 1;

INSERT INTO `BlogPost` (`filename`, `category`, `state`, `postAt`, `description`, `bannerUrl`, `thumbnailUrl`) VALUES ("forspoken-billet-d'humeur", 'VIDEOGAME', "NOT_PUBLISHED", '2023-02-22 20:00:00.000', "Forspoken était un des jeux que j'attendais, sans forcément un hype de fou parce que je ne savais pas trop à quoi m'attendre et la communication de Square Enix était catastrophique. J'avais apprécié la démo, confortant mon achat.", 'https://d18wazra96xhgb.cloudfront.net/blog/forspoken-billet-d-humeur-banner.jpg', 'https://d18wazra96xhgb.cloudfront.net/blog/forspoken-billet-d-humeur-thumbnail.jpg');
INSERT INTO `_BlogPostToTag` (`A`, `B`) VALUES(LAST_INSERT_ID(), 1);
