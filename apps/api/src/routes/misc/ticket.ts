import type { Request, Response } from "express";

import axios from "axios";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

type ExtensionRequest = {
  description: string;
  email: string;
  title: string;
};

const validationSchema = object({
  description: string().min(20).max(10000),
  email: string().email(),
  title: string().min(5).max(500)
});

export const post = [
  rateLimiter({ requests: 10, within: 60 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { description, email, title } = body as ExtensionRequest;

    try {
      // New Issue
      const { data: newIssueData } = await axios.post(
        "https://gitlab.com/api/v4/projects/61401782/issues",
        { description, title },
        { headers: { "PRIVATE-TOKEN": process.env.GITLAB_ACCESS_TOKEN } }
      );

      const { iid: id } = newIssueData;

      // Convert to Ticket
      axios.post(
        `https://gitlab.com/api/v4/projects/61401782/issues/${id}/notes`,
        { body: `/convert_to_ticket ${email}` },
        { headers: { "PRIVATE-TOKEN": process.env.GITLAB_ACCESS_TOKEN } }
      );

      // Send Acknowledgement
      axios.post(
        `https://gitlab.com/api/v4/projects/61401782/issues/${id}/notes`,
        {
          body: `Hey, We've received your request. We will get back to you as soon as possible. Your ticket number is #${id}`
        },
        { headers: { "PRIVATE-TOKEN": process.env.GITLAB_ACCESS_TOKEN } }
      );

      return res.status(200).json({ id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
