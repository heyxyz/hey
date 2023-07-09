import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SANDBOX_GRANTS_URL } from 'data/constants';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useChainId } from 'wagmi';

import { decodePublicationId, encodePublicationId } from '../utils';

const getGraphEndpoint = (chainId: number) => {
  switch (chainId) {
    case 80001:
      return SANDBOX_GRANTS_URL;
    default:
      throw new Error('ChainId not supported');
  }
};

async function fetchGraphQL(chainId: number, query: string, variables: any = {}) {
  const graphEndpoint = getGraphEndpoint(chainId);
  const apiClient = axios.create({
    baseURL: graphEndpoint,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  try {
    const response = await apiClient.post('', { query, variables });
    return response.data.data;
  } catch (error) {
    throw new Error('Subgraph fetch error: ' + error);
  }
}

// *************
// ROUND QUERIES
// *************

export async function getRoundInfo(chainId: number, grantsRound: string) {
  const roundLower = grantsRound.toLowerCase();
  const query = `{
    rounds(
      orderDirection: desc
      where: {id: "${roundLower}"}
    ) {
      id
      roundEndTime
      payoutStrategy
      votingStrategy {
        id
      }
      program {
        id
      }
      roundStartTime
      token
      roundMetaPtr {
        id
        pointer
        protocol
      }
    }
  }`;

  const data = await fetchGraphQL(chainId, query);
  return data.rounds[0];
}

export const useGetRoundInfo = (grantsRound: string | undefined) => {
  const chainId = useChainId();
  return useQuery(['getRoundInfo', grantsRound, chainId], async () => {
    if (!grantsRound) {
      return null;
    }
    return getRoundInfo(chainId, grantsRound);
  });
};

export async function getUserQuadraticTippingData(chainId: number, roundAddress: string, address: string) {
  const query = `
  query GetUserQuadraticTippingData($roundAddressLower: String!, $addressLower: String!) {
    quadraticTippings(where: {id: $roundAddressLower}) {
      id
      readyForPayout
      distributions {
        id
        address
        amount
      }
      votes(where: {to: $addressLower}) {
        projectId
        amount
        to
        from
      }
    }
  }`;
  const variables = {
    roundAddressLower: roundAddress.toLowerCase(),
    addressLower: address.toLowerCase()
  };
  const data = await fetchGraphQL(chainId, query, variables);

  return data.quadraticTippings;
}

// export async function getRoundTippingData(grantsRound: string) {
//   const query = `
//     query getRoundTippingData($id: String!) {
//       round(id: $id) {
//         id
//         createdAt
//         token
//         votingStrategy {
//           id
//           votes {
//             id
//             amount
//             from
//             to
//             version
//             token
//           }
//         }
//         roundEndTime
//       }
//     }
//   `;
//   const data = await request(query, { id: grantsRound });
//   return data.round;
// }

export async function getCurrentActiveRounds(chainId: number, unixTimestamp: number) {
  const query = `
    query GetCurrentActiveRounds($unixTimestamp: String!) {
    rounds(
      where: { roundEndTime_gt: $unixTimestamp }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      roundEndTime
      createdAt
      token
      roundMetaPtr {
        id
        pointer
      }
      
    }
}`;

  const metadataQuery = `
query GetRoundMetaData($pointer: String!) {
  roundMetaData(id: $pointer) {
    supportEmail
    requirements
    name
    id
    description
  }
}
`;
  let concatRounds = [];

  const variables = {
    unixTimestamp: unixTimestamp.toString()
  };

  const data = await fetchGraphQL(chainId, query, variables);

  const metaDataPromises = data.rounds.map((round: any) => {
    const { pointer } = round.roundMetaPtr;
    const metaDataVariables = {
      pointer
    };

    return fetchGraphQL(chainId, metadataQuery, metaDataVariables);
  });

  const metaDataResponses = await Promise.all(metaDataPromises);

  for (let i = 0; i < data.rounds.length; i++) {
    let metaData = metaDataResponses[i];

    if (!metaData || !metaData.roundMetaData) {
      metaData = {
        roundMetaData: {
          supportEmail: '',
          requirements: [],
          name: '',
          id: '',
          description: ''
        }
      };
    }

    Object.assign(data.rounds[i], metaData);
    concatRounds.push(data.rounds[i]);
  }

  return concatRounds;
}

export async function getRoundUserData(chainId: number, roundAddress: string, address: string) {
  const query = `
  query getRoundUserData($roundAddressLower: ID!, $addressLower: String!) {
    rounds(where: {id: $roundAddressLower}) {
      id
      roundStartTime
      roundEndTime
      votingStrategy {
        votes(where: {to: $addressLower}) {
          to
          amount
        }
      }
    }
  }`;

  const variables = {
    roundAddressLower: roundAddress.toLowerCase(),
    addressLower: address.toLowerCase()
  };

  const data = await fetchGraphQL(chainId, query, variables);

  return data.rounds;
}

// ************
// POST QUERIES
// ************

export async function getPostQuadraticTipping(chainId: number, pubId: string, roundAddress: string) {
  const query = `
  query GetPostQuadraticTipping($roundAddressLower: ID!, $postId: String!) {
    quadraticTipping(id: $roundAddressLower) {
      id
      votes(where: {projectId: $postId}) {
        version
        to
        projectId
        token
        round {
          id
          roundEndTime
        }
        id
        from
        createdAt
        amount
      }
    }
  }`;
  const variables = {
    roundAddressLower: roundAddress.toLowerCase(),
    postId: encodePublicationId(pubId)
  };

  const data = await fetchGraphQL(chainId, query, variables);
  return data.quadraticTipping;
}

export function useGetPostQuadraticTipping(pubId: string, roundAddress: string | undefined) {
  const chainId = useChainId();
  return useQuery(
    ['getPostQuadraticTipping', pubId, roundAddress, chainId],
    async () => {
      if (!roundAddress) {
        return null;
      }
      return getPostQuadraticTipping(chainId, pubId, roundAddress);
    },
    {
      select: (data) => {
        if (!data) {
          return data;
        }
        const votes = data?.votes || [];
        let voteTipTotal = BigNumber.from(0);
        for (const vote of votes) {
          if (!vote) {
            continue;
          }
          voteTipTotal = voteTipTotal.add(BigNumber.from(vote.amount));
        }
        return {
          ...data,
          voteTipTotal
        };
      }
    }
  );
}

export async function getRoundQuadraticTipping(chainId: number, roundAddress: string) {
  const query = `
  query GetRoundQuadraticTipping($roundAddressLower: ID!) {
    quadraticTipping(id: $roundAddressLower) {
      id
      matchAmount
    }
  }`;
  const variables = {
    roundAddressLower: roundAddress.toLowerCase()
  };

  const data = await fetchGraphQL(chainId, query, variables);
  return data.quadraticTipping;
}

export interface RoundStats {
  totalMatched: string;
  totalTipped: string;
  uniqueTippers: number;
  uniqueTippedPosts: number;
  averageTip: string;
  averageTipsPerPost: string;
  posts: {
    publicationId: string;
    uniqueContributors: number;
    totalTippedInToken: string;
  }[];
  roundMetaPtr: string;
  roundStartTime: number;
  roundEndTime: number;
  token: string;
}

export const useQueryQFRoundStats = ({ refetchInterval }: { refetchInterval?: number } = {}) => {
  const query = `
  query GetAllTimeStats($unixTimestamp: String!) {
    quadraticTippings(
      orderBy: round__createdAt,
      orderDirection:desc,
      where: { round_: { roundEndTime_gte: $unixTimestamp } }
    ) {
      id
      matchAmount
      votes {
        id
        from
        amount
        projectId
      }
      round {
        token
        roundStartTime
        roundEndTime
        roundMetaPtr {
          pointer
        }
      }
    }
    quadraticTippingDistributions {
      amount
    }
  }`;

  const unixNow = Math.floor(Date.now() / 1000).toString();
  const variables = {
    unixTimestamp: unixNow
  };

  const chainId = useChainId();

  return useQuery(['all-time-stats', chainId], () => fetchGraphQL(chainId, query, variables), {
    refetchOnMount: false,
    refetchInterval,
    select: (data) => {
      let totalMatched = BigNumber.from(0);
      let totalTipped = BigNumber.from(0);
      const tippersDictionary = new Set<string>();

      const roundStatsByRound: Record<string, RoundStats> = {};

      for (const round of data.quadraticTippings) {
        let tippedInRound = BigNumber.from(0);
        const tippersInRound = new Set<string>();
        const postsInRound = new Set<string>();
        const posts: Record<
          string,
          {
            uniqueContributors: Set<string>;
            totalTippedInToken: BigNumber;
          }
        > = {};

        for (const vote of round.votes) {
          tippersDictionary.add(vote.from);
          tippersInRound.add(vote.from);
          postsInRound.add(vote.projectId);
          totalTipped = totalTipped.add(vote.amount);
          tippedInRound = tippedInRound.add(vote.amount);

          const publicationId = decodePublicationId(vote.projectId);

          if (!posts[publicationId]) {
            posts[publicationId] = {
              uniqueContributors: new Set<string>([vote.from]),
              totalTippedInToken: BigNumber.from(0)
            };
          } else {
            posts[publicationId].totalTippedInToken = posts[publicationId].totalTippedInToken.add(
              vote.amount
            );
            posts[publicationId].uniqueContributors.add(vote.from);
          }
        }

        const formattedPosts = Object.entries(posts)
          .map(([publicationId, { uniqueContributors, totalTippedInToken }]) => ({
            publicationId,
            uniqueContributors: uniqueContributors.size,
            totalTippedInToken: formatEther(totalTippedInToken)
          }))
          .sort((a, b) => Number(b.totalTippedInToken) - Number(a.totalTippedInToken));

        const matchedInRound = formatEther(round.matchAmount);

        roundStatsByRound[round.id] = {
          token: round.round.token,
          totalMatched: matchedInRound,
          totalTipped: formatEther(tippedInRound),
          uniqueTippers: tippersInRound.size,
          uniqueTippedPosts: postsInRound.size,
          averageTip: round.votes.length ? formatEther(tippedInRound.div(round.votes.length)) : '0',
          averageTipsPerPost: round.votes.length ? (round.votes.length / postsInRound.size).toString() : '0',
          posts: formattedPosts,
          roundMetaPtr: round.round.roundMetaPtr.pointer,
          roundStartTime: Number(round.round.roundStartTime),
          roundEndTime: Number(round.round.roundEndTime)
        };
      }

      for (const dist of data.quadraticTippingDistributions) {
        totalMatched = totalMatched.add(dist.amount);
      }

      return {
        numberOfRounds: data.quadraticTippings.length as number,
        totalMatched: formatEther(totalMatched),
        totalTipped: formatEther(totalTipped),
        totalTippers: Object.keys(tippersDictionary).length,
        roundStatsByRound
      };
    }
  });
};

export interface RoundMetaData {
  description: string;
  id: string;
  name: string;
  requirements: string[];
  supportEmail: string;
}

export const useGetRoundMetaData = (roundMetaPtr: string) => {
  const chainId = useChainId();
  const query = `
    query GetRoundMeta($roundMetaPtr: String!) {
      roundMetaData(id: $roundMetaPtr) {
        description
        id
        name
        requirements
        supportEmail
      }
    }
  `;
  const variables = {
    roundMetaPtr
  };

  return useQuery(['round-meta', roundMetaPtr, chainId], () => fetchGraphQL(chainId, query, variables), {
    refetchOnMount: false,
    select: (data) => {
      return data.roundMetaData as RoundMetaData;
    }
  });
};

export const useGetRoundMetaDatas = (roundMetaPtrs: string[]) => {
  const query = `
    query GetRoundMeta($roundMetaPtrs: [String!]!) {
      roundMetaDatas(where: {id_in: $roundMetaPtrs}) {
        description
        id
        name
        requirements
        supportEmail
      }
}`;

  const variables = {
    roundMetaPtrs
  };

  const chainId = useChainId();

  return useQuery(
    ['round-metas', roundMetaPtrs, chainId],
    () => {
      if (!roundMetaPtrs.length) {
        return { roundMetaDatas: [] };
      }
      return fetchGraphQL(chainId, query, variables);
    },
    {
      keepPreviousData: true,
      refetchOnMount: false,
      select: (data) => {
        const result: Record<string, RoundMetaData> = {};
        for (const roundMeta of data.roundMetaDatas as RoundMetaData[]) {
          result[roundMeta.id] = roundMeta;
        }
        return result;
      }
    }
  );
};

export interface MatchingUpdateEntry {
  id: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  matchAmountInUSD: number;
  totalContributionsInUSD: number;
  totalContributionsInToken: string;
  matchPoolPercentage: number;
  matchAmountInToken: number;
  uniqueContributorsCount: number;
}

type ApiResult<T> = {
  data: T;
  success: boolean;
};

export const useGetRoundMatchingUpdate = (roundId: string) => {
  const chainId = useChainId();
  return useQuery(
    ['round-matching-overview', roundId, chainId],
    () => {
      // TODO: Do not hardcode chainId
      return axios.get<ApiResult<MatchingUpdateEntry[]>>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/data/match/round/${chainId}/${roundId}`
      );
    },
    {
      select: (response) => {
        const posts: Record<string, MatchingUpdateEntry> = {};

        if (Array.isArray(response.data.data)) {
          for (const entry of response.data.data) {
            posts[entry.projectId] = entry;
          }
        }
        return {
          posts
        };
      }
    }
  );
};

export const useGetManyPublicationMatchData = (roundId: string, publicationIds: string[]) => {
  const chainId = useChainId();
  return useQuery(
    ['publication-match-data', roundId, publicationIds, chainId],
    () => {
      return axios.get<ApiResult<MatchingUpdateEntry[]>>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/data/match/round/projectIds/${chainId}/${roundId}`,
        {
          params: {
            projectId: publicationIds
          }
        }
      );
    },
    {
      select: (response) => {
        const result: Record<string, MatchingUpdateEntry> = {};

        if (!response.data.success) {
          return result;
        }

        for (const entry of response.data.data) {
          result[entry.projectId] = entry;
        }

        return result;
      }
    }
  );
};

export const useGetPublicationMatchData = (roundId: string | undefined, publicationId: string) => {
  const chainId = useChainId();
  return useQuery(
    ['publication-match-data', roundId, publicationId, chainId],
    () => {
      if (!roundId) {
        return null;
      }
      return axios.get<ApiResult<MatchingUpdateEntry[]>>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/data/match/round/projectIds/${chainId}/${roundId}`,
        {
          params: {
            projectId: [publicationId]
          }
        }
      );
    },
    {
      select: (response) => {
        if (!response?.data.success) {
          return null;
        }

        return response.data.data[0];
      }
    }
  );
};

export const useQueryTokenPrices = () => {
  return useQuery(
    ['token-prices'],
    () => {
      return axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=weth%2Cmatic-network%2Cdai&vs_currencies=usd`)
        .then((response) => response.data);
    },
    {
      refetchOnMount: false
    }
  );
};

export interface QFContributionSummary {
  contributionCount: number;
  uniqueContributors: number;
  totalContributionsInUSD?: number;
  averageUSDContribution?: number;
  totalTippedInToken: string;
  averageTipInToken: string;
}

export const useGetQFContributionSummary = (roundId: string) => {
  const chainId = useChainId();
  return useQuery(
    ['qf-contribution-summary', roundId],
    () => {
      return axios.get<ApiResult<QFContributionSummary>>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/data/summary/round/${chainId}/${roundId}`
      );
    },
    {
      refetchOnMount: false,
      refetchInterval: 60 * 1000,
      select: (response) => {
        if (!response.data.success) {
          return null;
        }
        return response.data.data;
      }
    }
  );
};
