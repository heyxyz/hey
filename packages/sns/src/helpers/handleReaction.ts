import createClickHouseClient from './createClickHouseClient';

interface ReactionData {
  serverPubId: string;
  reaction: string;
}

const handleReaction = async (data: ReactionData) => {
  const { serverPubId, reaction } = data;
  const clickhouse = createClickHouseClient();

  if (reaction === 'UPVOTE') {
    const query = `
      ALTER TABLE firehose
      UPDATE likesCount = likesCount + 1
      WHERE id = '${serverPubId}';
    `;
    await clickhouse.query(query).toPromise();
  } else {
    const query = `
      ALTER TABLE firehose
      UPDATE likesCount = likesCount - 1
      WHERE id = '${serverPubId}';
    `;
    await clickhouse.query(query).toPromise();
  }
};

export default handleReaction;
