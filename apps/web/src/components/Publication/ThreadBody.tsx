import type { Publication } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface ThreadBodyProps {
  publication: Publication;
}

const ThreadBody: FC<ThreadBodyProps> = ({ publication }) => {
  const { push } = useRouter();

  return (
    <article
      className="cursor-pointer px-5 pt-5 hover:bg-gray-100 dark:hover:bg-gray-900"
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          push(`/posts/${publication?.id}`);
        }
      }}
    >
      <PublicationHeader publication={publication} />
      <div className="flex">
        <div className="-mt-5 -mb-6 mr-8 ml-5 border-[0.8px] border-gray-300 bg-gray-300 dark:border-gray-700 dark:bg-gray-700" />
        <div className="w-full pb-5">
          {publication?.hidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default ThreadBody;
