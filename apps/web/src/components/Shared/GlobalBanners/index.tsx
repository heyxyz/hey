import type { FC } from 'react';

import Flagged from './Flagged';
import ProtectProfile from './ProtectProfile';
import Suspended from './Suspended';

const GlobalBanners: FC = () => {
  return (
    <>
      <Flagged />
      <Suspended />
      <ProtectProfile />
    </>
  );
};

export default GlobalBanners;
