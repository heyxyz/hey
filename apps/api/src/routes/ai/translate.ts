import lensPg from "@hey/db/lensPg";
import { generateForeverExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

const TEMPLATE = `
Translate the following text to English.
Examples: Hello, How are you?, I am fine, thank you.
Return only the translation in English.
Keep the markdown formatting including line breaks.
Never change the @ mentions, hashtags, links, or any other special characters.
Text: {text}
{format_instructions}
`;

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  validateLensAccount,
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
      const cacheKey = `ai:translation:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) AI Translation fetched for ${id}`);
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_1_DAY)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const publicationResponse = await lensPg.query(
        "SELECT content FROM publication.metadata WHERE publication_id = $1",
        [id]
      );

      const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
        maxRetries: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
        verbose: false
      });
      const translatedResponseSchema = object({
        translated: string().describe("The translated text")
      });
      const parser = StructuredOutputParser.fromZodSchema(
        translatedResponseSchema
      );
      const prompt = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = RunnableSequence.from([prompt, model, parser]);
      const response = await chain.invoke({
        text: publicationResponse[0].content,
        format_instructions: parser.getFormatInstructions()
      });

      const result = {
        original: publicationResponse[0].content,
        translated: response.translated
      };

      await setRedis(cacheKey, JSON.stringify(result), generateForeverExpiry());
      logger.info(`AI Translation fetched for ${id}`);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_1_DAY)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
