import type { FC } from 'react';

import TbaAccount from './Account';

const mockNfts = [
  {
    contract: '0x6a9ab6e747699fb80e53b21b3bab24ee840fd1ff',
    tokenId: '15'
  },
  {
    contract: '0xf2a3c81faa6ad548fe8275dbf937a9481afc1e41',
    tokenId: '2713'
  }
];

const NftLogin: FC = () => {
  return (
    <div className="space-y-3 p-5">
      {mockNfts.map((nft) => (
        <TbaAccount key={`${nft.contract}-${nft.tokenId}`} nft={nft} />
      ))}
    </div>
  );
};

export default NftLogin;
