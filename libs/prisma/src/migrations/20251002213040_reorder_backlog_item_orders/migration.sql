WITH backlog AS (
  SELECT 
    id,
    userId,
    ROW_NUMBER() OVER (PARTITION BY userId ORDER BY `order`, id) AS new_order
  FROM BacklogItem
  WHERE status = 'BACKLOG'
)
UPDATE BacklogItem b
JOIN backlog bi ON b.id = bi.id
SET b.`order` = bi.new_order;


WITH currently AS (
  SELECT 
    id,
    userId,
    ROW_NUMBER() OVER (PARTITION BY userId ORDER BY `order`, id) AS new_order
  FROM BacklogItem
  WHERE status = 'CURRENTLY'
)
UPDATE BacklogItem b
JOIN currently bi ON b.id = bi.id
SET b.`order` = bi.new_order;


WITH finished AS (
  SELECT 
    id,
    userId,
    ROW_NUMBER() OVER (PARTITION BY userId ORDER BY `order`, id) AS new_order
  FROM BacklogItem
  WHERE status = 'FINISHED'
)
UPDATE BacklogItem b
JOIN finished bi ON b.id = bi.id
SET b.`order` = bi.new_order;


WITH abandoned AS (
  SELECT 
    id,
    userId,
    ROW_NUMBER() OVER (PARTITION BY userId ORDER BY `order`, id) AS new_order
  FROM BacklogItem
  WHERE status = 'Abandoned'
)
UPDATE BacklogItem b
JOIN abandoned bi ON b.id = bi.id
SET b.`order` = bi.new_order;


WITH wishlist AS (
  SELECT 
    id,
    userId,
    ROW_NUMBER() OVER (PARTITION BY userId ORDER BY `order`, id) AS new_order
  FROM BacklogItem
  WHERE status = 'WISHLIST'
)
UPDATE BacklogItem b
JOIN wishlist bi ON b.id = bi.id
SET b.`order` = bi.new_order;
