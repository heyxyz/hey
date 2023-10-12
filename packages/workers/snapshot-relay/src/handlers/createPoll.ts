import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import {
  HEY_POLLS_SPACE,
  MAINNET_PROPOSAL_CREATOR_ADDRESS,
  MAINNET_SNAPSHOT_SEQUNECER_URL,
  MAINNET_SNAPSHOT_URL,
  TESTNET_PROPOSAL_CREATOR_ADDRESS,
  TESTNET_SNAPSHOT_SEQUNECER_URL,
  TESTNET_SNAPSHOT_URL
} from '../constants';
import { keysValidator } from '../helpers/keysValidator';
import publicClient from '../helpers/publicClient';
import serializedTypedData from '../helpers/serializedTypedData';
import walletClient from '../helpers/walletClient';
import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  title: string;
  description: string;
  choices: string[];
  length: number;
  isMainnet: boolean;
};

type SnapshotResponse = {
  id: string;
  ipfs: string;
  relayer: {
    address: string;
    receipt: string;
  };
};

const requiredKeys: (keyof ExtensionRequest)[] = [
  'isMainnet',
  'title',
  'description',
  'choices',
  'length'
];

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const { isMainnet, title, description, choices, length } =
    body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  const sequencerUrl = isMainnet
    ? MAINNET_SNAPSHOT_SEQUNECER_URL
    : TESTNET_SNAPSHOT_SEQUNECER_URL;
  const snapshotUrl = isMainnet ? MAINNET_SNAPSHOT_URL : TESTNET_SNAPSHOT_URL;
  const relayerAddress = isMainnet
    ? MAINNET_PROPOSAL_CREATOR_ADDRESS
    : TESTNET_PROPOSAL_CREATOR_ADDRESS;
  const relayerPrivateKey = isMainnet
    ? request.env.MAINNET_PROPOSAL_CREATOR_PRIVATE_KEY
    : request.env.TESTNET_PROPOSAL_CREATOR_PRIVATE_KEY;

  const client = walletClient(relayerPrivateKey, isMainnet);
  const block = await publicClient(isMainnet).getBlockNumber();
  const blockNumber = Number(block) - 10;

  try {
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
      return response({ success: false, response: snapshotResponse });
    }

    return response({
      success: true,
      snapshotUrl: `${snapshotUrl}/#/${HEY_POLLS_SPACE}/proposal/${snapshotResponse.id}`
    });
  } catch (error) {
    throw error;
  }
};
