import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Portal } from '@hey/types/misc';
import { Button, Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { type FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface PortalProps {
  portal: Portal;
  publicationId?: string;
}

const Portal: FC<PortalProps> = ({ portal, publicationId }) => {
  const [portalData, setPortalData] = useState<null | Portal>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portal) {
      setPortalData(portal);
    }
  }, [portal]);

  if (!portalData) {
    return null;
  }

  const { buttons, image, postUrl } = portalData;

  const onPost = async (index: number) => {
    try {
      setLoading(true);

      const { data }: { data: { portal: Portal } } = await axios.post(
        `${HEY_API_URL}/portals/get`,
        { buttonIndex: index + 1, postUrl },
        { headers: getAuthApiHeaders() }
      );

      if (!data.portal) {
        return toast.error(Errors.SomethingWentWrong);
      }

      return setPortalData(data.portal);
    } catch {
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <img
        alt={image}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
        src={image}
      />
      <div
        className={cn(
          buttons.length === 1 && 'grid-cols-1',
          buttons.length === 2 && 'grid-cols-2',
          buttons.length === 3 && 'grid-cols-3',
          buttons.length === 4 && 'grid-cols-2',
          'grid gap-4 p-5 dark:border-gray-700'
        )}
      >
        {buttons.map(({ button, type }, index) => (
          <Button
            disabled={loading}
            key={index}
            onClick={() => {
              Leafwatch.track(PUBLICATION.CLICK_PORTAL_BUTTON, {
                publication_id: publicationId,
                type
              });

              if (type === 'redirect') {
                window.open(postUrl, '_blank');
              } else if (type === 'submit') {
                onPost(index);
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
