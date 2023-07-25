import type { Publication } from '@lenster/lens';
import clsx from 'clsx';
import { motion } from 'framer-motion';
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
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
    </motion.article>
  );
};

export default PublicationWrapper;
