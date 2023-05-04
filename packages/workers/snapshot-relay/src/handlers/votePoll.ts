import type { IRequest } from 'itty-router';
import { error } from 'itty-router';
import generateSnapshotAccount from 'lib/generateSnapshotAccount';

import { LENSTER_POLLS_SPACE } from '../constants';
import { keysValidator } from '../helpers/keysValidator';
import walletClient from '../helpers/walletClient';

type ExtensionRequest = {
  isMainnet: boolean;
  choice: number;
  ownedBy: string;
  profileId: string;
  snapshotId: string;
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
  'choice',
  'ownedBy',
  'profileId',
  'snapshotId'
];

export default async (request: IRequest) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { isMainnet, choice, ownedBy, profileId, snapshotId } =
    body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  const sequencerUrl = isMainnet
    ? 'https://seq.snapshot.org'
    : 'https://testnet.seq.snapshot.org';

  try {
    const { address, privateKey } = await generateSnapshotAccount({
      ownedBy,
      profileId,
      snapshotId
    });
    const client = walletClient(privateKey, isMainnet);

    const typedData = {
      domain: { name: 'snapshot', version: '0.1.4' },
      types: {
        Vote: [
          { name: 'from', type: 'address' },
          { name: 'space', type: 'string' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'proposal', type: 'bytes32' },
          { name: 'choice', type: 'uint32' },
          { name: 'reason', type: 'string' },
          { name: 'app', type: 'string' },
          { name: 'metadata', type: 'string' }
        ]
      },
      message: {
        space: LENSTER_POLLS_SPACE,
        proposal: snapshotId,
        choice,
        app: 'lenster',
        reason: '',
        metadata: '{}',
        from: address,
        timestamp: Math.floor(Date.now() / 1000)
      }
    };

    const signature = await client.signTypedData({
      primaryType: 'Vote',
      ...typedData
    });

    const serializedTypedData = JSON.stringify(typedData, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    );

    const response = await fetch(sequencerUrl, {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        address,
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

    return new Response(JSON.stringify({ success: true, address }));
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
