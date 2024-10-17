import clickhouseClient from "@hey/db/clickhouseClient";
import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import OpenAI from "openai";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY } from "src/helpers/constants";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  id: string;
}

const validationSchema = object({
  id: string()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { id } = body as ExtensionRequest;

    try {
      const rows = await clickhouseClient.query({
        format: "JSONEachRow",
        query: `SELECT * FROM moderation WHERE id = '${id}';`
      });

      const result = await rows.json();

      if (result.length > 0) {
        logger.info(`(cached) AI Moderation fetched for ${id}`);
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_1_DAY)
          .json({ result: result[0], success: true });
      }

      const publicationResponse = await lensPg.query(
        "SELECT content FROM publication.metadata WHERE publication_id = $1",
        [id]
      );

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: [{ type: "text", text: publicationResponse[0].content }]
      });

      const { flagged, categories, category_scores } = response.results[0];

      const values = {
        id,
        flagged,
        harassment: categories.harassment,
        harassment_threatening: categories["harassment/threatening"],
        sexual: categories.sexual,
        hate: categories.hate,
        hate_threatening: categories["hate/threatening"],
        illicit: categories.illicit,
        illicit_violent: categories["illicit/violent"],
        self_harm_intent: categories["self-harm/intent"],
        self_harm_instructions: categories["self-harm/instructions"],
        self_harm: categories["self-harm"],
        sexual_minors: categories["sexual/minors"],
        violence: categories.violence,
        violence_graphic: categories["violence/graphic"],
        harassment_score: category_scores.harassment,
        harassment_threatening_score: category_scores["harassment/threatening"],
        sexual_score: category_scores.sexual,
        hate_score: category_scores.hate,
        hate_threatening_score: category_scores["hate/threatening"],
        illicit_score: category_scores.illicit,
        illicit_violent_score: category_scores["illicit/violent"],
        self_harm_intent_score: category_scores["self-harm/intent"],
        self_harm_instructions_score: category_scores["self-harm/instructions"],
        self_harm_score: category_scores["self-harm"],
        sexual_minors_score: category_scores["sexual/minors"],
        violence_score: category_scores.violence,
        violence_graphic_score: category_scores["violence/graphic"]
      };

      await clickhouseClient.insert({
        format: "JSONEachRow",
        table: "moderation",
        values
      });

      logger.info(`AI Moderation fetched for ${id}`);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_1_DAY)
        .json({ result: values, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
