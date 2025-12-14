-- AlterTable
ALTER TABLE `BacklogItem` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

DROP PROCEDURE IF EXISTS setOrder;

CREATE PROCEDURE setOrder()
BEGIN 
	SET @userId = 0;
	SET @done = FALSE;

	DROP TEMPORARY TABLE IF EXISTS users_tmp;
	CREATE TEMPORARY TABLE users_tmp (id INT);

	INSERT INTO users_tmp SELECT id FROM User;
	SELECT COUNT(*) INTO @remainUsers FROM users_tmp;

	WHILE @remainUsers DO
		SELECT id INTO @userId FROM users_tmp LIMIT 1;
		SELECT COUNT(*) INTO @remainUsers FROM users_tmp;

		SET @row_number = 0;

		UPDATE BacklogItem SET `order` = (@row_number:=@row_number+1) WHERE BacklogItem.userId = @userId ORDER BY name ASC;

		DELETE FROM users_tmp WHERE id = @userId;
	END WHILE;

  DROP TEMPORARY TABLE IF EXISTS users_tmp;
END;

CALL setOrder();
