import { MicrophoneIcon, PencilAltIcon } from '@heroicons/react/outline';
import { FeatureFlag } from '@lenster/data/feature-flags';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { Card, Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { NewPublicationTypes } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { usePublicationStore } from 'src/store/publication';
import { useEffectOnce } from 'usehooks-ts';

const NewPost: FC = () => {
  const { query, isReady, push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowComposerModal = useGlobalModalStateStore(
    (state) => state.setShowComposerModal
  );
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );
  const isSpacesEnabled = isFeatureEnabled(FeatureFlag.Spaces);

  const openPublicationModal = () => {
    setShowComposerModal(true, NewPublicationTypes.Publication);
  };

  const openSpacesModal = () => {
    setShowComposerModal(true, NewPublicationTypes.Spaces);
  };

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

      openPublicationModal();
      setPublicationContent(content);
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
          onClick={openPublicationModal}
        >
          <PencilAltIcon className="h-5 w-5" />
          <span>
            <Trans>What's happening?</Trans>
          </span>
        </button>
        {isSpacesEnabled && (
          <MicrophoneIcon
            className="text-brand hidden h-6 w-6 sm:inline-flex"
            onClick={openSpacesModal}
          />
        )}
      </div>
    </Card>
  );
};

export default NewPost;
