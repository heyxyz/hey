import axios from 'axios';
import { SANDBOX_GRANTS_URL } from 'data/constants';

function graphPostID(lensterPostID: string): string {
  const [hex1, hex2] = lensterPostID.split('-').map((hex) => hex.trim());
  const num1 = BigInt(hex1);
  const result = num1.toString(16).padStart(64, '0');
  return `0x${result}`;
}

export async function getRoundInfo(grantsRound: string) {
  const roundLower = grantsRound.toLowerCase();

  const query = `
  {
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
  }
  `;

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(SANDBOX_GRANTS_URL, { query }, { headers });
    return response.data.data.rounds[0];
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
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

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(
      SANDBOX_GRANTS_URL,
      { query, variables: { id: grantsRound } },
      { headers }
    );
    return response.data.data.round;
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
}

export async function getPostInfo(address: string, postId: string) {
  const addressLower = address.toLowerCase();
  const graphId = graphPostID(postId);
  const query = `
  {
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
  }
  `;

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(SANDBOX_GRANTS_URL, { query }, { headers });
    return response.data.data.qfvotes;
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
}

// temp function to get unexpired round, until round selector is implemented in next iteration
export async function getCurrentRound(blockTimestamp: number) {
  const query = `
  {
    rounds(
      where: {roundEndTime_gt: "${blockTimestamp}"}
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
    }
  }
  `;

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(SANDBOX_GRANTS_URL, { query }, { headers });
    return response.data.data.rounds;
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
}
