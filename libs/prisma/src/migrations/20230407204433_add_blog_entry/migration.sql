INSERT INTO `BlogPost` (`filename`, `category`, `state`, `postAt`, `description`, `bannerUrl`, `thumbnailUrl`) VALUES ("nouveaute-avril-2023", 'NEWS', "NOT_PUBLISHED", '2023-04-07 22:30:00.000', "En Avril, ne te découvre pas d'un fil. Mais ce n'est pas une raison pour ne pas avoir de nouvelles fonctionnalités pour le site/bot. Voici un petit descriptif.", 'https://d18wazra96xhgb.cloudfront.net/blog/new-features-avril-2023-banner.jpg', 'https://d18wazra96xhgb.cloudfront.net/blog/new-features-avril-2023.jpg');
INSERT INTO `_BlogPostToTag` (`A`, `B`) VALUES(LAST_INSERT_ID(), 4);