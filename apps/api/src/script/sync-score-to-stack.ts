import logger from '@hey/helpers/logger';
import axios from 'axios';

import lensPg from '../db/lensPg';

const baseUrl = 'https://api.hey.xyz/score/get';
const batchSize = 7;
const limit = 300000;
const offset = 154000;

const getProfiles = async () => {
  const profiles = await lensPg.query(
    `
      SELECT profile_id FROM profile.record
      ORDER BY block_timestamp ASC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return profiles;
};

const sync = async (profileId: string) => {
  try {
    const { data } = await axios.get(baseUrl, { params: { id: profileId } });
    logger.info(
      `Synced score to Stack.so for ${profileId} - ${parseInt(profileId)} - ${data.score}`
    );
  } catch (error) {
    logger.error('Error syncing score:', error as Error);
  }
};

const syncScoreToStack = async () => {
  const profiles = await getProfiles();

  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    const syncPromises = batch.map(async (profile) => {
      await sync(profile.profile_id);
    });

    await Promise.all(syncPromises);
  }
};

syncScoreToStack();
