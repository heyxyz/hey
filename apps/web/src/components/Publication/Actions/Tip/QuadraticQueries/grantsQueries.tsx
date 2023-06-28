import axios from 'axios';
import { SANDBOX_GRANTS_URL } from 'data/constants';

import { encodePublicationId } from '../utils';

const apiClient = axios.create({
  baseURL: SANDBOX_GRANTS_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function request(query: string, variables: any = {}) {
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

export async function getRoundInfo(grantsRound: string) {
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
  const data = await request(query);
  return data.rounds[0];
}

export async function getUserQuadraticTippingData(roundAddress: string, address: string) {
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
  const data = await request(query, variables);

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

export async function getCurrentActiveRounds(unixTimestamp: number) {
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

  const data = await request(query, variables);

  const metaDataPromises = data.rounds.map((round: any) => {
    const { pointer } = round.roundMetaPtr;
    const metaDataVariables = {
      pointer
    };

    return request(metadataQuery, metaDataVariables);
  });

  const metaDataResponses = await Promise.all(metaDataPromises);

  for (let i = 0; i < data.rounds.length; i++) {
    Object.assign(data.rounds[i], metaDataResponses[i]);
    concatRounds.push(data.rounds[i]);
  }

  console.log(concatRounds);

  return concatRounds;
}

export async function getRoundUserData(roundAddress: string, address: string) {
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

  const data = await request(query, variables);

  return data.rounds;
}

// ************
// POST QUERIES
// ************

export async function getPostQuadraticTipping(pubId: string, roundAddress: string) {
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

  const data = await request(query, variables);
  return data.quadraticTipping;
}

// ************
// IPFS QUERIES
// ************

// export async function getRoundName(roundMetaPtr: string) {
//   const query = `${CLOUDFLARE_IPFS_GATEWAY}/${roundMetaPtr}`;

//   try {
//     const response = await axios.get(query);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
