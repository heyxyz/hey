import { HEY_APP } from "@hey/data/constants";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { heyWalletClient } from "src/helpers/heyWalletClient";
import { noBody } from "src/helpers/responses";

const domain = {
  name: "Lens Source",
  version: "1",
  chainId: 37111,
  verifyingContract: HEY_APP
} as const;

const types = {
  SourceStamp: [
    { name: "source", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
} as const;

export const post = [
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    try {
      const signature = await heyWalletClient.signTypedData({
        domain,
        types,
        primaryType: "SourceStamp",
        message: { source: HEY_APP, nonce: body.nonce, deadline: body.deadline }
      });

      return res.status(200).json({ allowed: true, signature });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
