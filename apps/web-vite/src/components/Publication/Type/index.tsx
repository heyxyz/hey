import type { AnyPublication } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { useLocation } from 'react-router-dom';
import { type FC } from 'react';

import Commented from './Commented';
import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: AnyPublication;
  showType: boolean;
  showThread?: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({
  publication,
  showType,
  showThread = false
}) => {
  const location = useLocation();
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>
      {type === 'Mirror' ? <Mirrored publication={publication} /> : null}
      {type === 'Comment' &&
      (showThread || location.pathname === '/posts/[id]') ? (
        <Commented publication={publication} />
      ) : null}
    </span>
  );
};

export default PublicationType;
