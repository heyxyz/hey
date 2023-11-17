import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import {
  HEY_POLLS_SPACE,
  PROPOSAL_CREATOR_ADDRESS,
  SNAPSHOT_SEQUNECER_URL,
  SNAPSHOT_URL
} from 'utils/constants';
import publicClient from 'utils/snapshot/publicClient';
import serializedTypedData from 'utils/snapshot/serializedTypedData';
import walletClient from 'utils/snapshot/walletClient';
import { array, number, object, string } from 'zod';

type SnapshotResponse = {
  id: string;
  ipfs: string;
  relayer: {
    address: string;
    receipt: string;
  };
};

type ExtensionRequest = {
  title: string;
  description: string;
  choices: string[];
  length: number;
};

const validationSchema = object({
  title: string(),
  description: string(),
  choices: array(string()),
  length: number()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  const { title, description, choices, length } = body as ExtensionRequest;

  const sequencerUrl = SNAPSHOT_SEQUNECER_URL;
  const snapshotUrl = SNAPSHOT_URL;
  const relayerAddress = PROPOSAL_CREATOR_ADDRESS;
  const relayerPrivateKey = process.env.PROPOSAL_CREATOR_PRIVATE_KEY as string;

  try {
    const client = walletClient(relayerPrivateKey);
    const block = await publicClient().getBlockNumber();
    const blockNumber = Number(block) - 10;

    const typedData = {
      domain: { name: 'snapshot', version: '0.1.4' },
      types: {
        Proposal: [
          { name: 'from', type: 'address' },
          { name: 'space', type: 'string' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'type', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'body', type: 'string' },
          { name: 'discussion', type: 'string' },
          { name: 'choices', type: 'string[]' },
          { name: 'start', type: 'uint64' },
          { name: 'end', type: 'uint64' },
          { name: 'snapshot', type: 'uint64' },
          { name: 'plugins', type: 'string' },
          { name: 'app', type: 'string' }
        ]
      },
      message: {
        space: HEY_POLLS_SPACE,
        type: 'single-choice',
        title,
        body: description,
        discussion: '',
        choices,
        start: Math.floor(Date.now() / 1000),
        end: Math.floor(Date.now() / 1000) + length * 86400,
        snapshot: blockNumber,
        plugins: '{}',
        app: 'snapshot',
        from: relayerAddress,
        timestamp: Math.floor(Date.now() / 1000)
      }
    };

    const signature = await client.signTypedData({
      primaryType: 'Proposal',
      ...typedData
    });

    const sequencerResponse = await fetch(sequencerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: relayerAddress,
        sig: signature,
        data: JSON.parse(serializedTypedData(typedData))
      })
    });

    const snapshotResponse: SnapshotResponse = await sequencerResponse.json();

    if (!snapshotResponse.id) {
      return res
        .status(400)
        .json({ success: false, response: snapshotResponse });
    }

    return res.status(200).json({
      success: true,
      snapshotUrl: `${snapshotUrl}/#/${HEY_POLLS_SPACE}/proposal/${snapshotResponse.id}`
    });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
