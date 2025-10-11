import z from 'zod';
import { TServer } from '../types';
import { BacklogStatus, Prisma } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';
import { backlogItemSchema } from '../common-schema';
import { getAuthedProcedure } from '../middleware';

const ITEMS_PER_PAGE = 30;

const backlogItemData = Prisma.validator<Prisma.BacklogItemDefaultArgs>()({
  omit: {
    userId: true,
  },
  include: {
    backlogItemReview: {
      include: {
        cons: {
          omit: {
            backlogItemReviewId: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        pros: {
          omit: {
            backlogItemReviewId: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: {
        backlogItemId: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  },
});

type BacklogItemType = Prisma.BacklogItemGetPayload<typeof backlogItemData>;

const getBacklogInput = z.object({
  page: z.number().gte(1).optional(),
  category: z.nativeEnum(BacklogStatus),
  discordId: z.string(),
});
const getMyBacklogInput = z.object({});
const getBacklogOutput = z.array(backlogItemSchema);

export type GetBacklogInputType = z.infer<typeof getBacklogInput>;
export type GetBacklogOutputType = z.infer<typeof getBacklogOutput>;

export const getBacklogProcedure = (t: TServer) => {
  return t.procedure
    .input(getBacklogInput)
    .output(getBacklogOutput)
    .query(getBacklogByDiscordId);
};
export const getMyBacklogProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(getMyBacklogInput)
    .output(getBacklogOutput)
    .query(async ({ input, ctx }) => {
      const { session } = ctx;

      const backlogItems = await prisma.backlogItem.findMany({
        where: {
          user: {
            discordId: session.userId,
          },
        },
        include: backlogItemData.include,
        omit: backlogItemData.omit,
      });

      return backlogItems.map(convert);
    });
};

const getBacklogByDiscordId = async ({
  input,
}: {
  input: GetBacklogInputType;
}) => {
  const { category, discordId, page = 1 } = input;
  const backlogItems = await prisma.backlogItem.findMany({
    where: {
      user: {
        discordId,
      },
      status: category,
    },
    include: backlogItemData.include,
    omit: backlogItemData.omit,
    take: ITEMS_PER_PAGE,
    skip: ITEMS_PER_PAGE * (page - 1),
  });

  return backlogItems.map(convert);
};

function convert(backlogItem: BacklogItemType) {
  return {
    ...backlogItem,
    createdAt: backlogItem.createdAt.toISOString(),
    updatedAt: backlogItem.updatedAt.toISOString(),
  };
}
