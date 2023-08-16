import { ArrowRightIcon } from '@heroicons/react/outline';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import { MISCELLANEOUS } from '@lenster/data/tracking';
import { Button, Card } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

const Gitcoin: FC = () => {
  return (
    <Card
      as="aside"
      className="mb-4 space-y-4 !border-gray-600 bg-gradient-to-r from-gray-500 to-gray-600 p-5 text-white dark:bg-gray-900"
    >
      <img
        src={`${STATIC_IMAGES_URL}/brands/gitcoin.svg`}
        alt="Gitcoin emoji"
        className="mx-auto h-14 w-14"
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">
          Support Lenster on Gitcoin Grants Round 18
        </div>
        <div>
          <Link href="https://lenster.xyz/gitcoin" target="_blank">
            <Button
              className="shadow-lg"
              icon={<ArrowRightIcon className="h-4 w-4" />}
              onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_GITCOIN)}
              variant="secondary"
            >
              <Trans>Contribute now</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
