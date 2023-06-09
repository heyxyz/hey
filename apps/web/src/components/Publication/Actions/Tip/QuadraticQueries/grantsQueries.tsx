import axios from 'axios';
import { SANDBOX_GRANTS_URL } from 'data/constants';

const apiClient = axios.create({
  baseURL: SANDBOX_GRANTS_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

function graphPostID(lensterPostID: string): string {
  const [hex1] = lensterPostID.split('-').map((hex) => hex.trim());
  const num1 = BigInt(hex1);
  const result = num1.toString(16).padStart(64, '0');
  return `0x${result}`;
}

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

export async function getPostInfo(address: string, postId: string) {
  const addressLower = address.toLowerCase();
  const graphId = graphPostID(postId);
  const query = `{
    qfvotes(
      where: {from: "${addressLower}", projectId: "${graphId}"}
    ) {
      amount
      createdAt
      id
      from
      to
      projectId
    }
  }`;
  const data = await request(query);
  return data.qfvotes;
}
