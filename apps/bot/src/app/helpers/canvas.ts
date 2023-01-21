import { loadImage, CanvasRenderingContext2D, createCanvas } from 'canvas';
import { join } from 'path';
import { CardDraw } from './types';

const CARD_SIZE = [475, 820] as const;
const HEIGHT_HEADER = 50;
const CARDS_PER_ROW = 4;
const MARGIN_LEFT_HEADER = 10;
const MARGIN_LEFT_CARD = 10;
const MARGIN_RIGHT_CARD = 10;
const MARGIN_TOP_CARD = 20;
const MARGIN_BOTTOM_CARD = 20;

export const setupCardDrawHeader = async (
  username: string,
  ctx: CanvasRenderingContext2D
) => {
  ctx.font = '30px Sans';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'ideographic';
  ctx.fillText(username, MARGIN_LEFT_HEADER, 10);
};

export const printCard = async (
  ctx: CanvasRenderingContext2D,
  card: CardDraw,
  offsetX: number,
  offsetY: number
) => {
  const img = await loadImage(
    join(
      __dirname,
      '..',
      '..',
      'public',
      'card-images',
      `${card.isGold ? 'gold' : 'basic'}-${card.cardType.imageName}`
    )
  );
  ctx.drawImage(img, offsetX, offsetY, CARD_SIZE[0], CARD_SIZE[1]);
};

export const setupCardDrawBody = async (
  ctx: CanvasRenderingContext2D,
  cardList: CardDraw[]
) => {
  let offsetY = HEIGHT_HEADER;

  for (let i = 0; i < cardList.length; ) {
    let offsetX = MARGIN_LEFT_CARD;

    for (let j = 0; j < CARDS_PER_ROW && i < cardList.length; ++j, ++i) {
      await printCard(ctx, cardList[i], offsetX, offsetY);
      offsetX += MARGIN_LEFT_CARD + MARGIN_RIGHT_CARD + CARD_SIZE[0];
    }

    offsetY += MARGIN_TOP_CARD + MARGIN_BOTTOM_CARD + CARD_SIZE[1];
  }
};

export const generateDrawImage = async (
  username: string,
  cardList: CardDraw[]
) => {
  const numberOfRow = Math.ceil(cardList.length / CARDS_PER_ROW);
  const maxColumn = Math.min(cardList.length, CARDS_PER_ROW);
  const size = {
    width: maxColumn * (MARGIN_LEFT_CARD + MARGIN_RIGHT_CARD + CARD_SIZE[0]),
    height:
      HEIGHT_HEADER +
      numberOfRow * (MARGIN_TOP_CARD + MARGIN_BOTTOM_CARD + CARD_SIZE[1]),
  };
  const canvas = createCanvas(size.width, size.height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size.width, size.height);
  await setupCardDrawHeader(username, ctx);
  await setupCardDrawBody(ctx, cardList);

  return canvas;
};
