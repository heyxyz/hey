import createClickHouseClient from './createClickHouseClient';

interface PublicationHidden {
  serverPubId?: string;
}

const handlePublicationHidden = async (data: PublicationHidden) => {
  const { serverPubId } = data;

  const clickhouse = createClickHouseClient();
  const query = `
    ALTER TABLE firehose
    DELETE WHERE pubId = '${serverPubId}';
  `;
  await clickhouse.query(query).toPromise();
};

export default handlePublicationHidden;
