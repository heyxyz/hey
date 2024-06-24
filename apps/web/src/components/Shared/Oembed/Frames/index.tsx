import type { Frame as IFrame } from '@hey/types/misc';
import type { FC } from 'react';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface FrameProps {
  frame: IFrame;
  publicationId?: string;
}

const Frame: FC<FrameProps> = ({ frame, publicationId }) => {
  const { currentProfile } = useProfileStore();
  const [frameData, setFrameData] = useState<IFrame | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (frame) {
      setFrameData(frame);
    }
  }, [frame]);

  if (!frameData) {
    return null;
  }

  const {
    buttons,
    frameUrl,
    image,
    inputText: inputTextLabel,
    postUrl
  } = frameData;

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
          inputText,
          postUrl: buttons[index].target || buttons[index].postUrl || postUrl,
          pubId: publicationId
        },
        { headers: getAuthApiHeaders() }
      );

      if (!data.frame) {
        return toast.error(Errors.SomethingWentWrong);
      }

      return setFrameData(data.frame);
    } catch {
      toast.error(Errors.SomethingWentWrong);
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
      {inputTextLabel && (
        <input
          className="mt-2 w-full rounded border p-2"
          onChange={(e) => setInputText(e.target.value)}
          placeholder={inputTextLabel}
          type="text"
          value={inputText}
        />
      )}
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
              // Leafwatch.track(PUBLICATION.CLICK_PORTAL_BUTTON, {
              //   action,
              //   publication_id: publicationId
              // });

              if (
                action === 'link' ||
                action === 'post_redirect' ||
                action === 'mint'
              ) {
                const url = action === 'mint' ? frameUrl : target || frameUrl;
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

export default Frame;
