import type { FC } from 'react';

import CountdownTimer from '@components/Shared/CountdownTimer';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';

const Gitcoin: FC = () => {
  return (
    <Card
      as="aside"
      className="mb-4 space-y-4 !border-[#27bdce] !bg-[#27bdce]/10 p-5 text-[#1396a5] dark:bg-[#27bdce]/50"
    >
      <img
        alt="Gitcoin emoji"
        className="mx-auto h-14"
        src={`${STATIC_IMAGES_URL}/brands/gitcoin.png`}
      />
      <div className="space-y-3 text-center text-sm">
        <div className="font-bold">
          Support {APP_NAME} on Gitcoin Grants Round 19
        </div>
        <div className="text-lg font-bold tracking-wide">
          <CountdownTimer targetDate={new Date(1701302340 * 1000).toString()} />
        </div>
        <div>
          <Link
            className="font-bold underline"
            href="https://hey.xyz/gitcoin"
            onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_GITCOIN)}
            target="_blank"
          >
            Contribute now
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
