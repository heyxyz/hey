import { ArrowRightIcon } from '@heroicons/react/outline';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import { MISCELLANEOUS } from '@lenster/data/tracking';
import { Button, Card } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

const Waitlist: FC = () => {
  return (
    <Card
      as="aside"
      className="!border-brand-600 !bg-brand-50 text-brand-600 dark:bg-brand-900 mb-4 space-y-4 p-5"
    >
      <img
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
        alt="Dizzy emoji"
        className="mx-auto h-14 w-14"
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">
          Join the waitlist to get early access to the vibrant Lens community!
        </div>
        <div>
          <Link href="https://waitlist.lens.xyz" target="_blank">
            <Button
              icon={<ArrowRightIcon className="h-4 w-4" />}
              onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_LENS_WAITLIST)}
            >
              <Trans>Join waitlist</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Waitlist;
