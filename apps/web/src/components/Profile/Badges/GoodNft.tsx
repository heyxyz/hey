import type { FC } from 'react';

import { APP_NAME, STATIC_IMAGES_URL } from '@good/data/constants';
import { Tooltip } from '@good/ui';

const GoodNft: FC = () => {
  return (
    <Tooltip content={`Owner of ${APP_NAME} NFT`} placement="top">
      <img
        alt={`Owner of ${APP_NAME} NFT Badge`}
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/good-nft.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default GoodNft;
