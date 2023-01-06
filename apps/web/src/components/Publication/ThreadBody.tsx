import type { LensterPublication } from '@generated/types';
import { Analytics } from '@lib/analytics';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface Props {
  publication: LensterPublication;
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
        <div className="mr-8 ml-5 bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 border-[0.8px] -my-[3px]" />
        <div className="pt-4 pb-5 !w-[85%] sm:w-full">
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
