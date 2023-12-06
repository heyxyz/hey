import type { Handler } from 'express';

import catchedError from '@utils/catchedError';
import { invalidBody, noBody } from '@utils/responses';
import axios from 'axios';
import { object, string } from 'zod';

type ExtensionRequest = {
  description: string;
  email: string;
  title: string;
  type: string;
};

const validationSchema = object({
  description: string().min(1).max(5000),
  email: string().email(),
  title: string().min(1).max(100),
  type: string().min(1).max(2)
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

  const { description, email, title, type } = body as ExtensionRequest;

  try {
    const ticket = await axios.post(
      'https://api.intercom.io/tickets',
      {
        contacts: [{ email }],
        ticket_attributes: {
          _default_description_: description,
          _default_title_: title
        },
        ticket_type_id: type
      },
      {
        headers: { Authorization: `Bearer ${process.env.INTERCOM_API_KEY}` }
      }
    );

    return res.status(200).json({ success: true, ticket: ticket.data });
  } catch (error) {
    console.log(error);
    return catchedError(res, error);
  }
};
