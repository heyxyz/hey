import { Card } from '@components/UI/Card';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { PencilAltIcon } from '@heroicons/react/outline';
import getAvatar from '@lib/getAvatar';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';

import NewPublication from '../NewPublication';

type Action = 'update' | 'image' | 'video' | 'audio' | 'article';

interface ActionProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}

const Action: FC<ActionProps> = ({ icon, text, onClick }) => (
  <Tooltip content={text} placement="top">
    <button
      className="flex flex-col items-center text-gray-500 hover:text-brand-500"
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  </Tooltip>
);

const NewPost: FC = () => {
  const { query, isReady } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const showNewPostModal = usePublicationStore((state) => state.showNewPostModal);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const [selectedAction, setSelectedAction] = useState<Action>('update');

  const openModal = (action: Action) => {
    setSelectedAction(action);
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

      const content = `${text}${processedHashtags ? ` ${processedHashtags} ` : ''}${url ? `\n\n${url}` : ''}${
        via ? `\n\nvia @${via}` : ''
      }`;

      setShowNewPostModal(true);
      setPublicationContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center space-x-3">
        <img
          src={getAvatar(currentProfile)}
          className="h-9 w-9 bg-gray-200 rounded-full border dark:border-gray-700/80"
          alt={currentProfile?.handle}
        />
        <button
          className="w-full flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700"
          type="button"
          onClick={() => openModal('update')}
        >
          <PencilAltIcon className="h-5 w-5" />
          <span>What's happening?</span>
        </button>
        <Modal
          title="Create post"
          size="md"
          show={showNewPostModal}
          onClose={() => setShowNewPostModal(false)}
        >
          {selectedAction === 'update' && <NewPublication />}
        </Modal>
      </div>
    </Card>
  );
};

export default NewPost;
