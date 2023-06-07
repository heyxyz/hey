import type { Publication } from '@lenster/lens';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

interface PublicationWrapperProps {
  publication: Publication;
  className?: string;
  children: ReactNode[];
}

const PublicationWrapper: FC<PublicationWrapperProps> = ({
  publication,
  className = '',
  children
}) => {
  const { push } = useRouter();

  return (
    <article
      className={clsx(className)}
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          push(`/posts/${publication?.id}`);
        }
      }}
      data-testid={`publication-${publication.id}`}
      aria-hidden="true"
    >
      {children}
    </article>
  );
};

export default PublicationWrapper;
