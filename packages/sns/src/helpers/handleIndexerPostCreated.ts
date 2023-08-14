import createClickHouseClient from './createClickHouseClient';

const IPFS_GATEWAY = 'https://ipfs.lenster.xyz/ipfs/';
const ARWEAVE_GATEWAY = 'https://arweave.net/';
const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return '';
  }

  let link = hash.replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}${hash}`);
  link = link.replace('https://ipfs.io/ipfs/', IPFS_GATEWAY);
  link = link.replace('ipfs://ipfs/', IPFS_GATEWAY);
  link = link.replace('ipfs://', IPFS_GATEWAY);
  link = link.replace('ar://', ARWEAVE_GATEWAY);

  return link;
};

interface IndexerPostCreated {
  profileId?: string;
  serverPubId?: string;
  contentURI?: string;
  collectModule?: string;
  collectModuleReturnData?: string;
  referenceModule?: string;
  referenceModuleReturnData?: string;
  timestamp?: string;
}

const handleIndexerPostCreated = async (data: IndexerPostCreated) => {
  const {
    profileId,
    serverPubId,
    contentURI,
    collectModule,
    collectModuleReturnData,
    referenceModule,
    referenceModuleReturnData,
    timestamp
  } = data;

  // Extract metadata
  let metadata;
  try {
    const contentURIResponse = await fetch(sanitizeDStorageUrl(contentURI));
    metadata = await contentURIResponse.json();
  } catch {}

  const clickhouse = createClickHouseClient();
  const query = `
    INSERT INTO firehose (
      id,
      profileId,
      contentURI,
      metadata,
      collectModule,
      collectModuleReturnData,
      referenceModule,
      referenceModuleReturnData,
      timestamp
    ) VALUES (
      ${serverPubId ? `'${serverPubId}'` : null},
      ${profileId ? `'${profileId}'` : null},
      ${contentURI ? `'${contentURI}'` : null},
      ${metadata ? `'${JSON.stringify(metadata)}'` : null},
      ${collectModule ? `'${collectModule}'` : null},
      ${collectModuleReturnData ? `'${collectModuleReturnData}'` : null},
      ${referenceModule ? `'${referenceModule}'` : null},
      ${referenceModuleReturnData ? `'${referenceModuleReturnData}'` : null},
      ${timestamp ? `'${timestamp}'` : null}
    )
  `;
  await clickhouse.query(query).toPromise();
};

export default handleIndexerPostCreated;
