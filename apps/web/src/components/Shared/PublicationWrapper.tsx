import type { AnyPublication } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface PublicationWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  publication: AnyPublication;
}

const PublicationWrapper: FC<PublicationWrapperProps> = ({
  children,
  className = '',
  publication
}) => {
  const { pathname, push } = useRouter();

  return (
    <motion.article
      animate={{ opacity: 1 }}
      className={cn(className)}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={() => {
        if (pathname === '/mod') {
          return;
        }

        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          push(`/posts/${publication?.id}`);
        }
      }}
    >
      {children}
    </motion.article>
  );
};

export default PublicationWrapper;
