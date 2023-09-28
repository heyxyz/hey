import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

const Waitlist: FC = () => {
  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <img
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
        alt="Dizzy emoji"
        className="mx-auto h-14 w-14"
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">
          <Trans>Get early access to Lens!</Trans>
        </div>
        <div>
          <Link href="https://waitlist.lens.xyz?utm_source=hey" target="_blank">
            <Button
              variant="black"
              size="lg"
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
