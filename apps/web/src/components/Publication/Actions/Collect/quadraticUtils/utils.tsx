import axios from 'axios';

export async function getRoundInfo(grantsRound: string) {
  const lower = grantsRound.toLowerCase();

  const query = `
  {
    rounds(
      orderDirection: desc
      where: {id: "${lower}"}
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
    const response = await axios.post(
      'https://api.thegraph.com/subgraphs/name/bitbeckers/ql-dev',
      { query },
      { headers }
    );
    return response.data.data.rounds[0];
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
}
