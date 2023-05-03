import type { IRequest } from 'itty-router';
import { error } from 'itty-router';

import { LENSTER_POLLS_SPACE } from '../constants';
import { keysValidator } from '../helpers/keysValidator';
import publicClient from '../helpers/publicClient';
import walletClient from '../helpers/walletClient';
import type { Env } from '../types';

type ExtensionRequest = {
  isMainnet: boolean;
  title: string;
  description: string;
  choices: string[];
  length: number;
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

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { isMainnet, title, description, choices, length } =
    body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  const client = walletClient(env.PROPOSAL_CREATOR_PRIVATE_KEY);
  const block = await publicClient().getBlockNumber();
  const blockNumber = Number(block) - 10;

  const sequencerUrl = isMainnet
    ? 'https://seq.snapshot.org'
    : 'https://testnet.seq.snapshot.org';
  const snapshotUrl = isMainnet
    ? 'https://snapshot.org'
    : 'https://demo.snapshot.org';
  const relayerAddress = isMainnet
    ? '0x6bEDc30348C84718033637a724A2Bf3740CA12B2'
    : '0xc1e2E5900733F07659965843555F8917c8F40abA';

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
        space: LENSTER_POLLS_SPACE,
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
        timestamp: BigInt(Math.floor(Date.now() / 1000))
      }
    };
    const signature = await client.signTypedData({
      primaryType: 'Proposal',
      ...typedData
    });

    const serializedTypedData = JSON.stringify(typedData, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    );

    const response = await fetch(sequencerUrl, {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        address: relayerAddress,
        sig: signature,
        data: JSON.parse(serializedTypedData)
      }),
      method: 'POST'
    });

    const snapshotResponse: SnapshotResponse = await response.json();

    if (!snapshotResponse.id) {
      return new Response(
        JSON.stringify({ success: false, response: snapshotResponse })
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        snapshotUrl: `${snapshotUrl}/#/${LENSTER_POLLS_SPACE}/proposal/${snapshotResponse.id}`
      })
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
