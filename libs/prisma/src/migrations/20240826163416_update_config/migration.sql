DELETE FROM `Config`
WHERE `name` = 'SPORT_SYNC';

INSERT INTO `Config` (`name`, `value`) VALUES('LAST_LUNDPROD_VIDEO', '{ "embedUrl": "https://www.youtube.com/embed/7Yg7SLBrSqQ?si=VKFnN7i44K1Ytu0_" }');
INSERT INTO `Config` (`name`, `value`) VALUES('LAST_LUNDPRODGAMEDEV_VIDEO', '{ "embedUrl": "https://www.youtube.com/embed/AFRkQTwi-FI?si=-dARyHf7bqfoDFnC" }');
