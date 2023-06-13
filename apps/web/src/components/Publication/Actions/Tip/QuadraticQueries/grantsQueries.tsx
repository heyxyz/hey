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
    }
  }`;
  const data = await request(query);
  return data.rounds[0];
}

export async function getRoundTippingData(grantsRound: string) {
  const query = `
    query getRoundTippingData($id: String!) {
      round(id: $id) {
        id
        createdAt
        token
        votingStrategy {
          id
          votes {
            id
            amount
            from
            to
            version
            token
          }
        }
        roundEndTime
      }
    }
  `;
  const data = await request(query, { id: grantsRound });
  return data.round;
}

export async function getCurrentActiveRounds(unixTimestamp: number) {
  const query = `{
    rounds(
      where: { roundEndTime_gt: "${unixTimestamp}" }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      roundEndTime
      createdAt
      token
      
    }
  }`;

  const data = await request(query);
  return data.rounds;
}

export async function getAllRounds() {
  const query = `{
    rounds(
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
    }
  }`;
  const data = await request(query);
  return data.rounds;
}

// ************
// POST QUERIES
// ************

export async function getPostQuadraticTipping(pubId: string, roundAddress: string) {
  const query = `
  query GetQuadraticTipping($roundAddressLower: ID!, $postId: String!) {
    quadraticTipping(id: $roundAddressLower) {
      id
      votes(where: {projectId: $postId}) {
        version
        to
        projectId
        token
        round {
          id
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
