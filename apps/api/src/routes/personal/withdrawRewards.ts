import type { Request, Response } from "express";
import type { Address } from "viem";

import { Errors } from "@hey/data/errors";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import validateSecret from "src/helpers/middlewares/validateSecret";
import { invalidBody, noBody } from "src/helpers/responses";
import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zora } from "viem/chains";
import { object, string } from "zod";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

type ExtensionRequest = {
  amount: string;
};

const validationSchema = object({
  amount: string()
});

export const post = [
  validateSecret,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { amount } = body as ExtensionRequest;

    if (!process.env.ADMIN_PRIVATE_KEY) {
      return res
        .status(400)
        .json({ error: Errors.InvalidEnvironmentVariable, success: false });
    }

    try {
      const account = privateKeyToAccount(
        process.env.ADMIN_PRIVATE_KEY as Address
      );
      const client = createWalletClient({
        account,
        chain: zora,
        transport: http("https://rpc.zora.energy")
      });

      const bigintAmount = BigInt(amount);
      const hash = await client.writeContract({
        abi: ABI,
        address: "0x7777777f279eba3d3ad8f4e708545291a6fdba8b",
        args: ["0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF", bigintAmount],
        functionName: "withdraw"
      });

      logger.info(`Withrawn ${amount} to ${account.address} from Zora`);

      return res.status(200).json({ hash, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
