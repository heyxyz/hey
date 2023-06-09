import axios from 'axios';
import { SANDBOX_VOTES_COLLECT_URL } from 'data/constants';

function getProfileAndPubId(hexString: string): [string, string] {
  const [profileIdStr, pubIdStr] = hexString.split('-');
  const profileId = parseInt(profileIdStr, 16);
  const pubId = parseInt(pubIdStr, 16);
  return [profileId.toString(), pubId.toString()];
}

export async function getVotesbyPubId(hexPair: string) {
  const [profileId, pubId] = getProfileAndPubId(hexPair);
  const pubIdLower = pubId.toLowerCase();
  console.log('pubIdLower: ', pubIdLower);

  const query = `
  {
    collectWithVotes(where: {pubId: ${pubIdLower}}) {
      id
      profileId
      pubId
      collector
      amount
    }
  }
  `;

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(SANDBOX_VOTES_COLLECT_URL, { query }, { headers });
    return response.data.data.collectWithVotes;
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
}

export async function getVotesbyProfileId(hexPair: string) {
  const [profileId, pubId] = getProfileAndPubId(hexPair);
  const profileIdLower = profileId.toLowerCase();

  const query = `
  {
    collectWithVotes(where: {profileId: ${profileIdLower}}) {
      id
      profileId
      profileId
      collector
    }
  }
  `;

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(SANDBOX_VOTES_COLLECT_URL, { query }, { headers });
    return response.data.data.collectWithVotes;
  } catch (error) {
    console.error('Subgraph fetch error: ', error);
  }
}
