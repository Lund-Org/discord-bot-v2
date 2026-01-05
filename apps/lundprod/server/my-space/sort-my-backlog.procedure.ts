import { prisma } from '@discord-bot-v2/prisma';
import { BacklogStatus } from '@prisma/client';
import z from 'zod';

import { getAuthedProcedure } from '../middleware';
import { SortOrderType, SortType, TServer } from '../types';

const sortMyBacklogInput = z.object({
  status: z.enum(BacklogStatus),
  sort: z.enum(SortType),
  ordering: z.enum(SortOrderType).optional(),
});
const sortMyBacklogOutput = z.object({
  success: z.boolean(),
});

export type SortMyBacklogInputType = z.infer<typeof sortMyBacklogInput>;
export type SortMyBacklogOutputType = z.infer<typeof sortMyBacklogOutput>;

export const sortMyBacklogProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(sortMyBacklogInput)
    .output(sortMyBacklogOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      let field = 'order';

      switch (input.sort) {
        case SortType.ALPHABETICAL_ORDER: {
          field = 'name';
          break;
        }
        case SortType.DATE_ORDER: {
          switch (input.status) {
            case BacklogStatus.BACKLOG:
              field = 'createdAt';
              break;
            case BacklogStatus.ABANDONED:
              field = 'abandonedAt';
              break;
            case BacklogStatus.CURRENTLY:
              field = 'startedAt';
              break;
            case BacklogStatus.FINISHED:
              field = 'finishedAt';
              break;
            case BacklogStatus.WISHLIST:
              field = 'wishlistAt';
              break;
          }
          break;
        }
      }

      await updateBacklogItemsOrder(
        field,
        input.status,
        user.id,
        input.ordering,
      );

      return {
        success: true,
      };
    });
};

async function updateBacklogItemsOrder(
  field: string,
  status: BacklogStatus,
  userId: number,
  order: SortOrderType = SortOrderType.ASC,
) {
  await prisma.$queryRawUnsafe(`
    WITH backlog AS (
      SELECT 
        id,
        userId,
        ROW_NUMBER() OVER (PARTITION BY userId ORDER BY ${field} ${order}, id) AS new_order
      FROM BacklogItem
      WHERE status = "${status}" AND userId = ${userId}
    )
    UPDATE BacklogItem b
    JOIN backlog bi ON b.id = bi.id
    SET b.\`order\` = bi.new_order;
  `);
}
