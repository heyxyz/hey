import type { Portal as IPortal } from '@hey/types/misc';
import type { FC } from 'react';

import { LinkIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface PortalProps {
  portal: IPortal;
  publicationId?: string;
}

const Portal: FC<PortalProps> = ({ portal, publicationId }) => {
  const { currentProfile } = useProfileStore();
  const [portalData, setPortalData] = useState<IPortal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (portal) {
      setPortalData(portal);
    }
  }, [portal]);

  if (!portalData) {
    return null;
  }

  const { buttons, image, portalUrl, postUrl } = portalData;

  const onPost = async (index: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      const { data }: { data: { portal: IPortal } } = await axios.post(
        `${HEY_API_URL}/portal/post`,
        { buttonIndex: index + 1, postUrl, publicationId },
        { headers: getAuthApiHeaders() }
      );

      if (!data.portal) {
        return toast.error(Errors.SomethingWrongWithPortal);
      }

      return setPortalData(data.portal);
    } catch {
      toast.error(Errors.SomethingWrongWithPortal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <img
        alt={image}
        className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
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
        {buttons.map(({ action, button, target }, index) => (
          <Button
            className="justify-center"
            disabled={isLoading || !publicationId || !currentProfile}
            icon={
              (action === 'link' ||
                action === 'post_redirect' ||
                action === 'mint') && <LinkIcon className="size-4" />
            }
            key={index}
            onClick={() => {
              Leafwatch.track(PUBLICATION.CLICK_PORTAL_BUTTON, {
                action,
                publication_id: publicationId
              });

              if (
                action === 'link' ||
                action === 'post_redirect' ||
                action === 'mint'
              ) {
                const url = action === 'mint' ? portalUrl : target || portalUrl;
                window.open(url, '_blank');
              } else if (action === 'post') {
                onPost(index);
              }
            }}
            outline
            size="lg"
            type={
              action === 'post' || action === 'post_redirect'
                ? 'submit'
                : 'button'
            }
          >
            {button}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default Portal;
