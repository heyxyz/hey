import type { FC } from 'react';

import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Portal } from '@hey/types/misc';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import toast from 'react-hot-toast';

interface PortalProps {
  portal: Portal;
  publicationId?: string;
}

const Portal: FC<PortalProps> = ({ portal, publicationId }) => {
  const { buttons, image, postUrl } = portal;

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <img
        alt={image}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
        src={image}
      />
      <div
        className="grid gap-4 p-5 dark:border-gray-700"
        style={{
          gridTemplateColumns: buttons.length === 1 ? '1fr' : '1fr 1fr',
          gridTemplateRows: buttons.length === 3 ? 'auto auto' : 'auto'
        }}
      >
        {buttons.map(({ button, type }, index) => (
          <Button
            className={`${
              buttons.length === 3 && index === 2 ? 'col-span-2' : 'col-span-1'
            }`}
            key={index}
            onClick={() => {
              Leafwatch.track(PUBLICATION.CLICK_PORTAL_BUTTON, {
                publication_id: publicationId,
                type
              });

              if (type === 'redirect') {
                window.open(postUrl, '_blank');
              } else if (type === 'submit') {
                toast.success('Not implemented yet, check back later!');
              }
            }}
            outline
            size="lg"
            type={type === 'submit' ? 'submit' : 'button'}
            variant="secondary"
          >
            {button}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default Portal;
