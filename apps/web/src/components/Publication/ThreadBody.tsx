import { Analytics } from '@lib/analytics';
import type { Publication } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface Props {
  publication: Publication;
}

const ThreadBody: FC<Props> = ({ publication }) => {
  const { push } = useRouter();

  return (
    <article
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          Analytics.track(PUBLICATION.OPEN);
          push(`/posts/${publication?.id}`);
        }
      }}
    >
      <PublicationHeader publication={publication} />
      <div className="flex">
        <div className="-my-[3px] mr-8 ml-5 border-[0.8px] border-gray-300 bg-gray-300 dark:border-gray-700 dark:bg-gray-700" />
        <div className="!w-[85%] pt-4 pb-5 sm:w-full">
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
