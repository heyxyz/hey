import type { Publication } from '@lenster/lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface QuotedPublicationProps {
  publication: Publication;
}

const QuotedPublication: FC<QuotedPublicationProps> = ({ publication }) => {
  const { push } = useRouter();

  return (
    <article
      className="cursor-pointer p-5 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          push(`/posts/${publication?.id}`);
        }
      }}
      data-testid={`publication-${publication.id}`}
      aria-hidden="true"
    >
      <PublicationHeader publication={publication} />
      <div className="ml-[53px]">
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <PublicationBody
            publication={publication}
            showMore
            nestedEmbeds={false}
          />
        )}
      </div>
    </article>
  );
};

export default QuotedPublication;
