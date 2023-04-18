import type { Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import Commented from './Commented';
import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: Publication;
  showType: boolean;
  showThread?: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({ publication, showType, showThread = false }) => {
  const { pathname } = useRouter();
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation} aria-label="">
      {type === 'Mirror' && <Mirrored publication={publication} />}
      {type === 'Comment' && (showThread || pathname === '/posts/[id]') && (
        <Commented publication={publication} />
      )}
    </span>
  );
};

export default PublicationType;
