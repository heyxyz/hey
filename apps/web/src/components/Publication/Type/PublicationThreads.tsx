import type { Publication } from 'lens';
import type { FC } from 'react';

import Commented from './Commented';

interface PublicationThreadsProps {
  publication: Publication;
  showThread: boolean;
}

const PublicationThreads: FC<PublicationThreadsProps> = ({ publication, showThread = false }) => {
  const type = publication.__typename;

  if (type === 'Comment' && showThread) {
    return <Commented publication={publication} />;
  }

  return null;
};

export default PublicationThreads;
