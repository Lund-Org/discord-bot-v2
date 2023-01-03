import { PrismaClient, CardType } from '@prisma/client';
import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D,
} from 'canvas';
import { createWriteStream } from 'fs';
import { join } from 'path';
import {
  CARD_SIZE,
  TITLE_OFFSET,
  IMAGE_OFFSET,
  DESCRIPTION_OFFSET,
  FUSION_OFFSET,
  STAR_OFFSETS,
  IMAGE_SIZE,
  TITLE_SIZE,
  ID_OFFSET,
  ID_SIZE,
  DESCRIPTION_SIZE,
  FUSION_IMG_SIZE,
  STAR_SIZE,
  FUSION_TEXT_SIZE,
} from './constants';

export const prisma = new PrismaClient();

registerFont(join(__dirname, `../assets/Ubuntu-Regular.ttf`), {
  family: 'Ubuntu',
});

type CardTypeAndFusions = CardType & {
  fusionDependencies: CardType[];
  possibleFusions: CardType[];
};

async function getCards() {
  return prisma.cardType.findMany({
    include: {
      fusionDependencies: true,
      possibleFusions: true,
    },
  });
}

async function setTextRescale({
  text,
  fontFamily = 'Ubuntu',
  fontSize,
  color = '#000000',
  position,
  size,
  ctx,
}: {
  text: string;
  fontFamily?: string;
  fontSize: number;
  color?: string;
  position: readonly [number, number];
  size: readonly [number, number];
  ctx: CanvasRenderingContext2D;
}) {
  ctx.textAlign = 'left';
  ctx.textBaseline = 'ideographic';
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;

  while (fontSize > 10 && ctx.measureText(text).width > size[0]) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    --fontSize;
  }
  ctx.fillText(text, position[0], position[1]);
}

async function setTextMultiLine({
  text,
  fontFamily = 'Ubuntu',
  fontSize,
  color = '#000000',
  position,
  size,
  ctx,
}: {
  text: string;
  fontFamily?: string;
  fontSize: number;
  color?: string;
  position: readonly [number, number];
  size: readonly [number, number];
  ctx: CanvasRenderingContext2D;
}) {
  const fragmentedDescription = text.split(' ');
  let linesInput = 0;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'ideographic';
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;

  for (
    let iteration = 10;
    fragmentedDescription.length && iteration > 0;
    --iteration
  ) {
    let quit = false;

    for (
      let wordsTaken = fragmentedDescription.length;
      wordsTaken > 0 && !quit;
      --wordsTaken
    ) {
      const desc = fragmentedDescription.filter(
        (_, index) => index < wordsTaken
      );

      if (ctx.measureText(desc.join(' ')).width < size[0]) {
        ctx.fillText(
          desc.join(' '),
          position[0],
          position[1] + linesInput * (fontSize + 10)
        );
        fragmentedDescription.splice(0, wordsTaken);
        ++linesInput;
        quit = true;
      }
    }
  }
}

async function setImage(
  imageUrl: string,
  ctx: CanvasRenderingContext2D,
  position: readonly [number, number],
  size: readonly [number, number]
) {
  try {
    const img = await loadImage(imageUrl);
    ctx.drawImage(img, position[0], position[1], size[0], size[1]);
  } catch (e) {
    console.log(e);
    ctx.fillStyle = '#000000';
    ctx.fillRect(position[0], position[1], size[0], size[1]);
  }
}

async function createImage(card: CardTypeAndFusions, type: 'basic' | 'gold') {
  const bgImage = type === 'basic' ? 'background.png' : 'background-gold.png';
  const canvas = createCanvas(CARD_SIZE[0], CARD_SIZE[1]);
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#e5e5e5';
  ctx.fillRect(0, 0, CARD_SIZE[0], CARD_SIZE[1]);
  await setImage(
    join(__dirname, `../assets/${bgImage}`),
    ctx,
    [0, 0],
    CARD_SIZE
  );
  // illustration
  await setImage(
    join(__dirname, '../assets/illustrations', card.imageName),
    ctx,
    IMAGE_OFFSET,
    IMAGE_SIZE
  );
  // card name
  setTextMultiLine({
    text: card.name,
    fontSize: 32,
    color: type === 'gold' ? '#000000' : '#FFFFFF',
    position: TITLE_OFFSET,
    size: TITLE_SIZE,
    ctx,
  });
  // id
  setTextRescale({
    text: `#${card.id}`,
    fontSize: 32,
    color: '#333333',
    position: ID_OFFSET,
    size: ID_SIZE,
    ctx,
  });
  // description
  setTextMultiLine({
    text: card.description,
    fontSize: 24,
    color: '#333333',
    position: DESCRIPTION_OFFSET,
    size: DESCRIPTION_SIZE,
    ctx,
  });

  // fusion hint
  if (card.isFusion) {
    await setImage(
      join(__dirname, `../assets/fusion-icon.png`),
      ctx,
      FUSION_OFFSET,
      FUSION_IMG_SIZE
    );
  } else if (card.possibleFusions.length) {
    setTextRescale({
      text: 'Composant de fusion',
      fontSize: 24,
      color: type === 'gold' ? '#000000' : '#FFFFFF',
      position: FUSION_OFFSET,
      size: FUSION_TEXT_SIZE,
      ctx,
    });
  }

  // stars
  const starImg = type === 'gold' ? 'star-gold.png' : 'star.png';
  for (let i = 0; i < card.level; ++i) {
    const index = (i + 1) as keyof typeof STAR_OFFSETS;
    const position = STAR_OFFSETS[index];

    await setImage(
      join(__dirname, `../assets/${starImg}`),
      ctx,
      [position[0] + i * STAR_SIZE[0], position[1]],
      STAR_SIZE
    );
  }

  const lundProdOut = createWriteStream(
    join(
      __dirname, // /dist/libs/card-generator/src/lib
      '..', // /dist/libs/card-generator/src
      '..', // /dist/libs/card-generator/
      '..', // /dist/libs/
      '..', // /dist/
      '..', // /
      'apps',
      'lundprod',
      'public',
      'card-images',
      `${type}-${card.imageName}`
    )
  );
  const streamLundProd = canvas.createJPEGStream();
  streamLundProd.pipe(lundProdOut);
  lundProdOut.on('finish', () =>
    console.log(
      `The file ${type}-${card.imageName} has been created in lundprod public folder.`
    )
  );
  const publicOut = createWriteStream(
    join(
      __dirname, // /dist/libs/card-generator/src/lib
      '..', // /dist/libs/card-generator/src
      '..', // /dist/libs/card-generator/
      '..', // /dist/libs/
      '..', // /dist/
      '..', // /
      'public',
      'card-images',
      `${type}-${card.imageName}`
    )
  );
  const publicStream = canvas.createJPEGStream();
  publicStream.pipe(publicOut);
  publicOut.on('finish', () =>
    console.log(
      `The file ${type}-${card.imageName} has been created in root public folder.`
    )
  );
}

async function generate() {
  const cards = await getCards();

  cards.forEach(async (card) => {
    await createImage(card, 'basic');
    await createImage(card, 'gold');
  });
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
