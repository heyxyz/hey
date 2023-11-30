import type { AnyPublication } from '@hey/lens';
import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import { type FC, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PublicationWrapperProps {
  publication: AnyPublication;
  className?: string;
  children: ReactNode[];
}

const PublicationWrapper: FC<PublicationWrapperProps> = ({
  publication,
  className = '',
  children
}) => {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(className)}
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          navigate(`/posts/${publication?.id}`);
        }
      }}
    >
      {children}
    </motion.article>
  );
};

export default PublicationWrapper;
