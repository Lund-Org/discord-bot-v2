DELETE FROM `Config`
WHERE `name` IN (
  'SELL',
  'PRICE',
  'DROP_CHANCES',
  'CARD_XP',
  'LEVELS'
)
