import type { FC } from 'react';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

const NavPost: FC = () => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useProfileStore();
  const { setShowNewPostModal } = useGlobalModalStateStore();
  const { setPublicationContent } = usePublicationStore();

  const openModal = () => {
    setShowNewPostModal(true);
  };

  useEffect(() => {
    if (isReady && query.text) {
      const { hashtags, text, url, via } = query;
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

      openModal();
      setPublicationContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      className="bg-custom-pink mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-black focus:outline-none dark:text-white"
      onClick={openModal}
      style={{ backgroundColor: '#da5597' }}
      type="button"
    >
      <span className="text-xl">Post</span>
    </button>
  );
};

export default NavPost;
