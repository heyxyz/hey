import type { EasPoll } from '@hey/types/hey';
import type { AxiosResponse } from 'axios';
import type { Handler } from 'express';
import type { PublicClient } from 'viem';

import { EasPollActionModule } from '@hey/abis/EasPollActionModule';
import EasEndpoint from '@hey/data/eas-endpoint';
import LensEndpoint from '@hey/data/lens-endpoints';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import axios from 'axios';
import { RPC_URL } from 'src/lib/constants';
import {
  createPublicClient,
  encodeAbiParameters,
  hexToBigInt,
  hexToString,
  http,
  trim
} from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

import catchedError from '../../../lib/catchedError';
import { noBody } from '../../../lib/responses';

interface VoteCount {
  _count: {
    _all: number;
  };
}

interface VoteCountData {
  data: {
    option0: VoteCount[];
    option1: VoteCount[];
    option2: VoteCount[];
    option3: VoteCount[];
  };
}

const getProfile = async (profileId: string, isMainnet: boolean) => {
  const profileRes = await axios.post(
    isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    {
      query: `
        query GetProfile {
            profile(request: { forProfileId: "${profileId}" }) {
              ownedBy {
                  address
              }
            }
        }
        `
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Hey.xyz'
      },
      withCredentials: true
    }
  );

  return profileRes.data.data.profile;
};

const getExistingVote = async (
  client: PublicClient,
  profileId: bigint,
  pubId: bigint,
  profileOwner: `0x${string}`
) => {
  try {
    const existingVote = await client.readContract({
      abi: EasPollActionModule,
      address: VerifiedOpenActionModules.Poll as `0x${string}`,
      args: [profileId, pubId, profileOwner],
      functionName: 'getVote'
    });
    return existingVote.optionIndex;
  } catch (error) {
    // no vote
  }
  return;
};

export const get: Handler = async (req, res) => {
  const { publicationId } = req.query;

  if (!publicationId || typeof publicationId !== 'string') {
    return noBody(res);
  }

  const network = req.headers['x-lens-network'] as string;
  const isMainnet = network === 'mainnet';

  try {
    const client = createPublicClient({
      chain: isMainnet ? polygon : polygonMumbai,
      transport: http(RPC_URL)
    });

    const profileId = BigInt(publicationId.split('-')[0]);
    const pubId = BigInt(publicationId.split('-')[1]);

    let votedIndex: number | undefined;

    const accessToken = req.headers['x-access-token'] as string;
    if (accessToken) {
      const payload = parseJwt(accessToken);
      const { id } = payload;

      const profile = await getProfile(id, isMainnet);

      if (!profile) {
        return res
          .status(400)
          .json({ error: 'Profile not found.', success: false });
      }

      votedIndex = await getExistingVote(
        client,
        profileId,
        pubId,
        profile.ownedBy.address
      );
    }

    const poll = await client.readContract({
      abi: EasPollActionModule,
      address: VerifiedOpenActionModules.Poll as `0x${string}`,
      args: [profileId, pubId],
      functionName: 'getPoll'
    });

    if (!poll) {
      return res.status(400).json({ error: 'Poll not found.', success: false });
    }

    const pollId = encodeAbiParameters(
      [
        { name: 'publicationProfileId', type: 'uint256' },
        { name: 'publicationId', type: 'uint256' }
      ],
      [profileId, pubId]
    );

    const schemaId: any = await client.readContract({
      abi: EasPollActionModule,
      address: VerifiedOpenActionModules.Poll as `0x${string}`,
      functionName: 'schemaUid'
    });

    const easResponse: AxiosResponse<VoteCountData> = await axios.post(
      isMainnet ? EasEndpoint.Mainnet : EasEndpoint.Testnet,
      {
        query: `
           query GetVoteCountForOptions(
              $schemaId: String!,
              $pollId: String!
          ) { 
            option0: groupByAttestation(
              where: { 
                schemaId: { equals: $schemaId }
                decodedDataJson: { 
                  contains: "{\\"name\\":\\"optionIndex\\",\\"type\\":\\"uint8\\",\\"value\\":0}" 
                } 
                data: { startsWith: $pollId }
                revoked: { equals: false } 
              }
              by: [schemaId]
            ) {
              _count {
                _all
              }
            }
            option1: groupByAttestation(
              where: { 
                schemaId: { equals: $schemaId }
                decodedDataJson: { 
                  contains: "{\\"name\\":\\"optionIndex\\",\\"type\\":\\"uint8\\",\\"value\\":1}" 
                } 
                data: { startsWith: $pollId }
                revoked: { equals: false } 
              }
              by: [schemaId]
            ) {
              _count {
                _all
              }
            }
            option2: groupByAttestation(
              where: { 
                schemaId: { equals: $schemaId }
                decodedDataJson: { 
                  contains: "{\\"name\\":\\"optionIndex\\",\\"type\\":\\"uint8\\",\\"value\\":2}" 
                } 
                data: { startsWith: $pollId }
                revoked: { equals: false } 
              }
              by: [schemaId]
            ) {
              _count {
                _all
              }
            }
            option3: groupByAttestation(
              where: { 
                schemaId: { equals: $schemaId }
                decodedDataJson: { 
                  contains: "{\\"name\\":\\"optionIndex\\",\\"type\\":\\"uint8\\",\\"value\\":3}" 
                } 
                data: { startsWith: $pollId }
                revoked: { equals: false } 
              }
              by: [schemaId]
            ) {
              _count {
                _all
              }
            }
          }
        `,
        variables: { pollId, schemaId }
      }
    );

    const counts = Object.values<VoteCount[]>(easResponse.data.data).map(
      (option) => option[0]?._count?._all ?? 0
    );
    const totalResponses = counts.reduce((acc, count) => acc + count, 0);

    let optionStrings = poll.options
      .filter((option) => hexToBigInt(option) !== 0n)
      .map((option) => hexToString(trim(option, { dir: 'right' })));

    const sanitizedData: EasPoll = {
      endsAt: poll.endTimestamp
        ? new Date(poll.endTimestamp * 1000)
        : undefined,
      followersOnly: poll.followersOnly,
      options: optionStrings.map((option, index) => ({
        index,
        option,
        percentage:
          totalResponses > 0 ? (counts[index] / totalResponses) * 100 : 0,
        responses: counts[index],
        voted: votedIndex === index
      })),
      publicationId,
      signatureRequired: poll.signatureRequired,
      ...(poll.gateParams.minThreshold > 0n && {
        gateParams: {
          minThreshold: poll.gateParams.minThreshold.toString(),
          tokenAddress: poll.gateParams.tokenAddress
        }
      })
    };

    logger.info('Poll fetched');

    return res.status(200).json({ result: sanitizedData, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
