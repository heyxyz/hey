import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  ids: string;
};

const validationSchema = object({
  id: string(),
  ids: string().regex(/0x[\dA-Fa-f]+/g, {
    message: 'Invalid user IDs'
  })
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { id: featureId, ids } = body as ExtensionRequest;

  try {
    const parsedIds = JSON.parse(ids) as string[];

    // remove duplicates that already have the feature
    const profiles = await prisma.profileFeature.findMany({
      where: { featureId, profileId: { in: parsedIds } }
    });

    const idsToAssign = parsedIds.filter(
      (profile_id) =>
        !profiles.some((profile) => profile.profileId === profile_id)
    );

    const result = await prisma.profileFeature.createMany({
      data: idsToAssign.map((profileId) => ({ featureId, profileId })),
      skipDuplicates: true
    });

    logger.info(`Bulk assigned features for ${ids.length} profiles`);

    return res.status(200).json({ assigned: result.count, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
