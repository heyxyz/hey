import type { Handler } from 'express';

import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { OpenAI } from 'openai';
import { object, string } from 'zod';

type ExtensionRequest = {
  text: string;
};

const validationSchema = object({
  text: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { text } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const { id } = payload;

    const preferences = await prisma.preference.findFirst({ where: { id } });
    if (!preferences?.openAiApiKey) {
      throw new Error('OpenAI API Key not found');
    }

    const openai = new OpenAI({ apiKey: preferences.openAiApiKey });
    const stream = await openai.chat.completions.create({
      messages: [{ content: text, role: 'user' }],
      model: 'gpt-3.5-turbo',
      stream: true
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of stream) {
      if (chunk && chunk.choices && chunk.choices.length > 0) {
        const [choice] = chunk.choices;
        if (choice && choice.delta && choice.delta.content) {
          const { content } = choice.delta;
          res.write(content);
        }
      }
    }

    res.end();
  } catch (error) {
    if (!res.headersSent) {
      catchedError(res, error);
    }
  }
};
