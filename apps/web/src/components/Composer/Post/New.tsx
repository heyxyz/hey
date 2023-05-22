import { PencilAltIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import { Card, Image, Modal } from 'ui';

import NewPublication from '../NewPublication';

const NewPost: FC = () => {
  const { query, isReady, push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const showNewPostModal = usePublicationStore(
    (state) => state.showNewPostModal
  );
  const setShowNewPostModal = usePublicationStore(
    (state) => state.setShowNewPostModal
  );
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );

  const openModal = () => {
    setShowNewPostModal(true);
  };

  useEffect(() => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Modal
          title={t`Create post`}
          size="md"
          show={showNewPostModal}
          onClose={() => setShowNewPostModal(false)}
        >
          <NewPublication />
        </Modal>
      </div>
    </Card>
  );
};

export default NewPost;
