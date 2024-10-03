import { MONTHLY_PRO_PRICE } from "@hey/data/constants";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import getRpc from "src/helpers/getRpc";
import getRates from "src/helpers/lens/getRates";
import type { Address, PublicClient } from "viem";
import { createPublicClient, formatEther } from "viem";
import { polygon } from "viem/chains";

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTransactionWithRetry = async (
  client: PublicClient,
  hash: Address,
  retries: number = MAX_RETRIES
): Promise<any> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await client.getTransaction({ hash });
    } catch {
      if (attempt < retries) {
        logger.error(
          `updateProStatus: Attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
        );
        await sleep(RETRY_DELAY_MS);
      } else {
        throw new Error(`updateProStatus: Failed after ${retries} attempts`);
      }
    }
  }
};

const updateProStatus = async (hash: Address) => {
  if (!hash) {
    throw new Error("updateProStatus: No transaction hash provided");
  }

  logger.info(`updateProStatus: Fetching transaction receipt for ${hash}`);

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: getRpc({ mainnet: true })
    });

    const fiatResult = await getRates();
    const usdRate =
      fiatResult.find((rate) => rate.symbol === "WMATIC")?.fiat || 0;
    const maticRate = usdRate
      ? Number((MONTHLY_PRO_PRICE / usdRate).toFixed(2))
      : MONTHLY_PRO_PRICE;
    const dailyRate = maticRate / 31;

    const transaction = await fetchTransactionWithRetry(client, hash);
    const id = transaction.input;
    const amount = Number.parseFloat(formatEther(transaction.value));
    const numberOfDays = Math.round(amount / dailyRate);
    const newExpiry = new Date(Date.now() + numberOfDays * 24 * 60 * 60 * 1000);

    if (!id) {
      throw new Error("updateProStatus: No profile ID found");
    }

    const existingPro = await prisma.pro.findFirst({
      where: { profileId: id, expiresAt: { gt: new Date() } },
      orderBy: { expiresAt: "desc" }
    });

    if (existingPro?.transactionHash === hash) {
      throw new Error("updateProStatus: Transaction hash already used");
    }

    let expiresAt: Date;
    if (existingPro) {
      // Extend the expiration date if the profile already has a subscription
      expiresAt = new Date(
        existingPro.expiresAt.getTime() + numberOfDays * 24 * 60 * 60 * 1000
      );
    } else {
      // Set a new expiration date if the profile does not have a subscription
      expiresAt = newExpiry;
    }

    const data = await prisma.pro.create({
      data: { amount, transactionHash: hash, expiresAt, profileId: id }
    });

    await delRedis(`profile:${id}`);

    logger.info(
      `updateProStatus: Updated Pro status for ${id} to ${expiresAt}`
    );

    return data;
  } catch (error) {
    throw new Error(`updateProStatus: Failed to update Pro status: ${error}`);
  }
};

export default updateProStatus;
