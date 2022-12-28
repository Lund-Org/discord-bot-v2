INSERT INTO `Tag` (`id`, `name`) VALUES (1, "Video");
INSERT INTO `Tag` (`id`, `name`) VALUES (2, "Stream");
INSERT INTO `Tag` (`id`, `name`) VALUES (3, "IRL");
INSERT INTO `Tag` (`id`, `name`) VALUES (4, "Autre");

INSERT INTO `BlogPost` (`filename`, `category`, `state`, `postAt`, `description`, `bannerUrl`, `thumbnailUrl`) VALUES ("bilan-2022", "NEWS", "NOT_PUBLISHED", "2022-12-28 20:00:00", "Décembre 2022, il fait froid, Noël approche et 2023 pointe le bout de son nez. L'heure de faire le bilan et de voir ce qui est prévu pour l'année à venir.", "https://d18wazra96xhgb.cloudfront.net/blog/bilan-2022-2023-banner.jpg", "https://d18wazra96xhgb.cloudfront.net/blog/bilan-2022-2023-thumbnail.jpg");
INSERT INTO `_BlogPostToTag` (`A`, `B`) VALUES(LAST_INSERT_ID(), 3);

INSERT INTO `BlogPost` (`filename`, `category`, `state`, `postAt`, `description`, `bannerUrl`, `thumbnailUrl`) VALUES ('backlog-2023', 'NEWS', "NOT_PUBLISHED", '2022-12-28 20:30:00.000', "Contrairement à 2022, pas mal de choses sont prévus, coté jeu vidéo mais pas que ! Venez découvrir les jeux et créations que j'envisage pour l'année qui arrive, c'est tout un programme !", 'https://d18wazra96xhgb.cloudfront.net/blog/backlog-2023-banner.jpg', 'https://d18wazra96xhgb.cloudfront.net/blog/backlog-2023-thumbnail.jpg');
INSERT INTO `_BlogPostToTag` (`A`, `B`) VALUES(LAST_INSERT_ID(), 3);
