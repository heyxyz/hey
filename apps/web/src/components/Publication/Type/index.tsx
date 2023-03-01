import type { Publication } from 'lens';
import type { FC } from 'react';

import Commented from './Commented';
import CommentedPublication from './CommentedPublication';
import Mirrored from './Mirrored';

interface Props {
  publication: Publication;
  showType?: boolean;
  showThread?: boolean;
}

const PublicationType: FC<Props> = ({ publication, showType, showThread = false }) => {
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={(event) => event.stopPropagation()}>
      {type === 'Mirror' && <Mirrored publication={publication} />}
      {type === 'Comment' && !showThread && <CommentedPublication publication={publication} />}
      {type === 'Comment' && showThread && <Commented publication={publication} />}
    </span>
  );
};

export default PublicationType;
