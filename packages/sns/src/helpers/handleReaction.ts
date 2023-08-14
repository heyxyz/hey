import createClickHouseClient from './createClickHouseClient';

interface ReactionData {
  profileId: string;
  reaction: string;
}

const handleReaction = async (data: ReactionData) => {
  const { profileId, reaction } = data;
  const clickhouse = createClickHouseClient();

  if (reaction === 'UPVOTE') {
    const query = `
      ALTER TABLE firehose
      UPDATE likesCount = likesCount + 1
      WHERE profileId = '${profileId}';
    `;
    await clickhouse.query(query).toPromise();
  } else {
    const query = `
      ALTER TABLE firehose
      UPDATE likesCount = likesCount - 1
      WHERE profileId = '${profileId}';
    `;
    await clickhouse.query(query).toPromise();
  }
};

export default handleReaction;
