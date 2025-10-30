import { prisma } from '@discord-bot-v2/prisma';
import { BacklogStatus } from '@prisma/client';
import z from 'zod';

import { getAuthedProcedure } from '../middleware';
import { SortType, TServer } from '../types';

const sortMyBacklogInput = z.object({
  status: z.nativeEnum(BacklogStatus),
  order: z.nativeEnum(SortType),
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

      switch (input.order) {
        case SortType.ALPHABETICAL_ORDER: {
          field = 'name';
          break;
        }
        case SortType.DATE_ORDER: {
          field = 'createdAt';
          break;
        }
      }

      await updateBacklogItemsOrder(field, input.status, user.id);

      return {
        success: true,
      };
    });
};

async function updateBacklogItemsOrder(
  field: string,
  status: BacklogStatus,
  userId: number,
) {
  await prisma.$queryRawUnsafe(`
    WITH backlog AS (
      SELECT 
        id,
        userId,
        ROW_NUMBER() OVER (PARTITION BY userId ORDER BY ${field}, id) AS new_order
      FROM BacklogItem
      WHERE status = "${status}" AND userId = ${userId}
    )
    UPDATE BacklogItem b
    JOIN backlog bi ON b.id = bi.id
    SET b.\`order\` = bi.new_order;
  `);
}
