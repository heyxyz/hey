import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import { MISCELLANEOUS } from '@lenster/data/tracking';
import { Card } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

const Gitcoin: FC = () => {
  return (
    <Card
      as="aside"
      className="mb-4 space-y-4 !border-[#27bdce] bg-[#27bdce]/20 p-5 text-[#1396a5] dark:bg-[#27bdce]/50"
    >
      <img
        src={`${STATIC_IMAGES_URL}/brands/gitcoin.png`}
        alt="Gitcoin emoji"
        className="mx-auto h-14"
      />
      <div className="space-y-3 text-center text-sm">
        <div className="font-bold">
          Support Lenster on Gitcoin Grants Round 18
        </div>
        <div>
          <Link
            href="https://lenster.xyz/gitcoin"
            className="font-bold underline"
            target="_blank"
            onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_GITCOIN)}
          >
            <Trans>Contribute now</Trans>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
