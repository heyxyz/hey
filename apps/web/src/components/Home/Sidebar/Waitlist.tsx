import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';

const Waitlist: FC = () => {
  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <img
        alt="Dizzy emoji"
        className="mx-auto size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">Get early access to Lens!</div>
        <div>
          <Link href="https://waitlist.lens.xyz?utm_source=hey" target="_blank">
            <Button
              onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_LENS_WAITLIST)}
              size="lg"
              variant="black"
            >
              Join waitlist
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Waitlist;
