import type { StaffPickType } from '@prisma/client';
import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  replace_id: string;
  type: StaffPickType;
};

const validationSchema = object({
  id: string(),
  replace_id: string(),
  type: string()
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

  const { id, replace_id, type } = body as ExtensionRequest;

  try {
    const deleteStaffPick = await prisma.staffPick.delete({
      where: { id }
    });

    const updateStaffPick = await prisma.staffPick.create({
      data: { id: replace_id, score: deleteStaffPick.score, type }
    });

    logger.info(`Staff pick ${id} replaced with ${replace_id}`);

    return res.status(200).json({ result: updateStaffPick, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
