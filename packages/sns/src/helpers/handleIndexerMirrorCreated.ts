import createClickHouseClient from './createClickHouseClient';

interface ReactionData {
  serverPubIdPointer: string;
}

const handleIndexerMirrorCreated = async (data: ReactionData) => {
  const { serverPubIdPointer } = data;
  const clickhouse = createClickHouseClient();

  // Check if the publication exists before updating
  const checkQuery = `
    SELECT id FROM firehose WHERE id = '${serverPubIdPointer}' LIMIT 1;
  `;
  const existsResult = await clickhouse.query(checkQuery).toPromise();

  if (existsResult.length > 0) {
    const updateQuery = `
      ALTER TABLE firehose
      UPDATE mirrorsCount = mirrorsCount + 1
      WHERE id = '${serverPubIdPointer}';
    `;
    await clickhouse.query(updateQuery).toPromise();
  } else {
    console.log(
      `Publication with serverPubIdPointer ${serverPubIdPointer} not found.`
    );
  }
};

export default handleIndexerMirrorCreated;
