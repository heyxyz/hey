import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import axios from "axios";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  description: string;
  email: string;
  title: string;
}

const validationSchema = object({
  description: string().min(20).max(20000),
  email: string().email(),
  title: string().min(5).max(1000)
});

// TODO: Add tests
export const post = [
  rateLimiter({ requests: 3, within: 60 }),
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
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const constructedDescription = payload.id
        ? `${description}\n\n**Profile**: https://hey.xyz/profile/${payload.id}`
        : description;

      // New Issue
      const { data: newIssueData } = await axios.post(
        "https://gitlab.com/api/v4/projects/61401782/issues",
        { description: constructedDescription, title },
        { headers: { "PRIVATE-TOKEN": process.env.GITLAB_ACCESS_TOKEN } }
      );

      const { iid: id } = newIssueData;
      const headers = { "PRIVATE-TOKEN": process.env.GITLAB_ACCESS_TOKEN };

      // Convert to Ticket
      axios.post(
        `https://gitlab.com/api/v4/projects/61401782/issues/${id}/notes`,
        { body: `/convert_to_ticket ${email}` },
        { headers }
      );

      const promises = [
        // Send Acknowledgement
        axios.post(
          `https://gitlab.com/api/v4/projects/61401782/issues/${id}/notes`,
          {
            body: `Hey, Thank you for contacting us!. We will get back to you as soon as possible. Your ticket number is **#${id}**`
          },
          { headers }
        )
      ];

      Promise.all(promises);

      logger.info(`New support ticket created for ${payload.id}`);

      return res.status(200).json({ id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
