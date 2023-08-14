import createClickHouseClient from './createClickHouseClient';

interface ReactionData {
  serverPubId: string;
  reaction: string;
}

const handleReaction = async (data: ReactionData) => {
  const { serverPubId, reaction } = data;
  const clickhouse = createClickHouseClient();

  // Check if the publication exists before updating
  const checkQuery = `
    SELECT id FROM firehose WHERE id = '${serverPubId}' LIMIT 1;
  `;
  const existsResult = await clickhouse.query(checkQuery).toPromise();

  if (existsResult.length > 0) {
    const updateQuery = `
      ALTER TABLE firehose
      UPDATE likesCount = likesCount ${reaction === 'UPVOTE' ? '+' : '-'} 1
      WHERE id = '${serverPubId}';
    `;
    await clickhouse.query(updateQuery).toPromise();
  } else {
    console.log(`Publication with serverPubId ${serverPubId} not found.`);
  }
};

export default handleReaction;
