import type { Frame as IFrame } from '@hey/types/misc';
import type { FC } from 'react';

import errorToast from '@helpers/errorToast';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { BoltIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useChainId, useSendTransaction, useSwitchChain } from 'wagmi';

interface FrameProps {
  frame: IFrame;
  publicationId?: string;
}

const Frame: FC<FrameProps> = ({ frame, publicationId }) => {
  const { currentProfile } = useProfileStore();
  const [frameData, setFrameData] = useState<IFrame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: { onError: errorToast }
  });
  const chain = useChainId();

  useEffect(() => {
    if (frame) {
      setFrameData(frame);
    }
  }, [frame]);

  if (!frameData) {
    return null;
  }

  const { buttons, frameUrl, image, postUrl } = frameData;

  const onPost = async (index: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      const { data }: { data: { frame: IFrame } } = await axios.post(
        `${HEY_API_URL}/frames/post`,
        {
          buttonIndex: index + 1,
          postUrl: buttons[index].target || buttons[index].postUrl || postUrl,
          pubId: publicationId
        },
        { headers: getAuthApiHeaders() }
      );

      if (!data.frame) {
        return toast.error(Errors.SomethingWentWrongWithFrame);
      }

      return setFrameData(data.frame);
    } catch {
      toast.error(Errors.SomethingWentWrongWithFrame);
    } finally {
      setIsLoading(false);
    }
  };

  const onTransaction = async (index: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      const { data }: { data: { frame: IFrame } } = await axios.post(
        `${HEY_API_URL}/frames/post`,
        {
          buttonAction: 'tx',
          buttonIndex: index + 1,
          postUrl: buttons[index].target || buttons[index].postUrl || postUrl,
          pubId: publicationId
        },
        { headers: getAuthApiHeaders() }
      );

      if (!data.frame.transaction) {
        return toast.error(Errors.SomethingWentWrongWithFrame);
      }

      const txnData = data.frame.transaction;
      const targetChain = parseInt(txnData.chainId.replace('eip155:', ''));

      await switchChainAsync({ chainId: targetChain });

      const hash = await sendTransactionAsync({
        data: txnData.params.data,
        to: txnData.params.to,
        value: BigInt(txnData.params.value)
      });

      toast.success(`Transaction sent to ${targetChain} chain - ${hash}`);

      const txnPostUrl = buttons[index].postUrl || postUrl;

      const { data: postedData }: { data: { frame: IFrame } } =
        await axios.post(
          `${HEY_API_URL}/frames/post`,
          { buttonIndex: index + 1, postUrl: txnPostUrl, pubId: publicationId },
          { headers: getAuthApiHeaders() }
        );

      if (!postedData.frame) {
        return toast.error(Errors.SomethingWentWrongWithFrame);
      }

      return setFrameData(postedData.frame);
    } catch {
      toast.error(Errors.SomethingWentWrongWithFrame);
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
            className="flex items-center justify-center space-x-2"
            disabled={isLoading || !publicationId || !currentProfile}
            icon={
              action === 'link' ||
              action === 'post_redirect' ||
              action === 'mint' ? (
                <LinkIcon className="size-4" />
              ) : action === 'tx' ? (
                <BoltIcon className="size-4" />
              ) : null
            }
            key={index}
            onClick={() => {
              Leafwatch.track(PUBLICATION.CLICK_FRAME_BUTTON, {
                action,
                publication_id: publicationId
              });

              if (
                action === 'link' ||
                action === 'post_redirect' ||
                action === 'mint'
              ) {
                const url = action === 'mint' ? frameUrl : target || frameUrl;
                window.open(url, '_blank');
              } else if (action === 'post') {
                onPost(index);
              } else if (action === 'tx') {
                onTransaction(index);
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
            <span>{button}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default Frame;
