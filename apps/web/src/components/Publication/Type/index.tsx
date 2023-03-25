import type { Publication } from 'lens';
import type { FC } from 'react';
import { stopEventPropagation } from 'utils/stopEventPropagation';

import Commented from './Commented';
import CommentedPublication from './CommentedPublication';
import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: Publication;
  showType?: boolean;
  showThread?: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({ publication, showType, showThread = false }) => {
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>
      {type === 'Mirror' && <Mirrored publication={publication} />}
      {type === 'Comment' && !showThread && <CommentedPublication publication={publication} />}
      {type === 'Comment' && showThread && <Commented publication={publication} />}
    </span>
  );
};

export default PublicationType;
