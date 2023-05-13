import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { number, object, string } from 'yup';

import { authOptions } from '../auth/[...nextauth]';

const updateBacklogDetailsSchema = object({
  igdbGameId: number().required().positive().integer(),
  note: string().max(255).required(),
});

export default async function updateBacklogDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false });
  }

  const user = await prisma.user.findFirst({
    where: {
      discordId: session.userId,
      isActive: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false });
  }
  const payload = await updateBacklogDetailsSchema.validate(req.body);

  await prisma.backlogItem.update({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: payload.igdbGameId,
      },
    },
    data: {
      note: payload.note,
    },
  });

  res.json({ success: true });
}
