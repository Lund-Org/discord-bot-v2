INSERT INTO `BlogPost` (
  `filename`,
  `category`,
  `state`,
  `postAt`,
  `description`,
  `bannerUrl`,
  `thumbnailUrl`
) VALUES (
  "mon-annee-2024",
  'VIDEOGAME',
  "NOT_PUBLISHED",
  '2024-12-04 20:00:00.000',
  "L'année 2024 touche bientôt à sa fin, l'occasion comme chaque année de faire un petit bilan de ce qu'il s'est passé. Et contrairement à d'habitude, pas que du jeu et beaucoup de choses sur le plan créatif. Bienvenue dans l'année 2024 d'une personne qui a trop de projets et trop peu de temps.",
  'https://d18wazra96xhgb.cloudfront.net/blog/bilan-2024-banner.jpg',
  'https://d18wazra96xhgb.cloudfront.net/blog/bilan-2024-thumbnail.jpg'
);
INSERT INTO `_BlogPostToTag` (`A`, `B`) VALUES(LAST_INSERT_ID(), 1);
