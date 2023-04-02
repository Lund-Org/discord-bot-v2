import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { number, object } from 'yup';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';

const removeExpectedGameSchema = object({
  igdbGameId: number().required().positive().integer(),
});

export default async function removeExpectedGame(
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

  const payload = await removeExpectedGameSchema.validate(req.body);

  await prisma.expectedGame.delete({
    where: {
      igdbId_userId: {
        igdbId: payload.igdbGameId,
        userId: user.id,
      },
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
