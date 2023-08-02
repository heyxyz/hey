import { PencilAltIcon } from '@heroicons/react/outline';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import { Card, Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { usePublicationStore } from 'src/store/publication';
import { useEffectOnce } from 'usehooks-ts';

const NewPost: FC = () => {
  const { query, isReady, push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );
  const setShowNewSpacesModal = useGlobalModalStateStore(
    (state) => state.setShowNewSpacesModal
  );

  const openModal = () => {
    setShowNewPostModal(true);
  };

  const openSpacesModal = () => {
    setShowNewSpacesModal(true);
  };

  const { resolvedTheme } = useTheme();

  useEffectOnce(() => {
    if (isReady && query.text) {
      const { text, url, via, hashtags } = query;
      let processedHashtags;

      if (hashtags) {
        processedHashtags = (hashtags as string)
          .split(',')
          .map((tag) => `#${tag} `)
          .join('');
      }

      const content = `${text}${
        processedHashtags ? ` ${processedHashtags} ` : ''
      }${url ? `\n\n${url}` : ''}${via ? `\n\nvia @${via}` : ''}`;

      setShowNewPostModal(true);
      setPublicationContent(content);
      setShowNewSpacesModal(true);
    }
  });

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center space-x-3">
        <Image
          src={getAvatar(currentProfile)}
          className="h-9 w-9 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          onClick={() => push(`/u/${currentProfile?.handle}`)}
          alt={formatHandle(currentProfile?.handle)}
        />
        <button
          className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          type="button"
          onClick={() => openModal()}
        >
          <PencilAltIcon className="h-5 w-5" />
          <span>
            <Trans>What's happening?</Trans>
          </span>
        </button>
        <Image
          src={`/${resolvedTheme}-mic-icon.png`}
          className="h-9 w-9 cursor-pointer"
          onClick={() => openSpacesModal()}
          alt={formatHandle(currentProfile?.handle)}
        />
      </div>
    </Card>
  );
};

export default NewPost;
