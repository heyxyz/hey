import { PencilAltIcon } from '@heroicons/react/outline';
import { IS_MAINNET } from 'data/constants';
import { useRouter } from 'next/router';
import React from 'react';
import { usePublicationStore } from 'src/store/publication';

const NewPublicationIcon = () => {
  const {
    query: { username }
  } = useRouter();
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);

  const openModal = () => {
    setShowNewPostModal(true);
    if (username) {
      setPublicationContent(`@${username}${IS_MAINNET ? '.lens' : '.test'}`);
    }
  };

  return (
    <button type="button" className="hidden p-1 md:block" onClick={() => openModal()}>
      <PencilAltIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  );
};

export default NewPublicationIcon;
