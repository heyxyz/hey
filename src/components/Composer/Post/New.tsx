import { Card } from '@components/UI/Card';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import {
  DocumentTextIcon,
  MusicNoteIcon,
  PencilAltIcon,
  PhotographIcon,
  VideoCameraIcon
} from '@heroicons/react/outline';
import getAvatar from '@lib/getAvatar';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';

import NewUpdate from './Update';

type Action = 'update' | 'image' | 'video' | 'audio' | 'article';

interface ActionProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}

const Action: FC<ActionProps> = ({ icon, text, onClick }) => (
  <Tooltip content={text} placement="top">
    <button className="flex flex-col items-center text-gray-500 hover:text-brand-500" onClick={onClick}>
      {icon}
    </button>
  </Tooltip>
);

const NewPost: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const showNewPostModal = usePublicationStore((state) => state.showNewPostModal);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);
  const [selectedAction, setSelectedAction] = useState<Action>('update');

  const openModal = (action: Action) => {
    setSelectedAction(action);
    setShowNewPostModal(true);
  };

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
          onClick={() => openModal('update')}
        >
          <PencilAltIcon className="h-5 w-5" />
          <span>What's happening?</span>
        </button>
        {isFeatureEnabled('composer-v2', currentProfile?.id) && (
          <div className="flex items-center space-x-5">
            <Action
              icon={<PhotographIcon className="h-5 w-5" />}
              text="Image"
              onClick={() => openModal('image')}
            />
            <Action
              icon={<VideoCameraIcon className="h-5 w-5" />}
              text="Video"
              onClick={() => openModal('video')}
            />
            <Action
              icon={<MusicNoteIcon className="h-5 w-5" />}
              text="Audio"
              onClick={() => openModal('audio')}
            />
            <Action
              icon={<DocumentTextIcon className="h-5 w-5" />}
              text="Article"
              onClick={() => openModal('article')}
            />
          </div>
        )}
        <Modal
          title="Create post"
          size="md"
          show={showNewPostModal}
          onClose={() => setShowNewPostModal(false)}
        >
          {selectedAction === 'update' && <NewUpdate />}
        </Modal>
      </div>
    </Card>
  );
};

export default NewPost;
